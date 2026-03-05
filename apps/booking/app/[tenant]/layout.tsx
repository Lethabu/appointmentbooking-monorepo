
export async function generateStaticParams() {
  // Add all tenant slugs you want to statically export
  return [
    { tenant: 'instylehairboutique' },
    // Add more tenants as needed
  ];
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}