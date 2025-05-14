import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class NotificationService {
  // Get all notifications for a user
  async getNotifications(userId, limit = 50, offset = 0, onlyUnread = false) {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        params: { userId, limit, offset, onlyUnread }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId) {
    try {
      const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const response = await axios.post(`${API_URL}/notifications/read-all`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Create a notification (this would typically be called from the server-side)
  async createNotification(notificationData) {
    try {
      const response = await axios.post(`${API_URL}/notifications`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();
