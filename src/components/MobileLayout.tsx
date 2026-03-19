interface MobileLayoutProps {
    children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <div className="fixed inset-0 w-full flex justify-center bg-gray-100 overflow-hidden">
            <div className="w-full max-w-[430px] h-full bg-white relative overflow-hidden shadow-xl py-4 flex flex-col">
                {children}
            </div>
        </div>
    );
}
