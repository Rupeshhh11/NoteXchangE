import React, { useState, useEffect, useRef, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';
import RequestCard, { type RequestItem } from '../components/RequestCard';
import toast from 'react-hot-toast';

const mockRequests: RequestItem[] = [
    { id: 1, category: 'Notes Writing', title: 'Advanced Calculus', pages: 15, ratePerPage: 5, budget: 75, status: 'Rate Fixed', postedBy: 'Alex009 • Mango', canDelete: false },
    { id: 2, category: 'Assignment', title: 'History Essay', pages: 4, ratePerPage: 10, budget: 40, status: 'Rate Fixed', postedBy: 'Sonali013 • Sakchi', canDelete: false },
    { id: 3, category: 'Lab Manual', title: 'Physics Lab 101', pages: 'N/A', budget: 30, status: 'Acquire', postedBy: 'Aman999 • Mango', canDelete: false },
    { id: 4, category: 'Project', title: 'Web Dev Portfolio', pages: 'N/A', budget: 150, status: 'Rate Fixed', postedBy: 'Rohit69 • Dimna', canDelete: false },
    { id: 5, category: 'Notes Writing', title: 'Organic Chemistry', pages: 10, ratePerPage: 6, budget: 60, status: 'Acquire', postedBy: 'Neha_22 • Sakchi', canDelete: false },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const { openAuth } = useAuthModal();
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [formCategory, setFormCategory] = useState('notes');
    const [formSubject, setFormSubject] = useState('');
    const [formPages, setFormPages] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formDetails, setFormDetails] = useState('');

    // Advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filterLocation, setFilterLocation] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState(500);
    const [showAllCards, setShowAllCards] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const modalPanelRef = useRef<HTMLDivElement>(null);

    const pagesVal = parseFloat(formPages) || 0;
    const rateVal = parseFloat(formBudget) || 0;
    const computedTotal = pagesVal > 0 && rateVal > 0 ? pagesVal * rateVal : rateVal;

    const filteredRequests = useMemo(() => {
        let list = requests.slice();
        if (selectedCategory) {
            const key = selectedCategory.toLowerCase();
            list = list.filter((req) => (req.category || '').toLowerCase().includes(key));
        }
        if (filterLocation.trim()) {
            const locKey = filterLocation.toLowerCase().trim();
            list = list.filter((req) => {
                const postedParts = (req.postedBy || '').split('•');
                const collegeName = (postedParts[1] || postedParts[0] || '').trim();
                return collegeName.toLowerCase().includes(locKey);
            });
        }
        list = list.filter((req) => {
            const b = typeof req.budget === 'number' ? req.budget : parseFloat(String(req.budget)) || Infinity;
            return b <= filterMaxPrice;
        });
        return list;
    }, [requests, selectedCategory, filterLocation, filterMaxPrice]);

    const displayedRequests = useMemo(() => {
        if (showAllCards) return filteredRequests;
        return filteredRequests.slice(0, 6);
    }, [filteredRequests, showAllCards]);

    useEffect(() => {
        fetchTasks();
    }, []);

    // Removed GSAP animations — keep UI behavior intact without animation library
    useEffect(() => {
        if (showPostModal) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showPostModal]);

    const fetchTasks = async () => {
        try {
            const localPosts: RequestItem[] = JSON.parse(localStorage.getItem('notex_requests') || '[]');
            try {
                const response = await api.get('/tasks');
                const apiTasks = response.data.tasks || [];
                const mappedApiTasks: RequestItem[] = apiTasks.map((t: { id: string; category: string; title: string; budget: number; status: string }) => ({
                    id: t.id,
                    category: t.category,
                    title: t.title,
                    pages: 'N/A',
                    budget: Math.floor(t.budget),
                    status: t.status === 'open' ? 'Acquire' : 'In Progress',
                    postedBy: 'Student',
                    isRealTask: true,
                }));
                const combined = [...localPosts, ...mappedApiTasks];
                setRequests(combined.length > 0 ? combined : mockRequests);
            } catch {
                const combined = [...localPosts, ...mockRequests];
                setRequests(combined.length > 0 ? combined : mockRequests);
            }
        } catch {
            setRequests(mockRequests);
        }
    };

    const closePostModal = () => {
        setShowPostModal(false);
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const totalBudget = pagesVal > 0 && rateVal > 0 ? pagesVal * rateVal : rateVal;
        const categoryMap: Record<string, { name: string }> = {
            notes: { name: 'Notes Writing' },
            assignment: { name: 'Assignment' },
            lab: { name: 'Lab Manual' },
            project: { name: 'Project' },
        };
        const config = categoryMap[formCategory] || { name: 'Other' };
        const newEntry: RequestItem = {
            id: Date.now().toString(),
            category: config.name,
            title: formSubject,
            pages: pagesVal || 'N/A',
            ratePerPage: rateVal || undefined,
            budget: totalBudget,
            status: 'Rate Fixed',
            postedBy: 'You • Just now',
            canDelete: true,
            deadline: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        };

        if (isAuthenticated) {
            try {
                await api.post('/tasks', {
                    title: formSubject,
                    description: formDetails || 'No additional details provided.',
                    category: config.name,
                    budget: totalBudget,
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });
            } catch (err) {
                console.error('Failed to post task:', err);
            }
        }

        const localPosts: RequestItem[] = JSON.parse(localStorage.getItem('notex_requests') || '[]');
        localStorage.setItem('notex_requests', JSON.stringify([newEntry, ...localPosts]));
        setFormSubject('');
        setFormPages('');
        setFormBudget('');
        setFormDetails('');
        closePostModal();
        toast.success(`Request posted — ₹${Math.floor(totalBudget)} total`);
        fetchTasks();

        // Optionally highlight new card briefly
        setTimeout(() => {
            const el = document.getElementById(`card-${newEntry.id}`);
            if (el) {
                el.classList.add('new-card-highlight');
                setTimeout(() => el.classList.remove('new-card-highlight'), 900);
            }
        }, 400);
    };

    const handleDeleteRequest = (id: string | number) => {
        if (!window.confirm('Delete this request?')) return;
        const localPosts: RequestItem[] = JSON.parse(localStorage.getItem('notex_requests') || '[]');
        const updated = localPosts.filter((req) => req.id !== id);
        localStorage.setItem('notex_requests', JSON.stringify(updated));
        setRequests((prev) => prev.filter((req) => req.id !== id));
    };

    const scrollToRequests = () => {
        setShowAdvancedFilters(true);
        setTimeout(() => {
            document.getElementById('requests-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAcquire = (req: RequestItem) => {
        if (!isAuthenticated) {
            toast('Sign in to acquire requests', { icon: '🔒' });
            openAuth('login');
            return;
        }
        if (req.isRealTask) {
            window.location.href = `/tasks/${req.id}`;
            return;
        }
        toast.success(`Acquire started for "${req.title}"`);
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategory((prev) => (prev === cat ? null : cat));
        setTimeout(() => {
            document.getElementById('requests-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
    };

    const categories = [
        { key: 'Notes Writing', label: 'Notes Writing', iconClass: 'blue', paths: ['m12 19 7-7 3 3-7 7-3-3z', 'm18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z', 'm2 2 7.586 7.586'] },
        { key: 'Assignment', label: 'Assignments', iconClass: 'green', paths: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'] },
        { key: 'Lab Manual', label: 'Lab Manuals', iconClass: 'purple', paths: [] },
        { key: 'Project', label: 'Projects', iconClass: 'orange', paths: [] },
    ];

    return (
        <>
            <main className="main-content-area">
                <div className="hero-section" ref={heroRef}>
                    <h1 className="hero-title">Connect, Collaborate, Complete.</h1>
                    <p className="hero-description">
                        An academic collaboration platform designed to connect students who need academic work with those who can deliver it and earn.
                    </p>
                    <div className="back10">
                        <video src="/0_3d_Model_Dragon_3840x2160.mp4" muted autoPlay loop playsInline />
                    </div>
                    <div className="hero-actions">
                        <button
                            type="button"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    toast('Sign in to post a request', { icon: '📝' });
                                    openAuth('login');
                                    return;
                                }
                                setShowPostModal(true);
                            }}
                            className="btn btn-primary btn-lg btn-rounded btn-shadow"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            Post a Request
                        </button>
                        <button type="button" onClick={scrollToRequests} className="btn btn-ghost btn-lg btn-rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            Browse Requests
                        </button>
                    </div>
                </div>

                <div className="category-grid">
                    {categories.map((c) => (
                        <div
                            key={c.key}
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleCategory(c.key)}
                            onKeyDown={(e) => e.key === 'Enter' && toggleCategory(c.key)}
                            className={`category-card ${c.key === 'All' ? (!selectedCategory ? 'active' : '') : (selectedCategory === c.key ? 'active' : '')}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`category-icon ${c.iconClass}`}>
                                {c.key === 'All' && (
                                    <>
                                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                    </>
                                )}
                                {c.key === 'Notes Writing' && (
                                    <>
                                        <path d="m12 19 7-7 3 3-7 7-3-3z" />
                                        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                        <path d="m2 2 7.586 7.586" />
                                        <circle cx="11" cy="11" r="2" />
                                    </>
                                )}
                                {c.key === 'Assignment' && (
                                    <>
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </>
                                )}
                                {c.key === 'Lab Manual' && (
                                    <>
                                        <path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19" />
                                        <path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19" />
                                        <path d="M8.5 2h7" />
                                        <path d="M14 21h-4" />
                                        <path d="M5 19h14" />
                                    </>
                                )}
                                {c.key === 'Project' && (
                                    <>
                                        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                                        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                                        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                                    </>
                                )}
                            </svg>
                            <h3 className="card-title">{c.label}</h3>
                        </div>
                    ))}
                </div>

                <div id="requests-section" className="requests-header">
                    <h2 className="section-title">
                        {selectedCategory ? `${selectedCategory} Requests` : 'Active Requests Near You'}
                    </h2>
                    <div className="requests-actions">
                        <button
                            type="button"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`btn-filter-toggle ${showAdvancedFilters ? 'active' : ''}`}
                            aria-expanded={showAdvancedFilters}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            Filters
                        </button>
                        {selectedCategory && (
                            <button type="button" onClick={() => setSelectedCategory(null)} className="btn-clear-filter">
                                Clear Category
                            </button>
                        )}
                        <button type="button" onClick={() => setShowAllCards(!showAllCards)} className="btn btn-text-link">
                            {showAllCards ? 'View Less' : 'View All'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showAllCards ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {showAdvancedFilters && (
                    <div className="advanced-filters-panel">
                        <div className="filter-group">
                            <label className="filter-label">Search Location</label>
                            <div className="filter-input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <input
                                    type="text"
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                    placeholder="e.g. Mango, Sakchi, Dimna"
                                    className="filter-input-field"
                                />
                            </div>
                        </div>
                        <div className="filter-group">
                            <div className="filter-label-row">
                                <label className="filter-label">Max Budget (Price)</label>
                                <span className="filter-value-badge">₹{filterMaxPrice}</span>
                            </div>
                            <div className="ios-slider-container">
                                <span className="slider-min">₹0</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    step="10"
                                    value={filterMaxPrice}
                                    onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                                    className="ios-slider"
                                />
                                <span className="slider-max">₹500+</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={gridRef} className="requests-grid" style={{ marginBottom: '4rem' }}>
                    {displayedRequests.length === 0 ? (
                        <div className="browse-empty requests-empty-state">
                            <div className="requests-empty-icon">🎓</div>
                            <h3>No requests here yet</h3>
                            <p>Post one or try another category/filter combination.</p>
                        </div>
                    ) : (
                        displayedRequests.map((req, idx) => (
                            <RequestCard
                                key={`req-${req.id}-${idx}`}
                                req={req}
                                onDelete={req.canDelete ? handleDeleteRequest : undefined}
                                onAcquire={handleAcquire}
                            />
                        ))
                    )}
                </div>
            </main>

            {showPostModal && (
                <div
                    ref={modalRef}
                    className="modal-overlay request-modal-overlay"
                    onClick={(e) => e.target === e.currentTarget && closePostModal()}
                >
                    <div ref={modalPanelRef} className="modal-content large request-modal-panel">
                        <div className="modal-header">
                            <h2 className="modal-title">Post a New Request</h2>
                            <p className="modal-description">Fill in details — total budget updates live.</p>
                        </div>
                        <hr className="modal-hr" />
                        <form onSubmit={handlePostSubmit} className="modal-form">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="form-inputt" required>
                                        <option value="notes">Notes Writing</option>
                                        <option value="assignment">Assignment</option>
                                        <option value="lab">Lab Manual</option>
                                        <option value="project">Project</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject / Title</label>
                                    <input value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="form-input form-input-wide" placeholder="e.g. Calculus II" required />
                                </div>
                            </div>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">No. of Pages</label>
                                    <input type="number" min="0" value={formPages} onChange={(e) => setFormPages(e.target.value)} className="form-input form-input-wide" placeholder="10" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cost per Page (₹)</label>
                                    <input type="number" min="0" step="0.5" value={formBudget} onChange={(e) => setFormBudget(e.target.value)} className="form-input form-input-wide" placeholder="5" required />
                                </div>
                            </div>

                            <div className="budget-live-preview">
                                <span className="budget-live-label">Estimated total</span>
                                <span className="budget-live-value">
                                    {pagesVal > 0 && rateVal > 0 ? (
                                        <>
                                            {pagesVal} × ₹{rateVal} = <strong>₹{computedTotal}</strong>
                                        </>
                                    ) : (
                                        <strong>₹{computedTotal || 0}</strong>
                                    )}
                                </span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Additional Details</label>
                                <textarea value={formDetails} onChange={(e) => setFormDetails(e.target.value)} className="form-textarea form-textarea-wide" placeholder="Specific requirements, format, deadline notes..." rows={4} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={closePostModal} className="btn btn-secondary">
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
