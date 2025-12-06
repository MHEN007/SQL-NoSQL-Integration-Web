import { Elysia, t } from "elysia";
import { LoginRequest, RegisterRequest } from "../models/requests.model";
import { AuthRepository } from "../repository/auth.repository";
import { jwt } from "@elysiajs/jwt";

export const AuthController = new Elysia({prefix: "/auth"})
    .use(jwt(
      {
        name: "jwt",
        secret: process.env.JWT_SECRET!,
      }
    ))
    .post("/login", async ({ jwt, body, set, cookie: { auth } }) => {
        const loginResult = await AuthRepository.Login({ body });

        if (!loginResult.success) {
            set.status = 401;
            return {
                message: loginResult.message
            };
        }

        auth.set({
            value: await jwt.sign({ userId: loginResult.user!.id, userName: loginResult.user!.username }),
            httpOnly: true,
            maxAge: 60 * 60 * 24, // 1 day
        })

        return {
            message: loginResult.message,
            user: loginResult.user,
        }
    }, 
    {
        body: LoginRequest,
    }
    )
    .post("/register", async ({ body, set }) => {
        const registerResult = await AuthRepository.Register({ body });

        if (!registerResult.success) {
            set.status = 400;
            return {
                message: registerResult.message
            };
        } else {
            set.status = 201;
    
            return {
                message: registerResult.message
            }
        }
    }, {
        body: RegisterRequest
    })
    .post("/logout", async ({ cookie: { auth }, set }) => {
        auth.set({
            value: "",
            httpOnly: true,
            maxAge: 0,
        });

        return {
            message: "Logged out successfully"
        }
    });