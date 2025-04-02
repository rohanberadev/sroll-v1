import { SignOutButton } from "@clerk/nextjs";
import {
  LogOutIcon,
  SettingsIcon,
  SparkleIcon,
  UserRoundPenIcon,
} from "lucide-react";
import Link from "next/link";
import { BsBookmark } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ProfileInfoDialog({
  username,
  triggerClassName,
}: {
  username: string;
  triggerClassName?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClassName}>
        <SettingsIcon className="text-gray-200 max-lg:h-5 max-lg:w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-gray-200">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm">
          <Link
            href={`/profile/${username}/edit`}
            className="flex items-center gap-x-2"
          >
            <UserRoundPenIcon className="text-xs" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <Link
            href={`/profile/${username}/saved-posts`}
            className="flex items-center gap-x-2"
          >
            <BsBookmark className="text-xs" />
            <span>Saved Posts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          <Link
            href={`/profile/${username}/draft-posts`}
            className="flex items-center gap-x-2"
          >
            <SparkleIcon className="text-xs" />
            <span>Draft Posts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm text-red-600">
          <LogOutIcon className="text-red-600" />
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
