"use client";

import { Member, Profile } from "@prisma/client";
import UserAvatar from "./user-avatar";
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";

interface MemberCardProps {
  member: Member & {
    profile: Profile;
  };
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheckIcon className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlertIcon className="h-4 w-4 text-rose-500" />,
};

const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <div className="flex items-center gap-x-3 text-xs">
      <UserAvatar imageUrl={member.profile.imageUrl} />
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2 font-semibold">
          {member.profile.name}
          {roleIconMap[member.role]}
        </div>
        <p className="text-muted-foreground">{member.profile.email}</p>
      </div>
      {}
    </div>
  );
};

export default MemberCard;
