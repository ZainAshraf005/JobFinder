import { PrismaClient } from "@prisma/client";

// Declare global augmentation without an initializer
declare global {
  // Declare the `prisma` property on `globalThis` with its type
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// This is necessary for the declaration to be considered a module
export {};
