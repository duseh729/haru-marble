import type { ReactNode } from "react";
import { Button } from "./button";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  icon,
  confirmText = "확인",
  onConfirm,
  showCancel = false,
  cancelText = "취소",
  confirmVariant = "default",
}: AlertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200 text-center flex flex-col items-center">
        {/* 커스텀 아이콘 또는 기본 알림 아이콘 */}
        {icon && <div className="mb-2">{icon}</div>}

        <div className="space-y-2 w-full">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
          {description && (
            <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2 w-full pt-1">
          {showCancel && (
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl font-medium border-gray-200"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}
          <Button
            className={`flex-1 h-12 rounded-xl font-medium ${
              confirmVariant === "destructive"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
             onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
