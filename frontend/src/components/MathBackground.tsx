import React from 'react';

export default function MathBackground() {
    return (
        <div 
            className="fixed inset-0 pointer-events-none select-none overflow-hidden" 
            style={{ zIndex: -2, opacity: 0.15 }}
        >
            {/* Sigma (Summation) */}
            <div 
                className="absolute text-orange-600 animate-float"
                style={{ 
                    top: '15%', 
                    left: '8%', 
                    width: '60px', 
                    height: '60px', 
                    opacity: 0.25,
                    animationDuration: '8s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6H8l5 6-5 6h10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Pi symbol */}
            <div 
                className="absolute text-blue-600 animate-float"
                style={{ 
                    top: '25%', 
                    right: '12%', 
                    width: '50px', 
                    height: '50px', 
                    opacity: 0.25,
                    animationDuration: '11s',
                    animationDelay: '1s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 6h14M7 6v12M17 6v12M5 6c0 1.5 1 2 2 2M15 18c0-1.5 1-2 2-2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Square Root */}
            <div 
                className="absolute text-purple-600 animate-float"
                style={{ 
                    top: '55%', 
                    left: '5%', 
                    width: '70px', 
                    height: '70px', 
                    opacity: 0.2,
                    animationDuration: '14s',
                    animationDelay: '2s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 12h2l3 8 4-16h9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Triangle Geometry */}
            <div 
                className="absolute text-emerald-600 animate-float"
                style={{ 
                    bottom: '15%', 
                    right: '8%', 
                    width: '80px', 
                    height: '80px', 
                    opacity: 0.25,
                    animationDuration: '10s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19h16V5L4 19z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Compass */}
            <div 
                className="absolute text-orange-600 animate-float"
                style={{ 
                    bottom: '22%', 
                    left: '15%', 
                    width: '65px', 
                    height: '65px', 
                    opacity: 0.2,
                    animationDuration: '12s',
                    animationDelay: '1.5s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4v2M7 18l5-12 5 12M9 14h6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Coordinate Graph */}
            <div 
                className="absolute text-blue-600 animate-float"
                style={{ 
                    top: '45%', 
                    right: '4%', 
                    width: '75px', 
                    height: '75px', 
                    opacity: 0.2,
                    animationDuration: '16s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12h16M12 4v16M4 16c2-4 4-8 8-8s6 4 8 8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Infinity */}
            <div 
                className="absolute text-pink-600 animate-float"
                style={{ 
                    top: '75%', 
                    right: '18%', 
                    width: '55px', 
                    height: '55px', 
                    opacity: 0.18,
                    animationDuration: '9s',
                    animationDelay: '0.5s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 9c-2.3 0-4 1.7-4 4s1.7 4 4 4c2.1 0 3.7-2.6 5-5 1.3-2.4 2.9-5 5-5 2.3 0 4 1.7 4 4s-1.7 4-4 4c-2.1 0-3.7-2.6-5-5-1.3-2.4-2.9-5-5-5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Grad Cap */}
            <div 
                className="absolute text-purple-600 animate-float"
                style={{ 
                    top: '8%', 
                    right: '25%', 
                    width: '60px', 
                    height: '60px', 
                    opacity: 0.2,
                    animationDuration: '13s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3L2 8l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 10v4c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 9v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Integral */}
            <div 
                className="absolute text-orange-500 animate-float"
                style={{ 
                    top: '68%', 
                    left: '12%', 
                    width: '55px', 
                    height: '55px', 
                    opacity: 0.22,
                    animationDuration: '11s',
                    animationDelay: '3s'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.5 4.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v15c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
}
