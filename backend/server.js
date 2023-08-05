const express = require("express");
const colors = require("colors");
const cors = require("cors");
http = require("http");
const dotenv = require("dotenv").config();
const PORT = process.env.port || 8000
const connectDB = require("./config/db.js");
const passport = require("passport");
const passport_setup = require("./model/passport.js");
const session = require("express-session");
const authRoute = require("./routes/auth.js");
const { Server } = require("socket.io");
connectDB();
const app = express();

const server = http.createServer(app);

app.use(session({
    secret: "super secret key",
    resave: false,
    saveUninitialized: false,
}));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));

app.use("/auth", authRoute);

app.use("/user", require("./routes/userroutes.js"));

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})

const io = new Server(server, {
    cors: {
        origin: "*"
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    console.log(users);
}

const removeUser = (socketId) => {
    users = users.filter((element) => element.socketId !== socketId)
    console.log(users);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
    //when connect
    console.log("user connected");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        //console.log("==", receiverId);
        const user = getUser(receiverId);
        console.log(user);
        io.to(user?.socketId).emit("getMessage", {
            senderId: senderId,
            text: text,
        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})

