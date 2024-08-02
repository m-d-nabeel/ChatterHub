import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
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
    return auth().redirectToSignIn();
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
    include: {
      profile: true,
    },
  });
  if (!channel || !member) {
    redirect("/");
  }

  // Ctrl + P (Go to File)

  return (
    <div className="flex h-full w-full flex-col">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type={"channel"}
      />
      {channel.type === ChannelType.TEXT ? (
        <>
          <ChatMessages
            name={channel.name}
            type="channel"
            member={member}
            chatId={channel.id}
            paramKey="channelId"
            paramValue={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            type="channel"
            name={channel.name}
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      ) : (
        <MediaRoom
          chatId={channel.id}
          audio={channel.type === ChannelType.AUDIO}
          video={channel.type === ChannelType.VIDEO}
        />
      )}
    </div>
  );
};

export default ChannelPage;
