import React, { useState, useRef, useEffect } from 'react';
import { Bell, Package2, Video, FileText, Mail, BarChart3, HelpCircle, X, Send, Ban, Settings, ChevronDown, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Inbox from './Inbox';
import FaxBroadcast from './fax/FaxBroadcast';
import BroadcastReports from './reports/BroadcastReports';
import SettingsLayout from './settings/SettingsLayout';
import ProfileSettings from './settings/ProfileSettings';
import BillingDashboard from './billing/BillingDashboard';

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [activeSection, setActiveSection] = useState<'inbox' | 'broadcast' | 'reports' | 'settings' | 'profile' | 'billing'>('inbox');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isAccountOwner = true;

  const sections = [
    { 
      id: 'inbox', 
      label: 'Fax Inbox', 
      icon: Mail,
      onClick: () => setActiveSection('inbox')
    },
    { 
      id: 'broadcast', 
      label: 'Fax Broadcast', 
      icon: Send,
      onClick: () => {
        setActiveSection('broadcast');
        setShowGettingStarted(false);
      }
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3,
      onClick: () => {
        setActiveSection('reports');
        setShowGettingStarted(false);
      }
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: DollarSign,
      onClick: () => {
        setActiveSection('billing');
        setShowGettingStarted(false);
      }
    },
    { 
      id: 'settings', 
      label: 'Block Lists & IVR', 
      icon: Ban,
      onClick: () => {
        setActiveSection('settings');
        setShowGettingStarted(false);
      }
    }
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <h1 className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900">
                    OPENFAX
                  </span>
                  <span className="text-[0.65rem] sm:text-xs sm:ml-2 font-medium text-gray-400 tracking-widest uppercase">
                    Secure Fax Portal
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowGettingStarted(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HelpCircle className="h-6 w-6" />
              </button>
              <div className="relative" ref={notificationRef}>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                  onMouseEnter={() => setShowNotifications(true)}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {/* Notifications dropdown remains the same */}
              </div>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveSection('profile');
                            setShowUserMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </button>
                        <button
                          onClick={() => {
                            setActiveSection('billing');
                            setShowUserMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Billing & Invoices
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          {activeSection !== 'profile' && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={section.onClick}
                        className={`w-full flex items-center p-3 text-left rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {showGettingStarted && activeSection === 'inbox' && (
              <div className="mb-8 bg-white rounded-lg shadow-sm">
                {/* Getting Started section remains the same */}
              </div>
            )}

            <div className="space-y-8">
              {activeSection === 'inbox' && (
                <Inbox 
                  isAccountOwner={isAccountOwner}
                  selectedFax={selectedNotification ? {
                    id: selectedNotification.id,
                    date: selectedNotification.timestamp,
                    fromNumber: selectedNotification.fromNumber,
                    ssid: `FAX${selectedNotification.id}`,
                    toNumber: selectedNotification.toNumber,
                    assignedUser: selectedNotification.userInbox,
                    pageCount: selectedNotification.pages,
                    previewUrl: selectedNotification.previewUrl,
                    pdfUrl: 'https://example.com/fax.pdf'
                  } : null}
                  onFaxSelected={() => setSelectedNotification(null)}
                  onNewFax={(count) => {
                    const newNotification = {
                      id: Date.now().toString(),
                      fromNumber: '+1234567890',
                      toNumber: '+0987654321',
                      userInbox: 'John Doe',
                      pages: Math.floor(Math.random() * 5) + 1,
                      timestamp: new Date().toLocaleString(),
                      read: false,
                      previewUrl: 'https://example.com/fax-preview.jpg'
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                  }} 
                />
              )}
              {activeSection === 'broadcast' && <FaxBroadcast />}
              {activeSection === 'reports' && <BroadcastReports />}
              {activeSection === 'settings' && <SettingsLayout />}
              {activeSection === 'profile' && <ProfileSettings />}
              {activeSection === 'billing' && <BillingDashboard />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;