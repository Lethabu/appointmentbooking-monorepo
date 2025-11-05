// Analytics utilities stub
export const trackEvent = (event: string, properties?: any) => {
  console.log(`Analytics: ${event}`, properties);
};

export const trackPageView = (page: string) => {
  console.log(`Page view: ${page}`);
};

export const identifyUser = (userId: string, traits?: any) => {
  console.log(`Identify user: ${userId}`, traits);
};

export const analytics = {
  track: trackEvent,
  page: trackPageView,
  identify: identifyUser
};