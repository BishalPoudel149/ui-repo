const URL = "ws://localhost:9083";
let currentFrameB64: string | null = null;
let audioContext: AudioContext | null = null;
let mediaRecorder: MediaRecorder | null = null;
let processor: ScriptProcessorNode | null = null;
let webSocket: WebSocket ;
let pcmData: number[] = [];
let interval: number | null = null;
let initialized = false;
let audioInputContext: AudioContext | null = null;
let workletNode: AudioWorkletNode | null = null;

interface User {

}
// Start screen sharing
async function startScreenShare(video: HTMLVideoElement): Promise<MediaStream | null> {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                width: { max: 640 },
                height: { max: 480 },
            },
        });

        video.srcObject = stream;
        await new Promise<void>(resolve => {
            video.onloadedmetadata = () => {
                console.log("Video loaded metadata");
                resolve();
            };
        });

        return stream;
    } catch (err) {
        console.error("Error accessing the screen:", err);
        return null;
    }
}

// Initialize audio context
async function initializeAudioContext(setAudioContext: (context: AudioContext) => void): Promise<void> {
    if (initialized) return;

    try {
        audioInputContext = new (window.AudioContext || 
            (window as any).webkitAudioContext as typeof AudioContext)({
                sampleRate: 24000
            });
            
        await audioInputContext.audioWorklet.addModule("pcm-processor.js");
        workletNode = new AudioWorkletNode(audioInputContext, "pcm-processor");
        workletNode.connect(audioInputContext.destination);
        initialized = true;
        setAudioContext(audioInputContext);
        
        console.log("Audio context initialized successfully");
    } catch (error) {
        console.error("Error initializing audio context:", error);
    }
}

// Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Convert PCM16LE to Float32
function convertPCM16LEToFloat32(pcmData: ArrayBuffer): Float32Array {
    const inputArray = new Int16Array(pcmData);
    const float32Array = new Float32Array(inputArray.length);

    for (let i = 0; i < inputArray.length; i++) {
        float32Array[i] = inputArray[i] / 32768;
    }

    return float32Array;
}

// Process and play audio chunk
async function injestAudioChuckToPlay(base64AudioChunk: string): Promise<void> {
    if (!audioInputContext || !workletNode) {
        console.error("Audio context or worklet node not initialized");
        return;
    }
    
    try {
        if (audioInputContext.state === "suspended") {
            await audioInputContext.resume();
        }
        
        const arrayBuffer = base64ToArrayBuffer(base64AudioChunk);
        const float32Data = convertPCM16LEToFloat32(arrayBuffer);

        workletNode.port.postMessage(float32Data);
    } catch (error) {
        console.error("Error processing audio chunk:", error);
    }
}

// Start audio input
async function startAudioInput(): Promise<void> {
    if (audioContext) {
        audioContext.close();
    }
    
    try {
        audioContext = new AudioContext({
            sampleRate: 16000,
        });

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
            },
        });

        const source = audioContext.createMediaStreamSource(stream);
        processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            
            for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = inputData[i] * 0x7fff;
            }
            
            pcmData.push(...Array.from(pcm16));
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        interval = window.setInterval(recordChunk, 3000);
        console.log("Audio input started");
    } catch (error) {
        console.error("Error starting audio input:", error);
    }
}

// Stop audio input
function stopAudioInput(): void {
    if (processor) {
        processor.disconnect();
        processor = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

    if (interval !== null) {
        clearInterval(interval);
        interval = null;
    }
    
    pcmData = [];
    console.log("Audio input stopped");
}

// Send voice message with screen capture
function sendVoiceMessage(b64PCM: string): void {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
        console.log("WebSocket not initialized or not open");
        return;
    }

    if (!currentFrameB64) {
        console.log("No screen capture available");
        return;
    }


    const payload = {
        sessionId: localStorage.getItem("sessionId"),
        realtime_input: {
            media_chunks: [
                {
                    mime_type: "audio/pcm",
                    data: b64PCM,
                },
                {
                    mime_type: "image/jpeg",
                    data: currentFrameB64,
                },
            ],
        },
    };

    // console.log(`payload sent:`,JSON.stringify(payload));
    webSocket.send(JSON.stringify(payload));
    console.log("Sent voice message with screen capture");
}

// Record and send audio chunk
function recordChunk(): void {
    if (pcmData.length === 0) {
        console.log("No audio data to send");
        return;
    }
    
    const buffer = new ArrayBuffer(pcmData.length * 2);
    const view = new DataView(buffer);
    
    pcmData.forEach((value, index) => {
        view.setInt16(index * 2, value, true);
    });

    const base64 = btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)))
    );

    sendVoiceMessage(base64);
    pcmData = [];
}

// Capture image from video
function captureImage(video: HTMLVideoElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    if (!video.srcObject) {
        console.log("No video stream available");
        return;
    }
    
    if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = 640;
        canvas.height = 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
            const imageData = canvas.toDataURL("image/jpeg").split(",")[1].trim();
            currentFrameB64 = imageData;

        } catch (error) {
            console.error("Error capturing image:", error);
        }
    } else {
        console.log("Video dimensions not available yet");
    }
}

// Handle incoming messages
function receiveMessage(event: MessageEvent, onTextReceived: (text: string) => void): void {
    try {
        const messageData = JSON.parse(event.data);
        
        if (messageData.text) {
            console.log(`Text from Gemini: ${messageData.text}`);
            onTextReceived(`GEMINI: ${messageData.text}`);
        }
        
        if (messageData.audio) {
            injestAudioChuckToPlay(messageData.audio);
        }
    } catch (error) {
        console.error("Error processing received message:", error);
    }
}

// Connect to WebSocket server
async function connect(
    setWebSocket: (ws: WebSocket) => void, 
    onTextReceived: (text: string) => void
): Promise<WebSocket> {
    console.log("Connecting to WebSocket:", URL);

    return new Promise((resolve, reject) => {
        webSocket = new WebSocket(URL);
        
        webSocket.onopen = (event) => {
            console.log("WebSocket connection opened:", event);
            sendInitialSetupMessage(webSocket);
            setWebSocket(webSocket);
            resolve(webSocket);
        };

        webSocket.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
            alert("Connection closed");
            reject(new Error("WebSocket connection closed"));
        };

        webSocket.onerror = (event) => {
            console.log("WebSocket error:", event);
            reject(new Error("WebSocket error"));
        };

        webSocket.onmessage = (event) => receiveMessage(event, onTextReceived);
    });
}

// Send initial setup message
function sendInitialSetupMessage(ws: WebSocket): void {
    console.log("Sending setup message...");

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    // Extract required fields
    const userName = userData?.given_name || "Anonymous";
    const sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);

    const userId = userData?.user_uuid || crypto.randomUUID();
    const setupMessage = {
        setup: {
            generation_config: { response_modalities: ["AUDIO"] },
        },
        userInfo: {
            userId,
            userName,
            sessionId,
        }
    };

    ws.send(JSON.stringify(setupMessage));
    console.log("Setup message sent:", setupMessage);
}

export { 
    startScreenShare, 
    initializeAudioContext, 
    connect, 
    startAudioInput, 
    stopAudioInput, 
    captureImage 
};