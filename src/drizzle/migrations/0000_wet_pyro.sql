CREATE TYPE "public"."post_visibility" AS ENUM('public', 'follower', 'private');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_user_id" uuid NOT NULL,
	"following_user_id" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "follows_follower_user_id_following_user_id_unique" UNIQUE("follower_user_id","following_user_id")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"sentByUserId" uuid NOT NULL,
	"recievedByUserId" uuid NOT NULL,
	"readAt" timestamp with time zone,
	"deletedAt" timestamp with time zone,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caption" text NOT NULL,
	"user_id" uuid NOT NULL,
	"image_urls" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"visibilty" "post_visibility" DEFAULT 'public' NOT NULL,
	"like_count" bigint DEFAULT 0 NOT NULL,
	"share_count" bigint DEFAULT 0 NOT NULL,
	"comment_count" bigint DEFAULT 0 NOT NULL,
	"view_count" bigint DEFAULT 0 NOT NULL,
	"deletedAt" timestamp with time zone,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_user" UNIQUE("postId","userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"fullname" text,
	"clerkUserId" text NOT NULL,
	"bio" text,
	"email" text NOT NULL,
	"image_url" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"follower_count" bigint DEFAULT 0 NOT NULL,
	"following_count" bigint DEFAULT 0 NOT NULL,
	"post_count" bigint DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_clerkUserId_unique" UNIQUE("clerkUserId")
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_user_id_users_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_user_id_users_id_fk" FOREIGN KEY ("following_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sentByUserId_users_id_fk" FOREIGN KEY ("sentByUserId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recievedByUserId_users_id_fk" FOREIGN KEY ("recievedByUserId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clerk_user_id_idx" ON "users" USING btree ("clerkUserId");--> statement-breakpoint
CREATE INDEX "username_idx" ON "users" USING btree ("username");