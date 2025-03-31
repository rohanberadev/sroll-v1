import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarLib,
} from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

export function UserAvatar({
  avatarContainerStyles,
  avatarImageUrl,
  avatarImageStyles,
  avatarFallbackStyles,
  avatarLabel,
  active,
}: {
  avatarContainerStyles?: string;
  avatarImageUrl?: string;
  avatarImageStyles?: string;
  avatarFallbackStyles?: string;
  avatarLabel?: string;
  active?: boolean;
}) {
  return (
    <AvatarLib className={avatarContainerStyles}>
      <AvatarImage
        src={avatarImageUrl}
        className={cn(
          "block select-none",
          active ? "border-[2px]" : "",
          avatarImageStyles
        )}
      />
      <AvatarFallback className={avatarFallbackStyles}>CN</AvatarFallback>
      <span className="text-[1rem] leading-none max-lg:hidden">
        {avatarLabel}
      </span>
    </AvatarLib>
  );
}
