import React from 'react';
import { Heart, ShieldCheck, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userNickname?: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userNickname, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <Heart className="w-6 h-6 fill-current" />
            <span className="text-xl font-bold tracking-tight">MindHarmony</span>
          </div>
          
          {userNickname && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <User className="w-4 h-4" />
                <span>你好, {userNickname}</span>
              </div>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
                >
                  退出
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <div className="flex justify-center items-center gap-2 mb-4 text-brand-600/80">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">隐私优先</span>
          </div>
          <p className="max-w-2xl mx-auto mb-4">
            所有数据均在您的浏览器本地处理。我们不会将您的具体问卷答案存储在服务器上。
            AI 分析仅使用去标识化后的分数数据。
          </p>
          <p>&copy; {new Date().getFullYear()} MindHarmony. 本产品非医疗设备。</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;