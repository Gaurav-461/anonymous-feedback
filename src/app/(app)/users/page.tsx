"use client";

import TransitionLink from "@/components/TransitionLink";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UsersPage = () => {
  // const PROFILE_URL = process.env;
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
  useEffect(() => {
    fetchAllUsers();
  }, []);
  console.log("users", users);

  if (isLoading) {
    return (
      <>
        <div>Loading</div>
      </>
    );
  }
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user._id as string} className="sm:w-[300px]">
            <CardHeader>
              <CardTitle>@{user.username}</CardTitle>
              <CardDescription>
                <TransitionLink href={`/u/${user.username}`}>
                  {`https://localhost:3000/u/${user.username}`}
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
