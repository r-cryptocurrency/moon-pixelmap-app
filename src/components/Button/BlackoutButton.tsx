import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { BsHeptagonFill, BsHexagon } from "react-icons/bs";

interface Props {
  mode: number;
  onClick: any;
  type: number;
}
const BlackoutButton: React.FC<Props> = (props) => {
  return (
    <StyledButton
      onClick={props.onClick}
      mode={props.mode === props.type ? 1 : 0}
    >
      {props.type === 2 ? (
        <BsHeptagonFill></BsHeptagonFill>
      ) : (
        <BsHexagon></BsHexagon>
      )}
      <Box width={"100%"} textAlign={"center"}>
        {props.type === 2 ? "Black" : "Unblack"}
      </Box>
    </StyledButton>
  );
};

const StyledButton = styled<any>(Box)`
  display: flex !important;
  align-items: center;
  justify-content: stretch;
  gap: 5px;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 8px 15px;
  background: none;
  background-color: ${(props) => (props.mode === 0 ? "#0a1123" : "#3d4660")};
  font-size: 12px;
  font-weight: 700;
  border-radius: 10rem;
  color: ${(props) => (props.mode === 0 ? "#97afd5" : "#97afd5")};
  margin-right: 5px;
  width: 100px;
  margin: 2px 0;

  * {
    color: ${(props) => (props.mode === 0 ? "#97afd5" : "#97afd5")};
  }

  transition: 200ms ease;
  outline: none;

  :hover {
    background-color: #152142;
  }

  @media (max-width: 599px) {
    padding: 8px 8px;
    font-size: 12px;
    font-weight: 500;
  }
`;

export default BlackoutButton;
