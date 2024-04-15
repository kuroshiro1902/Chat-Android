export default function createRoomId(id1:string|number, id2:string|number){
    let roomId = [id1+'', id2+''].sort().join('');
    return roomId
}