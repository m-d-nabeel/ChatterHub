"use client";

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  TrashIcon,
  UserPlus2Icon,
  UsersIcon,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

const ServerHeader = ({
  server,
  role,
}: {
  server: ServerWithMembersWithProfiles;
  role: MemberRole;
}) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="bg-cover bg-center bg-no-repeat brightness-75 saturate-150 focus:outline-none"
        style={{ backgroundImage: `url(${server.imageUrl})` }}
        asChild
      >
        <button className="z-50 flex h-12 w-full items-center px-3 py-3 text-lg font-semibold shadow-md brightness-100 contrast-100 saturate-100 hover:bg-transparent">
          <p className="w-full text-start mix-blend-difference">
            {server.name}
          </p>
          <ChevronDownIcon className="ml-auto h-5 w-5 mix-blend-difference" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-1 border-transparent bg-discord-gray4 contrast-[1.05]">
        {isModerator && (
          <DropdownMenuItem
            className="w-full cursor-pointer px-3 py-2 text-indigo-500 aria-selected:bg-discord-gray1"
            onClick={() => onOpen("invitation", { server })}
          >
            Invite People
            <UserPlus2Icon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="w-full cursor-pointer px-3 py-2 text-muted-foreground aria-selected:bg-discord-gray1"
            onClick={() => onOpen("editServer", { server })}
          >
            Server Settings
            <SettingsIcon className="ml-auto h-4 w-4" />{" "}
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="w-full cursor-pointer px-3 py-2 text-muted-foreground aria-selected:bg-discord-gray1"
          >
            Manage Members
            <UsersIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="w-full cursor-pointer px-3 py-2 text-muted-foreground aria-selected:bg-discord-gray1"
          >
            Create Channel
            <PlusCircleIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="w-full cursor-pointer px-3 py-2 text-rose-500 aria-selected:bg-discord-gray1"
          >
            Delete Server
            <TrashIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="w-full cursor-pointer px-3 py-2 text-rose-500 aria-selected:bg-discord-gray1 "
          >
            Leave Server
            <LogOutIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
