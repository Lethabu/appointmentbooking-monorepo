/**
 * 🦅 Sovereign WhatsApp Module
 * Export point for Direct Meta Cloud API integration
 */

export { 
  SovereignWhatsApp, 
  sovereignWhatsApp,
  sendWhatsAppMessage,
  createAutomation,
  syncCatalog,
  sendAbandonedCartReminder,
  aisensy 
} from './client';

export type { WhatsAppMessage, WhatsAppResponse } from './client';
