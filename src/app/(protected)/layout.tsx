// import BottomNav from "@/components/navbar/BottomNav";
// import SideNav from "@/components/navbar/SideNav";
// import { auth } from "@/server/auth";
import { AppHeader } from "~/components/app-header";
import BottomNav from "~/components/bottom-nav";
import SideNav from "~/components/side-nav";

function MainApp({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex w-full flex-col items-center lg:flex-1 lg:pl-[250px] xl:pl-[325px]">
      {children}
    </main>
  );
}

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full max-lg:flex-col lg:flex-row">
      {/* Header for Mobile */}
      <AppHeader />

      {/* Desktop Nav */}
      <SideNav username={"rohan"} />

      {/* <main className="flex w-full flex-col items-center lg:flex-1 lg:pl-[250px] xl:pl-[325px]">
        {children}
      </main> */}

      <MainApp>{children}</MainApp>

      {/* Mobile Nav */}
      <BottomNav username={"rohan"} />
    </div>
  );
}
