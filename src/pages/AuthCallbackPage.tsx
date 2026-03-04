import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socialApi } from "../api/social";

export default function AuthCallbackPage() {
    const navigate = useNavigate();

    useEffect(() => {
        socialApi.handleAuthCallback()
            .then((data) => {
                if (data.session) {
                    navigate("/app", { replace: true });
                } else {
                    navigate("/login", { replace: true });
                }
            })
            .catch(() => {
                navigate("/login", { replace: true });
            });
    }, [navigate]);

    return (
        <div className="w-full min-h-dvh flex items-center justify-center">
            <div className="text-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500">로그인 처리 중...</p>
            </div>
        </div>
    );
}
