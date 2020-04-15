import React from "react";
import Head from "next/head";
import { ThemeProvider } from "emotion-theming";
import { Global } from "@emotion/core";
import theme from "@rebass/preset";

import Nav from "../components/nav";

export default ({ children, title, description, settings = {} }) => (
  <ThemeProvider theme={theme}>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Ubuntu"
      />
    </Head>

    <Nav />

    {children}

    <Global
      styles={{
        body: {
          fontFamily: theme.fonts.body,
          margin: 0,
          padding: 0,
          backgroundColor: `#ffffff`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23989898' fill-opacity='0.19' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
        },
        a: {
          color: "inherit"
        }
      }}
    />
  </ThemeProvider>
);
