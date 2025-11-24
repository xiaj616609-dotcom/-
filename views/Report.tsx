import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
import { AssessmentResult, AIAnalysis, UserSession } from '../types';
import { analyzeAssessment } from '../services/geminiService';
import { PHQ9_SCHEMA, GAD7_SCHEMA } from '../constants';

interface Props {
  results: AssessmentResult[];
  user: UserSession;
  onReset: () => void;
}

const Report: React.FC<Props> = ({ results, user, onReset }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
        if (results.length > 0 && !analysis && process.env.API_KEY) {
            setLoading(true);
            const aiResult = await analyzeAssessment(results, user.nickname);
            setAnalysis(aiResult);
            setLoading(false);
        }
    };
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const chartData = results.map(r => ({
    name: r.scaleId,
    score: r.score,
    max: r.maxScore,
    color: r.scaleId.includes('PHQ') ? '#0ea5e9' : '#8b5cf6'
  }));

  const downloadReport = () => {
    const reportContent = {
      user: user.nickname,
      date: new Date().toLocaleDateString('zh-CN'),
      results: results,
      aiSummary: analysis
    };
    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindharmony-report-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">心理健康筛查报告</h1>
          <p className="text-slate-500">用户：{user.nickname}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> 导出数据
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/30"
          >
            <RotateCcw className="w-4 h-4" /> 重新测评
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Score Cards */}
        {results.map((res, idx) => {
          const schema = res.scaleId === 'PHQ-9' ? PHQ9_SCHEMA : GAD7_SCHEMA;
          const meta = schema.severityMap(res.score);
          
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-4 -mt-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">{schema.title}</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-slate-900">{res.score}</span>
                <span className="text-slate-400 mb-1">/ {res.maxScore}</span>
              </div>
              <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                {meta.level}
              </div>
              <p className="text-sm text-slate-500 mt-2">{meta.advice}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">分数可视化</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 'dataMax']} hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} width={60} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-brand-50 to-white rounded-2xl shadow-md border border-brand-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Sparkles className="w-6 h-6 text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">AI 心理健康助手分析</h2>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-brand-100 rounded w-3/4"></div>
            <div className="h-4 bg-brand-100 rounded w-full"></div>
            <div className="h-4 bg-brand-100 rounded w-5/6"></div>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {analysis.isCrisis && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800">建议立即关注</h4>
                  <p className="text-sm text-red-700">您的测评结果显示您可能正经历一段非常艰难的时期。请务必考虑今天就去学校健康中心或心理咨询室寻求帮助。</p>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-brand-900 mb-2">综合分析</h4>
              <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-brand-900 mb-3">建议的自我关怀策略</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                {analysis.copingStrategies.map((strategy, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold mb-2">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-600">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-slate-400 pt-4 border-t border-brand-100 italic">
              AI 生成内容仅供参考。请始终以专业医生的建议为准。
            </div>
          </div>
        ) : (
           <div className="text-slate-500 italic">
             {process.env.API_KEY ? "无法生成分析报告。" : "缺少 API Key，无法使用 AI 分析功能。"}
           </div>
        )}
      </div>
    </div>
  );
};

export default Report;