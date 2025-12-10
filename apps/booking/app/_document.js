// This file is likely not used in App Router or is misplaced.
// If using Pages Router, it should be in `pages/_document.js`.
// If using App Router, use `app/layout.tsx`.
// I will comment it out to fix the lint error for now, as it's causing a lint error because it's in `app/` but importing `next/document`.

/*
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Polyfill browser globals for SSR compatibility
                if (typeof self === 'undefined') {
                  global.self = globalThis;
                }
                if (typeof window === 'undefined') {
                  global.window = globalThis;
                }
                if (typeof document === 'undefined') {
                  global.document = {};
                }
                if (typeof navigator === 'undefined') {
                  global.navigator = {};
                }
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
*/
