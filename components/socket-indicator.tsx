"use client";

import { cn } from "@/lib/utils";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = ({ className }: { className?: string }) => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className={cn("border-transparent bg-yellow-600 text-foreground", className)}
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent bg-emerald-600 text-foreground", className)}
    >
      Live: Real-time updates
    </Badge>
  );
};
