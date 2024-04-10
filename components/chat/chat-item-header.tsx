"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile } from "@prisma/client";
import ActionTooltip from "../action-tooltip";
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";

interface ChatItemHeaderProps {
  member: Member & { profile: Profile };
  deleted: boolean;
  timestamp: string;
}
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ActionTooltip label="moderator" side="right">
      <ShieldCheckIcon className="mb-0.5 mr-2 h-4 w-4 text-indigo-500" />
    </ActionTooltip>
  ),
  [MemberRole.ADMIN]: (
    <ActionTooltip label="admin" side="right">
      <ShieldAlertIcon className="mb-0.5 mr-2 h-4 w-4 text-rose-500" />
    </ActionTooltip>
  ),
};
const ChatItemHeader = ({ member, deleted, timestamp }: ChatItemHeaderProps) => {
  return (
    <div className="flex items-center gap-x-3">
      <span
        className={cn(
          "flex cursor-pointer items-end gap-x-2 text-sm font-semibold text-foreground/95 transition hover:underline",
          deleted && "text-muted-foreground",
        )}
      >
        {member.profile.name}
        {roleIconMap[member.role]}
      </span>
      <span className="flex items-end text-xs text-muted-foreground">{timestamp}</span>
    </div>
  );
};

export default ChatItemHeader;
