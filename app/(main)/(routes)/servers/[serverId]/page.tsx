import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
