import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const profile: Profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await prismadb.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await prismadb.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return null;
};

export default InvitePage;
