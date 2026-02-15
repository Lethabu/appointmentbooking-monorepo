export type TenantConfig = {
  slug: string;
  name: string;
  domains: string[];
  route: string;
  apiBaseUrl: string;
};

function normalizeHost(host: string): string {
  const lower = host.trim().toLowerCase().replace(/\.$/, '');
  const withoutPort = lower.split(':')[0];
  return withoutPort.startsWith('www.') ? withoutPort.slice(4) : withoutPort;
}

const PLATFORM_ROUTE = '/platform';

const tenants: TenantConfig[] = [
  {
    slug: 'platform',
    name: 'AppointmentBooking.co.za',
    domains: [
      'appointmentbooking.co.za',
      'www.appointmentbooking.co.za',
      'appointmentbooking-coza.pages.dev',
      'appointment-booking-coza.pages.dev',
      'appointmentbooking-booking.pages.dev',
      'localhost',
      '127.0.0.1',
    ],
    route: PLATFORM_ROUTE,
    apiBaseUrl: 'https://appointmentbooking-worker.houseofgr8ness.workers.dev',
  },
  {
    slug: 'instylehairboutique',
    name: 'InStyle Hair Boutique',
    domains: [
      'instylehairboutique.co.za',
      'www.instylehairboutique.co.za',
      'instyle-hair-boutique.co.za',
      'www.instyle-hair-boutique.co.za',
      'instylehairboutique.pages.dev',
      'instyle-hair-boutique.pages.dev',
    ],
    route: '/instylehairboutique',
    apiBaseUrl: 'https://appointmentbooking-worker.houseofgr8ness.workers.dev',
  },
];

const defaultTenant = tenants[0];

export function getTenants(): TenantConfig[] {
  return tenants;
}

export function resolveTenantByHost(host?: string | null): TenantConfig {
  if (!host) return defaultTenant;
  const normalized = normalizeHost(host);
  const match = tenants.find((tenant) =>
    tenant.domains.some((domain) => normalizeHost(domain) === normalized),
  );
  return match ?? defaultTenant;
}

export function resolveRouteByHost(host?: string | null): TenantConfig {
  return resolveTenantByHost(host);
}

export function resolveTenantBySlug(slug: string): TenantConfig | undefined {
  return tenants.find((tenant) => tenant.slug === slug);
}

export { PLATFORM_ROUTE, defaultTenant as DEFAULT_TENANT_CONFIG };
