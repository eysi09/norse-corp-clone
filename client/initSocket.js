(function() {

// Read from cdn
const socket = io();
const { animateCyberAttack } = module.exports;

module.exports.initSocket = () => {
  socket.on('cyber-attack', msg => {
    animateCyberAttack(msg.origin, msg.dest);
  });
};

})();
