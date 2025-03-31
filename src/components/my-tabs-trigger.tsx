import { TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

export function MyTabsTrigger({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "flex-1 rounded-none bg-black py-4 data-[state=active]:border-b-[1px] data-[state=active]:bg-black data-[state=active]:text-stone-50 lg:rounded-t-lg",
        active ? "text-white" : "text-gray-600"
      )}
    >
      {label}
    </TabsTrigger>
  );
}
