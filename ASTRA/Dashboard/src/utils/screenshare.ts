const URL = "ws://localhost:9083";
let context;
let stream: MediaStream;
let currentFrameB64: any;
let audioContext = null;
let mediaRecorder = null;
let processor = null;
let webSocket:WebSocket;
let pcmData:any = [];
let interval = null;
let initialized = false;
let audioInputContext:AudioContext;
let workletNode: AudioWorkletNode;

async function startScreenShare(video: HTMLVideoElement) {

    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                width: { max: 640 },
                height: { max: 480 },
            },
        });

        video.srcObject = stream;
        await new Promise<void>(resolve => {
            video.onloadedmetadata = () => {
                console.log("video loaded metadata");
                resolve();
            }
        });

        return video.srcObject;

    } catch (err) {
        console.error("Error accessing the screen: ", err);
    }
}

async function initializeAudioContext(setAudioContext: any) {
    if (initialized) return;

    audioInputContext = new (window.AudioContext ||
        (window as any).webkitAudioContext as typeof AudioContext)({
            sampleRate: 24000
        });
    await audioInputContext.audioWorklet.addModule("pcm-processor.js");
    workletNode = new AudioWorkletNode(audioInputContext, "pcm-processor");
    workletNode.connect(audioInputContext.destination);
    initialized = true;
    setAudioContext(audioInputContext);
}

function base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function convertPCM16LEToFloat32(pcmData: any) {
    const inputArray = new Int16Array(pcmData);
    const float32Array = new Float32Array(inputArray.length);

    for (let i = 0; i < inputArray.length; i++) {
        float32Array[i] = inputArray[i] / 32768;
    }

    return float32Array;
}

async function injestAudioChuckToPlay(base64AudioChunk: any) {
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

async function startAudioInput() {
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
        pcmData.push(...pcm16);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    interval = setInterval(recordChunk, 3000);
}

function sendVoiceMessage(b64PCM: any) {
    if (webSocket == null) {
        console.log("websocket not initialized");
        return;
    }

    let payload = {
        realtime_input: {
            media_chunks: [{
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

    webSocket.send(JSON.stringify(payload));
    console.log("sent: ", payload);
}

function recordChunk() {
    const buffer = new ArrayBuffer(pcmData.length * 2);
    const view = new DataView(buffer);
    pcmData.forEach((value: any, index: number) => {
        view.setInt16(index * 2, value, true);
    });

    const base64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(buffer) as any)
    );

    sendVoiceMessage(base64);
    pcmData = [];
}

function captureImage(video: HTMLVideoElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    if (stream && video.videoWidth > 0 && video.videoHeight > 0 && context) {
        canvas.width = 640;
        canvas.height = 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg").split(",")[1].trim();
        currentFrameB64 = imageData;
    }
    else {
        console.log("no stream or video metadata not loaded");
    }
}


function receiveMessage(event: any) {
    const messageData = JSON.parse(event.data);

    if (messageData.text) {
        console.log(`test form geimini ${messageData.text}`)
        //displayMessage("GEMINI: " + response.text);
    }
    if (messageData.audioData) {
        injestAudioChuckToPlay(messageData.audioData);
    }
}

function connect(setWebSocket: any) {
    console.log("connecting: ", URL);

    webSocket = new WebSocket(URL);
    setWebSocket(webSocket);

    webSocket.onopen = (event) => {
        console.log("websocket open: ", event);
        sendInitialSetupMessage(webSocket);
    };

    webSocket.onclose = (event) => {
        console.log("websocket closed: ", event);
        alert("Connection closed");
    };

    webSocket.onerror = (event) => {
        console.log("websocket error: ", event);
    };

    webSocket.onmessage = receiveMessage;

    return webSocket;
}


function sendInitialSetupMessage(webSocket: WebSocket) {
    console.log("Sending setup message...");

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    // Extract required fields from local storage
    const username = userData?.given_name || "Anonymous";
    const sessionId = crypto.randomUUID(); // session id is dependent on new shared screen
    const userId = userData?.user_uuid || crypto.randomUUID();

    const setup_client_message = {
        setup: {
            generation_config: { response_modalities: ["AUDIO"] },
        },
        userInfo: {
            userId,
            username,
            sessionId,
        }
    };

    webSocket.send(JSON.stringify(setup_client_message));

    console.log("Setup message sent:", setup_client_message);
}

export { startScreenShare, initializeAudioContext, connect,startAudioInput, captureImage};
