import { currentProfilePagesRouting } from "@/lib/current-profile-pages-routing";
import prismadb from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "[SOCKET_HANDLET_ERROR]" });
  }
  try {
    const profile = await currentProfilePagesRouting(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Invalid profile" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is missing" });
    }
    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Invalid Message" });
    }
    const conversation = await prismadb.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }
    const message = await prismadb.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const conversationKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(conversationKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("[DIRECT_MESSAGES_POST]", error);
    res.status(500).json({ error: "[SOCKET_HANDLET_ERROR]" });
  }
};

export default handler;
