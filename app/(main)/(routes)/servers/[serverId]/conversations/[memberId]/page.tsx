import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ConversationPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
const ConversationPage = async ({
  params,
  searchParams,
}: ConversationPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const currentMember = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember || currentMember.id === params.memberId) {
    return redirect("../");
  }

  const conversation = await getConversation(currentMember.id, params.memberId);
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    profile.id === memberOne.profileId ? memberTwo : memberOne;
  return (
    <div className="flex h-full w-full flex-col">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
      {!searchParams.video ? (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            type="conversation"
            member={currentMember}
            chatId={conversation.id}
            paramKey="conversationId"
            paramValue={conversation.id}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            apiUrl="/api/socket/direct-messages"
            type="conversation"
            name={otherMember.profile.name}
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      ) : (
        <MediaRoom chatId={conversation.id} audio={false} video={false} />
      )}
    </div>
  );
};

export default ConversationPage;
