import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-bell-container">
      <button 
        className="btn btn-icon position-relative"
        onClick={togglePanel}
        aria-label="Notifications"
      >
        <i className="bi bi-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 99 ? '99+' : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </button>
      
      <NotificationPanel 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export default NotificationBell;
