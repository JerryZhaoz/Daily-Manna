import React, { useEffect, useState } from 'react';
import { MonitorDown, X, Share, MoreVertical, PlusSquare } from 'lucide-react';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
    
    if (isStandaloneMode) {
        setIsStandalone(true);
        return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // If it's iOS, we always show the button because beforeinstallprompt never fires
    if (ios) {
        setShowButton(true);
    }

    // Chrome/Android prompt handler
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback: If no prompt fires after 2 seconds (e.g. Xiaomi Browser), show button anyway for manual instructions
    const timer = setTimeout(() => {
        if (!isStandaloneMode) {
            setShowButton(true);
        }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      // 1. Try automatic prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowButton(false);
      }
    } else {
      // 2. If no prompt (iOS or blocked), show manual instructions
      setShowInstructions(true);
    }
  };

  if (isStandalone || !showButton) return null;

  return (
    <>
      {/* Install Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-up w-full px-4 max-w-sm flex justify-center">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-full shadow-lg hover:bg-stone-900 transition-all font-medium text-sm w-auto whitespace-nowrap"
        >
          <MonitorDown size={18} />
          {isIOS ? '添加到主屏幕' : '安装应用 (Install App)'}
        </button>
      </div>

      {/* Manual Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
                <X size={24} />
            </button>

            <h3 className="text-xl font-serif text-stone-800 mb-4">
                如何安装
            </h3>

            <div className="space-y-4 text-stone-600">
                {isIOS ? (
                    <>
                        <p className="flex items-center gap-3">
                            1. 点击浏览器底部的分享按钮 <Share size={18} />
                        </p>
                        <p className="flex items-center gap-3">
                            2. 向下滚动并选择 "添加到主屏幕" <PlusSquare size={18} />
                        </p>
                    </>
                ) : (
                    <>
                        <p className="flex items-center gap-3">
                            1. 点击浏览器右上角的菜单图标 <MoreVertical size={18} />
                        </p>
                        <p className="flex items-center gap-3">
                            2. 选择 "安装应用" 或 "添加到主屏幕"
                        </p>
                        <p className="text-xs text-stone-400 mt-2">
                            *不同浏览器（如小米浏览器、UC）菜单位置可能略有不同。
                        </p>
                    </>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};