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
