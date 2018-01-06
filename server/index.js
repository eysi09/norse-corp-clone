const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Cities of the world 
const cities = require('./data/cities.json');

const port = process.env.PORT || 3000;
const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

// Helper function
function rndRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client') });
});

io.on('connection', socket => {

  console.log('websocket connection established');

  const l = cities.length;

  const emitData = () => {
    io.emit('cyber-attack', {
      origin: cities[rndRange(0, l)],
      dest: cities[rndRange(0, l)]
    });
    setTimeout(emitData, rndRange(250, 1500));
  };

  emitData();

});

httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});
