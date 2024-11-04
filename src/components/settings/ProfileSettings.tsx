import React, { useState } from 'react';
import { Building2, CreditCard, Mail, Lock, Webhook } from 'lucide-react';
import CompanyInfo from './profile/CompanyInfo';
import PaymentMethods from './profile/PaymentMethods';
import CommunicationPrefs from './profile/CommunicationPrefs';
import SecuritySettings from './profile/SecuritySettings';
import IntegrationSettings from './profile/IntegrationSettings';

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'payment' | 'communication' | 'security' | 'integration'>('company');

  const tabs = [
    {
      id: 'company',
      name: 'Company Information',
      icon: Building2,
      component: CompanyInfo
    },
    {
      id: 'payment',
      name: 'Payment Methods',
      icon: CreditCard,
      component: PaymentMethods
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: Mail,
      component: CommunicationPrefs
    },
    {
      id: 'security',
      name: 'Security',
      icon: Lock,
      component: SecuritySettings
    },
    {
      id: 'integration',
      name: 'Integration',
      icon: Webhook,
      component: IntegrationSettings
    }
  ] as const;

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CompanyInfo;

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
                  onClick={() => setActiveTab(tab.id)}
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

export default ProfileSettings;