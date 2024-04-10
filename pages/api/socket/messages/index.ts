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
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Invalid profile" });
    }
    if (!serverId || !channelId) {
      return res.status(400).json({ error: "ServerId or ChannelId is missing" });
    }
    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Invalid Message" });
    }

    const server = await prismadb.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(404).json({ error: "server not found" });
    }

    const channel = await prismadb.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ error: "channel not found" });
    }

    const member = server.members.find((member) => member.profileId === profile.id);
    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }
    const message = await prismadb.channelMessage.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    res.status(500).json({ error: "[SOCKET_HANDLET_ERROR]" });
  }
};

export default handler;
