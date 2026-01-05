
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StudentProfile } from '../types';
import { useTranslation } from './TranslationContext';

const data = [
  { name: 'Week 1', skills: 20, jobs: 2 },
  { name: 'Week 2', skills: 35, jobs: 4 },
  { name: 'Week 3', skills: 48, jobs: 5 },
  { name: 'Week 4', skills: 65, jobs: 8 },
  { name: 'Week 5', skills: 78, jobs: 12 },
];

const pieData = [
  { name: 'Tech', value: 40, color: '#10b981' },
  { name: 'Soft Skills', value: 30, color: '#3b82f6' },
  { name: 'Projects', value: 30, color: '#f59e0b' },
];

interface OverviewProps {
  profile: StudentProfile;
}

export const Overview: React.FC<OverviewProps> = ({ profile }) => {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{t('welcomeBack')}, {profile.name}! 👋</h2>
        <p className="text-zinc-500">Here's your career progress in {profile.location}.</p>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title={t('skillsScore')} value="78/100" change="+12% from last month" icon="📈" />
        <MetricCard title={t('learningStreak')} value="14 Days" change="Personal Best!" icon="🔥" />
        <MetricCard title={t('localOpps')} value="12 Matched" change="5 new this week" icon="📍" />
        <MetricCard title={t('profileStrength')} value="High" change="Add a project to max it out" icon="🛡️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Skill Growth Forecast</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="skills" stroke="#10b981" fillOpacity={1} fill="url(#colorSkills)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-6">Learning Focus</h3>
          <div className="h-[240px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-400">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <h3 className="font-semibold text-lg mb-4">{t('upcomingTasks')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TaskItem title="Complete React Components Module" category="Learning" time="2h" />
            <TaskItem title="Reach out to local NGO for Web Support" category="Networking" time="15m" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; change: string; icon: string }> = ({ title, value, change, icon }) => (
  <div className="glass rounded-2xl p-5 hover:border-emerald-500/50 transition-colors group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-zinc-400 text-sm font-medium">{title}</span>
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs text-emerald-500 font-medium">{change}</div>
  </div>
);

const TaskItem: React.FC<{ title: string; category: string; time: string }> = ({ title, category, time }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
    <div className="w-2 h-10 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center">
      <div className="w-1 h-1 bg-emerald-500 rounded-full" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-zinc-500 flex items-center gap-2">
        <span>{category}</span>
        <span>•</span>
        <span>{time}</span>
      </div>
    </div>
    <input type="checkbox" className="rounded-md bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500/20 w-5 h-5" />
  </div>
);
