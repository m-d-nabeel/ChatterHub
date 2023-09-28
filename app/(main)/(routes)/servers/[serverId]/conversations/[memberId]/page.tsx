import ChatHeader from "@/components/chat/chat-header";
import { getConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";

interface ConversationPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}
const ConversationPage = async ({ params }: ConversationPageProps) => {
  const profile: Profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
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
    <div>
      <ChatHeader
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default ConversationPage;
