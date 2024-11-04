import React from 'react';
import { toast } from 'sonner';

interface NotificationProps {
  type: 'info' | 'success' | 'error';
  title: string;
  message: React.ReactNode;
  duration?: number;
}

// Initialize audio with preload
const notificationSound = new Audio('https://vz.weagree.org/audio/inbound.mp3');
notificationSound.preload = 'auto';

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export const showNotification = ({ type, title, message, duration = 8000 }: NotificationProps) => {
  const playSound = async () => {
    try {
      notificationSound.currentTime = 0;
      await notificationSound.play();
    } catch (error) {
      console.debug('Error playing notification sound:', error);
    }
  };

  toast(
    <div className="flex flex-col gap-2">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600">{message}</div>
    </div>,
    {
      duration,
      dismissible: true,
      onDismiss: () => {
        // Handle dismiss
      },
      onAutoClose: () => {
        // Handle auto close
      },
      onOpen: () => {
        playSound();
      },
      action: {
        label: "Dismiss",
        onClick: () => {
          // Handle manual dismiss
        }
      }
    }
  );
};