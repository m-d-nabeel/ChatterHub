"use client";

import UserAvatar from "../user-avatar";
import { Member, MemberRole, Profile } from "@prisma/client";

import { Edit2Icon, Trash2Icon } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useModal } from "@/hooks/use-modal-store";
import ChatItemHeader from "./chat-item-header";
import ChatItemUpdateForm from "./chat-item-update-form";
import ChatFileItem from "./chat-file-item";
import { useParams, useRouter } from "next/navigation";

interface ChatItemProps {
  id: string;
  member: Member & { profile: Profile };
  currentMember: Member;
  content: string;
  fileUrl: string | null;
  deleted: boolean;
  isUpdated: boolean;
  timestamp: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const ChatItem = ({
  id,
  member,
  currentMember,
  content,
  fileUrl,
  deleted,
  isUpdated,
  timestamp,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();
  const fileType = fileUrl?.split(".").pop()?.toLowerCase();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isImage =
    !!fileUrl &&
    ["jpg", "jpeg", "png", "svg", "gif", "bmp", "webp"].includes(
      fileType as string,
    );
  const handleMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-x-4 bg-discord-gray3 p-4 duration-75 hover:bg-discord-gray2 hover:contrast-[1.1] hover:saturate-[1.25]",
        deleted && "-z-30 select-none py-1 grayscale hover:bg-discord-gray3",
      )}
    >
      <div onClick={handleMemberClick}>
        <UserAvatar
          imageUrl={member.profile.imageUrl}
          className={cn(
            "cursor-pointer transition hover:drop-shadow-md",
            deleted && "pointer-events-none opacity-0",
          )}
        />
      </div>
      <div className="flex w-full flex-col justify-center">
        <div onClick={handleMemberClick}>
          <ChatItemHeader
            member={member}
            deleted={deleted}
            timestamp={timestamp}
          />
        </div>
        {isImage && fileUrl && (
          <a
            href={fileUrl}
            className="mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md hover:drop-shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              height={192}
              width={100}
              className="aspect-square h-48 w-48 rounded-md object-cover"
              alt="imageMessage"
              src={fileUrl}
            />
          </a>
        )}
        {!isImage && fileUrl && (
          <ChatFileItem fileUrl={fileUrl} fileType={fileType as string} />
        )}
        {!isEditing && !fileUrl && (
          <p
            className={cn(
              "text text-sm text-foreground/80",
              deleted && "text-xs italic text-muted-foreground",
            )}
          >
            {content}
            {isUpdated && !deleted && (
              <span className="mx-2 text-[10px] text-muted-foreground">
                (edited)
              </span>
            )}
          </p>
        )}
        {!fileUrl && isEditing && (
          <ChatItemUpdateForm
            content={content}
            setIsEditing={setIsEditing}
            id={id}
            socketUrl={socketUrl}
            socketQuery={socketQuery}
          />
        )}
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-md bg-discord-gray4 p-1 group-hover:flex">
          {canEditMessage && (
            <>
              <ActionTooltip label="edit">
                <Edit2Icon
                  onClick={() => setIsEditing(true)}
                  className="ml-auto h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                />
              </ActionTooltip>
              <Separator
                orientation="vertical"
                className="h-4 w-[1.5px] rounded bg-discord-gray1"
              />
            </>
          )}
          <ActionTooltip label="delete">
            <Trash2Icon
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
