import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { MemberRole, Profile } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!name || !imageUrl) {
      return new NextResponse("Name or Image is missing.", { status: 400 });
    }
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await prismadb.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: randomUUID(),
        profileId: profile.id,
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
