import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

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

        // Reset positions & opacity
        gsap.set(overlay, { opacity: 1 });
        gsap.set([note, x, change], { y: 40, opacity: 0, scale: 0.85 });
        gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(tagline, { opacity: 0, y: 10 });
        
        // Gentle float for background symbols
        const syms = bg.querySelectorAll('.preloader-math-sym, .preloader-bg-shape');
        gsap.set(syms, { opacity: 0, scale: 0.7 });

        const tl = gsap.timeline({
            onComplete: () => {
                // Exit animation
                gsap.to(overlay, {
                    opacity: 0,
                    y: -15,
                    duration: 0.5,
                    ease: 'power3.inOut',
                    onComplete: onComplete,
                });
            },
        });

        // Timeline Sequence
        tl.to(syms, {
            opacity: (i, target) => target.classList.contains('preloader-math-sym') ? 0.18 : 0.08,
            scale: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power2.out'
        })
        .to(note, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 0.2)
        .to(x, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 0.3)
        .to(change, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 0.4)
        .to(tagline, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.6)
        .to(bar, { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }, 0.7)
        .to({}, { duration: 0.4 }); // Hold frame before complete

        // Cleanup
        return () => {
            tl.kill();
        };
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
