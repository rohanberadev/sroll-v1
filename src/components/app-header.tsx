"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { NavLink } from "./nav-link";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b-[1px] border-gray-600 bg-black px-4 shadow-lg lg:hidden">
      <Link href={"/"} className="inline-flex">
        <h1 className="text-3xl font-bold">Scroll</h1>
      </Link>
      <ul className="flex items-center gap-x-4">
        <li>
          <NavLink
            linkHref="/notifications"
            linkLabel="Notifications"
            FillIcon={GoHeartFill}
            OutlineIcon={GoHeart}
            active={pathname === "/notifications"}
          />
        </li>

        <li>
          <NavLink
            linkHref="/messages"
            linkLabel="Messages"
            FillIcon={AiFillMessage}
            OutlineIcon={AiOutlineMessage}
            active={pathname === "/messages"}
          />
        </li>
      </ul>
    </header>
  );
}
