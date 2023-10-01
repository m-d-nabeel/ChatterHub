"use client";

import { ChannelMessage, Member, Profile } from "@prisma/client";
import { format } from "date-fns";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ServerCrashIcon } from "lucide-react";
import ChatSkeleton from "../chat-skeleton";
import { Fragment, useRef, ElementRef } from "react";
import { Separator } from "../ui/separator";
import ChatItem from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
  type: "channel" | "conversation";
  name: string;
  member: Member & { profile: Profile };
  chatId: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

type ChannelMessageWithMemberWithProfile = ChannelMessage & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "dd/MM/yyyy HH:mm";

const ChatMessages = ({
  type,
  name,
  member,
  chatId,
  paramKey,
  paramValue,
  apiUrl,
  socketUrl,
  socketQuery,
}: ChatMessagesProps) => {
  // must match with server
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });
  useChatSocket({ queryKey, updateKey, addKey });
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "loading") {
    return <ChatSkeleton />;
  }
  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrashIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Something went wrong!</p>
      </div>
    );
  }
  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className="flex flex-1" />
          <ChatWelcome
            type={type}
            name={name}
            imageUrl={member.profile?.imageUrl}
            hashTag={member.profileId}
          />
          <Separator className="mx-4 my-4 h-[1px] w-auto rounded-md bg-discord-gray1" />
        </>
      )}
      {hasNextPage && (
        <div>
          {isFetchingNextPage ? (
            <ChatSkeleton className="max-h-60" />
          ) : (
            <button
              className="flex w-full items-center justify-center text-xs font-semibold text-muted-foreground transition hover:text-foreground/80"
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group &&
              group.items.map(
                (message: ChannelMessageWithMemberWithProfile) => (
                  <ChatItem
                    key={message.id}
                    id={message.id}
                    member={message.member}
                    currentMember={member}
                    content={message.content}
                    fileUrl={message.fileUrl}
                    deleted={message.deleted}
                    isUpdated={message.createdAt !== message.updatedAt}
                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    socketQuery={socketQuery}
                    socketUrl={socketUrl}
                  />
                ),
              )}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
