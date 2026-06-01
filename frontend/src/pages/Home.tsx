import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const mockRequests = [
    { id: 1, category: 'Notes Writing', title: 'Advanced Calculus', pages: 15, budget: 75, status: 'Rate Fixed', postedBy: 'Alex009. • Mango', color: 'blue', canDelete: false },
    { id: 2, category: 'Assignment', title: 'History Essay', pages: 4, budget: 40, status: 'Rate Fixed', postedBy: 'Sonali013. • Sakchi', color: 'green', canDelete: false },
    { id: 3, category: 'Lab Manual', title: 'Physics Lab 101', pages: 'N/A', budget: 30, status: 'Acquire', postedBy: 'Aman999. • Mango', color: 'purple', canDelete: false },
    { id: 4, category: 'Project', title: 'Web Dev Portfolio', pages: 'N/A', budget: 150, status: 'Rate Fixed', postedBy: 'Rohit69. • Dimna ', color: 'orange', canDelete: false },
    { id: 5, category: 'Notes Writing', title: 'Organic Chemistry', pages: 10, budget: 60, status: 'Acquire', postedBy: 'Neha_22. • Sakchi', color: 'blue', canDelete: false },
];

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [formCategory, setFormCategory] = useState('notes');
    const [formSubject, setFormSubject] = useState('');
    const [formPages, setFormPages] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formDetails, setFormDetails] = useState('');

    useEffect(() => {
        const gsap = (window as any).gsap;
        if (gsap) {
            gsap.from(".hero-title", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" });
            gsap.from(".hero-description", { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out" });
            gsap.from(".hero-actions", { y: 20, opacity: 0, duration: 0.8, delay: 0.4, ease: "power2.out" });
        }
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const localPosts = JSON.parse(localStorage.getItem('notex_requests') || '[]');
            try {
                const response = await axios.get('/api/tasks');
                const apiTasks = response.data.tasks || [];
                const mappedApiTasks = apiTasks.map((t: any) => {
                    let color = 'blue';
                    if (t.category.toLowerCase().includes('assign')) color = 'green';
                    else if (t.category.toLowerCase().includes('lab')) color = 'purple';
                    else if (t.category.toLowerCase().includes('project')) color = 'orange';
                    return {
                        id: t.id,
                        category: t.category,
                        title: t.title,
                        pages: 'N/A',
                        budget: Math.floor(t.budget),
                        status: t.status === 'open' ? 'Acquire' : 'In Progress',
                        postedBy: 'Student',
                        color,
                        isRealTask: true
                    };
                });
                let combined = [...localPosts, ...mappedApiTasks];
                setRequests(combined.length > 0 ? combined : mockRequests);
            } catch (err) {
                const combined = [...localPosts, ...mockRequests];
                setRequests(combined.length > 0 ? combined : mockRequests);
            }
        } catch (error) {
            setRequests(mockRequests);
        }
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pagesVal = parseFloat(formPages) || 0;
        const rateVal = parseFloat(formBudget) || 0;
        const totalBudget = pagesVal > 0 ? (pagesVal * rateVal) : rateVal;
        const categoryMap: Record<string, { name: string; color: string }> = {
            'notes': { name: 'Notes Writing', color: 'blue' },
            'assignment': { name: 'Assignment', color: 'green' },
            'lab': { name: 'Lab Manual', color: 'purple' },
            'project': { name: 'Project', color: 'orange' }
        };
        const config = categoryMap[formCategory] || { name: 'Other', color: 'blue' };
        const newEntry = {
            id: Date.now().toString(),
            category: config.name,
            title: formSubject,
            pages: pagesVal || 'N/A',
            budget: totalBudget,
            status: 'Rate Fixed',
            postedBy: 'You • Just now',
            color: config.color,
            canDelete: true
        };
        if (isAuthenticated) {
            try {
                await axios.post('/api/tasks', {
                    title: formSubject,
                    description: formDetails || 'No additional details provided.',
                    category: config.name,
                    budget: totalBudget,
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
            } catch (err) {
                console.error('Failed to post task:', err);
            }
        }
        const localPosts = JSON.parse(localStorage.getItem('notex_requests') || '[]');
        const updated = [newEntry, ...localPosts];
        localStorage.setItem('notex_requests', JSON.stringify(updated));
        setFormSubject('');
        setFormPages('');
        setFormBudget('');
        setFormDetails('');
        setShowPostModal(false);
        fetchTasks();
    };

    const handleDeleteRequest = (id: any) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            const localPosts = JSON.parse(localStorage.getItem('notex_requests') || '[]');
            const updated = localPosts.filter((req: any) => req.id !== id);
            localStorage.setItem('notex_requests', JSON.stringify(updated));
            setRequests(prev => prev.filter(req => req.id !== id));
        }
    };
        ?requests.filter(req => req.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0]))
        : requests;

    const getIconSvg = (category: string, color: string) => {
        let pathData = '';
        switch (category) {
            case 'Notes Writing':
                pathData = `<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>`;
                break;
            case 'Assignment':
            case 'Assignments':
                pathData = `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`;
                break;
            case 'Lab Manual':
            case 'Lab Manuals':
                pathData = `<path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19"/><path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19"/><path d="M8.5 2h7"/><path d="M14 21h-4"/><path d="M5 19h14"/>`;
                break;
            case 'Project':
            case 'Projects':
                pathData = `<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>`;
                break;
            default: pathData = `<circle cx="12" cy="12" r="10"/>`;
        }
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-6 w-6 request-icon ${color}`}
                dangerouslySetInnerHTML={{ __html: pathData }}
            />
        );
    };

    return (
        <>
            <main className="main-content-area">

                {/* Hero Section */}
                <div className="hero-section">
                    <h1 id="hero-title" className="hero-title">
                        Connect, Collaborate, Complete.
                    </h1>
                    <p id="hero-desc" className="hero-description">
                        An academic collaboration platform designed to connect students who need academic work with those who can deliver it and earn.
                    </p>

                    {/* Autoplay Video Loop Backdrop */}
                    <div className="back10">
                        <video src="/0_3d_Model_Dragon_3840x2160.mp4" muted autoPlay loop playsInline></video>
                    </div>

                    <div id="hero-buttons" className="hero-actions">
                        <button
                            onClick={() => setShowPostModal(true)}
                            className="btn btn-primary btn-lg btn-rounded btn-shadow"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-mr">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            Post a Request
                        </button>
                        <button
                            onClick={() => navigate('/browse')}
                            className="btn btn-ghost btn-lg btn-rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-mr">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            Browse Requests
                        </button>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="category-grid">
                    <div
                        onClick={() => setSelectedCategory(selectedCategory === 'Notes Writing' ? null : 'Notes Writing')}
                        className="category-card"
                        style={{ border: selectedCategory === 'Notes Writing' ? '2px solid #df5d01' : '' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-icon blue">
                            <path d="m12 19 7-7 3 3-7 7-3-3z" />
                            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                            <path d="m2 2 7.586 7.586" />
                            <circle cx="11" cy="11" r="2" />
                        </svg>
                        <h3 className="card-title">Notes Writing</h3>
                    </div>

                    <div
                        onClick={() => setSelectedCategory(selectedCategory === 'Assignment' ? null : 'Assignment')}
                        className="category-card"
                        style={{ border: selectedCategory === 'Assignment' ? '2px solid #df5d01' : '' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-icon green">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <h3 className="card-title">Assignments</h3>
                    </div>

                    <div
                        onClick={() => setSelectedCategory(selectedCategory === 'Lab Manual' ? null : 'Lab Manual')}
                        className="category-card"
                        style={{ border: selectedCategory === 'Lab Manual' ? '2px solid #df5d01' : '' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-icon purple">
                            <path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19" />
                            <path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19" />
                            <path d="M8.5 2h7" />
                            <path d="M14 21h-4" />
                            <path d="M5 19h14" />
                        </svg>
                        <h3 className="card-title">Lab Manuals</h3>
                    </div>

                    <div
                        onClick={() => setSelectedCategory(selectedCategory === 'Project' ? null : 'Project')}
                        className="category-card"
                        style={{ border: selectedCategory === 'Project' ? '2px solid #df5d01' : '' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="category-icon orange">
                            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                        </svg>
                        <h3 className="card-title">Projects</h3>
                    </div>
                </div>

                {/* Requests Header */}
                <div className="requests-header">
                    <h2 id="filter-title" className="section-title">
                        {selectedCategory ? `${selectedCategory} Requests` : 'Active Requests Near You'}
                    </h2>
                    <div className="requests-actions">
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="btn-clear-filter"
                            >
                                Clear Filter
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/browse')}
                            className="btn btn-text-link"
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-ml">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Requests Grid */}
                <div id="requests-grid" className="requests-grid" style={{ marginBottom: '4rem' }}>
                    {filteredRequests.map((req: any) => (
                        <div key={req.id} className="request-card" id={`card-${req.id}`}>
                            <div>
                                <div className="card-header">
                                    <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {getIconSvg(req.category, req.color)}
                                        <span className="text-xs font-medium text-muted-foreground">{req.category}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1" style={{ lineHeight: '1.4' }}>{req.title}</h3>
                                <div className="card-details" style={{ marginTop: '0.5rem' }}>
                                    <p className="text-sm text-muted-foreground" style={{ margin: '2px 0' }}>Pages: {req.pages}</p>
                                    <p className="text-sm text-muted-foreground" style={{ margin: '2px 0' }}>Posted by {req.postedBy}</p>
                                </div>
                            </div>
                            <div className="price-group" style={{ position: 'relative', height: '1.5rem', marginTop: 'auto' }}>
                                <span className="request-price" style={{ bottom: '0.5rem', color: '#05b34d' }}>₹{req.budget}</span>
                            </div>
                            <hr />
                            <div className="request-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0' }}>
                                {req.canDelete ? (
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteRequest(req.id)}
                                        style={{ position: 'static', padding: '0.25rem 0.5rem', margin: '0' }}
                                    >
                                        Delete
                                    </button>
                                ) : <div />}
                                <div className="action-group" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={req.isRealTask ? `/tasks/${req.id}` : '#'} className="btn btn-text-link request-link" style={{ fontSize: '0.85rem' }}>
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (req.isRealTask) navigate(`/tasks/${req.id}`);
                                            else alert('Acquire request initialized for ' + req.title);
                                        }}
                                        className="btn btn-primaryy btn-sm"
                                    >
                                        Acquire It
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* Post Request Modal Overlay */}
            {showPostModal && (
                <div id="request-modal" className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h2 className="modal-title" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Post a New Request</h2>
                            <p className="modal-description" style={{ color: '#888', marginTop: '0.25rem' }}>Fill in the details below to get help with your academic work.</p>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '1rem 0' }} />
                        <form onSubmit={handlePostSubmit} className="modal-form">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Category</label>
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value)}
                                        className="form-inputt"
                                        required
                                    >
                                        <option value="notes">Notes Writing</option>
                                        <option value="assignment">Assignment</option>
                                        <option value="lab">Lab Manual</option>
                                        <option value="project">Project</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Subject / Title</label>
                                    <input
                                        value={formSubject}
                                        onChange={(e) => setFormSubject(e.target.value)}
                                        className="form-input"
                                        placeholder="e.g. Calculus II"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>No. of Pages (Optional)</label>
                                    <input
                                        type="number"
                                        value={formPages}
                                        onChange={(e) => setFormPages(e.target.value)}
                                        className="form-input"
                                        placeholder="10"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Budget Per Page (or Total Budget)</label>
                                    <input
                                        type="number"
                                        value={formBudget}
                                        onChange={(e) => setFormBudget(e.target.value)}
                                        className="form-input"
                                        placeholder="₹5"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Additional Details</label>
                                <textarea
                                    value={formDetails}
                                    onChange={(e) => setFormDetails(e.target.value)}
                                    className="form-textarea"
                                    placeholder="Specific requirements..."
                                    style={{ width: '95%', minHeight: '4.5rem' }}
                                />
                            </div>

                            <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowPostModal(false)} className="close-modal btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Post Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
