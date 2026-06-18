import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserAvatarUrl } from '../utils/avatarHelper';
import api from '../services/api';
import { ArrowLeft, LayoutDashboard, Award, Star, IndianRupee } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [activeTasks, setActiveTasks] = useState<any[]>([]);
    const [mockTasks, setMockTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/tasks/my-tasks');
                setActiveTasks(res.data.activeTasks || []);
            } catch (err) {
                console.error('Failed to fetch dashboard data from backend:', err);
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            fetchDashboardData();
            // Read mock tasks
            const mockAcquired = JSON.parse(localStorage.getItem('notex_acquired_requests') || '[]');
            setMockTasks(mockAcquired);
        }
    }, [user]);

    const avatarUrl = getUserAvatarUrl(user);
    const activeTasksCount = activeTasks.length + mockTasks.length;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 dashboard-page-container" style={{ background: 'var(--clr-dashboard-bg, linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%))', transition: 'background-color 0.3s ease' }}>
            <div className="max-w-6xl mx-auto">
                <div style={{
                    background: 'var(--clr-card-bg, rgba(255, 255, 255, 0.7))',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid var(--clr-border, rgba(255, 255, 255, 0.5))',
                    padding: '2.5rem',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
                    color: 'var(--clr-foreground, #1e293b)',
                    transition: 'all 0.3s ease'
                }} className="dashboard-main-panel">
                    
                    {/* Back Button */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ea580c', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s' }} className="hover:-translate-x-1">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div style={{
                            width: '5rem', height: '5rem', borderRadius: '50%', background: 'linear-gradient(to right, #f97316, #ea580c)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)', overflow: 'hidden', flexShrink: 0
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.firstName?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--clr-foreground, #111827)', margin: 0, letterSpacing: '-0.025em' }}>
                                Welcome back, <span style={{ color: '#ea580c' }}>{user?.firstName}</span>!
                            </h1>
                            <p style={{ fontSize: '1rem', color: 'var(--clr-muted-foreground, #6b7280)', margin: '0.25rem 0 0 0', fontWeight: 500 }}>
                                Role: <span style={{ textTransform: 'capitalize', color: 'var(--clr-foreground, #374151)' }}>{user?.role}</span>
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {/* Active Tasks Card */}
                        <div style={{
                            padding: '1.75rem', borderRadius: '1.25rem', background: 'var(--clr-card-bg, #ffffff)',
                            border: '1px solid var(--clr-border, rgba(255,255,255,0.8))', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.08)',
                            transition: 'transform 0.3s ease', cursor: 'pointer'
                        }} className="hover:-translate-y-2">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--clr-muted-foreground, #4b5563)', margin: 0 }}>Active Tasks</h3>
                                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                    <LayoutDashboard size={24} />
                                </div>
                            </div>
                            <p style={{ fontSize: '3rem', fontWeight: 800, color: '#2563eb', margin: '0.5rem 0 0 0' }}>{activeTasksCount}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--clr-muted-foreground, #6b7280)', margin: '0.5rem 0 0 0' }}>Current ongoing projects</p>
                        </div>

                        {/* Total Earnings Card */}
                        <div style={{
                            padding: '1.75rem', borderRadius: '1.25rem', background: 'var(--clr-card-bg, #ffffff)',
                            border: '1px solid var(--clr-border, rgba(255,255,255,0.8))', boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.08)',
                            transition: 'transform 0.3s ease', cursor: 'pointer'
                        }} className="hover:-translate-y-2">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--clr-muted-foreground, #4b5563)', margin: 0 }}>Total Earnings</h3>
                                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                    <IndianRupee size={24} />
                                </div>
                            </div>
                            <p style={{ fontSize: '3rem', fontWeight: 800, color: '#16a34a', margin: '0.5rem 0 0 0' }}>₹{user?.totalEarnings || 0}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--clr-muted-foreground, #6b7280)', margin: '0.5rem 0 0 0' }}>Lifetime balance earned</p>
                        </div>

                        {/* Rating Card */}
                        <div style={{
                            padding: '1.75rem', borderRadius: '1.25rem', background: 'var(--clr-card-bg, #ffffff)',
                            border: '1px solid var(--clr-border, rgba(255,255,255,0.8))', boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.08)',
                            transition: 'transform 0.3s ease', cursor: 'pointer'
                        }} className="hover:-translate-y-2">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--clr-muted-foreground, #4b5563)', margin: 0 }}>Rating</h3>
                                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
                                    <Star size={24} fill="currentColor" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', margin: '0.5rem 0 0 0' }}>
                                <p style={{ fontSize: '3rem', fontWeight: 800, color: '#9333ea', margin: 0 }}>{user?.rating || 0}</p>
                                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#d8b4fe', marginLeft: '0.25rem' }}>/ 5</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--clr-muted-foreground, #6b7280)', margin: '0.5rem 0 0 0' }}>Based on {user?.ratingCount || 0} reviews</p>
                        </div>
                    </div>

                    {/* Acquired tasks section */}
                    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--clr-border, rgba(0,0,0,0.05))', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--clr-foreground, #1f2937)', marginBottom: '1.5rem' }}>Acquired Tasks / Projects</h3>
                        
                        {activeTasksCount > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                {[...mockTasks, ...activeTasks].map((task, index) => (
                                    <div 
                                        key={task.id || index} 
                                        style={{ 
                                            padding: '1.5rem', 
                                            borderRadius: '16px', 
                                            background: 'var(--clr-card-bg, rgba(255,255,255,0.8))', 
                                            border: '1px solid var(--clr-border, #e2e8f0)',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                                        }}
                                        className="acquired-task-card"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#ea580c', backgroundColor: 'rgba(234, 88, 12, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
                                                {task.category || 'Task'}
                                            </span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>
                                                ₹{task.budget}
                                            </span>
                                        </div>
                                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--clr-foreground, #0f172a)' }}>{task.title}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--clr-muted-foreground, #64748b)', marginTop: '1.2rem' }}>
                                            <span>Status: <strong style={{ color: '#ea580c' }}>In Progress</strong></span>
                                            <span>{task.deadline || 'Flexible'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 0', background: 'var(--clr-muted, rgba(255,255,255,0.4))', borderRadius: '1rem', border: '1px dashed var(--clr-border, #cbd5e1)' }} className="dashboard-empty-activity">
                                <p style={{ color: 'var(--clr-muted-foreground, #94a3b8)', fontSize: '1.125rem', margin: 0 }}>You haven't acquired any tasks or projects yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
