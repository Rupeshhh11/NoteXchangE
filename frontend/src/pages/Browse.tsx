import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, BookOpen, ClipboardList, FolderKanban, FlaskConical, LayoutGrid, X } from 'lucide-react';
import TaskCard from '../components/TaskCard';

const CATEGORIES = [
    { label: 'All', value: '', icon: LayoutGrid },
    { label: 'Notes', value: 'notes writing', icon: BookOpen },
    { label: 'Assignment', value: 'assignment', icon: ClipboardList },
    { label: 'Project', value: 'project', icon: FolderKanban },
    { label: 'Lab Manual', value: 'lab manual', icon: FlaskConical },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
];

export default function Browse() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [activeCategory]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params: any = { status: 'open', limit: 30 };
            if (activeCategory) params.category = activeCategory;
            const response = await axios.get('/api/tasks', { params });
            setTasks(response.data.tasks || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks
        .filter(t =>
            searchQuery === '' ||
            t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'price_asc') return a.budget - b.budget;
            if (sortBy === 'price_desc') return b.budget - a.budget;
            if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    return (
        <div className="browse-page">
            {/* ── Hero / Header ─────────────────────────── */}
            <div className="browse-hero">
                <div className="browse-hero-inner">
                    <h1 className="browse-hero-title">
                        Find Academic <span className="browse-hero-accent">Resources</span>
                    </h1>
                    <p className="browse-hero-sub">
                        Browse notes, assignments, projects &amp; lab manuals from students across India
                    </p>

                    {/* Search */}
                    <div className="browse-search-wrap">
                        <Search className="browse-search-icon" />
                        <input
                            id="browse-search-input"
                            type="text"
                            placeholder="Search by title or description…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="browse-search-input"
                        />
                        {searchQuery && (
                            <button className="browse-search-clear" onClick={() => setSearchQuery('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Filter Bar ────────────────────────────── */}
            <div className="browse-filter-bar">
                <div className="browse-filter-inner">
                    {/* Category chips */}
                    <div className="browse-chips-row">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    id={`filter-chip-${cat.label.toLowerCase().replace(' ', '-')}`}
                                    onClick={() => setActiveCategory(cat.value)}
                                    className={`browse-chip ${isActive ? 'browse-chip-active' : ''}`}
                                >
                                    <Icon size={15} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right controls */}
                    <div className="browse-filter-right">
                        <span className="browse-count-badge">
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'result' : 'results'}
                        </span>
                        <div className="browse-sort-wrap">
                            <SlidersHorizontal size={15} className="browse-sort-icon" />
                            <select
                                id="browse-sort-select"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="browse-sort-select"
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content ──────────────────────────── */}
            <div className="browse-content">
                {loading ? (
                    <div className="browse-skeleton-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="browse-skeleton-card">
                                <div className="skel-line skel-short" />
                                <div className="skel-line skel-long" />
                                <div className="skel-line skel-mid" />
                                <div className="skel-line skel-short" />
                                <div className="skel-footer">
                                    <div className="skel-btn" />
                                    <div className="skel-btn skel-btn-wide" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="browse-empty">
                        <div className="browse-empty-icon">🎓</div>
                        <h3>No results found</h3>
                        <p>Try changing the filter or search query</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => { setSearchQuery(''); setActiveCategory(''); }}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="browse-grid">
                        {filteredTasks.map((task: any) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
