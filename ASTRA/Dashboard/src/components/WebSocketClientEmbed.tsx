import React, { useEffect, useRef, useState } from 'react';
import { Share2, Mic, Clock, Monitor } from 'lucide-react';
import { initializeAudioContext, startScreenShare, connect, startAudioInput, stopAudioInput, captureImage } from '../utils/screenshare';

function WebSocketClientEmbed() {
  const [sessions] = useState([
    { id: 1, date: 'Mar 19, 2025', active: true },
    { id: 2, date: 'Mar 18, 2025', active: false },
    { id: 3, date: 'Mar 17, 2025', active: false },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [sessionDuration, setSessionDuration] = useState<string>("00:00:00");
  const [sessionId] = useState<string>(crypto.randomUUID());
  const [startTime, setStartTime] = useState<number | null>(null);

  // Handle screen sharing
  const handleScreenShare = async () => {
    if (isSharing) return;
    
    if (videoRef.current) {
      try {
        setIsSharing(true);
        const videoStream = await startScreenShare(videoRef.current);
        setStream(videoStream as MediaStream);
        
        // Initialize audio context and WebSocket connection
        await initializeAudioContext(setAudioContext);
        const ws = await connect(setWebSocket, (text: string) => {
          setResponseText(text);
        });
        
        // Start session timer
        setStartTime(Date.now());
        
        return ws;
      } catch (err) {
        console.error("Error in screen sharing:", err);
        setIsSharing(false);
        return null;
      }
    }
  };

  // Handle microphone toggle
  const handleMic = () => {
    if (!audioContext || !isSharing) return;
    
    if (isMicActive) {
      stopAudioInput();
      setIsMicActive(false);
    } else {
      startAudioInput();
      setIsMicActive(true);
    }
  };

  // Handle screen share ending
  useEffect(() => {
    if (!stream) return;
    
    const tracks = stream.getVideoTracks();
    if (tracks.length > 0) {
      tracks[0].addEventListener('ended', () => {
        setIsSharing(false);
        setStream(null);
        setIsMicActive(false);
        stopAudioInput();
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          webSocket.close();
        }
        setStartTime(null);
      });
    }
    
    return () => {
      if (tracks.length > 0) {
        tracks[0].removeEventListener('ended', () => {});
      }
    };
  }, [stream, webSocket]);

  // Set up canvas and periodic image capture
  useEffect(() => {
    if (!isSharing || !videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set up interval for capturing images
    setInterval(() => {
        console.log("Capturing image...");
      if (videoRef.current && canvas && context) {
        captureImage(videoRef.current, canvas, context);
      }
    }, 3000);
    
    // return () => clearInterval(captureInterval);
  }, [isSharing,videoRef, canvasRef]);

  // Update session duration timer
  useEffect(() => {
    if (!startTime) return;
    
    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const hours = Math.floor(elapsedTime / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0');
      setSessionDuration(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime]);

  return (
    <div className="min-h-screen bg-gray-50 mt-6">
      <div className="flex p-4 gap-4">
        {/* Left Sidebar */}
        <div className="w-64 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Session History</h2>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  session.active
                    ? 'bg-[#4169E1] text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <span>Session {session.id} - {session.date}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-[#4169E1] text-white py-3 rounded-lg hover:bg-[#3158d0] transition-colors">
            New Session
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-4 mb-4 min-h-[400px] flex items-center justify-center text-gray-500 relative">
            {!isSharing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Click "Share Screen" to start</p>
              </div>
            )}
            <video ref={videoRef} className="w-full h-full object-contain" style={{ display: isSharing ? 'block' : 'none' }} autoPlay></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {!isSharing ? (
                <button 
                  className="flex items-center gap-2 bg-[#4169E1] text-white px-6 py-2 rounded-lg hover:bg-[#3158d0] transition-colors" 
                  onClick={handleScreenShare}
                >
                  <Monitor size={20} />
                  Share Screen
                </button>
              ) : (
                <button 
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg cursor-default"
                >
                  <Monitor size={20} />
                  Sharing
                </button>
              )}

              <button 
                className={`flex items-center justify-center ${isMicActive ? 'bg-red-500' : 'bg-[#4169E1]'} text-white p-2 rounded-full hover:${isMicActive ? 'bg-red-600' : 'bg-[#3158d0]'} transition-colors ${!isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleMic}
                disabled={!isSharing}
              >
                <Mic size={20} />
              </button>
            </div>

            {/* AI Response Box */}
            <div className="bg-white rounded-lg p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                G
              </div>
              <p className="text-gray-700">
                {responseText || "GEMINI: Waiting for input..."}
              </p>
            </div>

            {/* Session Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Session ID: {sessionId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Duration: {sessionDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebSocketClientEmbed;