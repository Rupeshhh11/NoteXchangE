import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, FlaskConical, FolderKanban, FileText, User, Clock } from 'lucide-react';

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
        pages?: number;
        posterName?: string;
        collegeName?: string;
        createdAt?: string;
    };
}

function getCategoryMeta(category: string) {
    const cat = category?.toLowerCase() ?? '';
    if (cat.includes('project'))
        return { label: 'Project', Icon: FolderKanban, color: 'cat-project' };
    if (cat.includes('assign'))
        return { label: 'Assignment', Icon: ClipboardList, color: 'cat-assignment' };
    if (cat.includes('lab') || cat.includes('manual'))
        return { label: 'Lab Manual', Icon: FlaskConical, color: 'cat-lab' };
    if (cat.includes('note'))
        return { label: 'Notes Writing', Icon: BookOpen, color: 'cat-notes' };
    return { label: category, Icon: FileText, color: 'cat-other' };
}

function timeAgo(dateStr?: string) {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

export default function TaskCard({ task }: TaskCardProps) {
    const { label, Icon, color } = getCategoryMeta(task.category);

    return (
        <div className={`tc-card ${color}`}>
            {/* Top row: category badge + price */}
            <div className="tc-top">
                <span className={`tc-badge ${color}`}>
                    <Icon size={13} strokeWidth={2.2} />
                    {label}
                </span>
                <span className="tc-price">₹{Math.floor(task.budget)}</span>
            </div>

            {/* Title */}
            <h3 className="tc-title">{task.title}</h3>

            {/* Meta row */}
            <div className="tc-meta">
                {task.pages != null && (
                    <span className="tc-meta-item">
                        <FileText size={13} /> Pages: {task.pages ?? 'N/A'}
                    </span>
                )}
                {task.deadline && (
                    <span className="tc-meta-item">
                        <Clock size={13} />
                        {new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                )}
            </div>

            {/* Poster */}
            <div className="tc-poster">
                <User size={13} />
                <span>
                    {task.posterName ?? `User#${task.clientId?.slice(-4) ?? '????'}`}
                </span>
                {task.collegeName && (
                    <>
                        <span className="tc-dot">•</span>
                        <span className="tc-college">{task.collegeName}</span>
                    </>
                )}
                <span className="tc-dot">•</span>
                <span className="tc-time">{timeAgo(task.createdAt)}</span>
            </div>

            {/* Push footer to bottom */}
            <div className="tc-spacer" />

            {/* Divider */}
            <hr className="tc-hr" />

            {/* Footer actions */}
            <div className="tc-footer">
                <Link to={`/tasks/${task.id}`} className="tc-link">
                    View Details
                </Link>
                <Link to={`/tasks/${task.id}`} className="tc-acquire-btn">
                    Acquire It ✦
                </Link>
            </div>
        </div>
    );
}
