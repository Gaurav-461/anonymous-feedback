"use client";

import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { User } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import TransitionLink from "@/components/TransitionLink";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {

  // State for storing messages and loading states
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // Function to delete a message by filtering it out from the messages array
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  // Get user session data and status
  const { data: session, status } = useSession();

  // Initialize form with validation schema
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  // Destructure methods from form
  const { register, watch, setValue } = form;

  // Watch the acceptMessages field value
  const acceptMessages = watch("acceptMessages");

  // Fetch whether user is accepting messages
  const fetchIsAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages!);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(
        "Error occurred while checking is user accept messages:-",
        error
      );
      toast.error(axiosError.response?.data.message, {
        description: "Failed to fetch user message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch user messages with optional refresh parameter
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log("User messages:-", response);
        setMessages(response.data.messages || []);

        if (!response.data.messages) {
          toast.info("User does't have messages");
        }

        if (refresh) {
          toast("Refreshed Message", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log("Error occurred while fetching user messages:-", error);
        toast.error(axiosError.response?.data.message);
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // Effect to fetch message settings and messages when component mounts
  useEffect(() => {
    if (!session || !session.user) return;

    fetchIsAcceptMessage();
    fetchMessages();
  }, [setValue, fetchIsAcceptMessage, fetchMessages, session]);

  // Handle switch change to toggle message acceptance
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);

      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(
        "Error occurred while update message acceptance status:-",
        error
      );
      toast.error(axiosError.response?.data.message);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-[calc(100vh-12rem)] grid place-items-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-4xl">Please login</p>
      </div>
    );
  }

  const { username } = session.user as User;

  const BASE_URL = `${window.location.origin}`;
  const PROFILE_URL = `${BASE_URL}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_URL);
      toast.info("Profile URL copied", {
        position: "top-center",
        description: "Now you can share your profile link",
      });
    } catch (error) {
      toast.error("Failed to copy profile URL", {
        position: "top-center",
      });
      console.log("Error while copying profile URL:-", error);
    }
  };

  console.log(process.env.NODE_ENV)

  return (
    <>
      <title>Dashboard</title>
      <div className="pt-10 px-4 mb-8 md:mx-8 lg:mx-auto rounded w-full max-w-6xl overflow-hidden">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="w-full md:w-1/2 flex max-sm:flex-col items-center gap-2">
            <TransitionLink
              href={PROFILE_URL}
              className="w-full max-sm:text-sm px-4 py-2 rounded-lg bg-white/20 border dark:border-none"
            >
              {PROFILE_URL}
            </TransitionLink>
            <Button onClick={copyToClipboard}>Copy Profile URL</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4 ml-2"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>

        <div className="max-sm:px-2">
          {isLoading ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[200px] md:w-[550px] rounded-xl"
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message._id?.toString()}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <p className="text-center text-xl col-span-2">
                  No messages to display.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
