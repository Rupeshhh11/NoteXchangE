import React, { useEffect } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(ellipse at center, #1a0a00 0%, #0f0a05 60%, #000 100%)',
                animation: 'preloader-fade-in 0.3s ease',
            }}
            aria-label="Loading NoteXchangE"
        >
            <style>{`
                @keyframes preloader-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ring-spin-1 {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes ring-spin-2 {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
                @keyframes logo-appear {
                    0% { opacity: 0; transform: scale(0.6); }
                    60% { opacity: 1; transform: scale(1.08); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes text-appear {
                    0% { opacity: 0; transform: translateY(12px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes bar-fill {
                    0% { width: 0%; }
                    20% { width: 20%; }
                    50% { width: 60%; }
                    80% { width: 85%; }
                    100% { width: 100%; }
                }
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
                @keyframes preloader-exit {
                    0% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1.05); }
                }
            `}</style>

            {/* Ambient glow */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(247,103,0,0.25) 0%, transparent 70%)',
                animation: 'glow-pulse 2.5s ease-in-out infinite',
                pointerEvents: 'none',
            }} />

            {/* Outer spinner ring */}
            <div style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                marginBottom: '1.75rem',
            }}>
                {/* Ring 1 - outer */}
                <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: '#f76700',
                    borderRightColor: 'rgba(247,103,0,0.3)',
                    animation: 'ring-spin-1 1.2s linear infinite',
                }} />
                {/* Ring 2 - inner */}
                <div style={{
                    position: 'absolute', inset: '14px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: 'rgba(255,183,3,0.8)',
                    borderLeftColor: 'rgba(255,183,3,0.3)',
                    animation: 'ring-spin-2 0.9s linear infinite',
                }} />
                {/* Logo in center */}
                <div style={{
                    position: 'absolute', inset: '28px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    animation: 'logo-appear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
                }}>
                    <img
                        src="/IMG_2556.PNG"
                        alt="NoteXchangE"
                        style={{
                            width: '52px', height: '52px',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            filter: 'drop-shadow(0 0 12px rgba(247,103,0,0.5))',
                        }}
                    />
                </div>
            </div>

            {/* App name */}
            <div style={{
                display: 'flex', alignItems: 'center',
                fontSize: '2rem', fontWeight: 800,
                letterSpacing: '-0.03em', color: 'white',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                marginBottom: '0.5rem',
                animation: 'text-appear 0.7s ease 0.5s both',
            }}>
                <span>Note</span>
                <span style={{ color: '#f76700', margin: '0 1px' }}>X</span>
                <span>chang</span>
                <span style={{ color: '#f76700' }}>E</span>
            </div>

            {/* Tagline */}
            <p style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                marginBottom: '2rem',
                animation: 'text-appear 0.7s ease 0.7s both',
            }}>
                Connect · Collaborate · Complete
            </p>

            {/* Loading bar */}
            <div style={{
                width: '180px',
                height: '3px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                overflow: 'hidden',
                animation: 'text-appear 0.5s ease 0.8s both',
            }}>
                <div style={{
                    height: '100%',
                    width: '0%',
                    background: 'linear-gradient(90deg, #f76700, #ffb703)',
                    borderRadius: '999px',
                    animation: 'bar-fill 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
                }} />
            </div>
        </div>
    );
}
