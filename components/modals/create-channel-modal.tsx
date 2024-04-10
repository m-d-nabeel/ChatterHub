"use client";

import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { generate } from "random-words";
import { useEffect, useRef } from "react";
import qs from "query-string";

// local imports
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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

const CreateChannelModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const params = useParams();
  const isModalOpen = isOpen && type === "createChannel";
  const { toast } = useToast();
  const randomServerNameRef = useRef("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isLoading;
  const generateRandomServerName = () => {
    randomServerNameRef.current = generate({
      exactly: 2,
      minLength: 4,
      maxLength: 10,
      join: " ",
    });
  };

  !isOpen && setTimeout(() => generateRandomServerName(), 1000);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels/",
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Channel creation failed.",
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
          <DialogTitle className="text-center text-2xl font-bold">Create Channel</DialogTitle>
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
                      placeholder={randomServerNameRef.current}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              Create Channel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
