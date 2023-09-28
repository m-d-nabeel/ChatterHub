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
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import {
  HashIcon,
  Mic2Icon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
  profileId: string;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlertIcon className="mr-2 h-4 w-4 text-rose-500" />
  ),
};

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
      <ScrollArea className="px-3">
        <div className="overflow-hidden">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: (
                    <HashIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                  ),
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: (
                    <Mic2Icon className="mr-3 h-4 w-4 text-muted-foreground" />
                  ),
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: (
                    <VideoIcon className="mr-3 h-4 w-4 text-muted-foreground" />
                  ),
                })),
              },
              {
                label: "Members",
                type: "member",
                data: server.members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
      <Accordion type="multiple" className="h-full overflow-y-scroll px-3">
        {textChannels.length > 0 && (
          <AccordionItem value="item-1" className="border-transparent">
            <ChannelOptions
              channelType={ChannelType.TEXT}
              channelLength={textChannels.length}
            />
            <ServerChannels
              channels={textChannels}
              type={ChannelType.TEXT}
              role={myRole}
            />
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
                role={myRole}
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
                role={myRole}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ServerSidebar;
