import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { MemberRole, Profile } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const profile: Profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!name || !type) {
      return new NextResponse("Name or type is missing.", {
        status: 400,
      });
    }
    if (!serverId) {
      return new NextResponse("SERVER_ID is missing.", {
        status: 400,
      });
    }
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await prismadb.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
