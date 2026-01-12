import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;
const SECRET_KEY = "my-secret-key-shhh"; // 실무에선 .env 파일에 숨겨야 함!

app.use(cors());
app.use(express.json());

// --- 🔐 1. 회원가입 & 로그인 ---

// 회원가입
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // 이미 있는 유저인지 확인
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: "이미 존재하는 이메일입니다." });

  // 비밀번호 암호화 (절대 그냥 저장하면 안 됨!)
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  });

  res.json({ message: "회원가입 성공!", userId: user.id });
});

// 로그인
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // 유저 찾기
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "유저를 찾을 수 없습니다." });

  // 비밀번호 확인
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "비밀번호가 틀렸습니다." });

  // 토큰 발급 (이 토큰이 있어야 글을 쓸 수 있음)
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1d' });

  res.json({ token });
});


// --- 🛡️ 미들웨어: 로그인한 사람인지 검사하는 함수 ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer 토큰값"

  if (!token) return res.sendStatus(401); // 토큰 없음 (로그인 안 함)

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // 토큰 만료되거나 조작됨
    req.user = user; // 토큰에서 userId를 꺼내 요청에 붙여줌
    next();
  });
};


// --- 📝 2. 할 일 기능 (로그인한 사람만 가능) ---

// 내 할 일 목록 가져오기
app.get('/api/tasks', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId; // 미들웨어에서 찾아준 내 아이디

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId, // ✨ 중요: 내 것만 가져오기
      createdAt: { gte: today },
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json(tasks);
});

// 할 일 추가하기
app.post('/api/tasks', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { text, emoji } = req.body;
  const DAILY_LIMIT = 10;

  // 오늘 내가 쓴 개수 확인
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.task.count({
    where: { userId: userId, createdAt: { gte: today } } // ✨ 내 것만 카운트
  });

  if (count >= DAILY_LIMIT) {
    return res.status(403).json({ error: "오늘은 더 이상 못 채워요!" });
  }

  const newTask = await prisma.task.create({
    data: {
      text,
      emoji: emoji || '✨',
      userId: userId, // ✨ 작성자 ID 저장
    },
  });

  res.json(newTask);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});