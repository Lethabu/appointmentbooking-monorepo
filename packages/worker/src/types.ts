// packages/worker/src/types.ts

export interface BookingRequest {
    tenantId: string;
    name: string;
    email: string;
    phone: string;
    serviceId: string;
    scheduledTime: string;
    notes?: string;
}
