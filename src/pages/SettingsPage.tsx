import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import { authApi } from "../api/auth";

export default function SettingsPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <div className="w-full min-h-dvh flex flex-col">
            <Helmet>
                <title>설정 - Done List</title>
            </Helmet>

            <div className="px-5 py-6 flex-1 flex flex-col">
                {/* 헤더 */}
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
                    </div>
                </header>

                {/* 설정 항목 */}
                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full h-14 rounded-xl border-2 flex items-center justify-start gap-3 px-5 text-red-500 hover:bg-red-50 hover:border-red-200"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">로그아웃</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
