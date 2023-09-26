"use client";

import { HashIcon, Mic2Icon, VideoIcon } from "lucide-react";
import { AccordionContent } from "../ui/accordion";
import { Channel, ChannelType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ServerChannelsProps {
  channels: Channel[];
  type: ChannelType;
}

const iconMapping: Record<ChannelType, React.ReactNode> = {
  [ChannelType.TEXT]: (
    <HashIcon className="mr-3 h-5 w-5 text-muted-foreground" />
  ),
  [ChannelType.AUDIO]: (
    <Mic2Icon className="mr-3 h-4 w-4 text-muted-foreground" />
  ),
  [ChannelType.VIDEO]: (
    <VideoIcon className="mr-3 h-4 w-4 text-muted-foreground" />
  ),
};

const ServerChannels = ({ channels, type }: ServerChannelsProps) => {
  const router = useRouter();
  const params = useParams();
  const handleClick = (channelId: string) => {
    router.push(`/servers/${params?.serverId}/channels/${channelId}`);
  };
  return (
    <AccordionContent>
      {channels.map((channel) => (
        <div
          onClick={() => handleClick(channel.id)}
          key={channel.id}
          className={cn(
            "relative mb-1 ml-3 mr-2 flex w-[200px] cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-discord-gray2 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            channel.id === params?.channelId && "bg-discord-gray2",
          )}
        >
          <div className="absolute -left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-foreground transition-transform" />
          {iconMapping[type]} {channel.name}
        </div>
      ))}
    </AccordionContent>
  );
};

export default ServerChannels;
