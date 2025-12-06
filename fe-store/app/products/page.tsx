"use client";

import { useEffect, useState } from "react";
import { ProductType } from "./types";
import { redirect } from 'next/navigation';

function Product({
    product
} : {product: ProductType}) {
    const buyProduct = async () => {
        // Implement buy product logic here
        const buyRequest = await fetch('/api/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.id }),
        });

        if (buyRequest.ok) {
            alert('Product purchased successfully!');
        } else {
            alert('Failed to purchase product. Please try again.');
        }
    }

    const openQnA = () => {
        // set to open QnA section or modal
        redirect(`/products/${product.id}/qna`);
    }

    const handleWishlist = () => {
        // Implement add to wishlist logic here
        alert('Product added to wishlist!');
    }

    return (
        <div className="border p-4 mb-4 rounded w-96">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="mb-2">{product.description}</p>
            <p className="mb-2">Stock: {product.stock}</p>
            <p className="font-bold">${product.price.toFixed(2)}</p>
            <p className="">Wishlisted: {product.wishlists}</p>

            <div className="flex flex-row">
                <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={buyProduct}>Buy</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openQnA}>QnA</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={handleWishlist}>Add to Wishlist</button>
            </div>
        </div>
    )
}

function CreateProductModal( { setShowModal, refresh }: {setShowModal: (show: boolean) => void, refresh: () => void} ) {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);
    const [price, setPrice] = useState(0);

    const handleCreate = async () => { 
        // validate inputs
        if (!productName || !description || stock < 0 || price < 0) {
            alert('Please fill in all fields with valid values.');
            return;
        }
        
        const createRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/v1/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: productName,
                description,
                stock,
                price,
            }),
            credentials: 'include',
        });

        if (createRequest.ok) {
            alert('Product created successfully!');
            setShowModal(false);
            refresh();
        } else {
            alert('Failed to create product. Please try again.');
        }
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
                <div className="flex flex-col">
                    <input type="text" placeholder="Product Name" className="border p-2 mb-2 rounded" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <textarea placeholder="Description" className="border p-2 mb-2 rounded" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                    <div className="flex flex-row justify-center items-center mb-2">
                        <div className="flex flex-col justify-center mr-4">Stock</div>
                        <input type="number" placeholder="Stock" className="border p-2 mb-2 rounded" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                    </div>
                    <div className="flex flex-row justify-center items-center mb-2">
                        <div className="flex flex-col justify-center mr-4">IDR</div>
                        <input type="number" placeholder="Price" className="border p-2 mb-2 rounded" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                    <div className="flex flex-row justify-between">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreate}>Create Product</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Products() {
    const [showModal, setShowModal] = useState(false);
    const [listOfProducts, setProducts] = useState<ProductType[]>([]);

    const fetchProducts = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/v1/products?page=1&limit=10`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            setProducts(data);
        } else {
            alert('Failed to fetch products.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        
        redirect('/login');
    }

    return (
        <div className="flex flex-col items-center bg-white text-black min-h-screen py-2">
            <div className="p-5">
                <h1 className="text-2xl font-bold">Products Page</h1> 
                <p>Welcome</p>
                <div className="flex flex-row">
                    <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(true)}>Create Product</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
                    {showModal && <CreateProductModal setShowModal={setShowModal} refresh={fetchProducts} />}
                </div>
                <div className="flex flex-col items-center mt-4">
                    {listOfProducts.length === 0 ? (
                        <p>No products available.</p>
                    ) : (
                        listOfProducts.map((product) => (
                            <Product key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
