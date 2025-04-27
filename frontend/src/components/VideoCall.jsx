import React, { useEffect, useState, useRef } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import axios from "axios";

const ZegoAppID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverURL = "http://localhost:4000/api/get-token";

const VideoCall = () => {
  const [client, setClient] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [status, setStatus] = useState("Idle...");

  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({}); // for multiple remote videos

  const userID = "user_" + Math.floor(Math.random() * 10000);
  const roomID = "test-room";

  const localStreamRef = useRef(null);

  useEffect(() => {
    if (!ZegoAppID) {
      console.error("ZEGO_APP_ID not found in env!");
      return;
    }

    const zegoClient = new ZegoExpressEngine(ZegoAppID, 1);
    setClient(zegoClient);

    return () => {
      if (zegoClient) {
        zegoClient.logoutRoom(roomID);
        zegoClient.destroyEngine();
      }
    };
  }, []);

  const joinRoom = async () => {
    if (!client) return;
    setStatus("Connecting...");
    try {
      const { data } = await axios.get(`${serverURL}?userID=${userID}`);
      const token = data.token;

      await client.loginRoom(roomID, token, { userID, userName: userID });

      const localStream = await client.createStream({
        camera: { video: true, audio: true },
      });

      localStreamRef.current = localStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play();
      }

      client.publishStream(localStream);

      client.on("roomStreamUpdate", async (updateType, streamList) => {
        if (updateType === "ADD") {
          streamList.forEach(async (stream) => {
            const remoteStream = await client.subscribeStream(stream.streamID);
            remoteVideosRef.current[stream.streamID] = remoteStream;
            updateRemoteVideos();
          });
        } else if (updateType === "DELETE") {
          streamList.forEach((stream) => {
            delete remoteVideosRef.current[stream.streamID];
            updateRemoteVideos();
          });
        }
      });

      client.on("IMRecvBroadcastMessage", (roomID, messageList) => {
        const messages = messageList.map((msg) => ({
          from: msg.fromUser.userName,
          message: msg.message,
        }));
        setChatMessages((prev) => [...prev, ...messages]);
      });

      setIsJoined(true);
      setStatus("Connected ✔️");
    } catch (error) {
      console.error("Failed to join room:", error);
      setStatus("Failed to connect ❌");
    }
  };

  const updateRemoteVideos = () => {
    const remoteVideoContainers = document.getElementById("remoteVideos");
    remoteVideoContainers.innerHTML = "";

    Object.keys(remoteVideosRef.current).forEach((streamID) => {
      const video = document.createElement("video");
      video.srcObject = remoteVideosRef.current[streamID];
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = "300px";
      video.style.margin = "10px";
      remoteVideoContainers.appendChild(video);
    });
  };

  const leaveRoom = async () => {
    if (client) {
      await client.logoutRoom(roomID);
    }
    if (localStreamRef.current) {
      localStreamRef.current.stop();
    }
    setIsJoined(false);
    setStatus("Idle...");
  };

  const toggleMuteAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.muteAudio(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleMuteVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.muteVideo(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const startScreenSharing = async () => {
    if (!client) return;
    try {
      const screenStream = await client.createStream({
        screen: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
        localVideoRef.current.play();
      }

      client.publishStream(screenStream);
      setIsScreenSharing(true);
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
    }
  };

  const stopScreenSharing = async () => {
    if (!client) return;
    if (localStreamRef.current) {
      await client.publishStream(localStreamRef.current);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play();
      }
    }
    setIsScreenSharing(false);
  };

  const sendMessage = async () => {
    if (chatInput.trim() && client) {
      await client.sendBroadcastMessage(roomID, chatInput);
      setChatMessages((prev) => [...prev, { from: "Me", message: chatInput }]);
      setChatInput("");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h6>ZEGO Video Call</h6>
      <p>Status: {status}</p>

      <div>
        <video
          ref={localVideoRef}
          muted
          style={{ width: "300px", margin: "10px", borderRadius: "10px" }}
        ></video>
      </div>

      <div
        id="remoteVideos"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      ></div>

      {!isJoined ? (
        <button onClick={joinRoom} style={{ marginTop: "20px" }}>
          Join Call
        </button>
      ) : (
        <>
          <div style={{ marginTop: "20px" }}>
            <button onClick={leaveRoom}>Leave Call</button>
            <button onClick={toggleMuteAudio}>
              {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            </button>
            <button onClick={toggleMuteVideo}>
              {isVideoMuted ? "Show Camera" : "Hide Camera"}
            </button>
            {!isScreenSharing ? (
              <button onClick={startScreenSharing}>Start Screen Share</button>
            ) : (
              <button onClick={stopScreenSharing}>Stop Screen Share</button>
            )}
          </div>

          {/* Chat Section */}
          <div style={{ marginTop: "30px" }}>
            <h4>Chat</h4>
            <div
              style={{
                width: "400px",
                height: "200px",
                margin: "0 auto",
                border: "1px solid gray",
                overflowY: "scroll",
                padding: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {chatMessages.map((msg, index) => (
                <div key={index}>
                  <b>{msg.from}:</b> {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              style={{ marginTop: "10px", width: "300px" }}
            />
            <br />
            <button onClick={sendMessage} style={{ marginTop: "10px" }}>
              Send Message
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCall;
