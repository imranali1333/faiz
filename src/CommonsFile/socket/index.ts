import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const setupSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

export default setupSocketServer;
