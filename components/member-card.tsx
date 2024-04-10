"use client";

import qs from "query-string";
import { Member, MemberRole, Profile } from "@prisma/client";
import {
  CheckIcon,
  GavelIcon,
  Loader2Icon,
  MoreVerticalIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldQuestionIcon,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import { ModalData, ModalType } from "@/hooks/use-modal-store";

interface MemberCardProps {
  member: Member & {
    profile: Profile;
  };
  serverId: string;
  profileId: string;
  loadingId: string;
  setLoadingId: React.Dispatch<React.SetStateAction<string>>;
  onOpen: (type: ModalType, data?: ModalData) => void;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheckIcon className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlertIcon className="h-4 w-4 text-rose-500" />,
};

const MemberCard = ({
  member,
  serverId,
  profileId,
  loadingId,
  setLoadingId,
  onOpen,
}: MemberCardProps) => {
  const router = useRouter();
  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId,
        },
      });
      const { data } = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.error("Role change error", error);
    } finally {
      setLoadingId("");
    }
  };
  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId,
        },
      });
      const { data } = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.error("Role change error", error);
    } finally {
      setLoadingId("");
    }
  };

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
      {profileId !== member.profileId && loadingId !== member.id && (
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
              <MoreVerticalIcon className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="left"
              className="space-y-1 border-transparent bg-discord-gray4 contrast-[1.05]"
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="aria-selected:bg-discord-gray1">
                  <ShieldQuestionIcon className="mr-2 h-4 w-4 aria-selected:bg-discord-gray1" />
                  Role
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className="border-discord-gray1 bg-discord-gray35"
                    sideOffset={10}
                    alignOffset={-30}
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleRoleChange(member.id, MemberRole.GUEST)}
                    >
                      <ShieldIcon className="mr-2 h-4 w-4" />
                      Guest
                      {member.role === "GUEST" && <CheckIcon className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleRoleChange(member.id, MemberRole.MODERATOR)}
                    >
                      <ShieldCheckIcon className="mr-2 h-4 w-4" />
                      Moderator
                      {member.role === "MODERATOR" && <CheckIcon className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-rose-600"
                onClick={() => handleKick(member.id)}
              >
                <GavelIcon className="mr-2 h-4 w-4" />
                Kick
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {loadingId === member.id && (
        <Loader2Icon className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};

export default MemberCard;
