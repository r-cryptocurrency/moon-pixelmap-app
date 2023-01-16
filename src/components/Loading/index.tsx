import React from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";

interface Props {
  open: boolean;
  message?: string;
}

const Loading: React.FC<Props> = (props) => {
  return (
    <Backdrop
      open={props.open}
      sx={{
        color: "#fff",
        zIndex: 100000,
        flexDirection: "column",
        display: props.open ? "flex" : "none",
      }}
    >
      <CircularProgress color="inherit"></CircularProgress>
      <Box mt={"16px"}>{props.message} </Box>
    </Backdrop>
  );
};

export default Loading;
