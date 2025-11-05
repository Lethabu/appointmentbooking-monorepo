// AISensy stub
export const sendWhatsAppMessage = () => Promise.resolve({ success: true });
export const createAutomation = () => Promise.resolve({ id: 'test' });

export const syncCatalog = (items: any[]) => Promise.resolve({ success: true, synced: items.length });

export const sendAbandonedCartReminder = (phone: string, data: any) => Promise.resolve({ success: true });

export const aisensy = {
  sendWhatsAppMessage,
  createAutomation,
  syncCatalog,
  sendAbandonedCartReminder
};