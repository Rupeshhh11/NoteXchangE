import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PlaceBid() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        deliveryTime: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            await axios.post(
                '/api/bids',
                { taskId, ...formData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Bid placed successfully!');
            navigate(`/tasks/${taskId}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to place bid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Place Your Bid</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Bid Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter your bid amount"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Delivery Time (days)</label>
                        <input
                            type="number"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleChange}
                            placeholder="How many days to complete?"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell the client why you're the best fit for this task"
                            rows={5}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                </form>
            </div>
        </div>
    );
}
