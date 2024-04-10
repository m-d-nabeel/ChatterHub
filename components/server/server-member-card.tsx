"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../user-avatar";
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheckIcon className="mr-2 h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlertIcon className="mr-2 h-4 w-4 text-rose-500" />,
};

interface ServerMemberCardProps {
  members: (Member & { profile: Profile })[];
  currentMemberProfileId: string;
}

const ServerMemberCard = ({ members, currentMemberProfileId }: ServerMemberCardProps) => {
  const router = useRouter();
  const params = useParams();
  const handleMemberClick = (memberId: string) => {
    router.push(`/servers/${params?.serverId}/conversations/${memberId}`);
  };
  return (
    <>
      {members.map((member: Member & { profile: Profile }) => (
        <div
          key={member.id}
          className={cn(
            "mt-4 flex select-none items-center gap-x-3 text-xs",
            member.profileId === currentMemberProfileId && "pointer-events-none",
          )}
        >
          <div onClick={() => handleMemberClick(member.id)}>
            <UserAvatar
              imageUrl={member.profile.imageUrl}
              className="transition hover:cursor-pointer hover:drop-shadow"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2 font-semibold">
              <p className="hover:cursor-pointer" onClick={() => handleMemberClick(member.id)}>
                {member.profile.name}
              </p>
              {currentMemberProfileId === member.profileId && (
                <p className="text-[10px] font-light">(You)</p>
              )}
              {roleIconMap[member.role]}
            </div>
            <p className="text-muted-foreground">{member.profile.email}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ServerMemberCard;
