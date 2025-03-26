import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { env } from "~/data/env/server";
import { deleteUser, insertUser, updateUser } from "~/features/user/db/users";
import { syncClerkUserMetadata } from "~/services/clerk";

export async function POST(req: Request) {
  const SIGNING_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;

  // Verify payload with headers
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const email = event.data.email_addresses.find(
        (email) => email.id === event.data.primary_email_address_id
      )?.email_address;
      const username = event.data.username;
      const fullname =
        `${event.data.first_name} ${event.data.last_name}`.trim();

      if (!email) {
        return new Response("No email", { status: 400 });
      }
      if (!username) {
        return new Response("No username", { status: 400 });
      }
      if (!fullname) {
        return new Response("No fullname", { status: 400 });
      }

      if (event.type === "user.created") {
        const user = await insertUser({
          username,
          email,
          fullname,
          imageUrl: event.data.image_url,
          clerkUserId: event.data.id,
          role: "user",
        });

        await syncClerkUserMetadata(user);
      } else if (event.type === "user.updated") {
        await updateUser(
          { clerkUserId: event.data.id },
          {
            email,
            username,
            fullname,
            role: event.data.public_metadata.role,
            imageUrl: event.data.image_url,
          }
        );
      }

      break;
    }
    case "user.deleted": {
      if (event.data.id) {
        await deleteUser({ clerkUserId: event.data.id });
      }
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
}
