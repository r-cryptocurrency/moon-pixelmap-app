import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import { BsChevronDown } from "react-icons/bs";
import useBlackList from "../../hooks/useBlackListContext";
import { useSnackbar } from "notistack";

const BlockList: React.FC = () => {
  const { open, setOpen } = useBlackList();
  const { blacks } = useBlackList();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId: any) => (
    <>
      <Box
        onClick={() => {
          setOpen(true);
          closeSnackbar(snackbarId);
        }}
        fontWeight={600}
        color={"#411fff"}
        mr={"8px"}
        sx={{ cursor: "pointer" }}
      >
        Show
      </Box>
      <Box
        onClick={() => {
          setOpen(false);
          closeSnackbar(snackbarId);
        }}
        color={"#fc2c2c"}
        fontWeight={600}
        mr={"8px"}
        sx={{ cursor: "pointer" }}
      >
        Cancel
      </Box>
    </>
  );

  const showBlackList = () => {
    if (!open) {
      enqueueSnackbar(
        "Are you sure you want them to appear? We censored them from the front end as they may be inappropriate / NSFW",
        {
          preventDuplicate: true,
          variant: "warning",
          action,
          autoHideDuration: 7000,
        }
      );
    } else {
      setOpen(!open);
    }
  };

  return blacks.length > 0 ? (
    <StyledAccordion expanded={open} onChange={showBlackList}>
      <StyledAccordionSummary
        expandIcon={<BsChevronDown></BsChevronDown>}
        aria-controls="black-blocks-content"
        id="black-blocks-header"
      >
        <Box
          component={"span"}
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {open ? "Hide" : "Show"} Black Tiles:
        </Box>
        <Box component={"span"}>{blacks.length}</Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <BlocksContainer>
          <BlocksList component={"ul"}>
            {blacks.length > 0 ? (
              blacks.map((block, i) => (
                <ListItem component={"li"} key={i}>{`(${
                  ~~(block / 100) * 10 + 1
                }, ${(block % 100) * 10 + 1}) - (${
                  ~~(block / 100) * 10 + 10
                }, ${(block % 100) * 10 + 10})`}</ListItem>
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
  background: none !important;
  box-shadow: none !important;

  &.Mui-expanded {
    margin: 0 !important;
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
