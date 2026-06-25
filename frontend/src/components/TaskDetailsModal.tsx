import React, { useEffect, useRef } from 'react';
import { X, BookOpen, ClipboardList, FlaskConical, FolderKanban, FileText, Clock, User, Award, ShieldAlert } from 'lucide-react';

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any | null;
    onAcquire: (task: any) => void;
    currentUserId?: string;
}

function getCategoryMeta(category: string) {
    const cat = category?.toLowerCase() ?? '';
    if (cat.includes('project'))
        return { label: 'Project', Icon: FolderKanban, color: '#f97316', bg: 'rgba(254, 243, 199, 0.7)' };
    if (cat.includes('assign'))
        return { label: 'Assignment', Icon: ClipboardList, color: '#10b981', bg: 'rgba(209, 250, 229, 0.7)' };
    if (cat.includes('lab') || cat.includes('manual'))
        return { label: 'Lab Manual', Icon: FlaskConical, color: '#8b5cf6', bg: 'rgba(237, 233, 254, 0.7)' };
    if (cat.includes('note'))
        return { label: 'Notes Writing', Icon: BookOpen, color: '#3b82f6', bg: 'rgba(219, 234, 254, 0.7)' };
    return { label: category, Icon: FileText, color: '#6b7280', bg: 'rgba(243, 244, 246, 0.7)' };
}

export default function TaskDetailsModal({ isOpen, onClose, task, onAcquire, currentUserId }: TaskDetailsModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !task) return null;

    const { label, Icon, color, bg } = getCategoryMeta(task.category);
    const isOwner = currentUserId && task.clientId === currentUserId;
    const isLocalMock = typeof task.id === 'number' || (typeof task.id === 'string' && !task.id.includes('-'));
    
    // Normalize poster details
    const postedParts = (task.postedBy || '').split('•');
    const posterName = task.posterName || postedParts[0]?.trim() || `User#${task.clientId?.slice(-4) || '????'}`;
    const collegeName = task.collegeName || postedParts[1]?.trim() || '';

    const handleAcquireClick = () => {
        onAcquire(task);
        onClose();
    };

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                padding: '1rem',
                animation: 'fadeIn 0.25s ease-out'
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={panelRef}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
                    padding: '2rem',
                    maxWidth: '35rem',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: "'Inter', sans-serif",
                    animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {/* Visual Accent Glares */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '12rem', height: '12rem', backgroundColor: `${color}1e`, borderRadius: '50%', filter: 'blur(50px)', marginRight: '-3rem', marginTop: '-3rem', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12rem', height: '12rem', backgroundColor: 'rgba(59, 130, 246, 0.12)', borderRadius: '50%', filter: 'blur(50px)', marginLeft: '-3rem', marginBottom: '-3rem', pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: color,
                                backgroundColor: bg,
                                padding: '0.3rem 0.75rem',
                                borderRadius: '999px',
                                width: 'fit-content'
                            }}>
                                <Icon size={12} strokeWidth={2.5} />
                                {label}
                            </span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                                {task.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            style={{ 
                                padding: '0.5rem', 
                                backgroundColor: '#f1f5f9', 
                                border: 'none', 
                                borderRadius: '50%', 
                                color: '#475569', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Stats Box */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.75rem',
                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        borderRadius: '16px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Budget</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                                ₹{Math.floor(task.budget)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Pages</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>
                                {task.pages && task.pages !== 'N/A' ? `${task.pages} pages` : 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Deadline</span>
                            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock size={14} className="text-slate-500" />
                                {task.deadline ? (
                                    task.deadline.includes(',') || task.deadline.includes('-') || isNaN(Date.parse(task.deadline)) ? 
                                    task.deadline : 
                                    new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                ) : 'Flexible'}
                            </span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Task Description
                        </h4>
                        <p style={{ 
                            fontSize: '0.925rem', 
                            color: '#475569', 
                            lineHeight: 1.6, 
                            margin: 0, 
                            backgroundColor: 'rgba(255,255,255,0.4)', 
                            padding: '1rem', 
                            borderRadius: '12px',
                            border: '1px solid rgba(241, 245, 249, 0.8)',
                            whiteSpace: 'pre-wrap',
                            maxHeight: '10rem',
                            overflowY: 'auto'
                        }}>
                            {task.description || 'No additional details provided for this request.'}
                        </p>
                    </div>

                    {/* Poster Section */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '14px', 
                        backgroundColor: 'rgba(241, 245, 249, 0.5)',
                        border: '1px solid #f1f5f9',
                        marginBottom: '1.75rem'
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${color}, #3b82f6)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.9rem', fontWeight: 800
                        }}>
                            {(posterName.charAt(0) || 'S').toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <User size={13} className="text-slate-500" />
                                {posterName}
                                {task.collegeName && (
                                    <span style={{ color: '#64748b', fontWeight: 400 }}>({task.collegeName})</span>
                                )}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>
                                Posted by student • Safe &amp; verified contract
                            </span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ 
                                flex: 1, 
                                padding: '0.8rem 1rem', 
                                borderRadius: '12px', 
                                fontWeight: 600, 
                                color: '#475569', 
                                backgroundColor: '#f1f5f9', 
                                border: '1px solid #e2e8f0', 
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        >
                            Close
                        </button>
                        {isOwner ? (
                            <div style={{
                                flex: 1.5,
                                padding: '0.8rem 1rem',
                                borderRadius: '12px',
                                fontWeight: 600,
                                color: '#d97706',
                                backgroundColor: '#fffbeb',
                                border: '1px solid #fde68a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                fontSize: '0.9rem'
                            }}>
                                <ShieldAlert size={16} />
                                Your Own Request
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAcquireClick}
                                style={{ 
                                    flex: 1.5, 
                                    padding: '0.8rem 1rem', 
                                    borderRadius: '12px', 
                                    fontWeight: 700, 
                                    color: 'white', 
                                    background: `linear-gradient(135deg, ${color}, #2563eb)`, 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    boxShadow: `0 8px 20px -4px rgba(37, 99, 235, 0.4)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                }}
                                className="hover:scale-95"
                            >
                                <Award size={16} />
                                Acquire It Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
