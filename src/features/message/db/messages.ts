import { desc, eq, or } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { MessageTable } from "~/drizzle/schema";

export function getMessages({
  userId,
  otherUserId,
  pagination,
}: {
  userId: string;
  otherUserId: string;
  pagination: { pageNumber: number; pageSize: number };
}) {
  return db
    .select()
    .from(MessageTable)
    .where(
      or(
        eq(MessageTable.sentByUserId, userId),
        eq(MessageTable.recievedByUserId, otherUserId)
      )
    )
    .limit(pagination.pageSize)
    .offset((pagination.pageNumber - 1) * pagination.pageSize)
    .orderBy(desc(MessageTable.createdAt));
}
