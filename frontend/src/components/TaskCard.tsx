import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, User } from 'lucide-react';

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        description: string;
        budget: number;
        category: string;
        status: string;
        deadline: string;
        clientId: string;
    };
}

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <Link to={`/tasks/${task.id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

                <div className="space-y-2 flex-1">
                    <div className="flex items-center text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-semibold">₹{task.budget}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {task.category}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(task.deadline).toLocaleDateString()}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${task.status === 'open'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'in_progress'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <button className="text-blue-600 text-sm font-semibold hover:text-blue-800">
                        View →
                    </button>
                </div>
            </div>
        </Link>
    );
}
