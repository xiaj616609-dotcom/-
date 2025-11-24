import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { DISCLAIMER_TEXT } from '../constants';

interface Props {
  onAccept: (nickname: string, studentId: string) => void;
}

const DisclaimerModal: React.FC<Props> = ({ onAccept }) => {
  const [nickname, setNickname] = useState('');
  const [studentId, setStudentId] = useState(''); // Optional
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted && nickname.trim()) {
      onAccept(nickname, studentId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="bg-brand-50 p-6 border-b border-brand-100">
          <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-brand-600" />
            测评须知
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="prose prose-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 h-48 overflow-y-auto">
            <p className="font-bold">隐私与医疗免责声明</p>
            <p className="whitespace-pre-line">{DISCLAIMER_TEXT}</p>
            <p className="mt-2">
              <strong>数据隐私：</strong> 您的回答完全在本地处理。
              只有汇总分数会匿名发送给 AI 助手用于生成建议。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">我们该如何称呼您？</label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="昵称或名字"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">学号 (可选)</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="仅供您个人记录使用"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <span className="text-sm text-slate-600">
              我明白这并非医疗诊断，并同意上述隐私条款。
            </span>
          </label>

          <button
            type="submit"
            disabled={!accepted || !nickname.trim()}
            className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            进入测评
          </button>
        </form>
      </div>
    </div>
  );
};

export default DisclaimerModal;