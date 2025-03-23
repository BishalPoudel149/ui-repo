import React, { useState } from 'react';
import { AiOutlineSend, AiOutlinePlus, AiOutlineClose, AiOutlineSketch } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';

export default function ChatComponent() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            if (selectedFile instanceof File) {
                setFile(selectedFile);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        const userMessage = { text: message, isUser: true };
        setChatMessages(prev => [...prev, userMessage]);
        setMessage("");
        try {
            const formData = new FormData();
            formData.append("query", userMessage.text);
            if (file) {
                formData.append("file", file);
            }
            const response = await fetch("https://pdf-chat.cfapps.us10-001.hana.ondemand.com/chat", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            const botMessage = { text: data?.response || "No response received", isUser: false };
            setChatMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <button
                className="fixed bottom-10 right-10 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <div className="relative flex items-center">
                    <AiOutlineSketch size={38} />
                    <FaStar size={10} className="absolute top-[-5px] right-[-5px] text-yellow-400" />
                </div>
            </button>
            {isChatOpen && (
                <div className="fixed bottom-16 right-6 w-[550px] h-[800px] bg-white shadow-3xl border border-gray-300 pb-6 rounded-xl flex flex-col z-[1000] border-fuchsia-400">
                    <div className="flex justify-between items-center mb-20 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-t-xl shadow-md animate-fade-in ">
                        <span className="text-2xl font-bold text-white tracking-wide drop-shadow-lg animate-[bounce_0.5s_ease-in-out_5]">ASTRA</span>
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-500 text-lg">✖</button>
                    </div>
                    {file && (
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 border border-gray-300">
                            <span className="text-gray-700 text-sm">{file.name}</span>
                            <button onClick={removeFile} className="text-white hover:text-red-500">
                                <AiOutlineClose size={20} />
                            </button>
                        </div>
                    )}
                    <div className="overflow-y-auto rounded-md text-gray-600 font-medium text-left">
                        {chatMessages.length === 0 ? (
                            <div className="space-y-4 text-center p-16">
                                <p className="text-lg font-semibold text-blue-700">
                                    {[
                                        "Did you know? Exchange rates fluctuate due to inflation, interest rates, and global trade balance!",
                                        "Higher interest rates often lead to a stronger currency. Ask me how!",
                                        "Central banks adjust interest rates to control inflation and stabilize the economy."
                                    ][Math.floor(Math.random() * 3)]}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-green-100 p-4 rounded-lg shadow-md text-green-400 font-semibold flex flex-col items-center mr-4">
                                        <span>Forward Interest Rate</span>
                                        <span className="text-2xl">5.4%</span>
                                        <span className="text-green-600">⬆ Up</span>
                                    </div>
                                    <div className="bg-red-100 p-4 rounded-lg shadow-md text-red-400 font-semibold flex flex-col items-center">
                                        <span>Forward Exchange Rate</span>
                                        <span className="text-2xl">$1 = ₹84.5</span>
                                        <span className="text-red-600">⬇ Down</span>
                                    </div>
                                </div>
                            </div>
                        ) : null}</div>
                    <div className="flex-1 overflow-y-auto p-2 rounded-md">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 my-1 rounded-lg shadow-lg text-sm w-fit max-w-[75%] ${msg.isUser ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}
                                style={{ wordBreak: 'break-word' }}
                            >
                                {msg.text}
                            </div>
                        ))}

                    </div>
                    <div className="flex items-center gap-3 mt-auto pr-6 pl-6">
                        <button
                            className="bg-gray-300 text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-400"
                            onClick={() => document.getElementById('fileUpload')?.click()}
                        >
                            <AiOutlinePlus size={24} />
                        </button>
                        <input
                            id="fileUpload"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 border-fuchsia-400"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600"
                            onClick={sendMessage}
                        >
                            <AiOutlineSend size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
