/**
 * API helper functions for authentication and request handling
 */

/**
 * Gets authentication headers for API requests
 * @returns {Object} Headers object with authorization token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Handles API response errors
 * @param {Response} response - Fetch API response object
 * @returns {Promise} Resolved with JSON data or rejected with error
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'An error occurred with the request');
  }
  return response.json();
};