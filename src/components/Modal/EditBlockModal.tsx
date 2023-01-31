import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Box, Skeleton, CircularProgress } from "@mui/material";
import { Base64 } from "js-base64";
import { GrClose } from "react-icons/gr";

import useEditBlockModal from "../../hooks/useEditBlockModal";
import styled from "styled-components";
import StyledButton from "../Button/StyledButton";
import {
  useAccount,
  useContract,
  useContractRead,
  useProvider,
  useSigner,
} from "wagmi";
import { PixelMap, Token } from "../../contracts/config";
import useBoardContext from "../../hooks/useBoardContext";
import {
  getImageDataURI,
  getTruncatedAddress,
  isEmpty,
} from "../../common/utils";
import useTxLoadingContext from "../../hooks/useTxLoadingContext";
import ColorBar from "../ColorBar";
import { useSnackbar } from "notistack";
import { BigNumber, ethers } from "ethers";
import useRedditNameContext from "../../hooks/useRedditNameContext";
import axios from "axios";

const EditBlockModal: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { x, y, open, setOpen } = useEditBlockModal();
  const [colors, setColors] = useState<string[]>([]);
  const { blocks, isLoading, setBlocks, fetchBlocks } = useBoardContext();
  const { setOpen: setLoadingOpen } = useTxLoadingContext();
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
  const [curColor, setCurColor] = useState("#ffffff");
  const { enqueueSnackbar } = useSnackbar();
  const { name } = useRedditNameContext();
  const boardRef = useRef<HTMLElement | null>(null);
  const { data: price } = useContractRead({
    address: PixelMap.address[42170],
    abi: PixelMap.abi,
    functionName: "costForBuy",
  });

  useEffect(() => {
    if (open) {
      let blockColor = blocks[x * 100 + y].colors;
      if (blockColor === undefined) {
        blockColor = Array(100)
          .fill(0)
          .map((_) => "");
      }
      setColors(blockColor);
    } else {
      setColors(
        Array(100)
          .fill(0)
          .map((_) => "")
      );
    }
  }, [x, y, open, blocks]);

  const setColorValue = (i: number, j: number, color: string) => {
    const id = i * 10 + j;
    setColors([
      ...colors.slice(0, id),
      color.toUpperCase(),
      ...colors.slice(id + 1),
    ]);
  };

  const closeHandler = () => {
    setOpen({ x: 0, y: 0, open: false });
  };

  const buyHandler = async () => {
    setLoadingOpen(true);
    const metadata = {
      title: "Moon Pixel Map",
      description: `Block: (${x}, ${y})`,
      image: getImageDataURI(Array(100).fill("#fff")),
    };
    const tokenURI =
      "data:application/json;base64," +
      Base64.toBase64(JSON.stringify(metadata));

    try {
      const buyCost = await pixelMapContract?.costForBuy();

      const balance = await tokenContract?.balanceOf(address);
      if (BigNumber.from(balance).lt(buyCost)) {
        enqueueSnackbar("Insufficient Moon", {
          variant: "error",
          preventDuplicate: true,
        });
        setLoadingOpen(false);
        return;
      }

      const allowance = await tokenContract?.allowance(
        address,
        pixelMapContract?.address
      );
      if (BigNumber.from(allowance).lt(buyCost)) {
        const approveTx = await tokenContract?.approve(
          pixelMapContract?.address,
          BigNumber.from(buyCost).mul(10)
        );
        await approveTx.wait();
      }

      const buyTx = await pixelMapContract?.buy(x, y, tokenURI);
      await buyTx.wait();
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blocks/buy`, {
        blocks: [
          {
            blockId: x * 100 + y,
            owner: address?.toString(),
            uri: tokenURI,
          },
        ],
      });

      setBlocks([
        ...blocks.slice(0, x * 100 + y),
        {
          owner: address,
          src: "",
          colors: undefined,
          name: name,
        },
        ...blocks.slice(x * 100 + y + 1),
      ]);

      setOpen({ x: 0, y: 0, open: false });
      fetchBlocks();
    } catch (err) {
      setLoadingOpen(false);
      console.log(err);
    }
    setLoadingOpen(false);
  };

  const updateHandler = async () => {
    setLoadingOpen(true);

    const metadata = {
      title: "Moon Pixel Map",
      description: `Block: (${x}, ${y})`,
      image: getImageDataURI(colors),
    };
    const tokenURI =
      "data:application/json;base64," +
      Base64.toBase64(JSON.stringify(metadata));

    try {
      const mintCost = await pixelMapContract?.costForUpdate();
      if (BigNumber.from(mintCost).gt(0)) {
        const balance = await tokenContract?.balanceOf(address);
        if (BigNumber.from(balance).lt(mintCost)) {
          enqueueSnackbar("Insufficient Moon", {
            variant: "error",
            preventDuplicate: true,
          });
          setLoadingOpen(false);
          return;
        }

        const allowance = await tokenContract?.allowance(
          address,
          pixelMapContract?.address
        );
        if (BigNumber.from(allowance).lt(mintCost)) {
          const approveTx = await tokenContract?.approve(
            pixelMapContract?.address,
            BigNumber.from(mintCost).mul(10)
          );
          await approveTx.wait();
        }
      }
      const updateTx = await pixelMapContract?.update(x, y, tokenURI);
      await updateTx.wait();
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blocks/update`,
        { blockId: x * 100 + y, owner: address?.toString(), uri: tokenURI }
      );

      setOpen({ x: 0, y: 0, open: false });
      fetchBlocks();
    } catch (err) {
      setLoadingOpen(false);
      console.log(err);
    }
    setLoadingOpen(false);
  };

  const getActionType = useCallback(() => {
    const owner = blocks[x * 100 + y].owner;
    if (!isConnected) return 0;
    if (isLoading) return 4;
    if (owner === undefined) return 1;
    if (owner.toLowerCase() === address?.toLowerCase()) {
      return 2;
    }
    if (!isEmpty(blocks[x * 100 + y].src)) return 3;
    return 6;
  }, [x, y, blocks, address]);

  const actionType = getActionType();
  const action =
    actionType === 1 ? (
      <>
        {ethers.BigNumber.isBigNumber(price) && (
          <Box
            component={"p"}
            fontSize={"12px"}
            textAlign={"center"}
            color={"#667285"}
          >
            Burn {parseFloat(ethers.utils.formatEther(price))} Moons to buy this
            Tile
          </Box>
        )}
        <StyledButton onClick={buyHandler}>BUY</StyledButton>
      </>
    ) : actionType === 2 ? (
      <>
        <StyledButton onClick={updateHandler}>UPDATE</StyledButton>
        <StyledButton
          mt={"10px"}
          maincolor={"#1f7ddb"}
          component={"a"}
          {...{
            href: `https://opensea.io/assets/arbitrum-nova/${
              PixelMap?.address[42170]
            }/${x * 100 + y}`,
            target: "_blank",
          }}
        >
          View on OpenSea
        </StyledButton>
      </>
    ) : actionType === 3 ? (
      <StyledButton
        maincolor={"#1f7ddb"}
        component={"a"}
        {...{
          href: `https://opensea.io/assets/arbitrum-nova/${
            PixelMap?.address[42170]
          }/${x * 100 + y}`,
          target: "_blank",
        }}
      >
        View on OpenSea
      </StyledButton>
    ) : actionType === 4 ? (
      <StyledButton mt={"24px"} py={"5px"}>
        <CircularProgress size={"26px"}></CircularProgress>
      </StyledButton>
    ) : null;

  const drawOnPane = (i: number, j: number) => {
    if (!isConnected) {
      enqueueSnackbar("Please check your wallet connection", {
        variant: "error",
        preventDuplicate: true,
      });
      return;
    }
    if (blocks[x * 100 + y].owner?.toLowerCase() !== address?.toLowerCase()) {
      enqueueSnackbar("You're not owner of this block", {
        variant: "error",
        preventDuplicate: true,
      });
      return;
    }
    if (colors[i * 10 + j] != curColor) {
      setColorValue(i, j, curColor);
    }
  };

  const mouseDrawOnPane = (
    e: React.MouseEvent<HTMLElement>,
    i: number,
    j: number
  ) => {
    e.preventDefault();
    if (e.buttons === 1) {
      drawOnPane(i, j);
    }
  };

  const touchDrawOnPane = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length === 1) {
      const rect = boardRef.current?.getClientRects().item(0);
      const posY = ~~((e.touches.item(0).clientX - (rect?.left ?? 0)) / 18),
        posX = ~~((e.touches.item(0).clientY - (rect?.top ?? 0)) / 18);
      if (posX >= 0 && posX < 10 && posY >= 0 && posY < 10)
        drawOnPane(posX, posY);
    }
  };

  return colors.length > 0 ? (
    <>
      <Modal open={open} onClose={closeHandler}>
        <ModalContent>
          <ImageBoard>
            <Box
              onTouchMove={touchDrawOnPane}
              ref={boardRef}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <Box key={i} display={"flex"}>
                    {Array(10)
                      .fill(0)
                      .map((_, j) => (
                        <Pixel
                          key={j}
                          color={colors[i * 10 + j]}
                          onMouseMove={(e: React.MouseEvent<HTMLElement>) =>
                            mouseDrawOnPane(e, i, j)
                          }
                          onClick={() => drawOnPane(i, j)}
                        ></Pixel>
                      ))}
                  </Box>
                ))}
            </Box>
          </ImageBoard>
          <Box
            mt={{ xs: "16px", sm: "0px" }}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-around"}
          >
            <Box minWidth={"200px"}>
              <Box component={"p"}>
                <Box component={"span"} mr={"5px"}>
                  Pixels:
                </Box>
                <Box component={"span"}>
                  ({x * 10 + 1}, {y * 10 + 1}) - ({x * 10 + 10}, {y * 10 + 10})
                </Box>
              </Box>
              {(actionType === 2 || actionType === 3) && (
                <Box component={"p"} display={"flex"} alignItems={"center"}>
                  <Box component={"span"} mr={"5px"}>
                    Owner:
                  </Box>
                  {isLoading ? (
                    <Skeleton
                      variant={"rounded"}
                      width={"100px"}
                      height={"20px"}
                      sx={{ bgcolor: "#2d3958" }}
                    ></Skeleton>
                  ) : (
                    getTruncatedAddress(
                      blocks[x * 100 + y].owner,
                      blocks[x * 100 + y].name,
                      address
                    )
                  )}
                </Box>
              )}
            </Box>
            {action}
          </Box>
          <CloseButton onClick={closeHandler}>
            <GrClose></GrClose>
          </CloseButton>
          <ColorBar value={curColor} setValue={setCurColor}></ColorBar>
        </ModalContent>
      </Modal>
    </>
  ) : null;
};

const Pixel = styled(Box).attrs((props) => {
  if (props.color === "") {
    return {
      style: {
        backgroundColor: "#e5e5f7",
        opacity: 0.8,
        backgroundImage:
          "linear-gradient(135deg, #8a8a8a 25%, transparent 25%), linear-gradient(225deg, #8a8a8a 25%, transparent 25%), linear-gradient(45deg, #8a8a8a 25%, transparent 25%), linear-gradient(315deg, #8a8a8a 25%, #e5e5f7 25%)",
        backgroundPosition: "9px 0, 9px 0, 0 0, 0 0",
        backgroundSize: "9px 9px",
        backgroundRepeat: "repeat",
      },
    };
  } else {
    return {
      style: {
        backgroundColor: props.color,
      },
    };
  }
})`
  width: 18px;
  height: 18px;
  margin: 0.02px;
  cursor: pointer;
`;

const ModalContent = styled(Box)`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px;
  outline: none;
  background-color: #111829;

  @media (max-width: 599px) {
    flex-direction: column;
  }
`;

const ImageBoard = styled(Box)`
  border: 1.5px dashed #3e4e74;
  background-color: white;
  padding: 8px;

  @media (min-width: 600px) {
    margin-right: 15px;
  }
`;

const CloseButton = styled(Box)`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: #111829;
  border-radius: 50%;
  top: -14px;
  right: -14px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;

  * {
    stroke: #97afd5;
  }
`;

export default EditBlockModal;
