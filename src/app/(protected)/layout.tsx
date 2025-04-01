import { redirect } from "next/navigation";
import { AppHeader } from "~/components/app-header";
import BottomNav from "~/components/bottom-nav";
import SideNav from "~/components/side-nav";
import { getCurrentUser } from "~/services/clerk";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser({ allData: true });
  if (!user) redirect("/sign-in");

  return (
    <div className="flex w-full max-lg:flex-col lg:flex-row">
      {/* Header for Mobile */}
      <AppHeader />

      {/* Desktop Nav */}
      <SideNav
        username={user.user?.username!}
        imageUrl={user.user?.imageUrl!}
      />

      {/* <main className="flex w-full flex-col items-center lg:flex-1 lg:pl-[250px] xl:pl-[325px]">
        {children}
      </main> */}

      <main className="flex w-full flex-col items-center lg:flex-1 lg:pl-[250px] xl:pl-[325px]">
        <div className="px-12 py-16 w-full h-full flex justify-center items-center">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <BottomNav username={"rohan"} />
    </div>
  );
}
