'use client';
import { use, useEffect, useState } from "react";
import { Question } from "../../types";
import { useParams } from "next/navigation";

export default function QnA() {
    const { id } = useParams();

    const [question, setQuestion] = useState("");
    const [productName, setProductName] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    useEffect(() => {
        const fetchProduct = async () => {
            const productRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/v1/products/${id}`, {
                credentials: 'include',
            });

            if (!productRequest.ok) {
                alert('Failed to fetch product details.');
            }

            const productData = await productRequest.json();
            setProductName(productData.name);
            
        }

        const fetchQuestions = async () => {
            const fetchRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/v1/products/${id}/qna`, {
                credentials: 'include',
            });

            if (!fetchRequest.ok) {
                alert('Failed to fetch questions.');
                return;
            }

            const data = await fetchRequest.json();
            setQuestions(data.qna);
        }
        fetchProduct();
        fetchQuestions();
    }, [id]);

    const handleSubmitQuestion = async (questionText: string) => {
        // Implement question submission logic here
        const submitRequest = await fetch('/api/submit-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: id, questionText }),
        });

        if (submitRequest.ok) {
            alert('Question submitted successfully!');
        } else {
            alert('Failed to submit question. Please try again.');
        }
    }

    return (
        <div className="flex flex-col items-center bg-white text-black min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Product {productName} Q&A</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Questions & Answers</h2>
                {questions.map((q) => (
                    <div key={q.id} className="mb-4 border-b pb-2">
                        <p className="font-bold">Q: {q.questionText} <span className="text-sm text-gray-600">- {q.author}</span></p>
                        {q.answer.map((a) => (
                            <p key={a.id} className="ml-4">A: {a.answerText} <span className="text-sm text-gray-600">- {a.author}</span></p>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Ask a Question</h2>
                <textarea className="w-full border p-2 rounded mb-2" rows={4} placeholder="Type your question here..." value={question} onChange={(e) => setQuestion(e.target.value)}></textarea>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleSubmitQuestion(question)}>Submit Question</button>
            </div>
        </div>
    )
}