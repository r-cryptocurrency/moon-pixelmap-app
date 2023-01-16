import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { FaTwitter, FaTelegram, FaGlobe, FaEthereum } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={{ xs: "column", sm: "row-reverse" }}
      alignItems={"center"}
      justifyContent={{ xs: "start", sm: "space-between" }}
      padding={{ sm: "10px 25px", md: "30px 60px" }}
      height={{ xs: "130px", sm: "80px" }}
      overflow={"hidden"}
      bgcolor={"#0a1122"}
      position={"relative"}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        padding={{ xs: "25px 0 10px", sm: "0" }}
      >
        <ContactIcon
          href="https://twitter.com/ccmod_?s=21&t=43eGZLcOCtAEtYNhBXSfgw"
          target={"_blank"}
        >
          <FaTwitter></FaTwitter>
        </ContactIcon>
        <ContactIcon
          href="https://t.me/rCryptoCurrencyOfficial"
          target={"_blank"}
        >
          <FaTelegram></FaTelegram>
        </ContactIcon>
        <ContactIcon
          href="https://www.reddit.com/r/CryptoCurrency"
          target={"_blank"}
        >
          <FaGlobe></FaGlobe>
        </ContactIcon>
        <ContactIcon
          href="https://mumbai.polygonscan.com/address/0x66FF1BcdCD50bB234B7A2102cF0875dfca60E703#code"
          target={"_blank"}
        >
          <FaEthereum></FaEthereum>
        </ContactIcon>
      </Box>
      <Box
        component={"hr"}
        width={"100%"}
        borderColor={"#3e507a"}
        display={{ sm: "none" }}
      ></Box>
      <Box
        textAlign={"center"}
        padding={{ xs: "8px", sm: "0" }}
        color="#97afd5"
        fontSize={{ xs: "13px", sm: "16px" }}
      >
        ©{new Date().getFullYear()} MoonPlace, All Rights Reserved
      </Box>
    </Box>
  );
};

const ContactIcon = styled.a`
  width: 40px;
  height: 40px;

  background-color: rgba(255, 255, 255, 0.05);
  margin: 0 8px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #97afd5;
  transition: all 0.3s;

  > svg {
    transition: all 0.3s;
  }

  :hover {
    * {
      color: #f42f54 !important;
    }
    background-color: #eee;
  }

  @media (max-width: 599px) {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
`;

export default Footer;
