import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsChevronDown } from "react-icons/bs";
import { useAccount } from "wagmi";

import useBoardContext from "../../hooks/useBoardContext";
import useViewBlockContext from "../../hooks/useViewBlockContext";

const BlockList: React.FC = () => {
  const { open, setOpen } = useViewBlockContext();
  const { blocks } = useBoardContext();
  const [myBlocks, setMyBlocks] = useState<{ x: number; y: number }[]>([]);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      const list: { x: number; y: number }[] = [];
      for (let i = 0; i < 10000; i++) {
        if (blocks[i].owner?.toLowerCase() === address?.toLowerCase())
          list.push({ x: ~~(i / 100), y: i % 100 });
      }
      setMyBlocks([...list]);
    }
  }, [blocks, address]);

  useEffect(() => {
    setOpen(false);
  }, [isConnected]);

  return isConnected ? (
    <StyledAccordion expanded={open} onChange={() => setOpen(!open)}>
      <StyledAccordionSummary
        expandIcon={<BsChevronDown></BsChevronDown>}
        aria-controls="my-blocks-content"
        id="my-blocks-header"
      >
        <Box
          component={"span"}
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          View My Tiles:
        </Box>
        <Box component={"span"}>{myBlocks.length}</Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <BlocksContainer>
          <BlocksList component={"ul"}>
            {myBlocks.length > 0 ? (
              myBlocks.map((block, i) => (
                <ListItem component={"li"} key={i}>{`(${block.x * 10 + 1}, ${
                  block.y * 10 + 1
                }) - (${block.x * 10 + 10}, ${block.y * 10 + 10})`}</ListItem>
              ))
            ) : (
              <Box>None</Box>
            )}
          </BlocksList>
        </BlocksContainer>
      </StyledAccordionDetails>
    </StyledAccordion>
  ) : null;
};

const BlocksContainer = styled(Box)`
  background-color: #040811;
  width: 170px;
  margin: 0;
  padding: 38px 10px 7px;
  border-radius: 15.5px;
  z-index: 1;

  color: #97afd5;
`;

const BlocksList = styled(Box)`
  list-style: none;
  padding: 0;
  overflow-y: auto;
  margin: 0;
  max-height: 150px;
`;

const ListItem = styled(Box)`
  font-size: 10px;
  padding: 5px 0;
  :not(:last-child) {
    border-bottom: 1px dotted #2f4781;
  }
`;

const StyledAccordion = styled(Accordion)`
  margin-bottom: 35px !important;
  background: none !important;
  box-shadow: none !important;

  &.Mui-expanded {
    margin: 0 0 5px 0 !important;
  }

  & .MuiCollapse-root {
    margin-top: -27px;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  padding: 8px 12px !important;
  border-radius: 50rem !important;
  width: 170px;
  background-color: #0a1123 !important;
  font-weight: bold;
  color: #97afd5 !important;
  min-height: auto !important;
  overflow: hidden;

  &.Mui-expanded {
    min-height: auto !important;
  }
  & .MuiAccordionSummary-content {
    margin: 0 !important;
    justify-content: space-between;
    padding-right: 10px;
  }
  & .MuiAccordionSummary-expandIconWrapper {
    color: #97afd5 !important;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 0 !important;
`;

export default BlockList;
