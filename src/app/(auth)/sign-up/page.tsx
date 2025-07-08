"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

const SignUpPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 1000);

  // Zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = useCallback(async () => {
    if (username.trim().length > 0) {
      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );

        // console.log("Axios for check username is unique response:-", response);

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error while checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  }, [username]);

  useEffect(() => {
    checkUsernameUnique();
  }, [username, checkUsernameUnique]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const toastId = "onSubmitToast";
    setIsSubmitting(true);
    try {
      toast.loading("Submitting...", {
        id: toastId,
      });
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log("Axios sign-in response:-", response);

      toast.success(response.data.message, {
        id: toastId,
      });

      router.push(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage, {
        id: toastId,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Sign Up</title>
      <div className="flex justify-center items-center min-h-screen px-4 ">
        <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg border">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl mb-6">
              Welcome Back to True Feedback
            </h1>
            <p className="mb-4">Sign up to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                    {isCheckingUsername && (
                      <Loader2 className="animate-spin size-4" />
                    )}

                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={` text-sm ${
                          usernameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center mt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="">Please wait</span>
                      <Loader2 className="ml-2 animate-spin size-4" />
                    </>
                  ) : (
                    <>
                      <span className="">Sign Up</span>
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-center gap-4">
            <p>Already have an account?</p>
            <Link href="/sign-in" className="underline">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
