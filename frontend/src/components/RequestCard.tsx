import React from 'react';
import { Link } from 'react-router-dom';

export interface RequestItem {
    id: string | number;
    category: string;
    title: string;
    pages: number | string;
    ratePerPage?: number;
    budget: number;
    status?: string;
    postedBy: string;
    canDelete?: boolean;
    isRealTask?: boolean;
    deadline?: string;
}

const categoryConfig: Record<string, { color: string; bg: string; gradient: string; icon: JSX.Element }> = {
    'cat-notes': {
        color: '#2563eb',
        bg: 'rgba(219, 234, 254, 0.6)',
        gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>
            </svg>
        ),
    },
    'cat-assignment': {
        color: '#059669',
        bg: 'rgba(209, 250, 229, 0.6)',
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
        ),
    },
    'cat-lab': {
        color: '#7c3aed',
        bg: 'rgba(237, 233, 254, 0.6)',
        gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19"/><path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19"/><path d="M8.5 2h7"/><path d="M5 19h14"/>
            </svg>
        ),
    },
    'cat-project': {
        color: '#d97706',
        bg: 'rgba(254, 243, 199, 0.6)',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
            </svg>
        ),
    },
    'cat-other': {
        color: '#4b5563',
        bg: 'rgba(243, 244, 246, 0.6)',
        gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
            </svg>
        ),
    },
};

function getCategoryClass(category: string) {
    const lower = (category || '').toLowerCase();
    if (lower.includes('note')) return 'cat-notes';
    if (lower.includes('assign')) return 'cat-assignment';
    if (lower.includes('lab') || lower.includes('manual')) return 'cat-lab';
    if (lower.includes('project')) return 'cat-project';
    return 'cat-other';
}

interface RequestCardProps {
    req: RequestItem;
    onDelete?: (id: string | number) => void;
    onAcquire: (req: RequestItem) => void;
    onViewDetails: (req: RequestItem) => void;
}

export default function RequestCard({ req, onDelete, onAcquire, onViewDetails }: RequestCardProps) {
    const catClass = getCategoryClass(req.category);
    const cfg = categoryConfig[catClass] || categoryConfig['cat-other'];
    const postedParts = (req.postedBy || '').split('•');
    const posterName = postedParts[0]?.trim() || 'Student';
    const collegeName = postedParts[1]?.trim() || '';
    const isSelf = posterName.toLowerCase() === 'you';

    const pagesNum = typeof req.pages === 'number' ? req.pages : parseFloat(String(req.pages));
    const hasPages = !isNaN(pagesNum) && pagesNum > 0;

    return (
        <div
            id={`card-${req.id}`}
            data-request-card
            style={{
                background: 'var(--clr-card-bg, white)',
                borderRadius: '18px',
                border: '1px solid var(--clr-border, #f1f5f9)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                cursor: 'default',
                position: 'relative',
            }}
            className="request-card-wrapper"
        >
            {/* Colored accent bar at top */}
            <div style={{
                height: '4px',
                background: cfg.gradient,
                width: '100%',
                flexShrink: 0,
            }} />

            <div style={{ padding: '1.1rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>

                {/* Header row: badge + price */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: cfg.color,
                        background: cfg.bg,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                    }}>
                        {cfg.icon}
                        {req.category}
                    </span>
                    <span style={{
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: '#059669',
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: '-0.03em',
                    }}>
                        ₹{Math.floor(req.budget)}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--clr-foreground, #0f172a)',
                    margin: 0,
                    lineHeight: 1.4,
                    fontFamily: "'Space Grotesk', sans-serif",
                }}>
                    {req.title}
                </h3>

                {/* Meta pills */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {hasPages && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.73rem', color: 'var(--clr-muted-foreground, #475569)', fontWeight: 500,
                            background: 'var(--clr-muted, #f8fafc)', border: '1px solid var(--clr-border, #e2e8f0)',
                            borderRadius: '8px', padding: '0.2rem 0.55rem',
                        }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                            {pagesNum} pages
                        </span>
                    )}
                    {req.deadline && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.73rem', color: 'var(--clr-muted-foreground, #475569)', fontWeight: 500,
                            background: 'var(--clr-muted, #f8fafc)', border: '1px solid var(--clr-border, #e2e8f0)',
                            borderRadius: '8px', padding: '0.2rem 0.55rem',
                        }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {req.deadline}
                        </span>
                    )}
                    {req.status && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.73rem', color: '#b45309', fontWeight: 600,
                            background: '#fef3c7', border: '1px solid #fde68a',
                            borderRadius: '8px', padding: '0.2rem 0.55rem',
                        }}>
                            {req.status}
                        </span>
                    )}
                </div>

                {/* Poster */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    marginTop: 'auto', paddingTop: '0.4rem',
                }}>
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: cfg.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
                    }}>
                        {(posterName.charAt(0) || 'S').toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clr-muted-foreground, #64748b)', fontWeight: 500 }}>
                        {isSelf ? 'You' : posterName}
                    </span>
                    {collegeName && (
                        <>
                            <span style={{ color: 'var(--clr-border, #cbd5e1)', fontSize: '0.7rem' }}>·</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--clr-muted-foreground, #94a3b8)', fontWeight: 600 }}>{collegeName}</span>
                        </>
                    )}
                    <span style={{ color: 'var(--clr-border, #cbd5e1)', fontSize: '0.7rem' }}>·</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--clr-muted-foreground, #94a3b8)' }}>{isSelf ? 'Just now' : '1d ago'}</span>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--clr-border, #f1f5f9)', margin: '0 1.25rem' }} />

            {/* Action footer */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: req.canDelete ? 'space-between' : 'flex-end',
                padding: '0.75rem 1.25rem',
                gap: '0.5rem',
            }}>
                {req.canDelete && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(req.id)}
                        style={{
                            fontSize: '0.75rem', fontWeight: 600, color: '#ef4444',
                            background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: '8px', padding: '0.4rem 0.85rem',
                            cursor: 'pointer', transition: 'all 0.15s ease',
                        }}
                    >
                        Delete
                    </button>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={() => onViewDetails(req)}
                        style={{
                            fontSize: '0.76rem', fontWeight: 600, color: 'var(--clr-foreground, #475569)',
                            background: 'var(--clr-muted, #f8fafc)', border: '1px solid var(--clr-border, #e2e8f0)', borderRadius: '8px',
                            padding: '0.42rem 0.85rem', transition: 'all 0.15s ease',
                            display: 'inline-flex', alignItems: 'center',
                            cursor: 'pointer', fontFamily: 'inherit'
                        }}
                    >
                        Details
                    </button>
                    <button
                        type="button"
                        onClick={() => onAcquire(req)}
                        style={{
                            fontSize: '0.76rem', fontWeight: 700, color: '#fff',
                            background: `linear-gradient(120deg, #0b81fa, #2DACFC)`,
                            border: 'none', borderRadius: '8px',
                            padding: '0.42rem 1rem', cursor: 'pointer',
                            boxShadow: '0 3px 10px rgba(11, 129, 250, 0.28)',
                            transition: 'all 0.18s ease',
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        }}
                        className="acquire-btn-card"
                    >
                        Acquire It
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
