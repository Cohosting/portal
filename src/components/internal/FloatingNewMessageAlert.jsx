import React from 'react';

const FloatingNewMessageAlert = ({
    messagesEndRef,
    showButton = true,
    onClick
}) => {

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClick = () => {
        scrollToBottom();
        onClick();
    }
    return (
        <>
            {showButton && (
                <div className='flex animate-bounce items-center justify-center'>
                    <button
                        onClick={handleClick}
                        className="z-[9999999] bg-gray-800 text-white px-3 py-2 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-gray-600 text-sm animate-float"
                    >
                        <span className="mr-1">New Message!</span>
                        <span className="">↓</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default FloatingNewMessageAlert;
