export function formatApiError(err) {
  // Axios-like error handling
  const serverMessage = err?.response?.data?.message;
  const status = err?.response?.status;
  const netMsg = err?.message || '';

  if (serverMessage) {
    // Map internal DB timeouts and similar to a friendly message
    if (serverMessage.toLowerCase().includes('buffering timed out') || serverMessage.toLowerCase().includes('failed to connect')) {
      return 'Server is temporarily unavailable. Try again later.';
    }
    return serverMessage;
  }

  if (netMsg.toLowerCase().includes('network')) return 'Unable to reach server. Check your connection.';
  if (status >= 500) return 'Server error. Please try again later.';

  return netMsg || 'An unexpected error occurred';
}
