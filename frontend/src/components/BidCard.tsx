import React from 'react';

interface BidCardProps {
    bid: {
        id: string;
        amount: number;
        deliveryTime: number;
        description: string;
        status: string;
        serviceProvider: {
            firstName: string;
            lastName: string;
            rating: number;
        };
    };
    onAccept?: (bidId: string) => void;
    onReject?: (bidId: string) => void;
    canManage?: boolean;
}

export default function BidCard({ bid, onAccept, onReject, canManage }: BidCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {bid.serviceProvider.firstName} {bid.serviceProvider.lastName}
                    </h3>
                    <p className="text-yellow-500 text-sm">★ {bid.serviceProvider.rating.toFixed(1)}</p>
                </div>
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded ${bid.status === 'pending'
                            ? 'bg-blue-100 text-blue-800'
                            : bid.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                >
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
            </div>

            <p className="text-gray-700 mb-4">{bid.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600 text-sm">Bid Amount</p>
                    <p className="text-2xl font-bold text-blue-600">₹{bid.amount}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600 text-sm">Delivery Time</p>
                    <p className="text-2xl font-bold text-gray-900">{bid.deliveryTime} days</p>
                </div>
            </div>

            {canManage && bid.status === 'pending' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onAccept?.(bid.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Accept Bid
                    </button>
                    <button
                        onClick={() => onReject?.(bid.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Reject Bid
                    </button>
                </div>
            )}
        </div>
    );
}
