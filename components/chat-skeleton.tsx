"use client";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
const ChatSkeleton = ({ className }: { className?: string }) => {
  const randomWidths = [
    "83%",
    "60%",
    "40%",
    "90%",
    "75%",
    "65%",
    "45%",
    "63%",
    "76%",
    "50%",
  ];
  return (
    <div className={cn("space-y-2 overflow-y-auto px-4", className)}>
      {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((c, index) => (
        <div className="flex items-center gap-x-4" key={c}>
          <Skeleton className="aspect-square h-12 w-12 rounded-full bg-discord-gray1" />
          <div className="flex w-full flex-col gap-y-1 rounded-lg p-4">
            <Skeleton
              className="h-4 bg-discord-gray1"
              style={{
                width: randomWidths[randomWidths.length - index - 1],
              }}
            />
            <Skeleton
              className="h-4 bg-discord-gray1"
              style={{
                width: randomWidths[index],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;
