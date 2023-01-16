import { Modal, Box } from "@mui/material";
import React, { useEffect } from "react";
import styled from "styled-components";

import Metamask from "../../assets/image/metamask.svg";
import Coinbase from "../../assets/image/coinbase.svg";
import WalletConnect from "../../assets/image/walletconnect.svg";
import { useAccount, useConnect, useNetwork } from "wagmi";
import useWalletModal from "../../hooks/useWalletModalContext";

const connectImages = [Metamask, WalletConnect, Coinbase];

const WalletConnectModal: React.FC = () => {
  const { mode, setMode } = useWalletModal();
  const { connectAsync, connectors } = useConnect();

  const connectHandler = async (connector: any) => {
    connectAsync({ chainId: 42170, connector }).then(() => {
      setMode(0);
    });
  };

  return (
    <Modal open={mode === 1} onClose={() => setMode(0)}>
      <ModalContent>
        <Box
          color={"white"}
          textAlign={"center"}
          fontWeight={600}
          mt={"6px"}
          pb={"10px"}
          mx={"50px"}
          borderBottom={"2px solid #333335"}
          fontSize={{ xs: "16px", sm: "20px" }}
        >
          Connect a Wallet
        </Box>
        <Box
          display={"flex"}
          mx={{ xs: "12px", sm: "18px" }}
          mt={{ xs: "10px", sm: "20px" }}
        >
          {connectors.map((connector, i) => (
            <WalletItem onClick={() => connectHandler(connector)} key={i}>
              <Box
                component={"img"}
                src={connectImages[i].src}
                width={{ xs: "60px", sm: "80px" }}
                height={{ xs: "60px", sm: "80px" }}
              ></Box>
            </WalletItem>
          ))}
        </Box>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled(Box)`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  outline: none;
  background-color: #1a1b1f;
  border-radius: 24px;
  flex-direction: column;

  @media (max-width: 599px) {
    padding: 15px;
  }
`;

const WalletItem = styled(Box)`
  margin: 0 3px;
  padding: 15px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 24px;
  user-select: none;
  transition: all 0.2s ease-in;

  :hover {
    border: 1px solid #2d2d2f;
    transform: scale(1.05);
  }

  :active {
    filter: blur(2px);
    transform: scale(0.9);
  }

  @media (max-width: 599px) {
    margin: 0;
  }
`;

export default WalletConnectModal;
