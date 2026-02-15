interface MobileLayoutProps {
    children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <div className="min-h-dvh w-full flex justify-center bg-gray-100">
            <div className="w-full max-w-[430px] min-h-dvh bg-white relative overflow-hidden shadow-xl py-4">
                {children}
            </div>
        </div>
    );
}
