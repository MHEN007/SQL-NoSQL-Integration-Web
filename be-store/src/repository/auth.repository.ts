import { db } from "..";
import { users } from "../db/schema";
import { LoginRequestType } from "../models/requests.model";
import { eq, and } from "drizzle-orm";

export class AuthRepository {
    static async Login({body}: {body: LoginRequestType}) : Promise<{success: boolean, message: string, user?: {id: string, username: string}}>  {
        const { username, password } = body;
        
        const findUser = await db
            .select({
                id: users.id,
                username: users.username,
                password: users.password,
            })
            .from(users)
            .where(and(eq(users.username, username)));

        if (findUser.length === 0 || !(await Bun.password.verify(password, findUser[0]?.password || ""))) {
            return { success: false, message: "Invalid username or password" };
        }

        return { success: true, message: "Login successful", user: {
            id: findUser[0].id,
            username: findUser[0].username
         } };
    }

    static async Register({body}: {body: LoginRequestType}) : Promise<{success: boolean, message: string}>  {
        const { username, password } = body;
        
        const insertUserQuery = await db
            .insert(users)
            .values({
                id: crypto.randomUUID(),
                username,
                password: await Bun.password.hash(password, {
                    algorithm: "bcrypt",
                    cost: 12,
                }),
            })
            .returning({ id: users.id })
            .catch((e) => {
                return [];
            });

        if (insertUserQuery.length === 0) {
            return { success: false, message: "Registration failed" };
        }

        return { success: true, message: "Registration successful" };
    }
}


