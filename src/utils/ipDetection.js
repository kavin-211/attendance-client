import axios from 'axios';

export const getClientIp = async () => {
  try {
    // In a real scenario, we might use a service like ipify or get it from the backend
    // Since we need the public IP or the IP visible to the server
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
};

export const checkWifiConnection = async () => {
  // Browser API doesn't allow direct access to Wifi SSID for security
  // We rely on the backend to validate the IP
  // However, we can use the Network Information API for connection type if supported
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.type === 'wifi' || connection.type === 'ethernet'; // Assuming ethernet is also acceptable office network
    }
  }
  return true; // Fallback to true if API not supported, let backend handle validation
};
