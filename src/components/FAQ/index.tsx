import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import styled from "styled-components";
import { BsChevronDown } from "react-icons/bs";

const data = [
  {
    q: "How many pixels are available?",
    a: "1,000,000 pixels are available. Pixels are sold in 10x10 tiles (100 pixels)",
  },
  { q: "What’s the price for each tile?", a: "100 Moons" },
  {
    q: "Is it an NFT?",
    a: "Yes, each tile of 100 pixels is an NFT, there are a total of 10,000 NFTs available for minting.",
  },
  { q: "Can I sell these tiles on an NFT Marketplace? OpenSea?", a: "Yes, you are free to use minted NFTs however you like. OpenSea recently added support for the Arbitrum Nova network." },
  {
    q: "I bought/minted a tile, can I change it?",
    a: (
      <>
        Yes
        <p style={{ color: "#0a1123" }}>
          • Click on View My Tiles on the PixelMap splash page to review your owned NFTs 
          (highlighted in hed borders)
        </p>
        <p style={{ color: "#0a1123" }}>
          • Click each owned NFT to change the pixels however you like.
        </p>
        <p style={{ color: "#0a1123" }}>
          • Click on “Update” and send the transaction.
        </p>
        <p style={{ color: "#0a1123" }}>• The NFT just got updated!</p>
      </>
    ),
  },
  {
    q: "Is there any fee for updating the NFTs?",
    a: "No, just the network fees (gas).",
  },
  {
    q: "What are Black Tiles?",
    a: (
      <>
        <p style={{ color: "#0a1123" }}>
          Some users may update inappropriate or NSFW images onto tiles. Moderators can censor those tiles
          (just from the frontend/website)
        </p>{" "}
        <p style={{ color: "#0a1123" }}>
          Tiles are decentralized and once you buy them, only you can change
          them
        </p>{" "}
        <p style={{ color: "#0a1123" }}>
          Additionally, anyone can build their own frontend and display the tiles
        </p>
      </>
    ),
  },
  {
    q: "Can you buy multiple tiles?",
    a: "Yes, click on Multi Tiles, select all the tiles you want and click Buy Tiles.",
  },
  {
    q: "What are Moons?",
    a: "Moons are part of Reddit's Community Points project, Moons are the native currency of r/Cryptocurrency- the biggest Crypto community on the Internet.",
  },
  { q: "Which network is this project built on?", a: "Arbitrum Nova." },
  {
    q: "How can I buy Moons?",
    a: (
      <a
        href="https://www.coingecko.com/en/coins/moon#markets"
        target={"_blank"}
        rel={"noreferrer"}
        style={{
          color: "#0a1123",
          textDecoration: "underline",
          wordWrap: "break-word",
        }}
      >
        https://www.coingecko.com/en/coins/moon
      </a>
    ),
  },
];

const FAQ: React.FC = () => {
  return (
    <Container>
      <Box
        minHeight={{
          xs: "calc(100vh - 205px)",
          sm: "calc(100vh - 156px)",
          md: "calc(100vh - 166px)",
        }}
      >
        <Box
          color={"#97afd5"}
          fontWeight={600}
          fontSize={"50px"}
          textAlign={"center"}
          pt={"30px"}
        >
          FAQ
        </Box>
        <Box my={"30px"} maxWidth={"700px"} mx={"auto"}>
          {data.map((item) => (
            <Accordion key={item.q} style={{ marginBottom: "20px" }}>
              <StyledAccordionSummary
                expandIcon={<BsChevronDown></BsChevronDown>}
              >
                {item.q}
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <Box pt={"15px"} lineHeight={1.5}>
                  {item.a}
                </Box>
              </StyledAccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

const StyledAccordionSummary = styled(AccordionSummary)`
  box-shadow: 0px 2px 20px 0.5px rgb(151 175 213 / 20%);
  background-color: #0a1123 !important;
  color: #97afd5 !important;
  line-height: 1.5;

  & .MuiAccordionSummary-content {
    margin: 20px 0 !important;
    &.Mui-expanded {
      margin: 20px 0 !important;
    }
  }

  & .MuiAccordionSummary-expandIconWrapper {
    color: #97afd5 !important;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  background: #97afd5;
  color: #0a1123;
`;

export default FAQ;
