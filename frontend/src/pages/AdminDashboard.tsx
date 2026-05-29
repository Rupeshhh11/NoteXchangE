import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminData();
        }
    }, [user]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, usersRes, tasksRes] = await Promise.all([
                axios.get('/api/admin/stats', { headers }),
                axios.get('/api/admin/users', { headers }),
                axios.get('/api/admin/tasks', { headers }),
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return <div className="text-center py-12 text-red-600">Unauthorized Access</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-gray-500 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalTasks}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-gray-500 text-sm">Completed Tasks</p>
                            <p className="text-3xl font-bold mt-2">{stats.completedTasks}</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="border-b flex">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 font-medium ${activeTab === 'users'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                                }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`px-6 py-3 font-medium ${activeTab === 'tasks'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                                }`}
                        >
                            Tasks
                        </button>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div>Loading...</div>
                        ) : activeTab === 'users' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Email</th>
                                            <th className="text-left py-2">Name</th>
                                            <th className="text-left py-2">Role</th>
                                            <th className="text-left py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} className="border-b">
                                                <td className="py-2">{u.email}</td>
                                                <td className="py-2">{u.firstName} {u.lastName}</td>
                                                <td className="py-2">{u.role}</td>
                                                <td className="py-2">{u.isActive ? 'Active' : 'Inactive'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Task</th>
                                            <th className="text-left py-2">Budget</th>
                                            <th className="text-left py-2">Status</th>
                                            <th className="text-left py-2">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((t) => (
                                            <tr key={t.id} className="border-b">
                                                <td className="py-2">{t.title}</td>
                                                <td className="py-2">₹{t.budget}</td>
                                                <td className="py-2">{t.status}</td>
                                                <td className="py-2">
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
