import React from 'react';
import { useParams } from 'react-router-dom';

export default function TaskDetail() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold">Task: {id}</h1>
                <p>Task details will be displayed here</p>
            </div>
        </div>
    );
}
