import { useEffect, useContext, useRef } from "react";
import io from 'socket.io-client';
import { useController } from '../controllers/MeetComponent';
import { AuthContext } from "../contexts/AuthContext";
import HangCall from "../assets/svg/meet-svgs/end-call.svg";
import ScreenShare from "../assets/svg/meet-svgs/screen-share.svg";
import VideoOff from "../assets/svg/meet-svgs/video-off.svg";
import VideoOn from "../assets/svg/meet-svgs/video-on.svg";
import MessagesIcon from "../assets/svg/meet-svgs/message-icon.svg";
import MicOff from "../assets/svg/meet-svgs/mic-off.svg";
import MicOn from "../assets/svg/meet-svgs/mic-on.svg";
import Snackbar from "@mui/material/Snackbar";
import "../styles/MeetPage.css";
import Logo from "../assets/svg/logo.svg";
import Navbar from "../components/Navbar";

const serverURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default function MeetComponent() {

    // ---------------- Importing all functions and hooks ---------------- 
    const {
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

    } = useController();

    // ---------------- USE CONTEXT ---------------- 

    const { handleSetHistory } = useContext(AuthContext);

    // ---------------- USE EFFECTS ---------------- 

    useEffect(() => {
        const videoContainer = document.getElementById("floatingVideo");
        if (!videoContainer) return;

        let isDragging = false;
        let startX, startY, initialX, initialY;
        let dockedSide = "right"; 

        const updatePosition = () => {
            const rect = videoContainer.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const padding = 20;

            let finalX;
            if (rect.left + rect.width / 2 < centerX) {
                finalX = padding;
                dockedSide = "left";
            } else {
                finalX = window.innerWidth - rect.width - padding;
                dockedSide = "right";
            }

            videoContainer.style.transition = "transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
            videoContainer.style.transform = `translate(${finalX}px, ${rect.top}px)`;
        };

        const onMouseDown = (e) => {
            isDragging = true;
            videoContainer.style.transition = "none";
            const rect = videoContainer.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialX = rect.left;
            initialY = rect.top;

            videoContainer.style.position = "fixed";
            videoContainer.style.bottom = "auto";
            videoContainer.style.right = "auto";
            videoContainer.style.margin = "0";
            videoContainer.style.left = "0";
            videoContainer.style.top = "0";
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let x = initialX + dx;
            let y = initialY + dy;

            const maxX = window.innerWidth - videoContainer.offsetWidth;
            const maxY = window.innerHeight - videoContainer.offsetHeight;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            videoContainer.style.transform = `translate(${x}px, ${y}px)`;
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            updatePosition();
        };

        const handleResize = () => {
            if (isDragging) return;
            
            const rect = videoContainer.getBoundingClientRect();
            const padding = 20;
            let newX;

            if (dockedSide === "right") {
                newX = window.innerWidth - videoContainer.offsetWidth - padding;
            } else {
                newX = padding;
            }

            let newY = Math.min(rect.top, window.innerHeight - videoContainer.offsetHeight - padding);
            
            videoContainer.style.transition = "transform 0.35s cubic-bezier(0.25, 0.1, 0, 2.05";
            videoContainer.style.transform = `translate(${newX}px, ${newY}px)`;
        };

        videoContainer.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        window.addEventListener("resize", handleResize);

        return () => {
            videoContainer.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("resize", handleResize);
        };
    }, [isUsername]);

    useEffect(() => {
        if (video != undefined && audio != undefined ){
            getUserMedia();
        }
    }, [video, audio]);

    useEffect(() => {

        if (screen){
            getScreenMedia();

        } else {
            try {
                if( window.localStream ){

                    const isDisplay = window.localStream.getVideoTracks().some( track =>
                        track.label?.toLowerCase().includes("screen") || track.getSettings?.().displaySurface
                    )

                    if(isDisplay || !window.localStream.getVideoTracks().some(track => track.readyState === "live")){
                        window.localStream.getTracks().forEach(track=>track.stop())
                        window.localStream = null;
                    }
                }

            } catch (e) {
                console.log(e)
            }

            getUserMedia();
        }
        
    }, [screen]);

    useEffect(() => {
        showChatRef.current = showChat;
    }, [showChat]);

    useEffect(() => {
        getPermissions();
    }, []);

    useEffect(() => {
        if (!isUsername && window.localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = window.localStream;
            window.localStream.getVideoTracks().forEach( track => { track.enabled = !!video});
            window.localStream.getAudioTracks().forEach( track => { track.enabled = !!audio});
        }
    }, [isUsername]);

    // ---------------- HANDLERS ---------------- 

    const socketConnection = () => {
        socketRef.current.emit("joinCall", window.location.href);
        socketIdRef.current = socketRef.current.id;
        socketRef.current.on("userJoined", userJoin);
        socketRef.current.on("userLeft", userLeft);
        socketRef.current.on("chatMessage", addMessage);
    }

    const connectToSocketServer = () => {
        socketRef.current = io.connect(serverURL, { secure: false });
        socketRef.current.on("signal", serverResponse);
        socketRef.current.on("connect", socketConnection);
    }
    
    const connectionInit = () => {
        connectToSocketServer();
    }

    const connectHandle = async () => {

        if (username.length >=3 ) {
            setIsUsername(false);
            await handleSetHistory(window.location.pathname.split('/')[1]);
            connectionInit();
        } else {
            setError("Username must be at least 3 characters long");
            setOpenSnackbar(true);
        }

    }

    const handleEndCall = () => {

        try {
            if (window.localStream) {
                const tracks = window.localStream.getTracks();
                tracks.forEach(track => track.stop());
            }

        } catch (e) {
            console.log(e);
        }

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        window.location.href = '/';
    }

    const handleVideoOff = () => {
        setVideo(prev => !prev);
    }

    const handleAudioOff = () => {
        setAudio(prev => !prev);
    }

    const handleScreenShare = () => {
        setScreen(!screen);
    }

    const handleShowChat = () => {
        setMessageCount(0);
        setShowChat(!showChat);
    }

    const handleSendMessage = () => {
        if ( message.length > 0) {
            socketRef.current.emit("chatMessage", message, username);
            setMessage("");
        }
    }

    const messagesRef = useRef(null)

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight + 100;
        }
    }

    const handleSendAndScroll = () => {
        handleSendMessage();
        scrollToBottom();
    }

    //---------------- FRONTEND ----------------

    return (
        <>
            { 
                isUsername ?

                <div className="out-container">
                    <Navbar />
                    <div className="meet-container">

                        <input 
                            type="text" 
                            placeholder="Enter a username" 
                            className="meet-inp"
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                        />

                        <div className="meet-video">
                                {
                                    video ? (
                                    <video className = "self-meet-video" ref={localVideoRef} autoPlay playsInline muted style={{ width: "30rem", height: "22.5rem", transform: "scaleX(-1)" }}/>
                                ) : (
                                    <div className="meet-placeholder" style={{ width: "30rem", height: "22.5rem", borderRadius: "20px"}}>
                                    <img 
                                        src={Logo} 
                                        alt="User Profile"
                                        style={{height: "60px", width: "60px"}} 
                                    />
                                    </div>
                                )}
                            
                        </div>

                        <div className="meet-btns">
                            <span className = "before-svgs">
                                <img src={video ? VideoOn : VideoOff} style={{height: '40px', width: '40px'}} onClick={handleVideoOff} />
                                <img src={audio ? MicOn : MicOff} style={{height: '38px', width: '38px'}} onClick={handleAudioOff} />
                            </span>
                            <span>
                                <button type="button" onClick={() => window.location.href = "/"}>Cancel</button>
                                <button type="button" onClick={connectHandle}>Enter</button>
                            </span>
                        </div>


                    </div> 
                </div>

                : 

                <div className={showChat ? "conf-container conf-container-half" : "conf-container conf-container-full"}>
                    <div className="self-video" id="floatingVideo">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                transform: "scaleX(-1)",
                                display: video ? "block" : "none"
                            }}
                        />

                        {!video && (
                            <div className="self-meet-placeholder">
                                <img src={Logo} style={{ height: 60, width: 60 }} />
                            </div>
                        )}
                    </div>

                    <div className="svgs">
                        <img src={HangCall} style={{height: '40px', width: '40px'}} onClick={handleEndCall} />
                        <img src={video ? VideoOn : VideoOff} style={{height: '40px', width: '40px'}} onClick={handleVideoOff} />
                        <img src={audio ? MicOn : MicOff} style={{height: '38px', width: '38px'}} onClick={handleAudioOff} />
                        <img src={ScreenShare} style={{height: '40px', width: '40px'}} onClick={handleScreenShare} />
                        <img src={MessagesIcon} style={{height: '38px', width: '40px'}} onClick={handleShowChat} />

                        { 
                            messageCount !== 0 ?
                            <h2 style={{display: "inline", color: "white"}}>{messageCount}</h2>
                            :
                            <></>
                        }

                    </div>

                    <div className="parti-cont">
                        {
                            videos.map((video) => {
                                
                                const isVideoActive = video.stream?.getVideoTracks().some(
                                    track => track.readyState === "live" && track.enabled && !track.muted
                                );

                                return (
                                    <div key={video.socketId}>
                                        {isVideoActive ? (
                                            <video 
                                                data-socket={video.socketId}
                                                ref={ref => {
                                                    if (ref && video.stream && ref.srcObject !== video.stream) {
                                                        ref.srcObject = video.stream;
                                                    }
                                                }}
                                                autoPlay
                                                playsInline
                                                style={{ transform: "scaleX(-1)" }}
                                            ></video>
                                        ) : (
                                            <div className="meet-placeholder">
                                            <img 
                                                src={Logo} 
                                                alt="User Profile"
                                                style={{height: "60px", width: "60px"}} 
                                            />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className = {showChat ? "chat-container chat-show" : "chat-container chat-hide"}>
                        <h1>Messages</h1>
                        <div className="messages" ref = {messagesRef}>
                        {
                            messages.map((el, i )=> (<p key={i} className={el.sender == username ? "self-message" : "others-message"}><span>{el.sender}</span><span>{el.data}</span></p>))
                        }
                        </div>
                        <div className="input_box">
                            <input 
                                type="text" 
                                placeholder="Write a message!" 
                                value={message} 
                                onChange={e => setMessage(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") handleSendAndScroll(); }}
                            />
                            <button onClick={handleSendAndScroll}>Send</button>
                        </div>
                    </div>
                </div>
            }
                  <Snackbar
                  style={{width: "25%"}}
                  open={openSnackbar}
                  message={error}
                  autoHideDuration={2000}
                  onClose={()=>setOpenSnackbar(false)}
                   />
        </>
    )
}
