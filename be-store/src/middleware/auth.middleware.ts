import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";

export const authmiddleware = new Elysia()
    .use(jwt(
      {
        name: "jwt",
        secret: process.env.JWT_SECRET!,
      }
    ))
    .derive({as: 'global'}, async ({ jwt, cookie, set }) => {
      const { auth } = cookie;
      
      if (!auth.value) {
          set.status = 401;
          return {
              message: "Unauthorized"
          };
      }

      // Verify JWT token
      try {
          if (typeof auth.value !== "string") {
              set.status = 401;
              throw new Error("Invalid token");
          }

          const user = await jwt.verify(auth.value);
          
          if (!user) {
              set.status = 401;
              return {
                  message: "Unauthorized"
              };
          }

        return { user };
      } catch (error) {
          set.status = 401;
          return {
              message: "Invalid token"
          };
      }
    });