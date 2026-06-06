import React, { useEffect, useRef } from 'react';

const FORMULA_SYMBOLS = ['∑', 'π', '√', '∫', '∞', 'θ', 'Δ', 'λ', 'α', 'β', '÷', '×', '±', '≈', '∂', '∇'];

const SVG_SHAPES = [
    { top: '15%', left: '8%', color: '#ff6a00', size: 60, delay: 0, path: 'M18 6H8l5 6-5 6h10' },
    { top: '25%', right: '12%', color: '#3b82f6', size: 50, delay: 1, path: 'M5 6h14M7 6v12M17 6v12' },
    { top: '55%', left: '5%', color: '#a855f7', size: 70, delay: 2, path: 'M3 12h2l3 8 4-16h9' },
    { bottom: '15%', right: '8%', color: '#10b981', size: 80, delay: 0, path: 'M4 19h16V5L4 19z' },
    { bottom: '22%', left: '15%', color: '#ff6a00', size: 65, delay: 1.5, path: 'M12 4v2M7 18l5-12 5 12M9 14h6' },
    { top: '45%', right: '4%', color: '#3b82f6', size: 75, delay: 0, path: 'M4 12h16M12 4v16' },
    { top: '75%', right: '18%', color: '#ec4899', size: 55, delay: 0.5, path: 'M7 9c-2.3 0-4 1.7-4 4s1.7 4 4 4' },
    { top: '8%', right: '25%', color: '#a855f7', size: 60, delay: 0, path: 'M12 3L2 8l10 5 10-5-10-5z' },
];

export default function MathBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Animations removed (previously used GSAP). Keep static decorative background.
    useEffect(() => {
        // No-op: background shapes remain static without the animation library.
    }, []);

    return (
        <div ref={containerRef} id="three-bg" className="math-bg-container" aria-hidden>
            {FORMULA_SYMBOLS.map((sym, i) => (
                <span
                    key={`f-${sym}-${i}`}
                    className="math-formula-float"
                    style={{
                        top: `${8 + (i * 5.5) % 82}%`,
                        left: `${3 + (i * 7.3) % 90}%`,
                        fontSize: `${1.2 + (i % 4) * 0.35}rem`,
                        color: i % 3 === 0 ? '#f76700' : i % 3 === 1 ? '#3b82f6' : '#a855f7',
                        animationDelay: `${i * 0.4}s`,
                    }}
                >
                    {sym}
                </span>
            ))}

            {SVG_SHAPES.map((shape, i) => (
                <div
                    key={`shape-${i}`}
                    className={`math-shape ${i % 3 === 0 ? 'slow' : i % 3 === 1 ? 'medium' : 'fast'}`}
                    style={{
                        top: shape.top,
                        left: shape.left,
                        right: shape.right,
                        bottom: shape.bottom,
                        width: shape.size,
                        height: shape.size,
                        color: shape.color,
                        animationDelay: `${shape.delay}s`,
                    } as React.CSSProperties}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d={shape.path} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            ))}
        </div>
    );
}
