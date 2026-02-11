import React, { useState, useCallback } from 'react';
import { ArrowRightLeft, AlertCircle, History, Globe, ExternalLink, Zap } from 'lucide-react';
import { Button } from './components/Button';
import { TextArea } from './components/TextArea';
import { convertTextWithGemini } from './services/geminiService';
import { ConversionDirection, ConversionHistoryItem } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [direction, setDirection] = useState<ConversionDirection>(ConversionDirection.UnicodeToBijoy);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);

  // Derived state for labels and placeholders
  const isUnicodeInput = direction === ConversionDirection.UnicodeToBijoy;
  
  const inputLabel = isUnicodeInput ? 'Unicode Input' : 'Bijoy 52 Input';
  const outputLabel = isUnicodeInput ? 'Bijoy 52 Output' : 'Unicode Output';
  
  const inputPlaceholder = isUnicodeInput 
    ? 'Enter Bengali text (e.g., আমার সোনার বাংলা)...' 
    : 'Enter Bijoy codes (e.g., Avgvi †mvbvi evsjv)...';
    
  const outputPlaceholder = isUnicodeInput 
    ? 'Converted Bijoy text will appear here...' 
    : 'Converted Unicode text will appear here...';

  const handleSwap = () => {
    setDirection(prev => prev === ConversionDirection.UnicodeToBijoy 
      ? ConversionDirection.BijoyToUnicode 
      : ConversionDirection.UnicodeToBijoy
    );
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setError(null);
  };

  const handleConvert = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to convert.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await convertTextWithGemini(inputText, direction);
      setOutputText(result);
      
      const newItem: ConversionHistoryItem = {
        id: Date.now().toString(),
        original: inputText.substring(0, 50) + (inputText.length > 50 ? '...' : ''),
        converted: result.substring(0, 50) + (result.length > 50 ? '...' : ''),
        direction,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev].slice(0, 5)); 
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, direction]);

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="https://raw.githubusercontent.com/appsaibd/Uni-Bijoy/main/abswer.com.gif" 
                alt="Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Uni-Bijoy
              </h1>
            </div>
            <div className="flex items-center gap-4">
               <a 
                href="https://www.abswer.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-gray-50 text-xs font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-gray-200"
              >
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                abswer.com
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-8 max-w-3xl mx-auto bg-red-50 border border-red-100 rounded-xl p-4 flex items-center animate-fade-in shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mr-3" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Converter Layout */}
        <div className="relative">
            {/* Desktop: Middle Swap Button Line */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-px h-64 bg-transparent"></div> {/* Spacer */}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-center">
            
            {/* Input Side */}
            <div className="flex-1 w-full min-w-0">
                <TextArea 
                label={inputLabel}
                placeholder={inputPlaceholder}
                value={inputText}
                onChange={setInputText}
                fontClass={isUnicodeInput ? 'font-bengali' : 'font-mono'}
                onClear={handleClear}
                isActive={true}
                />
            </div>

            {/* Controls Area */}
            <div className="flex flex-col items-center justify-center gap-4 z-20">
                 {/* Mobile Convert Button (Visible only on small screens) */}
                <div className="lg:hidden w-full">
                     <Button
                        variant="modern"
                        className="w-full h-12"
                        onClick={handleConvert}
                        isLoading={isLoading}
                        icon={<Zap size={18} />}
                    >
                        Convert Now
                    </Button>
                </div>

                {/* Swap Button */}
                <button
                    onClick={handleSwap}
                    className="p-4 rounded-full bg-white text-gray-400 border border-gray-100 shadow-xl shadow-gray-200/50 hover:text-emerald-600 hover:border-emerald-100 hover:scale-110 active:scale-95 transition-all duration-300 group"
                    title="Swap Direction"
                >
                    <ArrowRightLeft className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                </button>

                {/* Desktop Convert Button */}
                <div className="hidden lg:block">
                    <Button
                        variant="modern"
                        className="w-40"
                        onClick={handleConvert}
                        isLoading={isLoading}
                        icon={<Zap size={18} />}
                    >
                        Convert
                    </Button>
                </div>
            </div>

            {/* Output Side */}
            <div className="flex-1 w-full min-w-0">
                <TextArea 
                label={outputLabel}
                placeholder={outputPlaceholder}
                value={outputText}
                readOnly={true}
                fontClass={!isUnicodeInput ? 'font-bengali' : 'font-mono'}
                />
            </div>

            </div>
        </div>

        {/* Recent History */}
        <div className="mt-16 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <History size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recent Conversions</h3>
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400">No recent conversion history.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {history.map((item) => (
                  <div key={item.id} className="group flex flex-col bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.direction === ConversionDirection.UnicodeToBijoy ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {item.direction === ConversionDirection.UnicodeToBijoy ? 'Uni → Bijoy' : 'Bijoy → Uni'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                       <div className="relative">
                            <p className="text-xs text-gray-400 mb-1">Input</p>
                            <div className="truncate text-gray-800 font-medium text-sm">{item.original}</div>
                       </div>
                       <div className="w-full h-px bg-gray-50 group-hover:bg-emerald-50 transition-colors"></div>
                       <div className="relative">
                            <p className="text-xs text-gray-400 mb-1">Output</p>
                            <div className="truncate text-gray-600 text-sm">{item.converted}</div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 opacity-75">
                    <img 
                    src="https://raw.githubusercontent.com/appsaibd/Uni-Bijoy/main/logo.png" 
                    alt="Logo" 
                    className="h-5 w-auto"
                    />
                    <span className="text-sm font-medium text-gray-500">
                        &copy; {new Date().getFullYear()} Uni-Bijoy
                    </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8">
                    <a 
                        href="https://bijoy.abswer.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></div>
                        bijoy.abswer.com
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a 
                        href="https://www.abswer.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></div>
                        www.abswer.com
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;