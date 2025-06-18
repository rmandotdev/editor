import Head from "next/head";
import App from "../components/App";

export default function Home() {
  return (
    <>
      <Head>
        <title>GameRoMan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cousine&display=block"
        />
      </Head>

      <App />
    </>
  );
}
