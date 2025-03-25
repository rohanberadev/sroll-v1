"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  CirclePlusIcon,
  HeartIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  TelescopeIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { AvatarFallback } from "./ui/avatar";

export default function SideNav({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen border-r-[1px] border-gray-600 pl-8 pt-12 max-lg:hidden lg:w-[250px] xl:w-[325px]">
      <Link href={"/"} className="inline-flex">
        <h1 className="text-4xl">Scroll</h1>
      </Link>
      <ul className="mt-12 flex flex-col gap-y-10 text-lg">
        <li>
          <NavLink
            linkHref="/"
            linkLabel="Home"
            Icon={HomeIcon}
            active={pathname === "/"}
          />
        </li>
        <li>
          <NavLink
            linkHref="/search"
            linkLabel="Search"
            Icon={SearchIcon}
            active={pathname.includes("search")}
          />
        </li>
        <li>
          <NavLink
            linkHref="/explore"
            linkLabel="Explore"
            Icon={TelescopeIcon}
            active={pathname.includes("explore")}
          />
        </li>
        <li>
          <NavLink
            linkHref="/messages"
            linkLabel="Messages"
            Icon={MessageCircleIcon}
            active={pathname.includes("messages")}
          />
        </li>
        <li>
          <NavLink
            linkHref="/notifications"
            linkLabel="Notifications"
            Icon={HeartIcon}
            active={pathname.includes("notifications")}
          />
        </li>
        <li>
          <NavLink
            linkHref="/create"
            linkLabel="Create"
            Icon={CirclePlusIcon}
            active={pathname === "/create"}
          />
        </li>
        <li>
          <Link href={`/profile/${username}`}>
            <Avatar>
              <AvatarImage
                className="w-16 h-16 rounded-full"
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
