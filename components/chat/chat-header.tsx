import { HashIcon } from "lucide-react";
import UserAvatar from "../user-avatar";
import MobileToggle from "../mobile-toggle";

interface ChatHeaderProps {
  name: string;
  serverId: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ name, serverId, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="fixed flex h-12 w-full items-center border-b-2 border-discord-gray4 px-3 font-semibold text-muted-foreground hover:bg-transparent">
      <MobileToggle serverId={serverId} />
      {type === "channel" && <HashIcon className="mr-2 h-5 w-5" />}
      {type === "conversation" && <UserAvatar imageUrl={imageUrl as string} className="mr-4 w-7 h-7" />}
      {name}
    </div>
  );
};

export default ChatHeader;
