import React, { useState } from 'react';
import { Phone, Ban } from 'lucide-react';
import BlockListManager from './BlockListManager';
import TollFreeManager from './TollFreeManager';

const SettingsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocklist' | 'tollfree'>('blocklist');

  const tabs = [
    {
      id: 'blocklist',
      name: 'Block List',
      icon: Ban,
      component: BlockListManager
    },
    {
      id: 'tollfree',
      name: 'Toll-Free Service',
      icon: Phone,
      component: TollFreeManager
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || BlockListManager;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'blocklist' | 'tollfree')}
                  className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Component */}
      <ActiveComponent />
    </div>
  );
};

export default SettingsLayout;