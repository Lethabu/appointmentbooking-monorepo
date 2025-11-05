// Monitoring utilities stub
export const logError = (error: Error, context?: any) => console.error(error, context);
export const trackMetric = (name: string, value: number) => console.log(`Metric: ${name} = ${value}`);
export const captureException = (error: Error) => console.error('Exception:', error);
export const trackDemoRequest = (data: any) => console.log('Demo request tracked:', data);
export const trackError = (error: Error, context?: any) => console.error('Error tracked:', error, context);