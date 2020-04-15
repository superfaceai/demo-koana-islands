import React from "react";
import { Box } from "rebass";

const Container = props => (
  <Box
    {...props}
    sx={{
      maxWidth: "75rem",
      marginLeft: "auto",
      marginRight: "auto",
      paddingLeft: "20px",
      paddingRight: "20px",
      boxSizing: "border-box"
    }}
  >
    {props.children}
  </Box>
);

export default Container;
