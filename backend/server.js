const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // For generating unique room IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://chat-karo-qlpy.onrender.com"], // Adjust based on frontend port
        methods: ["GET", "POST"]
    }
});

const rooms = {}; // Stores users in rooms

app.use(cors());
app.use(express.json());

// API to create a new room and return a unique ID
app.get("/create-room", (req, res) => {
    const roomId = uuidv4(); // Generate unique room ID
    rooms[roomId] = [];
    res.json({ roomId });
});

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join-room", ({ room, name }) => {
        socket.join(room);
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push(name);
        io.to(room).emit("new-message", { sender: "System", text: `${name} joined the room` });
    });

    socket.on("send-message", ({ room, name, text }) => {
        io.to(room).emit("new-message", { sender: name, text });
    });

    // socket.on("disconnect", () => {
    //     console.log("User disconnected:", socket.id);
    // });

    socket.on("leave-room", ({ room, name }) => {
        socket.leave(room);
        io.to(room).emit("new-message", { sender: "System", text: `${name} left the room` });
    });
    
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
    
});

server.listen(5000, () => console.log("Server running on port 5000"));
