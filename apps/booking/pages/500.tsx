export default function Custom500() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#f5f5f5'
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>500</h1>
        <p style={{ fontSize: '1.25rem', marginTop: '1rem', color: '#666' }}>
          Server error occurred
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Go home
        </a>
      </div>
    </div>
  )
}
