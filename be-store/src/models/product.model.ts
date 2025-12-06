import { t } from "elysia";

export type ProductType = {
    id: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    wishlists: number;
}

export const ProductType = t.Object({
    id: t.String(),
    name: t.String(),
    description: t.String(),
    stock: t.Number(),
    price: t.Number(),
    wishlists: t.Number(),
});