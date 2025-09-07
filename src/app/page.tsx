'use client';

import { useState } from 'react';
import CallInterface from '@/components/CallInterface';
import HistoryView from '@/components/HistoryView';

export default function Home() {
  const [activeView, setActiveView] = useState<'call' | 'history'>('call');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Pharmacy Call Automation
              </h1>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveView('call')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'call'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Make Call
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'history'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Call History
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'call' ? <CallInterface /> : <HistoryView />}
      </main>
    </div>
  );
}
