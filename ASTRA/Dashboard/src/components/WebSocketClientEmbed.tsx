import React, { useState } from "react";

const WebSocketClientEmbed = () => {
    const [showIframe, setShowIframe] = useState(false);

    const handleClick = () => {
        setShowIframe(true); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl text-center">
                <h1 className="text-3xl font-bold mb-4">Financial Decision Maker</h1>
                <p className="text-gray-600 mb-6">Click below to start screen sharing.</p>

                {!showIframe && (
                    <button
                        onClick={handleClick}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Start Screen Sharing
                    </button>
                )}

                {showIframe && (
                    <iframe
                        src="/client.html" // Assuming it's inside `public/`
                        width="100%"
                        height="600px"
                        className="border rounded-lg mt-6"
                        title="WebSocket Client"
                    ></iframe>
                )}
            </div>
            <footer className="mt-8 text-gray-500">
                &copy; 2023 Financial Decision Maker. All rights reserved.
            </footer>
        </div>
    );
};

export default WebSocketClientEmbed;