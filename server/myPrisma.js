import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

export { app, prisma };
