import React, { useState, useEffect, useRef, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';
import { useVerificationModal } from '../context/VerificationModalContext';
import RequestCard, { type RequestItem } from '../components/RequestCard';
import AcquireModal from '../components/AcquireModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import toast from 'react-hot-toast';

const mockRequests: RequestItem[] = [
    { id: 1, category: 'Notes Writing', title: 'Advanced Calculus', pages: 15, ratePerPage: 5, budget: 75, postedBy: 'Alex009 • Mango', canDelete: false },
    { id: 2, category: 'Assignment', title: 'History Essay', pages: 4, ratePerPage: 10, budget: 40, postedBy: 'Sonali013 • Sakchi', canDelete: false },
    { id: 3, category: 'Lab Manual', title: 'Physics Lab 101', pages: 'N/A', budget: 30, postedBy: 'Aman999 • Mango', canDelete: false },
    { id: 4, category: 'Project', title: 'Web Dev Portfolio', pages: 'N/A', budget: 150, postedBy: 'Rohit69 • Dimna', canDelete: false },
    { id: 5, category: 'Notes Writing', title: 'Organic Chemistry', pages: 10, ratePerPage: 6, budget: 60, postedBy: 'Neha_22 • Sakchi', canDelete: false },
];

export default function Home() {
    const { isAuthenticated, user } = useAuth();
    const { openAuth } = useAuthModal();
    const { openVerification } = useVerificationModal();
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [formCategory, setFormCategory] = useState('notes');
    const [formSubject, setFormSubject] = useState('');
    const [formPages, setFormPages] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formDetails, setFormDetails] = useState('');

    const [acquireModalOpen, setAcquireModalOpen] = useState(false);
    const [acquireRequest, setAcquireRequest] = useState<RequestItem | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [detailsTask, setDetailsTask] = useState<any | null>(null);

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
        if (user?.verificationStatus !== 'Verified') {
            toast('Please complete identity verification to acquire tasks', { icon: '🔒' });
            openVerification();
            return;
        }
        setAcquireRequest(req);
        setAcquireModalOpen(true);
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
                    <div className="desktop-video-bg">
                        <video src="/0_3d_Model_Dragon_3840x2160.mp4" muted autoPlay loop playsInline />
                    </div>
                    <div className="liquid-glass-bg mobile-only-bg">
                        <div className="liquid-blob blob-1"></div>
                        <div className="liquid-blob blob-2"></div>
                        <div className="liquid-blob blob-3"></div>
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
                                if (user?.verificationStatus !== 'Verified') {
                                    toast('Please complete identity verification to post requests', { icon: '🔒' });
                                    openVerification();
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
                                onViewDetails={(item) => {
                                    setDetailsTask(item);
                                    setDetailsModalOpen(true);
                                }}
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

            <section id="about" style={{ padding: '6rem 2rem', background: 'var(--clr-about-bg, #e8f5e9)', display: 'flex', justifyContent: 'center', color: 'var(--clr-foreground, #111827)' }}>
                <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                    {/* Left Side */}
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--clr-foreground, #000)' }}>About NoteXchangE</h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--clr-muted-foreground, #1f2937)', marginBottom: '1rem', lineHeight: 1.6 }}>
                            Your Time is Precious. Let Us Handle the Work. Let's be real  student life is a wild rollercoaster ride. One week you're in total Holiday Mode, chilling with friends, traveling, or upskilling. The next week, Exam Season hits like a truck, and suddenly you are buried under a mountain of pending assignments, unwritten lab manuals, and incomplete projects.
                        </p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--clr-muted-foreground, #1f2937)', lineHeight: 1.6 }}>
                            That's exactly why we built NoteXchangE a peer-to-peer platform created by students, for students, to help you balance your chill time, clear your academic backlog, and make some serious cash on the side!
                        </p>
                    </div>

                    {/* Right Side */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--clr-foreground, #000)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🌴</span> Holiday Mode:
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--clr-muted-foreground, #1f2937)', fontWeight: 500, lineHeight: 1.6, marginLeft: '1.75rem' }}>
                                Holidays are meant for relaxing, not spending hours filling practical files. With NoteXchangE, you can get your writing work done by fellow students while enjoying your break stress free. And if you have some free time, complete assignments, notes, or lab reports for others and turn your holidays into an easy way to earn extra pocket money.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--clr-foreground, #000)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>📚</span> Exam Mode:
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--clr-muted-foreground, #1f2937)', fontWeight: 500, lineHeight: 1.6, marginLeft: '1.75rem' }}>
                                When exams are near, every minute matters. Instead of wasting time searching for notes or rushing to finish projects, focus on your preparation while NoteXchangE connects you with fellow students who can help complete pending academic tasks. And if you're looking to earn, take on requests from other students, complete their notes, assignments, or project work, and get paid for your effort. It's a simple, transparent way for students to help each other succeed while reducing stress and earning extra pocket money.

                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'var(--clr-how-it-works-bg, #f8fafc)', textAlign: 'center', color: 'var(--clr-foreground, inherit)', transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--clr-foreground, #1f2937)' }}>How it Works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div style={{ padding: '2rem', background: 'var(--clr-card-bg, white)', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--clr-border, transparent)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1. Post a Request</h3>
                            <p style={{ color: 'var(--clr-muted-foreground, #6b7280)' }}>Describe what you need help with and set a budget.</p>
                        </div>
                        <div style={{ padding: '2rem', background: 'var(--clr-card-bg, white)', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--clr-border, transparent)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>2. Connect</h3>
                            <p style={{ color: 'var(--clr-muted-foreground, #6b7280)' }}>Others browse and acquire your request to help out.</p>
                        </div>
                        <div style={{ padding: '2rem', background: 'var(--clr-card-bg, white)', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--clr-border, transparent)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>3. Complete</h3>
                            <p style={{ color: 'var(--clr-muted-foreground, #6b7280)' }}>Receive your work, review, and mark it as complete.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="community" style={{ padding: '6rem 2rem', background: 'var(--clr-community-bg, linear-gradient(135deg, #fff7ed, #ffedd5))', textAlign: 'center', color: 'var(--clr-foreground, inherit)', transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#ea580c' }}>Join Our Community</h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--clr-muted-foreground, #4b5563)', lineHeight: 1.8, marginBottom: '2rem' }}>
                        Be part of a growing network of students. Share knowledge, earn by helping others, and excel in your academics together!
                    </p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ padding: '1rem 2.5rem', borderRadius: '9999px', background: '#ea580c', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.3)', transition: 'transform 0.2s' }}>
                        Get Started
                    </button>
                </div>
            </section>

            <AcquireModal
                isOpen={acquireModalOpen}
                onClose={() => setAcquireModalOpen(false)}
                request={acquireRequest}
            />
            <TaskDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                task={detailsTask}
                onAcquire={handleAcquire}
            />
        </>
    );
}
