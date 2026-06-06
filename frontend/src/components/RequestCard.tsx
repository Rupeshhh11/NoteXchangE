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

function getCategoryClass(category: string) {
    const lower = (category || '').toLowerCase();
    if (lower.includes('note')) return 'cat-notes';
    if (lower.includes('assign')) return 'cat-assignment';
    if (lower.includes('lab') || lower.includes('manual')) return 'cat-lab';
    if (lower.includes('project')) return 'cat-project';
    return 'cat-other';
}

function CategoryBadgeIcon({ catClass }: { catClass: string }) {
    const props = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    if (catClass === 'cat-notes') {
        return <svg {...props}><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>;
    }
    if (catClass === 'cat-assignment') {
        return <svg {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    }
    if (catClass === 'cat-lab') {
        return <svg {...props}><path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19"/><path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19"/><path d="M8.5 2h7"/><path d="M14 21h-4"/><path d="M5 19h14"/></svg>;
    }
    if (catClass === 'cat-project') {
        return <svg {...props}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>;
    }
    return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
}

interface RequestCardProps {
    req: RequestItem;
    onDelete?: (id: string | number) => void;
    onAcquire: (req: RequestItem) => void;
}

export default function RequestCard({ req, onDelete, onAcquire }: RequestCardProps) {
    const catClass = getCategoryClass(req.category);
    const postedParts = (req.postedBy || '').split('•');
    const posterName = postedParts[0]?.trim() || 'Student';
    const collegeName = postedParts[1]?.trim() || '';
    const isSelf = posterName.toLowerCase() === 'you';

    const pagesNum = typeof req.pages === 'number' ? req.pages : parseFloat(String(req.pages));
    const hasPages = !isNaN(pagesNum) && pagesNum > 0;
    const rate =
        req.ratePerPage ??
        (hasPages && req.budget ? Math.round((req.budget / pagesNum) * 100) / 100 : undefined);
    const showBreakdown = hasPages && rate != null && rate > 0;

    return (
        <div className={`tc-card tc-card-modern ${catClass}`} id={`card-${req.id}`} data-request-card>
            <div className="tc-top">
                <span className={`tc-badge ${catClass}`}>
                    <CategoryBadgeIcon catClass={catClass} />
                    <span style={{ marginLeft: 4 }}>{req.category}</span>
                </span>
                <div className="tc-price-block">
                    <span className="tc-price">₹{Math.floor(req.budget)}</span>
                    {showBreakdown && (
                        <span className="tc-cost-formula">
                            {pagesNum} × ₹{rate}
                        </span>
                    )}
                </div>
            </div>

            <h3 className="tc-title">{req.title}</h3>

            {req.status && <span className="tc-status-pill">{req.status}</span>}

            <div className="tc-meta">
                <span className="tc-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    {hasPages ? `${pagesNum} pages` : `Pages: ${req.pages}`}
                </span>
                {showBreakdown && (
                    <span className="tc-meta-item tc-meta-highlight">
                        ₹{rate}/page
                    </span>
                )}
                <span className="tc-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {req.deadline || '15 Jun 2026'}
                </span>
            </div>

            <div className="tc-poster">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Posted by {posterName}</span>
                {collegeName && (
                    <>
                        <span className="tc-dot">•</span>
                        <span className="tc-college">{collegeName}</span>
                    </>
                )}
                <span className="tc-dot">•</span>
                <span className="tc-time">{isSelf ? 'Just now' : '1d ago'}</span>
            </div>

            <hr className="tc-hr" />

            <div className="tc-footer">
                {req.canDelete && onDelete ? (
                    <button type="button" className="btn-delete" onClick={() => onDelete(req.id)}>
                        Delete
                    </button>
                ) : (
                    <div />
                )}
                <div className="action-group">
                    {req.isRealTask ? (
                        <Link to={`/tasks/${req.id}`} className="tc-link">
                            View Details
                        </Link>
                    ) : (
                        <button type="button" className="tc-link tc-link-btn" onClick={() => onAcquire(req)}>
                            View Details
                        </button>
                    )}
                    <button type="button" className="tc-acquire-btn" onClick={() => onAcquire(req)}>
                        Acquire It
                    </button>
                </div>
            </div>
        </div>
    );
}
