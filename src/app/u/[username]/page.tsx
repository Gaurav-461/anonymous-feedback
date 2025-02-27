"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, SendHorizontal } from "lucide-react";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { set, z } from "zod";
import { useCompletion } from "@ai-sdk/react";

interface UsernameType {
  params: Promise<{ username: string }>;
}

const SPECIAL_CHARACTER = "||";

const parsedString = (message: string): string[] => {
  return message.split(SPECIAL_CHARACTER);
};

const SendMessagePage = ({ params }: UsernameType) => {
  const { username } = use(params);

  const [suggestMessages, setSuggestMessages] = useState<string[]>([
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);


  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch("content");
  console.log(" messageContent:-",messageContent);

  const onSubmitHandler = async (data: z.infer<typeof MessageSchema>) => {
    const toastId = "sendMessageToast";
    if (!data.content.trim()) {
      toast.error("Message cannot be empty", {
        id: "sendMessageToast",
      });
      return;
    }

    setIsSendingMessage(true);

    try {
      toast.loading("Sending message...", { id: toastId });

      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      if (!response.data.success) {
        toast.error(response.data.message, { id: toastId });
        return;
      }
      form.setValue("content", "");

      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(
        "Error occurred while sending message:-",
        axiosError.response?.data.message
      );
      toast.error(
        axiosError.response?.data.message ?? "Failed to delete message",
        { id: toastId }
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const fetchSuggestMessages = async () => {
    const toastId = "suggestMessagesToast";
    setIsLoading(true);
    try {
      toast.loading("Fetching suggested messages...", { id: toastId });
      const response = await axios.get("/api/suggest-messages");

      const parsedMessages = parsedString(response.data.message);
      setSuggestMessages(parsedMessages);

      toast.success("Suggested messages", { id: toastId });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(
        "Error occurred while getting suggested messages:-",
        axiosError.response?.data.message
      );
      console.log(error);
      toast.error(
        axiosError.response?.data.message ?? "Failed to get suggested messages",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Public Profile URL</title>
      <section className="max-w-screen-lg mx-auto py-16 px-4 md:px-24">
        <div className="w-full mb-8">
          <h1 className="text-2xl md:text-4xl text-center">Public Profile Link</h1>
        </div>

        <div className="w-full">
          <p className="p-2">Send Anonymous Messages to @{username}</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="h-full mb-10 resize-none"
                        placeholder="Write your anonymous message here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-center">
                <Button
                  className={cn("cursor-pointer", {
                    "cursor-not-allowed": isSendingMessage,
                  })}
                  disabled={isSendingMessage || !messageContent}
                  type="submit"
                >
                  {isSendingMessage ? (
                    <p className="flex items-center gap-2">
                      Sending
                      <Loader2 className="size-4 animate-spin" />
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      Send
                      <SendHorizontal className="size-4" />
                    </p>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <Separator className="my-4" />

        <div className="mt-10">
          <h1 className="text-4xl text-center">Suggested Messages</h1>

          <div className="mt-6">
            <div className="space-y-2 mb-2">
              <Button
                disabled={isLoading}
                onClick={fetchSuggestMessages}
                className={cn("max-sm:w-full", { "cursor-not-allowed": isLoading })}
              >
                Suggest Messages
              </Button>
              <p className="max-sm:text-center">Click on any message below to select it.</p>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Messages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestMessages.map((message, index) => (
                    <Button
                      key={index + 1}
                      variant={"ghost"}
                      className="w-full h-full text-wrap border dark:bg-white/5"
                      onClick={() => {
                        form.setValue("content", message);
                      }}
                    >
                      <p>{message}</p>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SendMessagePage;
