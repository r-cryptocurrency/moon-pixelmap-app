import { Box } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { Base64 } from "js-base64";
import React, { useEffect, useState } from "react";
import { useContract, useSigner, useProvider, useAccount } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";

import logo from "../../assets/image/logo.png";
import { getBlankImageURI } from "../../common/utils";
import useBatchContext from "../../hooks/useBatchContext";
import useLoadingContext from "../../hooks/useTxLoadingContext";
import ConnectWalletButton from "../Button/ConnectWalletButton";
import SelectButton from "../Button/SelectButton";
import { PixelMap, Token } from "../../contracts/config";
import { useSnackbar } from "notistack";
import useBoardContext from "../../hooks/useBoardContext";
import BalanceChip from "../BalanceChip";
import useWindowSize from "../../hooks/useWindowSize";
import useRedditNameContext from "../../hooks/useRedditNameContext";
import useWalletModal from "../../hooks/useWalletModalContext";
import axios from "axios";

const Header: React.FC = () => {
  const { batches, setBatches, mode, setMode } = useBatchContext();
  const { setOpen } = useLoadingContext();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const tokenContract = useContract({
    address: Token.address[42170],
    abi: Token.abi,
    signerOrProvider: signer ?? provider,
  });
  const pixelMapContract = useContract({
    address: PixelMap.address[42170],
    abi: PixelMap.abi,
    signerOrProvider: signer ?? provider,
  });
  const { address, isConnected } = useAccount();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { fetchBlocks } = useBoardContext();
  const { width } = useWindowSize();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { name, alert, setAlert } = useRedditNameContext();
  const { pathname } = useRouter();
  const { setMode: setModalMode } = useWalletModal();

  const action = (snackbarId: any) => (
    <>
      <Box
        onClick={() => {
          setModalMode(2);
          closeSnackbar(snackbarId);
        }}
        fontWeight={600}
        color={"#aaffad"}
        mr={"8px"}
        sx={{ cursor: "pointer" }}
      >
        Go
      </Box>
      <Box
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
        color={"#fb7676"}
        fontWeight={600}
        mr={"8px"}
        sx={{ cursor: "pointer" }}
      >
        Cancel
      </Box>
    </>
  );

  useEffect(() => {
    setMode(0);
    setBatches([]);
  }, [address]);

  useEffect(() => {
    if (!alert && name !== undefined && name.length === 0 && isConnected) {
      enqueueSnackbar("Please set your Reddit name", {
        variant: "info",
        preventDuplicate: true,
        action,
        persist: true,
      });
      setAlert(true);
    }
  }, [name]);

  const clickHandler = async () => {
    if (mode === 1 && batches.length > 0) {
      await batchBuy();
      setBatches([]);
      setMode(0);
    } else if (mode === 0) {
      setMode(1);
    }
  };

  const batchBuy = async () => {
    setOpen(true);

    const blankURI = getBlankImageURI();

    const batchURIs = batches.map(
      (block) =>
        "data:application/json;base64," +
        Base64.toBase64(
          JSON.stringify({
            title: "Moon Pixel Map",
            description: `Block: (${block.x}, ${block.y})`,
            image: blankURI,
          })
        )
    );

    try {
      const buyCost = await pixelMapContract?.costForBuy();
      const batchBuyCost = BigNumber.from(buyCost).mul(batches.length);

      if (batchBuyCost.gt(0)) {
        const balance = await tokenContract?.balanceOf(address);
        if (BigNumber.from(balance).lt(batchBuyCost)) {
          enqueueSnackbar("Insufficient Moon", {
            variant: "error",
            preventDuplicate: true,
          });
          setOpen(false);
          return;
        }

        const allowance = await tokenContract?.allowance(
          address,
          pixelMapContract?.address
        );
        if (BigNumber.from(allowance).lt(batchBuyCost)) {
          const approveTx = await tokenContract?.approve(
            pixelMapContract?.address,
            BigNumber.from(batchBuyCost).mul(10)
          );
          await approveTx.wait();
        }
      }
      const batchBuyTx = await pixelMapContract?.batchBuy(
        batches.map((block) => block.x),
        batches.map((block) => block.y),
        batchURIs
      );
      await batchBuyTx.wait();
      const blocks = batches.map((batch, index) => ({
        blockId: batch.x * 100 + batch.y,
        owner: address?.toString(),
        uri: batchURIs[index],
      }));
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blocks/buy`, {
        blocks,
      });

      fetchBlocks();
    } catch (err) {
      setOpen(false);
      console.log(err);
    }
    setOpen(false);
  };

  return (
    <>
      <Box
        bgcolor={"#03060e"}
        position={"absolute"}
        top={0}
        left={0}
        color={"#97afd5"}
        fontSize={{ xs: "9px", sm: "10px", md: "11px" }}
        textAlign={"center"}
        width={"100%"}
        py={"2px"}
      >
        1,000,000 Pixels&nbsp;&nbsp;•&nbsp;&nbsp;10,000 Tiles /
        NFTs&nbsp;&nbsp;•&nbsp;&nbsp;Burn 1 Moon Per
        Pixel&nbsp;&nbsp;•&nbsp;&nbsp;Own a Piece of Crypto Reddit’s History!
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bgcolor={"rgba(0, 0, 0, .3)"}
        padding={{
          xs: "27px 10px 8px",
          sm: "18px 15px 8px",
          md: "18px 30px 8px",
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Box
            component={"img"}
            src={logo.src}
            width={{ xs: "40px", sm: "50px", md: "60px" }}
            mr={{ sm: "10px", md: "20px" }}
          ></Box>
          {(width ?? 0) > 700 && (
            <>
              <Link href={"/"}>
                <NavLink>PixelMap</NavLink>
              </Link>
              <Link href={"/leaderboard"}>
                <NavLink>LeaderBoard</NavLink>
              </Link>
              <Link href={"/faq"}>
                <NavLink>FAQ</NavLink>
              </Link>
              <Link href={"/about"}>
                <NavLink>About</NavLink>
              </Link>
            </>
          )}
          {(width ?? 0) <= 700 && (
            <MenuIcon onClick={() => setMobileOpen(!mobileOpen)}>
              <AiOutlineMenu></AiOutlineMenu>
            </MenuIcon>
          )}
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          {isConnected && pathname === "/" && (
            <SelectButton mode={mode} onClick={clickHandler}></SelectButton>
          )}
          {(width ?? 0) >= 400 && <BalanceChip></BalanceChip>}
          <ConnectWalletButton></ConnectWalletButton>
        </Box>
        <Box
          position={"absolute"}
          display={(width ?? 0) <= 700 ? "flex" : "none"}
          top={"50%"}
          left={mobileOpen ? "-177px" : "-222px"}
          width={"fit-content"}
          zIndex={1000}
          bgcolor={"#040811"}
          borderRadius={"20px 20px 0 0"}
          px={"10px"}
          overflow={"hidden"}
          sx={{
            transform: "rotateZ(90deg)",
            transition: "all .3s",
          }}
        >
          <Link href={"/"}>
            <NavLink textTransform={"uppercase"}>PixelMap</NavLink>
          </Link>
          <Link href={"/leaderboard"}>
            <NavLink textTransform={"uppercase"}>LeaderBoard</NavLink>
          </Link>
          <Link href={"/faq"}>
            <NavLink textTransform={"uppercase"}>FAQ</NavLink>
          </Link>
          <Link href={"/about"}>
            <NavLink textTransform={"uppercase"}>About</NavLink>
          </Link>
        </Box>
      </Box>
    </>
  );
};

const NavLink = styled(Box)`
  color: #97afd5;
  font-weight: 600;
  padding: 20px 8px;
  font-size: 16px;
  transition: all 0.3s;
  text-align: center;

  :hover {
    color: #aeb9ca;
  }

  @media (max-width: 899px) {
    padding: 15px 6px;
    font-size: 14px;
  }
  @media (max-width: 699px) {
    padding: 15px 15px;
  }
`;

const MenuIcon = styled(Box)`
  color: #97afd5;
  font-weight: 600;
  font-size: 20px;
  transition: all 0.3s;
  margin-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default Header;
