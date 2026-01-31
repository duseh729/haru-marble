// supabase 의존성 코드
import { createClient } from '@supabase/supabase-js';

// 환경 변수 로드 (Vite 방식)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트 싱글톤 인스턴스 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);