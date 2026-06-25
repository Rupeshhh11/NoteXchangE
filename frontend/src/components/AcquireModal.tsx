import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { type RequestItem } from './RequestCard';

interface AcquireModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RequestItem | null;
}

export default function AcquireModal({ isOpen, onClose, request }: AcquireModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !request) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Successfully sent acquire request for "${request.title}"!`);
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
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                padding: '1rem'
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={panelRef}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2rem',
                    maxWidth: '28rem',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
            >
                {/* Decorative background gradients */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '8rem', height: '8rem', backgroundColor: 'rgba(251, 146, 60, 0.2)', borderRadius: '50%', filter: 'blur(40px)', marginRight: '-2.5rem', marginTop: '-2.5rem', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '8rem', height: '8rem', backgroundColor: 'rgba(96, 165, 250, 0.2)', borderRadius: '50%', filter: 'blur(40px)', marginLeft: '-2.5rem', marginBottom: '-2.5rem', pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>Acquire Request</h2>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>{request.title}</p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#6b7280', cursor: 'pointer' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div style={{ backgroundColor: 'rgba(249, 250, 251, 0.8)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Category</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{request.category}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Budget</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a' }}>₹{request.budget}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Poster</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{request.postedBy}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Your Message</label>
                            <textarea
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 0.5)', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                rows={4}
                                placeholder="Hi, I can complete this request within your budget and deadline..."
                                required
                            ></textarea>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 600, color: '#374151', backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 'bold', color: 'white', background: 'linear-gradient(to right, #f97316, #ea580c)', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)' }}
                            >
                                Send Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
