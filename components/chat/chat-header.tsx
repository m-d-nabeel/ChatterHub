import { HashIcon } from "lucide-react";
import UserAvatar from "../user-avatar";
import MobileToggle from "../mobile-toggle";
import { SocketIndicator } from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
  name: string;
  serverId: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ name, serverId, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="flex h-12 w-full items-center border-b-2 border-discord-gray4 px-3 font-semibold text-foreground hover:bg-transparent">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <HashIcon className="mr-2 h-5 w-5 text-muted-foreground" />
      )}
      {type === "conversation" && (
        <UserAvatar imageUrl={imageUrl as string} className="mr-4 h-7 w-7" />
      )}
      {name}
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
