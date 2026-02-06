import { supabase } from "@/lib/supabase";

// 카카오 소셜 로그인 API
export const socialApi = {
    // 카카오 로그인 - Supabase OAuth 사용
    kakaoLogin: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
        return data;
    },

    // 소셜 로그인 콜백 처리 (URL에서 세션 추출)
    handleAuthCallback: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data;
    },

    // 현재 사용자 정보 가져오기
    getCurrentUser: async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    // 소셜 로그인 상태 구독 (세션 변화 감지)
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    },
};
