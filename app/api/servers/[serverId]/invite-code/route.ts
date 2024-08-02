export const dynamic = "force-dynamic";

import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { Profile } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("ServerID not found", { status: 400 });
    }
    const inviteCode = randomUUID();
    const updatedServer = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode,
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error(error);
    return new NextResponse("[INVITE_PATCH]", { status: 500 });
  }
}
