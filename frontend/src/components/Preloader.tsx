import React, { useEffect, useRef } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const noteRef = useRef<HTMLSpanElement>(null);
    const xRef = useRef<HTMLSpanElement>(null);
    const changeRef = useRef<HTMLSpanElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        const note = noteRef.current;
        const x = xRef.current;
        const change = changeRef.current;
        const tagline = taglineRef.current;
        const bar = barRef.current;
        const bg = backgroundRef.current;
        const content = contentRef.current;
        if (!overlay || !note || !x || !change || !bar || !bg || !content) return;
        // Simple fallback animation using timeouts & CSS transitions so preloader still shows.
        overlay.style.opacity = '1';
        [note, x, change].forEach((el) => {
            el.style.transform = 'translateY(40px) scale(0.85)';
            el.style.opacity = '0';
            el.style.transition = 'transform 450ms cubic-bezier(.175,.885,.32,1), opacity 450ms ease';
        });
        if (bar) {
            bar.style.transformOrigin = 'left center';
            bar.style.transform = 'scaleX(0)';
            bar.style.transition = 'transform 1000ms ease-in-out';
        }
        if (tagline) {
            tagline.style.opacity = '0';
            tagline.style.transform = 'translateY(10px)';
            tagline.style.transition = 'transform 400ms ease, opacity 400ms ease';
        }

        const syms = Array.from(bg.querySelectorAll('.preloader-math-sym, .preloader-bg-shape')) as HTMLElement[];
        syms.forEach((s) => {
            s.style.opacity = '0';
            s.style.transform = 'scale(0.7)';
            s.style.transition = 'opacity 800ms ease, transform 800ms ease';
        });

        const timers: number[] = [];
        timers.push(window.setTimeout(() => {
            syms.forEach((s, i) => {
                s.style.opacity = s.classList.contains('preloader-math-sym') ? '0.18' : '0.08';
                s.style.transform = 'scale(1)';
                if (i === 0 && note) {
                    note.style.transform = 'translateY(0) scale(1)';
                    note.style.opacity = '1';
                }
            });
        }, 100));

        timers.push(window.setTimeout(() => {
            if (x) { x.style.transform = 'translateY(0) scale(1)'; x.style.opacity = '1'; }
        }, 200));

        timers.push(window.setTimeout(() => {
            if (change) { change.style.transform = 'translateY(0) scale(1)'; change.style.opacity = '1'; }
        }, 300));

        timers.push(window.setTimeout(() => {
            if (tagline) { tagline.style.transform = 'translateY(0)'; tagline.style.opacity = '1'; }
        }, 500));

        timers.push(window.setTimeout(() => {
            if (bar) bar.style.transform = 'scaleX(1)';
        }, 700));

        // Complete after sequence
        timers.push(window.setTimeout(() => {
            if (overlay) {
                overlay.style.transition = 'opacity 500ms ease, transform 500ms ease';
                overlay.style.opacity = '0';
                overlay.style.transform = 'translateY(-15px)';
            }
            // call onComplete after fade
            window.setTimeout(() => onComplete(), 520);
        }, 1900));

        return () => timers.forEach((t) => clearTimeout(t));
    }, [onComplete]);

    return (
        <div ref={overlayRef} className="app-preloader" aria-label="Loading NoteXchangE">
            {/* GPU Accelerated Floating Math & Scientific Background */}
            <div ref={backgroundRef} className="preloader-scientific-bg">
                {/* Mathematical formulas & symbols */}
                <div className="preloader-math-sym sym-1">∫ e^x dx = e^x + C</div>
                <div className="preloader-math-sym sym-2">E = mc²</div>
                <div className="preloader-math-sym sym-3">{"∑_{i=1}^n x_i"}</div>
                <div className="preloader-math-sym sym-4">{"∇ × B = μ₀J"}</div>
                <div className="preloader-math-sym sym-5">π ≈ 3.14159</div>
                <div className="preloader-math-sym sym-6">f(x) = sin(x)</div>
                <div className="preloader-math-sym sym-7">λ = h / p</div>
                <div className="preloader-math-sym sym-8">Δy / Δx</div>
                <div className="preloader-math-sym sym-9">θ + ϕ = 90°</div>

                {/* Elegant geometric blueprint shapes */}
                <div className="preloader-bg-shape shape-circle" />
                <div className="preloader-bg-shape shape-square" />
                <div className="preloader-bg-shape shape-triangle" />
                <div className="preloader-bg-shape shape-grid" />
            </div>

            <div ref={contentRef} className="app-preloader-inner">
                {/* Pulsing micro indicators */}
                <div className="preloader-pulse-dots" aria-hidden>
                    <span className="pulse-dot dot-orange" />
                    <span className="pulse-dot dot-orange-glow" />
                    <span className="pulse-dot dot-orange" />
                </div>

                {/* Brand Logo Header */}
                <div className="preloader-brand">
                    <span ref={noteRef} className="preloader-letter preloader-note">Note</span>
                    <span ref={xRef} className="preloader-letter preloader-x">X</span>
                    <span ref={changeRef} className="preloader-letter preloader-change">changE</span>
                </div>

                {/* Subtitle Tagline */}
                <p ref={taglineRef} className="preloader-tagline">
                    Connect · Collaborate · Complete
                </p>

                {/* Progress bar track */}
                <div className="preloader-bar-track">
                    <div ref={barRef} className="preloader-bar-fill" />
                </div>
            </div>
        </div>
    );
}
