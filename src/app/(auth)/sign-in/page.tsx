"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    const toastId = "signInToast";
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error, { id: toastId });
      setIsSubmitting(false);
      return;
    }

    if (result?.ok) {
      toast.success("Sign in successfully", { id: toastId });
      router.replace("/dashboard");
    }
  };

  return (
    <>
      <title>Sign In</title>
      <div className="flex justify-center items-center h-[89dvh] px-4">
        <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg border">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight lg:text-3xl mb-6">
              Welcome Back to True Feedback
            </h1>
            <p className="mb-4">
              Sign in to continue your secret conversations
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder="username or email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
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
                      <span className="">Sign in</span>
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-center gap-4">
            <p>Don&apos;t have an account?</p>
            <Link href="/sign-up" className="underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
