// Google Analytics with proxy support
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Types
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ) => void;
    dataLayer: any[];
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    transport_url: '/g/collect',
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!GA_TRACKING_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    transport_url: '/g/collect',
  });
};

// Initialize GA
export const initGA = () => {
  if (!GA_TRACKING_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    transport_url: '/g/collect',
  });
}; 