import Link from "next/link";
import { IconType } from "react-icons";

export function NavLink({
  linkHref,
  linkLabel,
  OutlineIcon,
  FillIcon,
  active,
}: {
  linkHref: string;
  linkLabel: string;
  OutlineIcon: IconType;
  FillIcon: IconType;
  active?: boolean;
}) {
  return (
    <Link href={linkHref} className="inline-block">
      <div className="flex items-center gap-x-8">
        {active ? (
          <FillIcon className="text-2xl leading-none" />
        ) : (
          <OutlineIcon className="text-2xl leading-none" />
        )}
        <span className="text-[1rem] leading-none max-lg:hidden">
          {linkLabel}
        </span>
      </div>
    </Link>
  );
}
