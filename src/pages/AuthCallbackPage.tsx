import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("인증 처리 중...");

    useEffect(() => {
        // Supabase는 이메일 인증/OAuth 후 URL 해시(#) 또는 쿼리(?code=)에 토큰을 담아 리다이렉트함
        // onAuthStateChange로 세션 변화를 감지해 자동 처리
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session) {
                // 이메일 인증 완료 or OAuth 로그인 완료 → 앱으로 이동
                navigate("/app", { replace: true });
            } else if (event === "PASSWORD_RECOVERY") {
                navigate("/login", { replace: true });
            }
        });

        // 초기 세션 확인 (이미 세션이 있을 경우 즉시 처리)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate("/app", { replace: true });
            } else {
                // 세션 없으면 URL 토큰 처리 대기 중 (onAuthStateChange가 처리)
                // 5초 후에도 세션이 없으면 로그인 페이지로
                const timeout = setTimeout(() => {
                    setMessage("인증에 실패했습니다. 로그인 페이지로 이동합니다.");
                    setTimeout(() => navigate("/login", { replace: true }), 1500);
                }, 5000);

                return () => clearTimeout(timeout);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div className="w-full min-h-dvh flex items-center justify-center">
            <div className="text-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    );
}
