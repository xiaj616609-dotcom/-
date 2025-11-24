import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DisclaimerModal from './components/DisclaimerModal';
import Assessment from './views/Assessment';
import Report from './views/Report';
import AdminDashboard from './views/AdminDashboard';
import { UserSession, AssessmentResult, ScaleType } from './types';
import { PHQ9_SCHEMA, GAD7_SCHEMA } from './constants';
import { Activity, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<ScaleType | null>(null);

  // Load session from local storage (simulate session persistence)
  useEffect(() => {
    const savedSession = localStorage.getItem('mindharmony_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const handleLogin = (nickname: string, studentId: string) => {
    const newSession: UserSession = {
      nickname,
      studentId,
      agreedToTerms: true,
      isAdmin: nickname.toLowerCase() === 'admin' // Simple mock auth
    };
    setSession(newSession);
    localStorage.setItem('mindharmony_session', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    setSession(null);
    setResults([]);
    localStorage.removeItem('mindharmony_session');
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setResults(prev => [...prev, result]);
    setActiveAssessment(null);
  };

  // Landing Page View
  const Landing = () => (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          关注您的心理健康
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          一个安全、私密的自我关怀空间。通过快速、标准化的量表筛查，了解您当下的心理状态。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-6">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">抑郁症筛查 (PHQ-9)</h3>
          <p className="text-slate-500 mb-6">
            评估过去两周内是否存在情绪低落、睡眠问题、精力不足等抑郁相关症状。
          </p>
          <button 
            onClick={() => setActiveAssessment(ScaleType.PHQ9)}
            className="w-full py-3 rounded-xl bg-sky-50 text-sky-700 font-semibold hover:bg-sky-100 transition-colors"
          >
            开始 PHQ-9 测评
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">焦虑症筛查 (GAD-7)</h3>
          <p className="text-slate-500 mb-6">
             评估过去两周内是否感到紧张、焦虑、无法放松或过度担忧。
          </p>
          <button 
            onClick={() => setActiveAssessment(ScaleType.GAD7)}
            className="w-full py-3 rounded-xl bg-violet-50 text-violet-700 font-semibold hover:bg-violet-100 transition-colors"
          >
            开始 GAD-7 测评
          </button>
        </div>
      </div>
      
      {session?.isAdmin && (
          <div className="mt-12 text-center">
              <a href="#/admin" className="text-sm text-slate-400 hover:text-slate-600 underline">进入管理员后台</a>
          </div>
      )}
    </div>
  );

  if (!session) {
    return (
      <Layout>
        <DisclaimerModal onAccept={handleLogin} />
        <div className="flex items-center justify-center h-[80vh] text-slate-400">
          <p>请先接受免责声明以继续。</p>
        </div>
      </Layout>
    );
  }

  return (
    <HashRouter>
      <Layout userNickname={session.nickname} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={
            activeAssessment ? (
              <Assessment 
                schema={activeAssessment === ScaleType.PHQ9 ? PHQ9_SCHEMA : GAD7_SCHEMA}
                onComplete={handleAssessmentComplete}
                onCancel={() => setActiveAssessment(null)}
              />
            ) : results.length > 0 ? (
              <Report results={results} user={session} onReset={() => setResults([])} />
            ) : (
              <Landing />
            )
          } />
          <Route path="/admin" element={session.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;