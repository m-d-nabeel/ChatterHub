"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import axios from "axios";
import qs from "query-string";

import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../emoji-picker";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  apiUrl: string;
  type: "conversation" | "channel";
  query: Record<string, any>;
  name: string;
}

// TODO : Can we send only files without any texts ?

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { onOpen } = useModal();
  const chatInputRef = useRef<HTMLInputElement>(null);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("[MESSAGE_SEND_ERROR]", error);
    }
  };
  useEffect(() => {
    chatInputRef.current?.focus();
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-auto w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex w-full items-center p-4 pb-6">
                  <Input
                    {...field}
                    ref={chatInputRef}
                    className="rounded-lg border-transparent bg-discord-gray2 px-14 py-6 ring-offset-transparent focus-visible:ring-transparent"
                    placeholder={`Message ${
                      type === "channel" ? "#" + name : name
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute left-8 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/50 transition hover:bg-foreground/80"
                  >
                    <PlusIcon className="h-5 w-5 text-discord-gray3" />
                  </button>
                  <EmojiPicker
                    onChange={(emoji: string) =>
                      field.onChange(field.value + emoji)
                    }
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
