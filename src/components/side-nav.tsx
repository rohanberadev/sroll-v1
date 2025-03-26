"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { GoHeart, GoHeartFill, GoHome, GoHomeFill } from "react-icons/go";
import {
  MdAddToPhotos,
  MdExplore,
  MdOutlineAddToPhotos,
  MdOutlineExplore,
} from "react-icons/md";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { UserAvatar } from "~/features/user/components/user-avatar";
import { NavLink } from "./nav-link";

export default function SideNav({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen border-r-[1px] border-gray-600 pl-8 pt-12 max-lg:hidden lg:w-[250px] xl:w-[325px]">
      <Link href={"/"} className="inline-flex">
        <h1 className="text-4xl font-bold">Scroll</h1>
      </Link>
      <ul className="mt-12 flex flex-col gap-y-10 text-lg">
        <li>
          <NavLink
            linkHref="/"
            linkLabel="Home"
            FillIcon={GoHomeFill}
            OutlineIcon={GoHome}
            active={pathname === "/"}
          />
        </li>

        <li>
          <NavLink
            linkHref="/search"
            linkLabel="Search"
            FillIcon={RiSearchFill}
            OutlineIcon={RiSearchLine}
            active={pathname.includes("search")}
          />
        </li>

        <li>
          <NavLink
            linkHref="/explore"
            linkLabel="Explore"
            FillIcon={MdExplore}
            OutlineIcon={MdOutlineExplore}
            active={pathname.includes("explore")}
          />
        </li>

        <li>
          <NavLink
            linkHref="/messages"
            linkLabel="Messages"
            FillIcon={AiFillMessage}
            OutlineIcon={AiOutlineMessage}
            active={pathname.includes("messages")}
          />
        </li>

        <li>
          <NavLink
            linkHref="/notifications"
            linkLabel="Notifications"
            FillIcon={GoHeartFill}
            OutlineIcon={GoHeart}
            active={pathname.includes("notifications")}
          />
        </li>

        <li>
          <NavLink
            linkHref="/create"
            linkLabel="Create"
            FillIcon={MdAddToPhotos}
            OutlineIcon={MdOutlineAddToPhotos}
            active={pathname === "/create"}
          />
        </li>

        <li>
          <Link href={`/profile/${username}`}>
            <UserAvatar
              avatarContainerStyles="h-auto w-full items-center gap-x-6 rounded-full"
              avatarImageStyles="h-6 w-6 rounded-full object-cover"
              avatarLabel="Profile"
              active={
                pathname.split("/").includes("profile") &&
                pathname.split("/").includes(username)
              }
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
