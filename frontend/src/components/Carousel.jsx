import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Observer } from "gsap/observer";
import '../style/carousel.css';

gsap.registerPlugin(Observer);

const Carousel = ({ children }) => {
    const sectionsRef = useRef([]);
    const wrapperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Convert children to array to safely access length
    const childrenArray = React.Children.toArray(children);
    const totalSlides = childrenArray.length;

    useEffect(() => {
        const observer = Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            wheelSpeed: -1,
            onDown: () => !isAnimating && gotoSlide(currentIndex - 1),
            onUp: () => !isAnimating && gotoSlide(currentIndex + 1),
            tolerance: 10,
            preventDefault: true
        });

        return () => {
            observer.kill();
        };
    }, [currentIndex, isAnimating]);

    const gotoSlide = (index) => {
        if (isAnimating) return;
        if (index < 0 || index >= totalSlides) return;

        setIsAnimating(true);
        setCurrentIndex(index);

        const currentSlide = sectionsRef.current[currentIndex]; // The slide leaving
        const nextSlide = sectionsRef.current[index]; // The slide entering

        // Basic timeline for slide transition
        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
        });

        // Use a simple slide effect
        // Current slide slides out to left (if going next) or right (if going prev)
        const direction = index > currentIndex ? 1 : -1;

        // Ensure next slide is positioned correctly before animating in
        // We can just use transforms.

        // Actually, for a clean full-screen slider, let's just animate the wrapper
        // or toggle visibility/z-index with some generic animations.
        // But the "wrapper translation" is easiest for "carousel" feel.

        gsap.to(wrapperRef.current, {
            xPercent: -100 * index,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => setIsAnimating(false)
        });
    };

    return (
        <div className="carousel-container">
            <div className="carousel-track" ref={wrapperRef}>
                {React.Children.map(children, (child, index) => (
                    <div
                        className="carousel-item"
                        key={index}
                        ref={el => sectionsRef.current[index] = el}
                    >
                        {child}
                    </div>
                ))}
            </div>
            {/* Optional Navigation Dots */}
            <div className="carousel-nav-dots">
                {childrenArray.map((_, idx) => (
                    <button
                        key={idx}
                        className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => gotoSlide(idx)}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="carousel-arrow prev"
                onClick={() => gotoSlide(currentIndex - 1)}
                disabled={currentIndex === 0}
            >
                &lt;
            </button>
            <button
                className="carousel-arrow next"
                onClick={() => gotoSlide(currentIndex + 1)}
                disabled={currentIndex === totalSlides - 1}
            >
                &gt;
            </button>
        </div>
    );
};

export default Carousel;
