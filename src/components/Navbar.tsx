"use client";

import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "./ToggleTheme";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import Link from "next/link";
import TransitionLink from "./TransitionLink";
import { useState } from "react";
import { Cross, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const URL_PATHNAME = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();

  const user: User = session?.user;

  return (
    <nav className="sticky top-0 max-w-screen-xl w-full mx-auto py-4 px-2 backdrop-blur-md flex flex-grow items-center justify-between gap-4 z-50 border-b">
      <TransitionLink className="max-sm:text-xs" href="/">
        Anonymous <span className="font-bold text-green-600">Message</span>
      </TransitionLink>

      <div className="hidden md:block">
        <div className="flex items-center gap-8">
          <Link
            href="/users"
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            All Users
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-8">
              <span className="max-sm:text-xs">
                Welcome {user?.username || user?.email}
              </span>
              {URL_PATHNAME !== "/dashboard" && (
                <TransitionLink
                  href="/dashboard"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Dashboard
                </TransitionLink>
              )}
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <TransitionLink
                href="/sign-in"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Sign in
              </TransitionLink>

              <TransitionLink
                href="/sign-up"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Sign up
              </TransitionLink>
            </>
          )}
          <ModeToggle />
        </div>
      </div>

      {/* Responsive Navbar */}
      {status === "authenticated" ? (
        <div className="md:hidden">
          <Button
            className="w-full text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="size-6 shrink-0" />
            ) : (
              <Menu className="size-6 shrink-0" />
            )}
          </Button>
          {isOpen && (
            <div className="absolute left-0 mt-4 w-full dark:backdrop-blur-xl rounded-md shadow-lg z-10 p-6 border transition-all">
              <Button
                onClick={() => {
                  router.push("/users");
                  setIsOpen(false);
                }}
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                All Users
              </Button>
              <div className="flex flex-col gap-4 mt-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Welcome, {user?.username || user?.email}
                </span>
                <Button
                  onClick={() => {
                    router.push("/dashboard");
                    setIsOpen(false);
                  }}
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                  })}
                >
                  Dashboard
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                >
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4 md:hidden">
          <TransitionLink
            href="/sign-in"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Sign in
          </TransitionLink>
          <TransitionLink
            href="/sign-up"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Sign up
          </TransitionLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
