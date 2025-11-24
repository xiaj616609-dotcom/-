import React from 'react';
import { Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    // This is a mock dashboard. In a real app, this would fetch from a secure backend.
    const mockStats = [
        { label: '总测评数', value: 142 },
        { label: 'PHQ-9 平均分', value: 8.4 },
        { label: '标记为高风险', value: 12 },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8 text-slate-800">
                <Shield className="w-8 h-8 text-slate-800" />
                <h1 className="text-2xl font-bold">管理员仪表盘</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {mockStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
                <p><strong>管理员提示：</strong> 在生产环境中，此仪表盘需要严格的基于角色的访问控制 (RBAC)。此处显示的数据必须经过汇总和去标识化处理，以符合 GDPR 或 《个人信息保护法》 (PIPL) 的要求。</p>
            </div>
        </div>
    );
};

export default AdminDashboard;