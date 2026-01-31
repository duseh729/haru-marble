import Matter from 'matter-js';

// 🎨 디자인 시안 컬러 팔레트
export const MARBLE_COLORS = [
  '#FFE4E6', // Blush Pink
  '#FECDD3', // Rose Pink
  '#FED7AA', // Peach
  '#FEF3C7', // Butter Yellow
  '#D9F99D', // Lime Green
  '#BBF7D0', // Mint Green
  '#A5F3FC', // Sky Blue
  '#BFDBFE', // Baby Blue
  '#DDD6FE', // Lavender
  '#FBCFE8', // Cotton Candy
];

export class MarbleFactory {
  /**
   * 랜덤한 파스텔 색상을 반환합니다.
   */
  static getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * MARBLE_COLORS.length);
    return MARBLE_COLORS[randomIndex];
  }

  /**
   * 디자인이 적용된 유리구슬(Marble) 객체를 생성합니다. (랜덤 색상)
   * @param x 시작 x 좌표
   * @param y 시작 y 좌표
   * @param radius 반지름 (기본값 24)
   */
  static create(x: number, y: number, radius: number = 24) {
    const color = this.getRandomColor();
    return this.createWithColor(x, y, radius, color);
  }

  /**
   * 지정된 색상으로 유리구슬(Marble) 객체를 생성합니다.
   * @param x 시작 x 좌표
   * @param y 시작 y 좌표
   * @param radius 반지름
   * @param color 색상 (hex)
   */
  static createWithColor(x: number, y: number, radius: number, color: string) {
    return Matter.Bodies.circle(x, y, radius, {
      restitution: 0.2,
      friction: 0.005,
      frictionAir: 0.01,
      render: {
        fillStyle: color,
        strokeStyle: '#ffffff',
        lineWidth: 0,
      },
      plugin: {
        marbleColor: color,
      }
    });
  }
}