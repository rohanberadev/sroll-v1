import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { insertUser } from "~/features/user/db/users";
import { syncClerkUserMetadata } from "~/services/clerk";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) return new Response("User not found", { status: 400 });
  if (!user.fullName) return new Response("No fullname", { status: 400 });
  if (!user.username) return new Response("No username", { status: 400 });
  if (!user.primaryEmailAddress?.emailAddress)
    return new Response("No email", { status: 400 });

  const dbUser = await insertUser({
    clerkUserId: user.id,
    fullname: user.fullName,
    username: user.username,
    email: user.primaryEmailAddress.emailAddress,
    imageUrl: user.imageUrl,
    role: user.publicMetadata.role ?? "user",
  });

  await syncClerkUserMetadata(dbUser);

  await new Promise((res) => setTimeout(res, 100));

  return NextResponse.redirect(request.headers.get("referer") ?? "/");
}
