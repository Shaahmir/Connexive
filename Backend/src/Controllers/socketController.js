import { Server } from "socket.io";

const connections = {};
const messages = {};
const timeOnline = {};

export const connnectToSocket = (server) => {

    //CORS and Server Setup

    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ["GET", 'POST'],
            allowedHeader: ['*'],
            credentials: true
        }
    });
    
    io.on("connection", (socket) => {
        
        //ON JOINING CALL

        socket.on("joinCall", (path) => {

            if (connections[path] == undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();

            connections[path].forEach(connection => {
                io.to(connection).emit("userJoined", socket.id, connections[path]);
            });

            if (messages[path] != undefined) {
                for (let i = 0; i < messages[path].length; i++) {
                    io.to(socket.id).emit("chatMessage", 
                        messages[path][i]["data"], 
                        messages[path][i]["sender"], 
                        messages[path][i]["senderSocketId"],
                    )
                }
            }

        });

        //ON SIGNAL

        socket.on("signal", (toId, message) => {

            io.to(toId).emit("signal", socket.id, message);

        });

        //ON CHAT MESSAGE

        socket.on("chatMessage", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)

                .reduce(([room, isFound], [roomId, connected]) => {

                    if (!isFound && connected.includes(socket.id)) {
                        return [roomId, true];
                    }

                    return [room, isFound];

                }, [ '' , false ])

            if (found == true) {

                if (messages[matchingRoom] == undefined) {

                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({"sender" : sender, "data": data, "senderSocketId": socket.id});

                connections[matchingRoom].forEach(connection => {
                    io.to(connection).emit("chatMessage",data, sender, socket.id);
                })
            }
        });

        //ON DISCONNECT

        socket.on("disconnect", () => {
            let roomKey;
            
            for (const [roomId, connected] of (Object.entries(connections))) {

                connected.forEach(connection => {

                    if (connection == socket.id) {

                        roomKey =  roomId;

                        connected.forEach(connection => {
                            io.to(connection).emit("userLeft", socket.id);
                        })

                        let idx = connected.indexOf(socket.id);
                        connections[roomKey].splice(idx, 1);

                        if (connected.length == 0) {
                            delete connections[roomKey];
                            delete messages[roomKey];
                        }
                    }
                })
            }
        });
    })
}