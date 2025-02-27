"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const date = new Date();

  const handleDeleteConfirm = async () => {
    const toastId = "deleteMessageToast";
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast.success(response.data.message, {
        id: toastId,
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      console.log("Error while deleting message:-", error);
      toast.error("Error while deleting message", {
        id: toastId,
      });
    }
  };

  return (
    <div className="">
      <Card className="bg-white/15">
        <CardHeader>
          <CardTitle>{message.content}</CardTitle>
          <CardFooter></CardFooter>
        </CardHeader>

        <div className="p-6 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="w-full flex items-center justify-between">
                <div>
                <p className="max-sm:text-sm">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
                <Button variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
};

export default MessageCard;
