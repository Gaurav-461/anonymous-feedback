"use client";

import TransitionLink from "@/components/TransitionLink";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllUsers = async () => {
    const toastId = "fetchAllUsersToast";
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-users");
      setUsers(response.data?.users);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(
        "Error occurred while fetching all users:-",
        axiosError.response?.data.message
      );
      console.log(error);
      toast.error(axiosError.response?.data.message ?? "Failed to get users", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  // or
  const BASE_URL = `${window.location.protocol}//${window.location.host}`;
  const PROFILE_URL: string = `${BASE_URL}/u`;

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">All Users</h1>
          <div className="grid grid-cols-1 gap-4 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 ">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index + 1} className="w-full h-28" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="grid grid-cols-1 gap-4 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={`${user._id}`} className="sm:w-full]">
            <CardHeader>
              <CardTitle>@{user.username}</CardTitle>
              <CardDescription>
                <TransitionLink href={`${PROFILE_URL}/${user.username}`}>
                  {`${PROFILE_URL}/${user.username}`}
                </TransitionLink>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
