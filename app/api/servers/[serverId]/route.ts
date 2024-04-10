import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { Profile } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    await prismadb.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return new NextResponse("[SERVERID_POST]", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const { name, imageUrl } = await req.json();
    if (!name || !imageUrl) {
      return new NextResponse("Name or Image is missing.", { status: 400 });
    }
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("ServerID not found", { status: 400 });
    }
    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error(error);
    return new NextResponse("[SERVERID_PATCH]", { status: 500 });
  }
}
