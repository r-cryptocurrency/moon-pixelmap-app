import { Box } from "@mui/material";
import styled from "styled-components";

const StyledButton = styled<any>(Box)`
  border-radius: 50rem;
  padding: 12px 24px;
  background-color: ${(props) => props.maincolor ?? "#f42f54"};
  color: white;
  transition: all 0.3s;
  text-align: center;
  cursor: pointer;

  :hover {
    background-color: white;
    color: ${(props) => props.maincolor ?? "#f42f54"};
  }
`;

export default StyledButton;
