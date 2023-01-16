import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { RiShoppingBagLine } from "react-icons/ri";
import useBatchContext from "../../hooks/useBatchContext";

interface Props {
  mode: number;
  onClick: any;
}
const SelectButton: React.FC<Props> = (props) => {
  const { batches } = useBatchContext();
  return (
    <StyledButton onClick={props.onClick} mode={props.mode === 1 ? 1 : 0}>
      <RiShoppingBagLine></RiShoppingBagLine>
      {props.mode === 1 && batches.length > 0 ? "Buy Tiles" : "Multi Tiles"}
    </StyledButton>
  );
};

const StyledButton = styled<any>(Box)`
  display: flex !important;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 20px;
  background: none;
  border-color: ${(props) => (props.mode === 0 ? "#97afd5" : "#f42f54")};
  background-color: ${(props) => (props.mode === 0 ? "none" : "#f42f54")};
  font-size: 16px;
  font-weight: 700;
  border-radius: 10rem;
  border-style: solid;
  border-width: 2px;
  color: ${(props) => (props.mode === 0 ? "#97afd5" : "white")};
  margin-right: 5px;

  * {
    color: ${(props) => (props.mode === 0 ? "#97afd5" : "white")};
  }

  transition: 200ms ease;
  outline: none;

  :hover {
    background-color: #f42f54;
    border-color: #f42f54;
    color: white;
    * {
      color: white;
    }
  }

  @media (max-width: 899px) {
    padding: 10px 10px;
    font-size: 14px;
    font-weight: 600;
  }
  @media (max-width: 599px) {
    padding: 8px 8px;
    font-size: 12px;
    font-weight: 500;
  }
`;

export default SelectButton;
