export type ProductType = {
    id: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    wishlists: number;
}

export type Question = {
    id : string;
    author : string;
    questionText : string;
    answer : Answer[];
}

export type Answer = {
    id : string;
    author : string;
    answerText : string;
}