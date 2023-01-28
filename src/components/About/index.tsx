import { Box } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";

const About: React.FC = () => {
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
          About
        </Box>
        <Box my={"50px"} maxWidth={"700px"} mx={"auto"} lineHeight={2}>
          <p>
            It’s simple - 1 Million pixels divided into 10,000 Tiles ( 1 Tile =
            100 pixels ). To buy a tile you have to burn 100 MOONs.
          </p>{" "}
          <p>
            MoonPlace is inspired by r/Place and{" "}
            <a
              href="http://www.milliondollarhomepage.com"
              target={"_blank"}
              rel={"noreferrer"}
              style={{ textDecoration: "underline", wordWrap: "break-word" }}
            >
              http://www.milliondollarhomepage.com
            </a>{" "}
            while adding web3 functionality.
          </p>{" "}
          <p>
            Users who mint retain ownership even if this website shuts down, the NFTs will still exist on
            the Arbitrum Nova blockchain forever! 
          </p>{" "}
          <p>And anyone can make new website that displays the pixels.</p>
        </Box>
      </Box>
    </Container>
  );
};

export default About;
