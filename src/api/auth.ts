import { supabase } from "@/lib/supabase";

export const authApi = {
  // 회원가입
  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;

    // identities가 빈 배열 = 이미 가입된 이메일 (Supabase 보안 정책상 에러 대신 빈 값 반환)
    if (data.user?.identities?.length === 0) {
      throw new Error('이미 사용 중인 이메일입니다. 로그인 페이지에서 로그인해주세요.');
    }

    return data;
  },

  // 이메일 인증 재발송
  resendVerificationEmail: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) throw error;
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

  // 회원탈퇴
  // ⚠️ Supabase DB에 아래 SQL로 delete_user 함수를 미리 생성해야 합니다:
  // create or replace function delete_user()
  // returns void language plpgsql security definer as $$
  // begin
  //   delete from auth.users where id = auth.uid();
  // end;
  // $$;
  deleteAccount: async () => {
    const { error } = await supabase.rpc('delete_user');
    if (error) throw error;
  },

  // 인증 여부 확인 (동기적 확인은 세션 상태를 가져오는 방식으로 변경)
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
};