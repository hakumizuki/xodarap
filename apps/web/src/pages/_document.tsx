import {
  default as Document,
  type DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

type Props = DocumentProps;

class MyDocument extends Document<Props> {
  override render() {
    const locale = this.props.locale;

    return (
      <Html lang={locale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Example to process graceful shutdowns (ie: closing db or other resources)
// https://nextjs.org/docs/deployment#manual-graceful-shutdowns
if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  // this should be added in your custom _document
  process.on("SIGTERM", () => {
    console.log("Received SIGTERM: ", "cleaning up");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("Received SIGINT: ", "cleaning up");
    process.exit(0);
  });
}

export default MyDocument;
