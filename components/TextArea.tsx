import React from 'react';
import { Copy, Trash2, Check, Type } from 'lucide-react';

interface TextAreaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  label: string;
  readOnly?: boolean;
  fontClass?: string;
  onClear?: () => void;
  isActive?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  readOnly = false,
  fontClass = '',
  onClear,
  isActive = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`
      flex flex-col h-full rounded-2xl transition-all duration-300
      ${isActive ? 'ring-2 ring-emerald-500/20 bg-white shadow-xl shadow-emerald-500/5' : 'bg-white shadow-lg shadow-gray-200/50 border border-gray-100'}
    `}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                <Type size={14} />
            </div>
            <label className={`text-sm font-bold tracking-wide ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
            {label}
            </label>
        </div>
        <div className="flex items-center space-x-1">
          {value && (
            <>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              {!readOnly && onClear && (
                <button
                  onClick={onClear}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Clear text"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="relative flex-grow">
        <textarea
          className={`
            w-full h-72 md:h-96 p-5 resize-none border-none outline-none focus:ring-0 text-lg leading-relaxed rounded-b-2xl
            ${fontClass} 
            ${readOnly ? 'bg-slate-50 text-slate-600 cursor-default' : 'bg-white text-gray-800'}
          `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
        />
        <div className="absolute bottom-3 right-5">
           <span className="px-2 py-1 rounded-md bg-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {value.length} chars
           </span>
        </div>
      </div>
    </div>
  );
};