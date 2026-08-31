import { useEffect, useState } from 'react'
import { Users, Route, Target, AlertTriangle, Leaf, Activity } from 'lucide-react'
import { getAdminKpi, getAdminTimeSeries, getAdminDemographics } from '@/api/admin'
import type { AdminAnalyticsKpi, TimeSeriesData, DemographicsData } from '@/api/admin'
import { useLocale } from '@/i18n/LocaleContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7']

export function AdminAnalytics() {
  const { s } = useLocale()
  const [kpi, setKpi] = useState<AdminAnalyticsKpi | null>(null)
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([])
  const [demographics, setDemographics] = useState<DemographicsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdminKpi(),
      getAdminTimeSeries(30),
      getAdminDemographics()
    ])
      .then(([kpiData, tsData, demoData]) => {
        setKpi(kpiData as any)
        setTimeSeries(tsData as any)
        setDemographics(demoData as any)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !kpi) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-brand-500"></div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Users', value: kpi.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Now', value: kpi.activeUsers.toLocaleString(), icon: Activity, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Total Distance', value: `${kpi.totalDistanceKm.toLocaleString()} km`, icon: Route, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'EcoPoints Issued', value: kpi.totalEcoPoints.toLocaleString(), icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Incidents', value: kpi.activeIncidents.toLocaleString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Platform Health', value: '100%', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  // Reverse timeseries to be chronological
  const chartData = [...timeSeries].reverse()

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Growth Area Chart */}
        <div className="col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-200">New Users (Last 30 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics Pie Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-200">Vehicle Types</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Economy Bar Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-200">EcoPoints Economy (Earned vs Spent)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="ecoPointsEarned" name="Earned" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ecoPointsSpent" name="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
