import prismadb from "@/lib/db";
import { Channel, ChannelType, MemberRole } from "@prisma/client";

// local imports
import ServerHeader from "./server-header";

interface ServerSidebarProps {
  serverId: string;
  profileId: string;
}

const ServerSidebar = async ({ serverId, profileId }: ServerSidebarProps) => {
  const server = await prismadb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return null;
  }

  const textChannels: Channel[] = [];
  const audioChannels: Channel[] = [];
  const videoChannels: Channel[] = [];

  server?.channels.forEach((channel) => {
    switch (channel.type) {
      case ChannelType.TEXT:
        textChannels.push(channel);
        break;
      case ChannelType.AUDIO:
        audioChannels.push(channel);
        break;
      case ChannelType.VIDEO:
        videoChannels.push(channel);
        break;
      default:
        break;
    }
  });

  const myMembership = server?.members.find(
    (member) => member.profileId === profileId,
  );
  const myRole = myMembership?.role;

  return (
    <div className="bg-discord-gray35 z-30 flex h-full w-full flex-col">
      <ServerHeader server={server} role={myRole || MemberRole.GUEST} />
    </div>
  );
};

export default ServerSidebar;
