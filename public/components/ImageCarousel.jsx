import React, { useState, useEffect } from 'react';
// CSS imported via main.css
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval;
        if (isAutoPlaying && images && images.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isAutoPlaying, images]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="carousel-container">
            <div className="carousel">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="carousel-image"
                        />
                    </div>
                ))}
            </div>
            {images.length > 1 && (
                <>
                    <button 
                        className="carousel-button prev" 
                        onClick={goToPrevious}
                        aria-label="Previous image"
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        className="carousel-button next" 
                        onClick={goToNext}
                        aria-label="Next image"
                    >
                        <FaChevronRight />
                    </button>
                    <div className="carousel-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => {
                                    setIsAutoPlaying(false);
                                    setCurrentIndex(index);
                                }}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel; 