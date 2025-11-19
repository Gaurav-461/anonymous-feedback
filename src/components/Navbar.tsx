"use client";

import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "./ToggleTheme";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import Link from "next/link";
import TransitionLink from "./TransitionLink";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const URL_PATHNAME = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();

  const user: User = session?.user;

  return (
    <nav className="sticky top-0 max-w-screen-xl w-full mx-auto py-4 px-2 backdrop-blur-md flex flex-grow items-center justify-between gap-4 z-50 border-b">
      <TransitionLink className="max-sm:text-xs" href="/">
        Anonymous <span className="font-bold text-green-600">Feedback</span>
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
          <div className="flex items-center gap-2">
            <ModeToggle />
            {pathname !== "/users" && (
              <Button
                onClick={() => {
                  router.push("/users");
                  setIsOpen(false);
                }}
                variant={"ghost"}
                className={"w-full"}
              >
                All Users
              </Button>
            )}
            <Button
              className="w-full rounded-md"
              onClick={() => setIsOpen(!isOpen)}
              variant={"ghost"}
            >
              {isOpen ? (
                <X className="size-12 shrink-0" />
              ) : (
                <Menu className="size-6 shrink-0" />
              )}
            </Button>
          </div>
          {isOpen && (
            <div className="absolute left-0 mt-4 w-full bg-white dark:bg-zinc-950 max-sm:h-dvh backdrop-blur-xl rounded-md shadow-lg z-10 p-6 transition-all">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Welcome, {user?.username || user?.email}
              </div>

              <div className="flex flex-col gap-4 mt-4">
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
