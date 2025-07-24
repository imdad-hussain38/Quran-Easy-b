// server/socket.js
const { Server } = require("socket.io");

let activeUsers = [];

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    socket.on("join-room", ({ roomId, userId, role }) => {
      const joinTime = Date.now();

      console.log(`👤 User ${userId} (${role}) joined room ${roomId}`);
      socket.join(roomId);

      const userData = {
        socketId: socket.id,
        userId,
        role,
        roomId,
        joinTime
      };
      activeUsers.push(userData);

      socket.to(roomId).emit("user-connected", userId);

      socket.on("signal", (data) => {
        socket.to(roomId).emit("signal", {
          userId: data.userId,
          signalData: data.signalData
        });
      });

      socket.on("sync-page", ({ roomId, pageNumber }) => {
        console.log(`📄 Syncing page ${pageNumber} in room ${roomId}`);
        socket.to(roomId).emit("sync-page", { pageNumber });
      });

      socket.on("disconnect", () => {
        const leaveTime = Date.now();
        const index = activeUsers.findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
          const user = activeUsers[index];
          user.duration = Math.floor((leaveTime - user.joinTime) / 1000);
          console.log(`❌ User ${user.userId} disconnected after ${user.duration} seconds`);
          activeUsers.splice(index, 1);
          socket.to(user.roomId).emit("user-disconnected", user.userId);
        }
      });
    });

    socket.on("get-active-users", () => {
      const enrichedUsers = activeUsers.map(u => ({
        ...u,
        duration: Math.floor((Date.now() - u.joinTime) / 1000)
      }));
      socket.emit("active-users", enrichedUsers);
    });

    socket.on("admin-disconnect-user", ({ userId, roomId }) => {
      const target = activeUsers.find(u => u.userId === userId && u.roomId === roomId);
      if (target) {
        const targetSocket = io.sockets.sockets.get(target.socketId);
        if (targetSocket) {
          console.log(`⚠️ Admin forcibly disconnecting user ${target.userId} from room ${target.roomId}`);
          targetSocket.emit("force-disconnect");

          // Give client time to handle UI cleanup
          setTimeout(() => {
            targetSocket.disconnect(true);
          }, 100);
        }
      }
    });

    // ✅ New Search Event Handler
    socket.on("search", (query) => {
      const lowerQuery = query.toLowerCase();
      const results = activeUsers.filter(u =>
        u.userId.toLowerCase().includes(lowerQuery) ||
        u.role.toLowerCase().includes(lowerQuery) ||
        (u.roomId && u.roomId.toLowerCase().includes(lowerQuery))
      );
      socket.emit("search-results", results);
    });
  });
}

module.exports = setupSocket;
