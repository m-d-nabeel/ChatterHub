import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { Profile } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error(error);
    return new NextResponse("[LEAVE_SERVER]", { status: 500 });
  }
}
