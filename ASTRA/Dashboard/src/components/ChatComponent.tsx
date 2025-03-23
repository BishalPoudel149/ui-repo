import React, { useState } from 'react';
import { AiOutlineSend, AiOutlinePlus, AiOutlineClose, AiOutlineMessage } from 'react-icons/ai';

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
                className="fixed bottom-10 right-10 bg-blue-500 text-white p-6 rounded-full shadow-lg hover:bg-blue-600 transition-transform z-[1000]"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <AiOutlineMessage size={32} />
            </button>
            {isChatOpen && (
                <div className="fixed bottom-16 right-6 w-[550px] h-[800px] bg-white shadow-3xl border border-gray-300 p-6 rounded-xl flex flex-col z-[1000]">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <span className="text-lg font-extrabold text-blue-800">ASTRA</span>
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-500 text-lg">✖</button>
                    </div>
                    {file && (
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 border border-gray-300">
                            <span className="text-gray-700 text-sm">{file.name}</span>
                            <button onClick={removeFile} className="text-gray-500 hover:text-red-500">
                                <AiOutlineClose size={16} />
                            </button>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`p-2 my-1 rounded-md shadow ${msg.isUser ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 mt-auto">
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
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
