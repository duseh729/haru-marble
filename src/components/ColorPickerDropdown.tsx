import { MARBLE_COLORS } from '../utils/MarbleFactory';

interface ColorPaletteProps {
    selectedColor: string;
    onSelect: (color: string) => void;
}

export default function ColorPalette({ selectedColor, onSelect }: ColorPaletteProps) {
    return (
        <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-2 justify-center">
                {MARBLE_COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() => onSelect(color)}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-125 ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                            }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
}
