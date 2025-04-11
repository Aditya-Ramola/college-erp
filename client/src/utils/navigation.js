/**
 * Navigation utilities for handling browser navigation
 */

/**
 * Handles navigation back to the main app
 * Prevents getting stuck in a redirect loop with the login page
 * @param {function} navigate - React Router navigate function
 * @param {string} route - Route to navigate to
 */
export const navigateWithoutLoop = (navigate, route) => {
  // Replace the current history entry instead of pushing a new one
  // This prevents back button from sending user to login page again
  navigate(route, { replace: true });
};

/**
 * Custom event listener setup for handling page reloads
 * Only reloads on bfcache navigation events (back/forward)
 */
export const setupPageReloadListener = () => {
  const handlePageShow = (event) => {
    // Only reload if coming from cache (bfcache navigation)
    if (event.persisted) {
      window.location.reload();
    }
  };

  // Add the event listener
  window.addEventListener('pageshow', handlePageShow);

  // Return cleanup function
  return () => {
    window.removeEventListener('pageshow', handlePageShow);
  };
}; 