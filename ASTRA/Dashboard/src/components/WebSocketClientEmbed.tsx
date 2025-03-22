import React, { useEffect, useRef, useState } from 'react';
import { Share2, Mic, Clock } from 'lucide-react';
import { Monitor } from 'lucide-react';
import { initializeAudioContext, startScreenShare, connect, startAudioInput, captureImage } from '../utils/screenshare';


function WebSocketClientEmbed() {
  const [sessions] = useState([
    { id: 1, date: 'Mar 19, 2025', active: true },
    { id: 2, date: 'Mar 18, 2025', active: false },
    { id: 3, date: 'Mar 17, 2025', active: false },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState<any>();
  const [webSocket, setWebSocket] = useState<any>();
  const [audioContext, setAudioContext] = useState<any>();
  const [context, setContext] = useState<any>();
  const handleScreenShare = async () => {
    setIsSharing(true);
    if (videoRef.current) {
      try{
        const videoStream = await startScreenShare(videoRef.current);
        setStream(videoStream);
        await initializeAudioContext(setAudioContext);
        connect(setWebSocket);
      }
      catch(err){
        console.log(err)
        setIsSharing(false);
      }
    }
  };

  const handleMic = () => {
    if(audioContext){
      startAudioInput();
    }
  };

  useEffect(() => {
    if(!stream) return;
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      setIsSharing(false);
      setStream(undefined);
  });
  }
    ,[stream]);

  useEffect(() => {
    window.addEventListener("load", () => {
      setContext(canvasRef.current?.getContext("2d"));
      setInterval(() => captureImage(videoRef.current as HTMLVideoElement, canvasRef.current as HTMLCanvasElement, context), 3000);
  });
  }, [context,canvasRef,videoRef]);

  return (
    <div className="min-h-screen bg-gray-50 mt-6" >

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
          <div className="bg-white rounded-lg p-4 mb-4 min-h-[400px] flex items-center justify-center text-gray-500">
            <video ref={videoRef}></video>
            <canvas ref = {canvasRef}></canvas>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex gap-4">
            { !isSharing ?
              <button className="flex items-center gap-2 bg-[#4169E1] text-white px-6 py-2 rounded-lg hover:bg-[#3158d0] transition-colors" onClick={handleScreenShare}>
                <Monitor size={20} />
                Share Screen
              </button>
              :
              <button className="flex items-center gap-2 bg-[#4169E1] text-white px-6 py-2 rounded-lg hover:bg-[#3158d0] transition-colors">
                <Monitor size={20} />
                Sharing
              </button>
            }

              <button className="flex items-center justify-center bg-[#4169E1] text-white p-2 rounded-full hover:bg-[#3158d0] transition-colors" onClick={handleMic}>
                <Mic size={20} />
              </button>
            </div>

            {/* AI Response Box */}
            <div className="bg-white rounded-lg p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                G
              </div>
              <p className="text-gray-700">
                GEMINI: I can see a chart showing sales data for 2024...
              </p>
            </div>

            {/* Session Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Session ID: 8f7d6e5c-4b3a-2c1d-0e9f-8g7h6i5j4k3l</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Duration: 00:05:23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebSocketClientEmbed; 