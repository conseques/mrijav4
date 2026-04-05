import React from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

const getErrorCopy = (error) => {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Page not found',
        description: 'The page you requested does not exist or has been moved.'
      };
    }

    return {
      title: `Error ${error.status}`,
      description: error.statusText || 'Something went wrong while opening this page.'
    };
  }

  return {
    title: 'Something went wrong',
    description: 'The page hit an unexpected error. Please try again or return to the homepage.'
  };
};

const AppRouteError = () => {
  const error = useRouteError();
  const { title, description } = getErrorCopy(error);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
        background: 'linear-gradient(180deg, #f7f1e6 0%, #fffaf4 100%)',
        color: '#1f1a14'
      }}
    >
      <section
        style={{
          width: 'min(100%, 640px)',
          padding: '32px',
          borderRadius: '28px',
          border: '1px solid rgba(96, 72, 45, 0.12)',
          background: 'rgba(255, 255, 255, 0.88)',
          boxShadow: '0 24px 70px rgba(66, 46, 26, 0.12)',
          backdropFilter: 'blur(14px)'
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '12px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#8f6c43'
          }}
        >
          Application recovery
        </p>
        <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05 }}>
          {title}
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: '1rem', lineHeight: 1.7, color: '#5d4833' }}>
          {description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '0 18px',
              borderRadius: '999px',
              background: '#1f1a14',
              color: '#fffaf4',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Go to homepage
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              minHeight: '48px',
              padding: '0 18px',
              border: '1px solid rgba(31, 26, 20, 0.14)',
              borderRadius: '999px',
              background: 'transparent',
              color: '#1f1a14',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reload page
          </button>
        </div>
        {error instanceof Error ? (
          <p style={{ margin: '18px 0 0', fontSize: '0.9rem', color: '#7d6143' }}>
            {error.message}
          </p>
        ) : null}
      </section>
    </main>
  );
};

export default AppRouteError;
