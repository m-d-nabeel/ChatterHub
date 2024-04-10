"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useEffect, useRef } from "react";

// local imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  imageUrl: z.string().min(2, {
    message: "Image URL must be at least 2 characters.",
  }),
});

const EditServerModal = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === "editServer";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
    return () => form.reset();
  }, [form, server]);

  const isLoading = form.formState.isLoading;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Server update failed.",
      });
    }
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="border-transparent bg-discord-gray2">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Customise your server
          </DialogTitle>
          <DialogDescription className="text-center brightness-75">
            Your server is where you and your friends hang out.
            <br />
            Make yours and start talking.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-w-full flex-col justify-center space-y-8"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex w-full justify-center">
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    endPoint="serverImage"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">SERVER NAME</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="bg-discord-gray4"
                      disabled={isLoading}
                    />
                  </FormControl>
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
              Update Server
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
