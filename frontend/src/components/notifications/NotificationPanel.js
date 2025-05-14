import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import './NotificationPanel.css';

function NotificationPanel({ isOpen, onClose }) {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      case 'danger': return 'bi-exclamation-circle-fill text-danger';
      default: return 'bi-info-circle-fill text-primary';
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    }
    if (diffHour > 0) {
      return `${diffHour}h ago`;
    }
    if (diffMin > 0) {
      return `${diffMin}m ago`;
    }
    return 'Just now';
  };

  if (!isOpen) return null;

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h6>Notifications</h6>
        <div>
          {unreadCount > 0 && (
            <button 
              className="btn btn-link btn-sm text-decoration-none"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
          <button 
            className="btn-close btn-sm ms-2" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
      
      <div className="notification-content">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-bell-slash fs-4 mb-2"></i>
            <p className="mb-0">No notifications yet</p>
          </div>
        ) : (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification._id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  <i className={`bi ${getNotificationIcon(notification.type)}`}></i>
                </div>
                <div className="notification-body">
                  {notification.link ? (
                    <Link 
                      to={notification.link} 
                      className="notification-title"
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification._id);
                        }
                        onClose();
                      }}
                    >
                      {notification.title}
                    </Link>
                  ) : (
                    <div className="notification-title">{notification.title}</div>
                  )}
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{formatRelativeTime(notification.createdAt)}</div>
                </div>
                <div className="notification-actions">
                  {!notification.isRead && (
                    <button 
                      className="btn btn-sm btn-link text-decoration-none p-0 me-2"
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <i className="bi bi-check2"></i>
                    </button>
                  )}
                  <button 
                    className="btn btn-sm btn-link text-decoration-none text-danger p-0"
                    onClick={() => deleteNotification(notification._id)}
                    title="Delete notification"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
