import { supabase } from "@/lib/supabase";

export const authApi = {
  // 회원가입
  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // 로그인
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    return data;
  },

  // 로그아웃
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 인증 여부 확인 (동기적 확인은 세션 상태를 가져오는 방식으로 변경)
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
};