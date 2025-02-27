"use client";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TransitionLink = ({ children, href, ...props }: TransitionLinkProps) => {
  const router = useRouter();
  const URL_PATHNAME = usePathname();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (URL_PATHNAME === href) return;
    e.preventDefault();
    const body = document.querySelector("body");

    body?.classList.add("page-transition");

    await sleep(500);

    router.push(href);

    await sleep(500);

    body?.classList.remove("page-transition");

  };
  return (
    <Link href={href} {...props} onClick={(e) => handleClick(e)}>
      {children}
    </Link>
  );
};

export default TransitionLink;
