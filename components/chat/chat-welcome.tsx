"use client";

import { HashIcon } from "lucide-react";
import UserAvatar from "../user-avatar";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
  imageUrl?: string;
  hashTag?: string;
}
const ChatWelcome = ({ type, name, imageUrl, hashTag }: ChatWelcomeProps) => {
  return (
    <div className="flex flex-col gap-y-4 px-4 pt-4">
      {type === "channel" && (
        <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-discord-gray2">
          <HashIcon className="h-12 w-12 text-foreground" />
        </div>
      )}
      {type === "conversation" && <UserAvatar imageUrl={imageUrl!} className="h-20 w-20" />}
      <h1 className="flex items-center text-3xl font-bold">
        {type === "channel" ? `Welcome to #${name}!` : `${name}`}
      </h1>
      {type === "conversation" && (
        <p>
          {name}#{hashTag?.substring(8, 4)}
        </p>
      )}
      <p className="font-light text-muted-foreground">
        {type === "channel"
          ? `This is the start of #${name} channel.`
          : `This is the beginning of your direct message history with ${name}.`}
      </p>
    </div>
  );
};

export default ChatWelcome;
