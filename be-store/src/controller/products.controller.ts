import Elysia from "elysia";
import { t } from "elysia";
import { ProductsRepository } from "../repository/product.repository";
import jwt from "@elysiajs/jwt";
import { authmiddleware } from "../middleware/auth.middleware";

export const ProductsController = new Elysia({prefix: "/products"})
    .use(jwt(
      {
        name: "jwt",
        secret: process.env.JWT_SECRET!,
      }
    ))
    .use(
        authmiddleware
    )
    .get("/", async ({ query }) => {
        const products = await ProductsRepository.GetAllProducts(query.page, query.limit);
        return products;
    }, {
        query: t.Object({
            page: t.Number(),
            limit: t.Number()
        })
    })
    .get("/:id", async ({ params, set }) => {
        const product = await ProductsRepository.GetProductById(params.id);
        if (!product) {
            set.status = 404;
            return {
                message: "Product not found"
            }
        }
        return product;
    })
    .post("/", async ({ body, set, user }) => {
        const newProduct = await ProductsRepository.CreateProduct(body, user!.userId as string);
        if (!newProduct) {
            set.status = 400;
            return {
                message: "Failed to create product"
            }
        }
        return newProduct;
    }, 
    {
        body: t.Object({
            name: t.String(),
            description: t.String(),
            stock: t.Number(),
            price: t.Number(),
        })
    }
)
