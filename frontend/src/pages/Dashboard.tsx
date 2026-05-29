import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-4 font-display">
                        Welcome, {user?.firstName}!
                    </h1>
                    <p className="text-gray-600 mb-8">Role: {user?.role}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Dashboard cards will be added here */}
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                            <h3 className="font-semibold text-lg">Active Tasks</h3>
                            <p className="text-3xl font-bold text-primary mt-2">0</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                            <h3 className="font-semibold text-lg">Total Earnings</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">₹0</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg">
                            <h3 className="font-semibold text-lg">Rating</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{user?.rating}/5</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
