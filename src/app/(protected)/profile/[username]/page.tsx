import { SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function ProfilePage() {
  return (
    <SignOutButton>
      <Button variant={"destructive"}>Sign out</Button>
    </SignOutButton>
  );
}
