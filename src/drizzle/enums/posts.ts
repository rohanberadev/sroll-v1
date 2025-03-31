import { pgEnum } from "drizzle-orm/pg-core";

export const postVisibilty = ["public", "follower", "private"] as const;
export type PostVisibilty = (typeof postVisibilty)[number];
export const postVisibiltyEnum = pgEnum("post_visibility", postVisibilty);
