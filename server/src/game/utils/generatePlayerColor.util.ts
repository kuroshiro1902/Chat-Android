import { Color } from "chess.js";

const colors: Color[]  = ['b', 'w'];

export default function generatePlayerColor(selfId: string, opponentId: string): {[key: string]: Color} {

  // Sử dụng hàm Math.random() để chọn ngẫu nhiên một màu cho người chơi một
  const selfColor: Color = colors[Math.floor(Math.random() * 2)];

  // Màu còn lại sẽ là màu của đối thủ
  const opponentColor = selfColor === 'b' ? 'w' : 'b';

  // Tạo và trả về đối tượng chứa màu cho mỗi người chơi
  return {
    [selfId]: selfColor,
    [opponentId]: opponentColor
  };
}