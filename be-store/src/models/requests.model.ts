import { t } from "elysia";

export const LoginRequest = t.Object({
    username: t.String(),
    password: t.String()
});

export type LoginRequestType = typeof LoginRequest.static;

export const RegisterRequest = t.Object({
    username: t.String(),
    password: t.String()
});

export type RegisterRequestType = typeof RegisterRequest.static;