import {Server} from "socket.io"
import express from "express"
import http from "http"
import cors from "cors"

const app = express();
const server = http.createServer(app)
app.use(cors())

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

let playerCount = 0
io.on("connection", (socket) => {
    if (playerCount <= 0) {
        playerCount = 0;
    }

    socket.on("connected", () => {
        playerCount++;
        socket.emit("player_number", playerCount);

        if (playerCount === 2) {
            io.emit("start_game");
        }
    })

    socket.on("disconnect", () => {
        playerCount--;
        if (playerCount < 0) {
            playerCount = 0;
        }
    })

    socket.on("send_message", ({ name, object }) => {
        socket.broadcast.emit("receive_message", { name, object });
    })
})

server.listen(5174, () => {
    console.log("Server is running on port 5174");
})
