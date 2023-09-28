import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const channel = await prismadb.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const member = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="flex h-full w-full flex-col">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type={"channel"}
      />
    </div>
  );
};

export default ChannelPage;
