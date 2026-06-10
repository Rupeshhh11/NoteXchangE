import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RequestDetail() {
    const { id } = useParams<{ id: string }>();

    // Note: In a real app you'd fetch the request by id. Here we show a mock layout to match the design.
    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="request-detail-card" style={{ background: 'linear-gradient(160deg,#fff,#fafafa)', padding: 20, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>Request #{id} — Physics Lab 101</h1>
                            <div style={{ color: '#6b7280', marginTop: 6 }}>Posted by Aman999 • Mango • 1d ago</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', color: '#059669', fontWeight: 700 }}>₹30</div>
                            <div style={{ fontSize: '.85rem', color: '#6b7280' }}>Pages: N/A</div>
                        </div>
                    </div>

                    <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                        <div>
                            <h3 style={{ margin: '6px 0', fontWeight: 700 }}>Description</h3>
                            <p style={{ margin: 0, color: '#374151' }}>
                                This is a sample request detail view. Replace this text with the real request description fetched
                                from the server. Include attachments, number of pages, expectations and any additional notes.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Link to="/browse" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                                Back
                            </Link>
                            <button className="btn btn-primary" style={{ minWidth: 140 }}>
                                Acquire It
                            </button>
                            <button className="btn btn-ghost" style={{ minWidth: 110 }}>
                                Message Poster
                            </button>
                        </div>

                        <div style={{ marginTop: 10 }}>
                            <h4 style={{ margin: '6px 0', fontWeight: 700 }}>Attachments</h4>
                            <div style={{ color: '#6b7280' }}>No attachments</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
