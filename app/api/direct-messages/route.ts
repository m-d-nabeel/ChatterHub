import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

// 10 messages per request
const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const url = new URL(req.url);
    const { searchParams } = url;
    const conversationId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("conversationId is missing.", { status: 400 });
    }
    let messages: DirectMessage[] = [];
    if (cursor) {
      messages = await prismadb.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prismadb.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }
    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.error("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
