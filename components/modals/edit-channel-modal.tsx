"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useEffect } from "react";
import qs from "query-string";

// local imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChannelType } from "@prisma/client";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "editChannel";
  const { channel, serverId } = data;
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("type", channel.type);
      form.setValue("name", channel.name);
    }
  }, [channel, form]);

  const isLoading = form.formState.isLoading;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId,
        },
      });
      await axios.patch(url, values);
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Channel update failed.",
      });
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="border-transparent bg-discord-gray2">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-w-full flex-col justify-center space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="-mb-4">
                  <FormLabel className="text-sm font-semibold text-foreground/80">
                    CHANNEL NAME
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="bg-discord-gray4 placeholder:capitalize"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="font-thin text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground/80">
                    Channel Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="bg-discord-gray4">
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a Channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-transparent bg-discord-gray35">
                      {Object.values(ChannelType).map((type) => (
                        <SelectItem value={type} key={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-thin text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white transition-colors hover:bg-indigo-500"
            >
              Edit Channel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
