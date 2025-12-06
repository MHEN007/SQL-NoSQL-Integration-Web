import { db } from "..";
import { products } from "../db/schema";
import { ProductType } from "../models/product.model";
import { eq } from "drizzle-orm";

export class ProductsRepository {
    public static async GetAllProducts(page: number, limit: number): Promise<ProductType[]> {
        const products_query = await db
            .select()
            .from(products)
            .limit(limit)
            .offset(limit * (page - 1))

        return products_query;
    }

    public static async GetProductById(id: string): Promise<ProductType | null> {
        const product_query = await db
            .select()
            .from(products)
            .where(eq(products.id, id));

        if (product_query.length === 0) {
            return null;
        }

        return product_query[0];
    }

    public static async CreateProduct(product: Omit<ProductType, "id" | "wishlists">, ownerId: string): Promise<ProductType> {
        const insert_product = await db
            .insert(products)
            .values({
                id: crypto.randomUUID(),
                name: product.name,
                description: product.description,
                stock: product.stock,
                price: product.price,
                ownerId: ownerId,
            })
            .returning()
        
        return insert_product[0];
    }

    public static async BuyProduct(id: string): Promise<void> {
        // Start transaction    
        await db.transaction(async (tx) => {
            const product = await tx
                .select({
                    stock: products.stock,
                })
                .from(products)
                .where(eq(products.id, id));

            if (product.length === 0) {
                throw new Error("Product not found");
            }

            if (product[0].stock <= 0) {
                throw new Error("Product out of stock");
            }

            await tx
                .update(products)
                .set({
                    stock: product[0].stock - 1,
                })
                .where(eq(products.id, id));
        });
    }
}