import React, { useState } from 'react';

export default function CompanyB() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Needs Review', value: '12', subtext: 'Urgent attention', icon: '🔴', urgent: true },
    { label: 'Processing', value: '8', subtext: 'AI analyzing', icon: '⚙️' },
    { label: 'Approved', value: '156', subtext: 'This month', icon: '✓' },
    { label: 'Total Spend', value: '$234K', subtext: 'Monthly', icon: '💰' }
  ];

  const pendingInvoices = [
    {
      id: 'INV-2024-0234',
      vendor: 'Tech Solutions Inc.',
      category: 'Software License',
      amount: '$12,450.00',
      dueDate: 'Dec 15, 2024',
      confidence: 98,
      items: '3 licenses'
    },
    {
      id: 'INV-2024-0235',
      vendor: 'Cloud Services Ltd.',
      category: 'Monthly Subscription',
      amount: '$8,920.00',
      dueDate: 'Dec 18, 2024',
      confidence: 85,
      items: '5 services'
    },
    {
      id: 'INV-2024-0236',
      vendor: 'Office Supplies Co.',
      category: 'Office Equipment',
      amount: '$2,340.00',
      dueDate: 'Dec 20, 2024',
      confidence: 95,
      items: '12 items'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Top Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
                <span className={`font-bold text-xl ${isDark ? 'text-black' : 'text-white'}`}>S</span>
              </div>
              <div>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>SpendDock</span>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Client Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className={`px-5 py-2.5 rounded-xl ${isDark ? 'bg-white text-black hover:shadow-xl hover:shadow-white/20' : 'bg-black text-white hover:shadow-xl hover:shadow-black/20'} font-medium transition cursor-pointer`}>
                💬 Ask AI Assistant
              </button>
              <button className={`p-2.5 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition border ${isDark ? 'border-white/20' : 'border-black/20'} relative`}>
                <span className="text-lg">🔔</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">12</span>
              </button>
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition border ${isDark ? 'border-white/20' : 'border-black/20'}`}
              >
                <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              </button>
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-white/20' : 'bg-black/20'} flex items-center justify-center`}>
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>Enterprise Corp</p>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Finance Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed left-0 w-72 h-[calc(100vh-64px)] backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border-r ${isDark ? 'border-white/10' : 'border-black/10'} p-6`}>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
              { id: 'review', icon: '⚠️', label: 'Needs Review', badge: 12 },
              { id: 'invoices', icon: '📄', label: 'All Invoices', badge: null },
              { id: 'payments', icon: '💳', label: 'Payments', badge: null },
              { id: 'analytics', icon: '📈', label: 'Analytics', badge: null },
              { id: 'ai-chat', icon: '🤖', label: 'AI Assistant', badge: null },
              { id: 'settings', icon: '⚙️', label: 'Settings', badge: null }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition ${
                  activeTab === item.id
                    ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
                    : isDark ? 'text-white/70 hover:bg-white/10' : 'text-black/70 hover:bg-black/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className={`mt-8 p-6 rounded-2xl backdrop-blur-xl ${isDark ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-gradient-to-br from-black/10 to-black/5'} border ${isDark ? 'border-white/20' : 'border-black/20'}`}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-3 block">🤖</span>
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-black'} mb-2`}>AI Assistant</h4>
              <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>Ask about your invoices</p>
            </div>
            <button className={`w-full py-2.5 rounded-xl ${isDark ? 'bg-white text-black hover:shadow-xl' : 'bg-black text-white hover:shadow-xl'} font-medium text-sm transition cursor-pointer`}>
              Start Chat
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-2`}>
              Finance Dashboard
            </h1>
            <p className={`text-lg ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              <span className="text-red-500 font-semibold">12 invoices</span> need your attention
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`backdrop-blur-xl ${
                  stat.urgent 
                    ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-300'
                    : isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                } rounded-2xl p-6 border hover:${isDark ? 'bg-white/10' : 'bg-black/10'} transition transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  {stat.urgent && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold animate-pulse">
                      URGENT
                    </span>
                  )}
                </div>
                <div className={`text-sm font-medium ${stat.urgent ? 'text-red-500' : isDark ? 'text-white/60' : 'text-black/60'} mb-2`}>
                  {stat.label}
                </div>
                <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>

          {/* AI Assistant Banner */}
          <div className={`backdrop-blur-xl ${isDark ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'} rounded-2xl p-6 border mb-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl ${isDark ? 'bg-white/20' : 'bg-black/20'} flex items-center justify-center`}>
                  <span className="text-3xl">🤖</span>
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-1`}>
                    AI Invoice Assistant
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                    Ask questions about your invoices in natural language
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className={`px-5 py-3 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white' : 'bg-black/20 hover:bg-black/30 border-black/30 text-black'} border font-medium transition cursor-pointer`}>
                  "Show unpaid invoices"
                </button>
                <button className={`px-5 py-3 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white' : 'bg-black/20 hover:bg-black/30 border-black/30 text-black'} border font-medium transition cursor-pointer`}>
                  "Spend by category"
                </button>
              </div>
            </div>
          </div>

          {/* Pending Invoices */}
          <div className={`backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-2xl border ${isDark ? 'border-white/10' : 'border-black/10'} overflow-hidden`}>
            <div className={`p-6 border-b ${isDark ? 'border-white/10 bg-red-500/10' : 'border-black/10 bg-red-50'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    Invoices Requiring Your Approval
                  </h3>
                </div>
                <button className={`px-4 py-2 rounded-xl ${isDark ? 'bg-white text-black hover:shadow-xl' : 'bg-black text-white hover:shadow-xl'} font-medium text-sm transition cursor-pointer`}>
                  Approve All Trusted
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {pendingInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className={`p-6 hover:${isDark ? 'bg-white/5' : 'bg-black/5'} transition`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-xl ${isDark ? 'bg-gradient-to-br from-white/20 to-white/10' : 'bg-gradient-to-br from-black/20 to-black/10'} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-3xl">📄</span>
                      </div>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-black'} text-xl mb-2`}>
                          {invoice.id}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'} mb-3 space-y-1`}>
                          <div>{invoice.vendor} · {invoice.category}</div>
                          <div className="flex items-center space-x-4">
                            <span>Due: {invoice.dueDate}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              invoice.confidence >= 95 
                                ? isDark ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-300'
                                : isDark ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            }`}>
                              AI Confidence: {invoice.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-4`}>
                        {invoice.amount}
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition transform hover:scale-105 cursor-pointer">
                          ✓ Approve
                        </button>
                        <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition transform hover:scale-105 cursor-pointer">
                          ✕ Reject
                        </button>
                        <button className={`px-5 py-2.5 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'} text-sm font-medium transition cursor-pointer`}>
                          👁️ Review
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Extracted Data */}
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
                    <div className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'} mb-3`}>
                      🤖 AI Extracted Data:
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className={`${isDark ? 'text-white/50' : 'text-black/50'}`}>Vendor:</span>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-black'} mt-1`}>
                          {invoice.vendor}
                        </div>
                      </div>
                      <div>
                        <span className={`${isDark ? 'text-white/50' : 'text-black/50'}`}>Category:</span>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-black'} mt-1`}>
                          {invoice.category}
                        </div>
                      </div>
                      <div>
                        <span className={`${isDark ? 'text-white/50' : 'text-black/50'}`}>Payment Terms:</span>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-black'} mt-1`}>
                          Net 30
                        </div>
                      </div>
                      <div>
                        <span className={`${isDark ? 'text-white/50' : 'text-black/50'}`}>Items:</span>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-black'} mt-1`}>
                          {invoice.items}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}