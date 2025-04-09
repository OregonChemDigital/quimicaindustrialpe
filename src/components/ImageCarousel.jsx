import React, { useState, useEffect } from 'react';
import '../styles/ImageCarousel.css';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    console.log('ImageCarousel received images:', images);

    useEffect(() => {
        let interval;
        if (isAutoPlaying && images && images.length > 1) {
            console.log('Starting auto-play');
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);
        }
        return () => {
            console.log('Clearing interval');
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
        console.log('No images to display');
        return null;
    }

    console.log('Current index:', currentIndex);

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
                        &lt;
                    </button>
                    <button 
                        className="carousel-button next" 
                        onClick={goToNext}
                        aria-label="Next image"
                    >
                        &gt;
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