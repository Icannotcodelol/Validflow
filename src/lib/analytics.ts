type EventParams = {
  [key: string]: string | number | boolean | Record<string, string | number | boolean>;
};

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'consent',
      action: string,
      params?: EventParams
    ) => void;
  }
}

/**
 * Track a page view in GA4
 * @param url The URL of the page
 * @param title The title of the page
 */
export const pageView = (url: string, title: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_view', {
      page_location: url,
      page_title: title,
    });
  }
};

/**
 * Track a custom event in GA4
 * @param eventName Name of the event
 * @param params Additional parameters for the event
 */
export const trackEvent = (eventName: string, params: EventParams = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
};

/**
 * Set user properties in GA4
 * @param properties User properties to set
 */
export const setUserProperties = (properties: Record<string, string | number | boolean>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      user_properties: properties,
    });
  }
}; 