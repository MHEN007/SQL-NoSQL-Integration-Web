import { drizzle } from "drizzle-orm/node-postgres";
import { Elysia } from "elysia";
import "dotenv/config";
import { AuthController } from "./controller/auth.controller";
import { ProductsController } from "./controller/products.controller";
import {cors} from "@elysiajs/cors";
import { ProductQnAController } from "./controller/productqna.controller";
import { MongoClient } from "mongodb";

// PostgreSQL Drizzle DB instance
export const db = drizzle(process.env.DATABASE_URL!);

// MongoDB client instance
export const mongoClient = new MongoClient(process.env.MONGODB_CONN_STRING!);

const app = new Elysia()
  .use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }))
  .group('/v1', (app) => 
    app
    .use(AuthController)
    .use(ProductsController)
    .use(ProductQnAController)
  )
  .listen(process.env.APP_PORT! || 3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
