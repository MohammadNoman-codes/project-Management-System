import React, { createContext, useState, useEffect, useContext } from 'react';
import NotificationService from '../services/NotificationService';

// Create the notification context
const NotificationContext = createContext();

// This hook will be used to access the notification context
export const useNotifications = () => useContext(NotificationContext);

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // In a real app, this would come from the auth context
  const mockUserId = '1'; // simulated authenticated user ID
  
  // Load notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling to fetch notifications periodically
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getNotifications(mockUserId);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error(err);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(mockUserId);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to mark all notifications as read');
      console.error(err);
    }
  };
  
  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      const updatedNotifications = notifications.filter(n => n._id !== notificationId);
      setNotifications(updatedNotifications);
      
      // Update unread count if the deleted notification was unread
      const wasUnread = notifications.find(n => n._id === notificationId && !n.isRead);
      if (wasUnread) {
        setUnreadCount(prev => prev - 1);
      }
    } catch (err) {
      setError('Failed to delete notification');
      console.error(err);
    }
  };
  
  // Add a notification (typically this would be triggered by WebSocket in a real app)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };
  
  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
