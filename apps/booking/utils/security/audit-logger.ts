// Placeholder for audit logger
export function logAuditEvent(event: string, details: any) {
  console.log(`[AUDIT] ${event}:`, details);
}

export class AuditLogger {
  static log(event: string, details: any) {
    logAuditEvent(event, details);
  }
}

