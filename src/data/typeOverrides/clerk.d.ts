import { UserRole } from "~/drizzle/schema";

export {};

declare global {
  interface UserPublicMetadata {
    dbId?: string;
    role?: UserRole;
  }

  interface CustomJwtSessionClaims {
    dbId?: string;
    role?: UserRole;
  }
}
