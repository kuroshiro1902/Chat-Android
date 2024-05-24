const ip = '192.168.1.15';
// const ip = 'localhost';
export const server = {
  // url: 'http://localhost:3000/api',
  url: `http://${ip}:3000/api`,
  // url: 'https://chat-android.onrender.com/api',
  host: 'localhost',
  port: 3000,
};

export const chatServer = {
  // url: 'http://localhost:3000/chat',
  url: `http://${ip}:3000/chat`,
  // url: 'https://chat-android.onrender.com/chat',
  host: 'localhost',
  port: 3000,
};
