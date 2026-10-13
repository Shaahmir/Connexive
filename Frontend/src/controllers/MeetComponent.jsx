import {useRef, useState } from "react";

export function useController()  {

    // ---------------- USE STATE ---------------- 

    const [username, setUsername] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [isUsername, setIsUsername] = useState(true);

    const [isVideo, setIsVideo] = useState(true);
    const [isAudio, setIsAudio] = useState(true);
    const [isScreen, setIsScreen] = useState(true);

    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);

    const [videos, setVideos] = useState([]);

    const [showChat, setShowChat] = useState(false);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageCount, setMessageCount] = useState(0);

    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // ---------------- USE REFS ---------------- 

    const localVideoRef = useRef(null);
    const videoRef = useRef([]);
    const socketRef = useRef(null);
    const socketIdRef = useRef(null);
    const showChatRef = useRef(false);

    // ---------------- VARIABLES ---------------- 
    const connectionsRef = useRef({});
    const connections = connectionsRef.current;

    const RTCPeerConfig = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    }

    // ---------------- GETTING PERMISSIONS ---------------- 
    
    const getPermissions = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            window.localStream = mediaStream;

            const hasVideo = mediaStream.getVideoTracks().length > 0;
            const hasAudio = mediaStream.getAudioTracks().length > 0;

            setIsVideo(hasVideo);
            setIsAudio(hasAudio);

            setIsScreen(!!navigator.mediaDevices.getDisplayMedia);
            
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }
            
        } catch (e) {
            console.log(e);
            setIsVideo(false);
            setIsAudio(false);
        }
    }

    // ---------------- USER JOIN FUNCTION ---------------- 

    const userJoin = (id, clients) => {

        clients.forEach(async (socketListId) => {
            
            if (socketListId === socketIdRef.current) return;
            if (connections[socketListId]) return;

            connections[socketListId] = new RTCPeerConnection(RTCPeerConfig);
            
            connections[socketListId].onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit("signal", socketListId, JSON.stringify({ice: event.candidate}));
                }  
            };

            connections[socketListId].ontrack = (event) => {

                const remoteStream = event.streams[0];

                remoteStream.getVideoTracks().forEach(track => {
                    track.onmute = () => setVideos(prev => [...prev]);
                    track.onunmute = () => setVideos(prev => [...prev]);
                })

                setVideos((prev) => {

                    const exisiting = prev.find(v => v.socketId === socketListId);

                    if (exisiting) {
                        const updated = prev.map((video) => 
                            video.socketId == socketListId ? {...video, stream: remoteStream} : video
                        )
                        videoRef.current = updated;
                        return updated;
                    }

                    const newVideo = {
                        socketId: socketListId,
                        stream: remoteStream,
                        autoPlay: true,
                        playsInline: true
                    };

                    const updated = [...prev, newVideo];
                    videoRef.current = updated;
                    return updated;
                });
            }

            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                    connections[socketListId].addTrack(track, window.localStream);
                });       
            }

            if (socketListId === id) {
                try {
                    const description = await connections[socketListId].createOffer();
                    await connections[socketListId].setLocalDescription(description);

                    await socketRef.current.emit(
                        "signal", 
                        socketListId, 
                        JSON.stringify({sdp: connections[socketListId].localDescription})
                    )
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }

    // ---------------- USER LEFT FUNCTION ---------------- 

    const userLeft = (id) => {
        if (connections[id]) {

            try {
                connections[id].close();
            } catch (e) {
                console.log(e);
            }

            delete connections[id];
        }
        setVideos((videos) => videos.filter(video => video.socketId != id));
    }

    // ---------------- SERVER REPOSNSE FUNCTION ---------------- 

    const serverResponse = async (fromId, message) => {

        const signal = JSON.parse(message);

        if (fromId === socketIdRef.current) return;

        if (!connections[fromId]) {
            
            connections[fromId] = new RTCPeerConnection(RTCPeerConfig);
            
            connections[fromId].onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit("signal", fromId, JSON.stringify({ice: event.candidate}));
                }  
            };

            connections[fromId].ontrack = (event) => {

                const remoteStream = event.streams[0];

                remoteStream.getVideoTracks().forEach(track => {
                    track.onmute = () => setVideos(prev => [...prev]);
                    track.onunmute = () => setVideos(prev => [...prev]);
                })

                setVideos((prev) => {

                    const exisiting = prev.find(v => v.socketId === fromId);

                    if (exisiting) {
                        const updated = prev.map((video) => 
                            video.socketId == fromId ? {...video, stream: remoteStream} : video
                        )
                        videoRef.current = updated;
                        return updated;
                    }

                    const newVideo = {
                        socketId: fromId,
                        stream: remoteStream,
                        autoPlay: true,
                        playsInline: true
                    };

                    const updated = [...prev, newVideo];
                    videoRef.current = updated;
                    return updated;
                });
            }

            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                    connections[fromId].addTrack(track, window.localStream);
                });       
            }
        }

        try {
            if (signal.sdp) {
                
                await connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp));

                if (signal.sdp.type == "offer") {
                    const description = await connections[fromId].createAnswer();
                    await connections[fromId].setLocalDescription(description);
                    await socketRef.current.emit(
                        "signal", 
                        fromId,
                        JSON.stringify({"sdp": connections[fromId].localDescription})
                    );
                }
            }

            if (signal.ice) {
                await connections[fromId].addIceCandidate( new RTCIceCandidate(signal.ice) );
            }

        } catch (e) {
            console.log("Signal Error: ", e);
        }
    }

    // ---------------- REPLACE TRACKS ON ALL PEERS ----------------

    const replaceTracks = async (stream) => {

        for (let id in connections) {

            if (id === socketIdRef.current) continue;
            if (!connections[id]) continue;

            const senders = connections[id].getSenders();

            const videoTrack = stream.getVideoTracks()[0] || null;
            const audioTrack = stream.getAudioTracks()[0] || null;

            let videoReplaced = false;
            let audioReplaced = false;

            senders.forEach(sender => {

                if (sender.track && sender.track.kind === "video" && videoTrack) {
                    sender.replaceTrack(videoTrack).catch((e) => {console.log(e)});
                    videoReplaced = true;

                } else if (sender.track && sender.track.kind === "audio" && audioTrack) {
                    sender.replaceTrack(audioTrack).catch((e) => {console.log(e)});
                    audioReplaced = true;
                }
            })

            if (!videoReplaced || !audioReplaced) {

                senders.forEach(sender => {
                    if (sender.track) {
                        try {
                            connections[id].removeTrack(sender);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                })

                stream.getTracks().forEach(track => {
                    connections[id].addTrack(track, stream);
                })
            }

            try {
                const description = await connections[id].createOffer();
                await connections[id].setLocalDescription(description);
                socketRef.current.emit('signal', id, JSON.stringify({sdp: connections[id].localDescription}))
            } catch (e) {
                console.log(e);
            }
        }
    }

    // ---------------- USER MEDIA SOCKET FUNCTION ---------------- 

    const userMediaSocket = async (stream) => {
    
        try {
            if (window.localStream){
                window.localStream.getTracks().forEach(track => {
                    if (!stream.getTracks().includes(track)) {
                        track.stop();
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    
        window.localStream = stream;

        if (localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }

        await replaceTracks(stream);
            
        stream.getTracks().forEach((track => {
            track.onended = () => {
            if (track.kind === "video") { setVideo(false) }
            if (track.kind === "audio") { setAudio(false) }
            }
        }));
    }

    // ---------------- GET USER MEDIA FUNCTION ---------------- 

    const getUserMedia = async () => {

        if (window.localStream){

            const videoTracks = window.localStream.getVideoTracks();
            const audioTracks = window.localStream.getAudioTracks();

            const hasLiveVideo = videoTracks.some(track => track.readyState == "live");
            const hasLiveAudio = audioTracks.some(track => track.readyState == "live");

            if (hasLiveVideo || hasLiveAudio) {
                
                videoTracks.forEach(track => {
                    track.enabled = !!video;
                })

                audioTracks.forEach(track => {
                    track.enabled = !!audio;
                })

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = window.localStream;
                }

                return;
            }
        }
        
        if ((video && isVideo) || (audio && isAudio)) {

            try {
                
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: video == true,
                    audio: audio == true
                });

                await userMediaSocket(stream);

            } catch (e) {
                console.log(e);
            }

        } else {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
        }
    }

    // ---------------- SCREEN SHARE ----------------

    const userScreenSocket = async (stream) => {
               
        try {
            if (window.localStream){
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) {
            console.log(e)
        }
    
        window.localStream = stream;

        if (localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }

        await replaceTracks(stream);
    
        stream.getTracks().forEach((track => {
            track.onended = async () => {
                setScreen(false);
            }
        }));
    }

    // ---------------- GETTING PERMISSIONS ---------------- 

    const getScreenMedia = async () => {
        
        if (screen) {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    audio: true,
                    video: true
                });
                await userScreenSocket(stream);

            } catch (e) {
                console.log(e);
                setScreen(false);
            }

        } else {

            try {
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => track.stop());
                }
            } catch (e) {
                console.log(e);
            }

            window.localStream = null;

            setVideo(true);
            setAudio(true);
        }
    }

    // ---------------- ADD MESSAGE ---------------- 

    const addMessage = (data, sender, senderId) => {

        setMessages((prevMessages) => [
            ...prevMessages,
            {sender: sender, data: data, senderSocketId: senderId}
        ]);

        if (!showChatRef.current && senderId !== socketIdRef.current) {
            setMessageCount((prevMessageCount) => prevMessageCount + 1);
        }

    }

    // --> NOTE: Didn't Return USER MEDIA SOCKET FUNCTION and USER SCREEN SOCKET

    return {
        getPermissions,
        userJoin, 
        userLeft, 
        serverResponse, 
        getUserMedia,
        getScreenMedia,
        addMessage,

        username, setUsername,
        chatInput, setChatInput,
        isUsername, setIsUsername, 

        isVideo, setIsVideo, 
        isAudio, setIsAudio,
        isScreen, setIsScreen,

        video, setVideo,
        audio, setAudio,
        screen, setScreen,

        videos, setVideos,
        message, setMessage,
        messages, setMessages,
        messageCount, setMessageCount,

        showChat, setShowChat,
        error, setError,
        openSnackbar, setOpenSnackbar,

        localVideoRef,
        videoRef,
        socketRef,
        socketIdRef,
        showChatRef,

    }
}
