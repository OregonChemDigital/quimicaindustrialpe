import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';
import FavoritesTooltip from './FavoritesTooltip';

const CSSSystemTest = () => {
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="test-page">
            <h1 className="test-page-title">
                CSS System Test - New Components
            </h1>
            
            <div className="test-grid">
                {/* Loading Spinner Test */}
                <div className="test-card">
                    <h2 className="test-card-title">Loading Spinner</h2>
                    <div className="test-card-content">
                        <LoadingSpinner size="small" />
                        <LoadingSpinner size="medium" />
                        <LoadingSpinner size="large" />
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowLoading(true)}
                        >
                            Show Fullscreen Loading
                        </button>
                    </div>
                </div>

                {/* Success Message Test */}
                <div className="test-card">
                    <h2 className="test-card-title">Success Message</h2>
                    <div className="test-card-content">
                        <button 
                            className="btn btn-success"
                            onClick={() => setShowSuccess(true)}
                        >
                            Show Success Message
                        </button>
                        <button 
                            className="btn btn-error"
                            onClick={() => setShowSuccess(true)}
                        >
                            Show Error Message
                        </button>
                    </div>
                </div>

                {/* Tooltip Test */}
                <div className="test-card">
                    <h2 className="test-card-title">Favorites Tooltip</h2>
                    <div className="test-card-content">
                        <button 
                            className="btn btn-outline"
                            onClick={() => setShowTooltip(true)}
                        >
                            Show Tooltip
                        </button>
                    </div>
                </div>

                {/* Button System Test */}
                <div className="test-card">
                    <h2 className="test-card-title">Button System</h2>
                    <div className="test-card-content">
                        <button className="btn btn-primary">Primary Button</button>
                        <button className="btn btn-secondary">Secondary Button</button>
                        <button className="btn btn-ghost">Ghost Button</button>
                        <button className="btn btn-outline">Outline Button</button>
                        <button className="btn btn-danger">Danger Button</button>
                        <button className="btn btn-success">Success Button</button>
                    </div>
                </div>

                {/* Button Sizes Test */}
                <div className="test-card">
                    <h2 className="test-card-title">Button Sizes</h2>
                    <div className="test-card-content">
                        <button className="btn btn-primary btn-sm">Small</button>
                        <button className="btn btn-primary">Medium</button>
                        <button className="btn btn-primary btn-lg">Large</button>
                        <button className="btn btn-primary btn-xl">Extra Large</button>
                    </div>
                </div>

                {/* Icon Buttons Test */}
                <div className="test-card">
                    <h2 className="test-card-title">Icon Buttons</h2>
                    <div className="test-card-content">
                        <button className="btn btn-primary btn-icon btn-sm">+</button>
                        <button className="btn btn-primary btn-icon">+</button>
                        <button className="btn btn-primary btn-icon btn-lg">+</button>
                        <button className="btn btn-primary btn-icon btn-xl">+</button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Loading Overlay */}
            {showLoading && (
                <LoadingSpinner fullScreen={true} />
            )}

            {/* Success Message */}
            {showSuccess && (
                <SuccessMessage 
                    message="This is a test success message!" 
                    onClose={() => setShowSuccess(false)}
                    variant="success"
                />
            )}

            {/* Favorites Tooltip */}
            {showTooltip && (
                <FavoritesTooltip onClose={() => setShowTooltip(false)} />
            )}
        </div>
    );
};

export default CSSSystemTest;
