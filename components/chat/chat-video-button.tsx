"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import { VideoIcon, VideoOffIcon } from "lucide-react";
import ActionTooltip from "../action-tooltip";

const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOffIcon : VideoIcon;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname ?? "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );
    router.replace(url);
  };

  return (
    <ActionTooltip label={tooltipLabel} side="bottom">
      <button onClick={handleClick} className="mr-4 bg-transparent transition hover:opacity-75">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
