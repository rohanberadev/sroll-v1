import { LucideIcon } from "lucide-react";
import Link from "next/link";

export function NavLink({
  linkHref,
  linkLabel,
  Icon,
  active,
}: {
  linkHref: string;
  linkLabel: string;
  Icon: LucideIcon;
  active?: boolean;
}) {
  return (
    <Link href={linkHref} className="inline-block">
      <div className="flex items-center gap-x-8">
        {active ? (
          <Icon
            className="text-2xl leading-none"
            fill="currentColor"
            stroke="none"
          />
        ) : (
          <Icon className="text-2xl leading-none" />
        )}
        <span className="text-[1rem] leading-none max-lg:hidden">
          {linkLabel}
        </span>
      </div>
    </Link>
  );
}
