import prismadb from "@/lib/db";
import { Channel, ChannelType, MemberRole } from "@prisma/client";

// local imports
import ServerHeader from "./server-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import ChannelOptions from "./server-section";
import ServerChannels from "./server-channels";

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
    <div className="z-30 flex h-full w-full flex-col bg-discord-gray35">
      <ServerHeader server={server} role={myRole || MemberRole.GUEST} />
      <Accordion type="multiple" className="h-full overflow-y-scroll px-3">
        {textChannels.length > 0 && (
          <AccordionItem value="item-1" className="border-transparent">
            <ChannelOptions
              channelType={ChannelType.TEXT}
              channelLength={textChannels.length}
            />
            <ServerChannels channels={textChannels} type={ChannelType.TEXT} />
          </AccordionItem>
        )}
        {audioChannels.length > 0 && (
          <AccordionItem value="item-2" className="border-transparent">
            <ChannelOptions
              channelType={ChannelType.AUDIO}
              channelLength={audioChannels.length}
            />
            <AccordionContent>
              <ServerChannels
                channels={audioChannels}
                type={ChannelType.AUDIO}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {videoChannels.length > 0 && (
          <AccordionItem value="item-3" className="border-transparent">
            <ChannelOptions
              channelType={ChannelType.VIDEO}
              channelLength={videoChannels.length}
            />
            <AccordionContent>
              <ServerChannels
                channels={videoChannels}
                type={ChannelType.VIDEO}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ServerSidebar;
