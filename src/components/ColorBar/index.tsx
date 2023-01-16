import { Box } from "@mui/material";
import React from "react";

const colors = [
  "#ffffff",
  "#e7e7e7",
  "#8c8c8c",
  "#212121",
  "#ffa6d6",
  "#e70000",
  "#e79600",
  "#a56942",
  "#e7db00",
  "#94e342",
  "#00be00",
  "#00d3de",
  "#0082c6",
  "#0000ef",
  "#ce6de7",
];

interface Props {
  value: string;
  setValue: any;
}

const ColorBar: React.FC<Props> = (props) => {
  return (
    <Box
      zIndex={10000}
      position={"absolute"}
      top={"50%"}
      left={{ xs: "-40px", sm: "-45px" }}
      sx={{ transform: "translate(0, -50%)" }}
      display={"flex"}
      flexDirection={"column"}
      padding={{ xs: "20px 6px", sm: "24px 8px" }}
      bgcolor={"#0a1123"}
      borderRadius={"50rem"}
    >
      {colors.map((color) => (
        <Box
          width={"24px"}
          height={"24px"}
          bgcolor={color}
          key={color}
          border={color === props.value ? "2px solid white" : "none"}
          onClick={() => props.setValue(color)}
          sx={{ cursor: "pointer" }}
        ></Box>
      ))}
    </Box>
  );
};

export default ColorBar;
