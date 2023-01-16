import { Modal, Box } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  useAccount,
  useBalance,
  useContract,
  useContractRead,
  useDisconnect,
  useProvider,
  useSigner,
} from "wagmi";
import {
  MdContentCopy,
  MdLogout,
  MdMode,
  MdDone,
  MdSend,
} from "react-icons/md";
import { useTextWidth } from "@tag0/use-text-width";

import useWalletModal from "../../hooks/useWalletModalContext";
import { getAbbrAddress } from "../../common/utils";
import SVG from "../SVG";
import { useSnackbar } from "notistack";
import useLoadingContext from "../../hooks/useTxLoadingContext";
import useRedditNameContext from "../../hooks/useRedditNameContext";
import { PixelMap, Token } from "../../contracts/config";
import { ethers } from "ethers";

const AccountInfoModal: React.FC = () => {
  const { mode, setMode } = useWalletModal();
  const { address } = useAccount();
  const { data } = useBalance({ address });
  const { disconnectAsync } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [nameIconLeft, setNameIconLeft] = useState(190);
  const [name, setName] = useState("");
  const [nameEdit, setNameEdit] = useState(false);
  const nameWidth = useTextWidth({ text: name, font: "16px Quicksand" });
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { setOpen: setLoadingOpen } = useLoadingContext();
  const { name: redditName, setName: setRedditName } = useRedditNameContext();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const pixelMapContract = useContract({
    address: PixelMap.address[42170],
    abi: PixelMap.abi,
    signerOrProvider: signer ?? provider,
  });
  const { data: moonBalance } = useContractRead({
    address: Token.address[42170],
    abi: Token.abi,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  useEffect(() => {
    if (mode === 2) {
      setNameEdit(false);
      setName(redditName ?? "");
    }
  }, [mode]);

  const disconnectHandler = async () => {
    await disconnectAsync().then(() => setMode(0));
  };

  const copyAddressHandler = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address?.toString());
      setCopied(true);
    }
  }, [address]);

  const nameChangeHandler = (e: any) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const nameHandler = async () => {
    if (nameEdit === false) {
      if (redditName && redditName.length > 1) {
        setName(redditName?.slice(2));
      }
      setNameEdit(true);
    } else {
      if (name.length === 0) {
        enqueueSnackbar("Input your name.", {
          variant: "error",
          preventDuplicate: true,
        });
        return;
      }
      if (name.length >= 12) {
        enqueueSnackbar("Name is too long.", {
          variant: "error",
          preventDuplicate: true,
        });
        return;
      }
      try {
        setLoadingOpen(true);

        const setTx = await pixelMapContract?.setName("u/" + name);
        await setTx.wait();
        setName("u/" + name);
        setRedditName("u/" + name);
        setNameEdit(false);
        setLoadingOpen(false);
      } catch (err) {
        console.log(err);
        setName(redditName ?? "");
        setNameEdit(false);
        setLoadingOpen(false);
      }
      setLoadingOpen(false);
    }
  };

  useEffect(() => {
    if (nameEdit) {
      nameRef.current?.focus();
    }
  }, [nameEdit]);

  useEffect(() => {
    if (name.length) {
      const left = (isNaN(nameWidth) ? 0 : nameWidth) / 2 + 125;
      setNameIconLeft(left > 210 ? 220 : left + 10);
    } else setNameIconLeft(190);
  }, [name]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Modal open={mode === 2} onClose={() => setMode(0)}>
      <ModalContent>
        <Box
          display={"flex"}
          mx={{ xs: "12px", sm: "18px" }}
          flexDirection={"column"}
        >
          <Box textAlign={"center"} mt={"15px"}>
            <SVG address={address ?? ""} size={74}></SVG>
          </Box>
          <Box mt={"10px"} display={"flex"} justifyContent={"center"}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              position={"relative"}
              overflow={"hidden"}
              width={"250px"}
            >
              <Box
                component={"input"}
                placeholder={"Reddit UserName"}
                textAlign={"center"}
                bgcolor={"transparent"}
                p={"6px 30px"}
                sx={{ outline: "none" }}
                color={"white"}
                fontSize={"16px"}
                border={"none"}
                width={"100%"}
                value={name}
                ref={nameRef}
                onChange={nameChangeHandler}
                disabled={!nameEdit}
              ></Box>
              <Box
                position={"absolute"}
                color={"white"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                fontWeight={600}
                width={"30px"}
                height={"100%"}
                left={`${nameIconLeft}px`}
                borderRadius={"0 16px 16px 0"}
                sx={{ cursor: "pointer" }}
                onClick={nameHandler}
              >
                {nameEdit ? <MdSend></MdSend> : <MdMode></MdMode>}
              </Box>
            </Box>
          </Box>
          <Box
            color={"white"}
            fontWeight={800}
            textAlign={"center"}
            mt={"3px"}
            fontSize={"18px"}
          >
            {getAbbrAddress(address ?? "")}
          </Box>
          <Box
            color={"#aaa"}
            fontWeight={600}
            textAlign={"center"}
            mt={"10px"}
            fontSize={"14px"}
          >{`${parseFloat(data?.formatted ?? "0").toFixed(2)} ${
            data?.symbol ?? ""
          }`}</Box>
          {ethers.BigNumber.isBigNumber(moonBalance) ? (
            <Box
              color={"#aaa"}
              fontWeight={600}
              textAlign={"center"}
              mt={"10px"}
              fontSize={"14px"}
            >
              {parseFloat(ethers.utils.formatEther(moonBalance)).toFixed(2)}{" "}
              MOON
            </Box>
          ) : null}
          <Box display={"flex"} mt={"16px"}>
            <ActionBtn onClick={copyAddressHandler} mr={"10px"}>
              <Box mb={"3px"} lineHeight={"max-content"} fontSize={"16px"}>
                {copied ? <MdDone></MdDone> : <MdContentCopy></MdContentCopy>}
              </Box>

              <Box display={"flex"} justifyContent={"center"}>
                {copied ? "Copied" : "Copy Address"}
              </Box>
            </ActionBtn>
            <ActionBtn onClick={disconnectHandler}>
              <Box mb={"3px"} lineHeight={"max-content"} fontSize={"16px"}>
                <MdLogout></MdLogout>
              </Box>

              <Box display={"flex"} justifyContent={"center"}>
                Disconnect
              </Box>
            </ActionBtn>
          </Box>
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
  padding: 20px 5px;
  outline: none;
  background-color: #1a1b1f;
  border-radius: 24px;
  flex-direction: column;
  width: 360px;
  max-width: 100%;

  @media (max-width: 599px) {
    padding: 15px;
  }
`;

const ActionBtn = styled(Box)`
  background-color: rgba(224, 232, 255, 0.1);
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in;
  color: white;
  font-size: 13px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  :hover {
    background-color: rgba(224, 232, 255, 0.2);
    transform: scale(1.05);
  }

  :active {
    background-color: rgba(224, 232, 255, 0.2);
    transform: scale(0.9);
  }

  @media (max-width: 599px) {
    font-size: 12px;
  }
`;

export default AccountInfoModal;
