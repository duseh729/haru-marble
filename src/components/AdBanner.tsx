interface AdBannerProps {
  className?: string;
}

/**
 * 구글 애드센스 등 광고 배너를 위한 플레이스홀더 컴포넌트
 */
export default function AdBanner({ className = "" }: AdBannerProps) {
  return (
    <div className={`w-full flex justify-center items-center bg-gray-50 border-t border-gray-100 ${className}`} style={{ minHeight: '50px' }}>
      {/* 실제 애드센스 적용 시에는 이 자리에 <ins> 태그와 스크립트가 들어갑니다. */}
      <div className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">
        Advertisement
      </div>
    </div>
  );
}
