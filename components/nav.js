import React from "react";
import NextLink from "next/link";
import Container from "../containers/container";

import { Box, Flex, Image, Text, Link } from "rebass";

const Nav = props => (
  <Box
    fontFamily="Ubuntu"
    variant="technicalBackground"
    color="white"
    sx={{
      borderTop: "0px solid #000",
      borderRight: "0px solid #000",
      borderBottom: "1px solid #c8c8c8",
      borderLeft: "0px solid #000",
      lineHeight: "3em",
      backgroundColor: "#1d1e1f",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.15' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")"
    }}
  >
    <Container>
      <Flex>
        <Box width={1 / 2}>
          <a style={{ textDecoration: "none" }} href="/">
            <Box>
              <Image src="logo-500.svg" height="2em" verticalAlign="middle" />
              superface demo
            </Box>
          </a>
        </Box>

        <Box width={1 / 2} textAlign="right">
          <a href="https://superface.ai">superface.ai</a>
        </Box>
      </Flex>
    </Container>
  </Box>
);

export default Nav;
