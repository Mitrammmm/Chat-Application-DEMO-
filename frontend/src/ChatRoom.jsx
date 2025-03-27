import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatRoom() {
    const { room, name } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("join-room", { room, name });

        socket.on("new-message", (msg) => {
            setMessages((prev) => [...prev, msg]); 
        });

        return () => {
            socket.off("new-message");
        };
    }, [room, name]);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("send-message", { room, name, text: message });
            setMessage("");
        }
    };

    const leaveRoom = () => {
        socket.emit("leave-room", { room, name });
        navigate("/"); // Redirect back to home
    };

    return (
        <div className="chat-container">
            <h2 className="room-title">Room: {room}</h2>
            
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <p key={index} className="message">
                        <strong>{msg.sender}:</strong> {msg.text}
                    </p>
                ))}
            </div>

            <div className="input-container">
                <input 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    className="message-input"
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>

            <button onClick={leaveRoom} className="leave-button">Leave Room</button>
        </div>
    );
}

export default ChatRoom;
