import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../style/card.css';

const Card = ({ title, description, image, link }) => {
    const contentRef = useRef(null);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        // Simple entrance animation when the card part of the DOM
        // Note: In existing Carousel implementation, all cards are in DOM.
        // We might want to trigger this based on "active" state if passed, 
        // but simple hover/mount effects are okay for now or we rely on the parent wrapper movement.

        // Let's add a subtle floating effect to the text 
        // that is always active or triggers on hover which is already in CSS.
        // We'll stick to CSS for hover to keep it performant, 
        // but we can add a "reveal" animation here if needed.
    }, []);

    return (
        <div
            className={`card ${isExpanded ? 'expanded' : ''}`}
            onClick={toggleExpand}
        >
            {image ? (
                <img src={image} alt={title} className="card-image" />
            ) : (
                <div className="card-image" style={{
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#333',
                    fontSize: '2rem',
                    fontFamily: 'monospace'
                }}>
                    NO SIGNAL
                </div>
            )}
            <div className="card-overlay">
                <div className="card-content" ref={contentRef}>
                    <h3 className="card-title">{title}</h3>

                    <div className="card-details">
                        <p className="card-description">{description}</p>
                        <div className="card-actions">
                            <a
                                href={link}
                                className="card-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking button
                            >
                                Explore Project
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
