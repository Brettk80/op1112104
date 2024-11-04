import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Lock, 
  Key, 
  Copy, 
  Loader2, 
  Eye, 
  EyeOff,
  Shield,
  Clock,
  Bell,
  History,
  Smartphone,
  LogOut,
  AlertTriangle,
  QrCode,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Password validation schema with enhanced security requirements
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Session timeout options
const timeoutOptions = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' }
];

// Mock active sessions data
const activeSessions = [
  {
    id: '1',
    device: 'Chrome on Windows',
    location: 'San Francisco, CA',
    ip: '192.168.1.1',
    lastActive: '2024-03-20T15:30:00Z',
    current: true
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'New York, NY',
    ip: '192.168.1.2',
    lastActive: '2024-03-20T14:00:00Z',
    current: false
  }
];

// Mock audit log data
const auditLogs = [
  {
    id: '1',
    event: 'Password changed',
    timestamp: '2024-03-20T15:30:00Z',
    ip: '192.168.1.1',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    event: 'New API key generated',
    timestamp: '2024-03-19T10:15:00Z',
    ip: '192.168.1.1',
    location: 'San Francisco, CA'
  }
];

type PasswordFormData = z.infer<typeof passwordSchema>;

const SecuritySettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(15);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'sessions' | 'notifications' | 'audit'>('general');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      setIsVerifyingPassword(true);
      // Simulate password history check
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock password history validation
      const isPasswordReused = false;
      if (isPasswordReused) {
        toast.error('Password has been used in the last 10 changes');
        return;
      }

      toast.success('Password updated successfully');
      reset();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleMfaSetup = async () => {
    try {
      // Simulate MFA setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMfaEnabled(true);
      setShowMfaSetup(false);
      toast.success('Two-factor authentication enabled');
    } catch (error) {
      toast.error('Failed to enable two-factor authentication');
    }
  };

  const handleSessionTimeout = async (value: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessionTimeout(value);
      toast.success('Session timeout updated');
    } catch (error) {
      toast.error('Failed to update session timeout');
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Session terminated');
    } catch (error) {
      toast.error('Failed to terminate session');
    }
  };

  const handleExportAuditLog = () => {
    // Create CSV content
    const csvContent = [
      ['Event', 'Timestamp', 'IP Address', 'Location'],
      ...auditLogs.map(log => [
        log.event,
        log.timestamp,
        log.ip,
        log.location
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `security-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Audit log downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'general', label: 'General', icon: Shield },
              { id: 'sessions', label: 'Sessions', icon: Clock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'audit', label: 'Audit Log', icon: History }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* General Security Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Password Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Password Security</h2>
              </div>
              <span className="text-sm text-gray-500">
                Last changed: 30 days ago
              </span>
            </div>

            <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...register('currentPassword')}
                    className="block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    className="block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum 12 characters</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• At least one number</li>
                  <li>• At least one special character</li>
                  <li>• Cannot reuse last 10 passwords</li>
                  <li>• Must be changed every 60 days</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h2>
              </div>
              {mfaEnabled ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Enabled
                </span>
              )}
            </div>

            {!mfaEnabled ? (
              <div className="text-center">
                <button
                  onClick={() => setShowMfaSetup(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Set Up Two-Factor Authentication
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Two-factor authentication is enabled for your account. You'll need to enter a verification code when signing in or performing sensitive actions.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowMfaSetup(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Recovery Codes
                  </button>
                  <button
                    onClick={() => setMfaEnabled(false)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Disable 2FA
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Key className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
              </div>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showApiKey ? 'Hide' : 'Show'} API Key
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Production API Key</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('sk_live_1234567890abcdef');
                      toast.success('API key copied to clipboard');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-mono text-gray-600">
                  {showApiKey ? 'sk_live_1234567890abcdef' : '••••••••••••••••'}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: Mar 15, 2024</span>
                  <span>Last used: 2 hours ago</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    // Generate new API key
                    toast.success('New API key generated');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Generate New Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Session Management</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Session Timeout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => handleSessionTimeout(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {timeoutOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Your session will automatically end after this period of inactivity
              </p>
            </div>

            {/* Active Sessions List */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current Session
                            </span>
                          )}
                        </p>
                        <div className="mt-1 text-xs text-gray-500 space-y-1">
                          <p>Location: {session.location}</p>
                          <p>IP Address: {session.ip}</p>
                          <p>Last active: {new Date(session.lastActive).toLocaleString()}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Security Notifications</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      Security Alerts
                    </label>
                    <p className="text-sm text-gray-500">
                      Get notified about important security events
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      New Device Login
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive alerts when your account is accessed from a new device
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-700">
                      Password Changes
                    </label>
                    <p className="text-sm text-gray-500">
                      Get notified when your password is changed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Notification Frequency</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Security Updates
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option>Instant</option>
                    <option>Daily Digest</option>
                    <option>Weekly Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quiet Hours
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="time"
                      defaultValue="07:00"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Non-critical notifications will be held during these hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <History className="h-6 w-6 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Security Audit Log</h2>
            </div>
            <button
              onClick={handleExportAuditLog}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </button>
          </div>

          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {log.event}
                    </p>
                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                      <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                      <p>Location: {log.location}</p>
                      <p>IP Address: {log.ip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MFA Setup Modal */}
      {showMfaSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Set Up Two-Factor Authentication
              </h3>
              <button
                onClick={() => setShowMfaSetup(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <QrCode className="h-48 w-48 text-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="mt-1 block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-700">
                      Save these backup codes in a secure location. You'll need them if you lose access to your authentication device.
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <code key={i} className="text-xs bg-white px-2 py-1 rounded">
                          {Math.random().toString(36).substring(2, 8).toUpperCase()}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMfaSetup(false)}
                  className="px-4 py-2 text-smfont-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMfaSetup}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;