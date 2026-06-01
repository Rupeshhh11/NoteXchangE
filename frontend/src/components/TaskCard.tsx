import React from 'react';
import { Link } from 'react-router-dom';

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        description: string;
        budget: number;
        category: string;
        status: string;
        deadline: string;
        clientId: string;
    };
}

export default function TaskCard({ task }: TaskCardProps) {
    // Map category to a class color and standard names
    let color = 'blue';
    const cat = task.category.toLowerCase();
    if (cat.includes('assign')) color = 'green';
    else if (cat.includes('lab') || cat.includes('manual')) color = 'purple';
    else if (cat.includes('project')) color = 'orange';

    const getIconSvg = (category: string, color: string) => {
        let pathData = '';
        const lowerCat = category.toLowerCase();
        if (lowerCat.includes('notes')) {
            pathData = `<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>`;
        } else if (lowerCat.includes('assign')) {
            pathData = `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`;
        } else if (lowerCat.includes('lab') || lowerCat.includes('manual')) {
            pathData = `<path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19"/><path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19"/><path d="M8.5 2h7"/><path d="M14 21h-4"/><path d="M5 19h14"/>`;
        } else if (lowerCat.includes('project')) {
            pathData = `<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>`;
        } else {
            pathData = `<circle cx="12" cy="12" r="10"/>`;
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
        <div className="request-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div>
                <div className="card-header">
                    <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {getIconSvg(task.category, color)} 
                        <span className="text-xs font-medium text-muted-foreground">{task.category}</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ lineHeight: '1.4' }}>{task.title}</h3>
                <div className="card-details" style={{ marginTop: '0.5rem' }}>
                    <p className="text-sm text-muted-foreground line-clamp-2" style={{ margin: '2px 0' }}>{task.description}</p>
                    <p className="text-sm text-muted-foreground" style={{ margin: '2px 0', fontSize: '0.75rem', opacity: 0.8 }}>
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                </div>
            </div>
            
            <div className="price-group" style={{ position: 'relative', height: '1.5rem', marginTop: 'auto' }}>
                <span className="request-price" style={{ bottom: '0.5rem', color: '#05b34d' }}>₹{Math.floor(task.budget)}</span>
            </div>
            
            <hr />   
            
            <div className="request-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0' }}>
                <div />
                <div className="action-group" style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/tasks/${task.id}`} className="btn btn-text-link request-link" style={{ fontSize: '0.85rem' }}>
                        View Details
                    </Link>
                    <Link to={`/tasks/${task.id}`} className="btn btn-primaryy btn-sm" style={{ textDecoration: 'none' }}>
                        Acquire It
                    </Link>
                </div>
            </div>
        </div>
    );
}
