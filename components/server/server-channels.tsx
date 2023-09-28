"use client";

import {
  Edit2Icon,
  HashIcon,
  LockIcon,
  Mic2Icon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import { AccordionContent } from "../ui/accordion";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import ActionTooltip from "../action-tooltip";


interface ServerChannelsProps {
  channels: Channel[];
  type: ChannelType;
  role: MemberRole | undefined;
}

const ServerChannels = ({ channels, type, role }: ServerChannelsProps) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();

  const handleClick = (channelId: string) => {
    router.push(`/servers/${params?.serverId}/channels/${channelId}`);
  };

  const IconMapping = () => {
    switch (type) {
      case ChannelType.AUDIO:
        return (
          <Mic2Icon className="mr-3 h-4 min-h-[16px] w-4 min-w-[16px] text-muted-foreground" />
        );
      case ChannelType.VIDEO:
        return (
          <VideoIcon className="mr-3 h-4 min-h-[16px] w-4 min-w-[16px] text-muted-foreground" />
        );
      default:
        return (
          <HashIcon className="mr-3 h-5 min-h-[20px] w-5 min-w-[20px]  text-muted-foreground" />
        );
    }
  };

  const handleChannelEditDelete = (
    e: React.MouseEvent,
    action: "editChannel" | "deleteChannel",
    channel: Channel,
  ) => {
    e.stopPropagation();
    onOpen(action, {
      serverId: params?.serverId as string | undefined,
      channel,
    });
  };
  return (
    <AccordionContent>
      {channels.map((channel) => (
        <div
          onClick={() => handleClick(channel.id)}
          key={channel.id}
          className={cn(
            "group relative mb-1 ml-3 mr-2 flex w-[200px] cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-discord-gray2 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            channel.id === params?.channelId && "bg-discord-gray2",
          )}
        >
          <div
            className={cn(
              "absolute -left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-foreground transition-transform",
              channel.id === params?.channelId && "hidden",
            )}
          />
          <ActionTooltip label={channel.name} align="start">
            <div className="flex w-full items-center">
              <IconMapping />{" "}
              <span className="line-clamp-1">{channel.name}</span>
              {channel.name === "general" && (
                <LockIcon className="ml-auto h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </ActionTooltip>
          {role !== "GUEST" && channel.name !== "general" && (
            <div className="ml-auto flex items-center">
              <ActionTooltip label="Edit" align="start">
                <Edit2Icon
                  onClick={(e) =>
                    handleChannelEditDelete(e, "editChannel", channel)
                  }
                  className="hidden h-5 w-5 rounded p-1 text-muted-foreground ring-discord-gray1 hover:ring-[2px] group-hover:block"
                />
              </ActionTooltip>
              <ActionTooltip label="Delete" align="start">
                <Trash2Icon
                  onClick={(e) =>
                    handleChannelEditDelete(e, "deleteChannel", channel)
                  }
                  className="hidden h-5 w-5 rounded p-1 text-rose-500 ring-discord-gray1 hover:ring-[2px] group-hover:block"
                />
              </ActionTooltip>
            </div>
          )}
        </div>
      ))}
    </AccordionContent>
  );
};

export default ServerChannels;
