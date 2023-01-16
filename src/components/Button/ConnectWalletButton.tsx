import React from "react";
import styled from "styled-components";
import { SlWallet } from "react-icons/sl";
import { Hidden } from "@mui/material";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { getAbbrAddress } from "../../common/utils";
import useWalletModal from "../../hooks/useWalletModalContext";
import useRedditNameContext from "../../hooks/useRedditNameContext";

const ConnectWalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { setMode } = useWalletModal();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { name } = useRedditNameContext();

  const switchHandler = () => {
    switchNetworkAsync?.(42170).then();
  };

  return !isConnected ? (
    <StyledButton onClick={() => setMode(1)} type="button">
      <SlWallet></SlWallet>
      <Hidden smDown>Connect Wallet</Hidden>
    </StyledButton>
  ) : chain?.unsupported ? (
    <StyledButton
      onClick={switchHandler}
      type="button"
      style={{
        backgroundColor: "#f42f54",
        borderColor: "#f42f54",
        color: "white",
      }}
    >
      Wrong network
    </StyledButton>
  ) : (
    <StyledButton onClick={() => setMode(2)} type="button">
      {name && name.length > 1 ? name : getAbbrAddress(address ?? "")}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex !important;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  background: none;
  border-color: #97afd5;
  font-size: 16px;
  font-weight: 700;
  border-radius: 10rem;
  border-style: solid;
  color: #97afd5;

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
    overflow: hidden;
  }
  @media (max-width: 599px) {
    padding: 8px 8px;
    font-size: 12px;
    overflow: hidden;
  }
`;

export default ConnectWalletButton;
