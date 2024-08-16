import { PrismaClient } from "@prisma/client";
import { config } from "./env.js";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
});

prisma
  .$connect()
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
