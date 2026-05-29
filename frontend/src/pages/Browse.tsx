import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import TaskCard from '../components/TaskCard';

export default function Browse() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [category, status]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tasks', {
                params: { category, status, limit: 20 },
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Available Tasks</h1>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="writing">Writing</option>
                                <option value="coding">Coding</option>
                                <option value="research">Research</option>
                                <option value="design">Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={fetchTasks}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Filter className="w-4 h-4 inline mr-2" />
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="text-center py-12">Loading tasks...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task: any) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
