import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { ChannelMessage } from "@prisma/client";
import { NextResponse } from "next/server";

// 10 messages per request
const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const url = new URL(req.url);
    const { searchParams } = url;
    const channelId = searchParams.get("channelId");
    const cursor = searchParams.get("cursor");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("channelId is missing.", { status: 400 });
    }
    let messages: ChannelMessage[] = [];
    if (cursor) {
      messages = await prismadb.channelMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
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
      messages = await prismadb.channelMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
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
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
