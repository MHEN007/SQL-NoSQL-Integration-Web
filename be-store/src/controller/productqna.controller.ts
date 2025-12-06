import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { authmiddleware } from "../middleware/auth.middleware";

const sampleQuestions : any[] = [
        {
            id: "q1",
            author: "User1",
            questionText: "What is the return policy?",
            answer: [
                {
                    id: "a1",
                    author: "Support",
                    answerText: "You can return the product within 30 days of purchase."
                }
            ]
        },
        {
            id: "q2",
            author: "User2",
            questionText: "Is there a warranty on this product?",
            answer: [
                {
                    id: "a2",
                    author: "Support",
                    answerText: "Yes, there is a one-year warranty included."
                }
            ]
        }
    ];

export const ProductQnAController = new Elysia({prefix: "/products/:id/qna"})
    .use(jwt(
        {
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        }
        ))
    .use(
        authmiddleware
    )
    .get("/", async ({ params, set }) => {
        // Fetch QnA for the product with id params.id
        // Placeholder implementation
        return {
            productId: params.id,
            qna: sampleQuestions
        };
    })