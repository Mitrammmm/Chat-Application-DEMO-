import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Home() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    const createRoom = () => {
        const newRoom = uuidv4().slice(0, 6); // Generate 6-char room ID
        setRoom(newRoom);
    };

    const joinRoom = () => {
        if (name.trim() && room.trim()) {
            navigate(`/chat/${room}/${name}`);
        }
    };

    return (
        <div className="home-container">
            <h1 className="title">Welcome to Chat App</h1>

            <div className="input-container">
                <input 
                    type="text" 
                    placeholder="Enter your name..." 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="input-box"
                />
            </div>

            <div className="options-container">
                <button onClick={createRoom} className="button">Create Room</button>
                <input 
                    type="text" 
                    placeholder="Enter Room ID..." 
                    value={room} 
                    onChange={(e) => setRoom(e.target.value)} 
                    className="input-box"
                />
                <button onClick={joinRoom} className="button">Join Room</button>
            </div>
        </div>
    );
}

export default Home;
