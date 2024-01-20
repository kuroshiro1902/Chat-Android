//Giả sử đã đăng nhập và có token của user ở local
const id = (100*Math.random()).toFixed(0)
const user = {
  id,
  name: 'Player ' + id,
}
const client = io('http://localhost:3000/game?id='+id, {autoConnect: false});
client.connect();

client.on('connected', (id)=>{
  console.log("Your id: ", id);
  
})

client.on('joined-room', (data)=>{
  console.log(JSON.parse(data));
})

client.on('room-full', (data)=>{
  console.log('room is full');
})

client.on('move', (move)=>{
  move = JSON.parse(move);
  chess.move(move);
  board.position(chess.fen());
})

// $('#join-game').on('click', ()=>{
//   console.log("Join Game");
//   client.connect();
// })

$('form#room-form').on('submit', (e)=>{
  e.preventDefault();
  client.emit('join-room', e.target.roomId.value )
})