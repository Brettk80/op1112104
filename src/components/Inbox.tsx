import React, { useState, useEffect } from 'react';
import { Eye, Mail, ChevronDown, X, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Fax {
  id: string;
  date: string;
  fromNumber: string;
  ssid: string;
  toNumber: string;
  assignedUser: string;
  pageCount: number;
  previewUrl: string;
  pdfUrl: string;
}

interface InboxProps {
  isAccountOwner: boolean;
  onNewFax: (count: number) => void;
  selectedFax?: Fax | null;
  onFaxSelected?: () => void;
}

interface UserInbox {
  userName: string;
  faxNumber: string;
}

export default function Inbox({ 
  isAccountOwner, 
  onNewFax, 
  selectedFax: initialSelectedFax, 
  onFaxSelected 
}: InboxProps) {
  const [selectedUserInbox, setSelectedUserInbox] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFax, setSelectedFax] = useState<Fax | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSendFax, setShowSendFax] = useState(false);

  useEffect(() => {
    if (initialSelectedFax) {
      setSelectedFax(initialSelectedFax);
      setShowPreview(true);
    }
  }, [initialSelectedFax]);

  // Mock data for demonstration
  const userInboxes: UserInbox[] = [
    { userName: 'All Users', faxNumber: 'all' },
    { userName: 'John Doe', faxNumber: '+18001234567' },
    { userName: 'Jane Smith', faxNumber: '+18001234568' },
  ];

  const [faxes, setFaxes] = useState<Fax[]>([
    {
      id: '1',
      date: '10:30 3/20/24',
      fromNumber: '+18885551234',
      ssid: 'FAX001',
      toNumber: '+18001234567',
      assignedUser: 'John Doe',
      pageCount: 3,
      previewUrl: 'https://example.com/preview1.jpg',
      pdfUrl: 'https://example.com/fax1.pdf'
    },
  ]);

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      const newFax = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          month: 'numeric',
          day: 'numeric',
          year: '2-digit'
        }),
        fromNumber: '+18885559876',
        ssid: `FAX${Math.floor(Math.random() * 1000)}`,
        toNumber: '+18001234567',
        assignedUser: 'John Doe',
        pageCount: Math.floor(Math.random() * 5) + 1,
        previewUrl: 'https://example.com/preview-new.jpg',
        pdfUrl: 'https://example.com/fax-new.pdf'
      };

      setFaxes(prev => [newFax, ...prev]);
      onNewFax(1);

      // Play notification sound
      const audio = new Audio('https://vz.weagree.org/audio/inbound.mp3');
      audio.play().catch(console.error);

      // Show notification
      toast.success(
        <div>
          <div className="font-medium">New Fax Received</div>
          <div className="text-sm">From: {formatPhoneNumber(newFax.fromNumber)}</div>
          <div className="text-sm">To: {formatPhoneNumber(newFax.toNumber)}</div>
          <div className="text-sm text-gray-500">SID: {newFax.ssid}</div>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Dismiss",
            onClick: () => {}
          }
        }
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [onNewFax]);

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
  };

  const filteredFaxes = faxes.filter(fax => 
    selectedUserInbox === 'all' || 
    fax.toNumber === userInboxes.find(u => u.faxNumber === selectedUserInbox)?.faxNumber
  );

  const handleResendEmail = (fax: Fax) => {
    toast.success(`Fax resent to ${fax.assignedUser}'s email`);
  };

  const handleDownload = (fax: Fax) => {
    window.open(fax.pdfUrl, '_blank');
  };

  const handleSendFax = () => {
    setShowSendFax(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedFax(null);
    if (onFaxSelected) {
      onFaxSelected();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Fax Inbox</h2>
          <div className="flex items-center space-x-4">
            <div className="relative inline-block w-64">
              <select
                value={selectedUserInbox}
                onChange={(e) => setSelectedUserInbox(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none bg-white"
              >
                {userInboxes.map((inbox) => (
                  <option key={inbox.faxNumber} value={inbox.faxNumber}>
                    {inbox.userName} {inbox.faxNumber !== 'all' ? `/ ${inbox.faxNumber}` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <button
              onClick={handleSendFax}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Fax
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFaxes.map((fax) => (
              <tr key={fax.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fax.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPhoneNumber(fax.fromNumber)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fax.ssid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPhoneNumber(fax.toNumber)}<br />
                  <span className="text-gray-500">{fax.assignedUser}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fax.pageCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedFax(fax);
                        setShowPreview(true);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleResendEmail(fax)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedFax && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Fax Preview</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>From: {formatPhoneNumber(selectedFax.fromNumber)}</p>
                    <p>To: {formatPhoneNumber(selectedFax.toNumber)} ({selectedFax.assignedUser})</p>
                    <p>Pages: {selectedFax.pageCount}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload(selectedFax)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleResendEmail(selectedFax)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Resend Email
                  </button>
                  <button
                    onClick={handleClosePreview}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-10rem)]">
              <div className="flex justify-between items-center mb-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {selectedFax.pageCount}
                </span>
                <button
                  disabled={currentPage === selectedFax.pageCount}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <img
                src={selectedFax.previewUrl}
                alt={`Fax page ${currentPage}`}
                className="w-full h-auto"
                style={{ aspectRatio: '8.5/11' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}