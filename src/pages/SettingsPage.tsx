import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut, UserX } from "lucide-react";
import { authApi } from "../api/auth";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleLogout = () => {
        authApi.logout();
        navigate("/login");
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "탈퇴") return;
        setIsDeleting(true);
        setDeleteError("");
        try {
            await authApi.deleteAccount();
            await authApi.logout();
            navigate("/", { replace: true });
        } catch (err: any) {
            setDeleteError(err.message || "회원 탈퇴 중 오류가 발생했습니다.");
            setIsDeleting(false);
        }
    };

    const isConfirmValid = deleteConfirmText === "탈퇴";

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

                    <Button
                        variant="outline"
                        className="w-full h-14 rounded-xl border-2 flex items-center justify-start gap-3 px-5 text-gray-400 hover:text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors"
                        onClick={() => {
                            setShowDeleteModal(true);
                            setDeleteConfirmText("");
                            setDeleteError("");
                        }}
                    >
                        <UserX className="w-5 h-5" />
                        <span className="font-medium">회원 탈퇴</span>
                    </Button>
                </div>
            </div>

            {/* 회원 탈퇴 확인 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 배경 오버레이 */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isDeleting && setShowDeleteModal(false)}
                    />

                    {/* 모달 본체 */}
                    <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-5">
                        {/* 아이콘 */}
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <UserX className="w-7 h-7 text-red-500" />
                        </div>

                        <div className="text-center space-y-1.5">
                            <h2 className="text-xl font-bold text-gray-900">정말 탈퇴하시겠어요?</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                탈퇴 시 모든 기록과 데이터가<br />
                                <span className="text-red-500 font-semibold">영구적으로 삭제</span>되며 복구할 수 없습니다.
                            </p>
                        </div>

                        {/* 확인 입력 */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 text-center">
                                확인을 위해 <span className="font-bold text-gray-900">"탈퇴"</span>를 입력해주세요
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="탈퇴"
                                disabled={isDeleting}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 focus:bg-white transition-all text-gray-900 disabled:opacity-60"
                            />
                        </div>

                        {deleteError && (
                            <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-xl">
                                {deleteError}
                            </p>
                        )}

                        {/* 버튼 */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={!isConfirmValid || isDeleting}
                                className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        탈퇴 중...
                                    </span>
                                ) : "탈퇴하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
