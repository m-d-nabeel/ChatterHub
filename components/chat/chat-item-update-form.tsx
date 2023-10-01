"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import qs from "query-string";

import { Dispatch, SetStateAction, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EmojiPicker from "../emoji-picker";

interface ChatItemUpdateFormProps {
  id: string;
  content: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItemUpdateForm = ({
  id,
  content,
  setIsEditing,
  socketUrl,
  socketQuery,
}: ChatItemUpdateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: content,
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error("[MESSAGE_UPDATE_ERROR]", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-auto w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative my-2 flex w-full items-center">
                  <Input
                    {...field}
                    className="rounded-lg border-none bg-discord-gray35 px-6 py-6 pr-14 ring-offset-transparent focus-visible:ring-transparent"
                    placeholder=""
                    disabled={isLoading}
                  />
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
      <span className="-mb-2 -mt-1 text-[10px] text-foreground/30">
        Press escape to cancel, enter to save
      </span>
    </Form>
  );
};

export default ChatItemUpdateForm;
