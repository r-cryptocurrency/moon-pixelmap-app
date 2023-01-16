import React, { useEffect, useRef, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { useAccount, useContractRead } from "wagmi";
import styled from "styled-components";
import { BsPlusLg, BsDashLg } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import axios from "axios";

import useBoardContext from "../../hooks/useBoardContext";
import useEditBlockModal from "../../hooks/useEditBlockModal";
import {
  getPinchDistance,
  getTruncatedAddress,
  isEmpty,
} from "../../common/utils";
import Loading from "../Loading";
import MyBlockList from "../BlockList/myBlockList";
import BlackBlockList from "../BlockList/blackBlockList";
import usePixelSizeContext from "../../hooks/usePixelSizeContext";
import useViewBlockContext from "../../hooks/useViewBlockContext";
import useBatchContext from "../../hooks/useBatchContext";
import usePinchContext from "../../hooks/usePinchContext";
import useBlackList from "../../hooks/useBlackListContext";
import { PixelMap as PixelMapContract } from "../../contracts/config";
import BlackoutButton from "../Button/BlackoutButton";
import useWindowSize from "../../hooks/useWindowSize";
import { useSnackbar } from "notistack";
import { ethers } from "ethers";

const PixelMap: React.FC = () => {
  const { address } = useAccount();
  const { blocks, isLoading } = useBoardContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLElement>(null);
  const { setOpen } = useEditBlockModal();
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const { size, setSize } = usePixelSizeContext();
  const { open: viewOpen } = useViewBlockContext();
  const { mode, batches, setBatches, setMode } = useBatchContext();
  const { blacks, open: blackShow, setBlacks } = useBlackList();
  const {
    startDistance: pinchStartDistance,
    startSize: pinchStartSize,
    setStartDistance: setPinchStartDistance,
    setStartSize: setPinchStartSize,
  } = usePinchContext();
  const { data: owner } = useContractRead({
    address: PixelMapContract.address[42170],
    abi: PixelMapContract.abi,
    functionName: "owner",
  });
  const [canvasURI, setCanvasURI] = useState("");
  const { setOpen: setBlackListOpen } = useBlackList();
  const { setOpen: setMyListOpen } = useViewBlockContext();
  const { width } = useWindowSize();
  const { enqueueSnackbar } = useSnackbar();
  const { data: price } = useContractRead({
    address: PixelMapContract.address[42170],
    abi: PixelMapContract.abi,
    functionName: "costForBuy",
  });

  useEffect(() => {
    setBlackListOpen(false);
    setMyListOpen(false);
  }, []);

  useEffect(() => {
    boardRef.current?.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    boardRef.current?.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    boardRef.current?.addEventListener("touchend", onTouchEnd, {
      passive: false,
    });

    return () => {
      boardRef.current?.removeEventListener("touchstart", onTouchStart);
      boardRef.current?.removeEventListener("touchmove", onTouchMove);
      boardRef.current?.removeEventListener("touchend", onTouchEnd);
    };
  }, [pinchStartDistance, pinchStartSize]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas?.getContext("2d");
    const cellSize = 2;
    canvas.width = cellSize * 1000;
    canvas.height = cellSize * 1000;
    if (context) {
      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
          if (blocks[i * 100 + j].src === undefined) {
            context.fillStyle = (i + j) % 2 ? "#666" : "#777";
            context.fillRect(
              i * (cellSize * 10),
              j * (cellSize * 10),
              cellSize * 10,
              cellSize * 10
            );
          } else {
            for (let k = 0; k < 10; k++) {
              for (let l = 0; l < 10; l++) {
                context.fillStyle =
                  blocks[i * 100 + j].colors?.[l * 10 + k] ?? "#fff";
                context.fillRect(
                  (i * 10 + k) * cellSize,
                  (j * 10 + l) * cellSize,
                  cellSize,
                  cellSize
                );
              }
            }
          }
        }
      }
      setCanvasURI(canvas.toDataURL());
    }
  }, [blocks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.fillStyle = "#ffffff01";
      context.strokeStyle = "#f00";
      context.lineWidth = 1;
      context.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
      for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
          if (
            viewOpen &&
            blocks[i * 100 + j].owner?.toLowerCase() === address?.toLowerCase()
          ) {
            context.strokeRect(
              i * (size * 10),
              j * (size * 10),
              size * 10,
              size * 10
            );
          }
          if (!blackShow && blacks.find((black) => black === i * 100 + j)) {
            context.fillStyle = "#050505";
            context.fillRect(
              i * (size * 10),
              j * (size * 10),
              size * 10,
              size * 10
            );
          }
        }
      }
      context.fillStyle = "#b8c59288";
      batches.map((block) => {
        context.fillRect(
          block.x * (size * 10),
          block.y * (size * 10),
          size * 10,
          size * 10
        );
      });
    }
  }, [blocks, size, viewOpen, batches, address, blacks, blackShow]);

  const zoomIn = () => {
    setSize(size === 0.5 ? 1 : Math.min(size + 0.5, 2.5));
  };

  const zoomOut = () => {
    if (size > 0.5) {
      setSize(Math.max(size - 0.5, 0.5));
    }
  };

  const getMousePosition = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.x ?? 0);
    const y = e.clientY - (rect?.y ?? 0);
    return { x: Math.floor(x / size), y: Math.floor(y / size) };
  };

  const batchHandler = (x: number, y: number) => {
    if ((mode === 1 && isEmpty(blocks[x * 100 + y].owner)) || mode > 1) {
      const batchId = batches.findIndex(
        (batch) => x === batch.x && y === batch.y
      );
      if (batchId === -1) {
        setBatches([...batches, { x, y }]);
      } else {
        setBatches([
          ...batches.slice(0, batchId),
          ...batches.slice(batchId + 1),
        ]);
      }
    }
  };

  const onCanvasMouseDown = (e: any) => {
    const { x, y } = getMousePosition(e);

    if (mode === 0) {
      if (
        !blackShow &&
        blacks.findIndex((black) => black === ~~(x / 10) * 100 + ~~(y / 10)) >
          -1
      ) {
        enqueueSnackbar("Can't see blacked tiles", {
          variant: "error",
          preventDuplicate: true,
        });
      } else setOpen({ x: ~~(x / 10), y: ~~(y / 10), open: true });
    } else {
      batchHandler(~~(x / 10), ~~(y / 10));
    }
  };

  const onCanvasMouseMove = (e: any) => {
    const { x, y } = getMousePosition(e);
    if (x != currentPos.x || y != currentPos.y) {
      setCurrentPos({ x, y });
    }
  };

  const onCanvasMouseOut = (e: any) => {
    setCurrentPos({ x: -1, y: -1 });
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getPinchDistance(e.touches);
      if (distance > 0) {
        setPinchStartDistance(distance);
        setPinchStartSize(size);
      }
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setPinchStartDistance(0);
      setPinchStartSize(0);
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (
      e.touches.length === 2 &&
      pinchStartDistance > 0 &&
      pinchStartSize > 0
    ) {
      e.preventDefault();
      const distance = getPinchDistance(e.touches);
      if (distance > 0) {
        const pinchPropotion = distance / pinchStartDistance;
        const newSize = Math.min(
          Math.max(pinchStartSize * pinchPropotion, 0.5),
          2.5
        );
        setSize(~~(newSize * 5) / 5);
      }
    }
  };

  const onCancelSelection = () => {
    setMode(0);
    setBatches([]);
  };

  const onBlackoutHandler = async () => {
    if (mode === 2 && batches.length > 0) {
      try {
        const SERVER_URL =
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001";
        const result = await axios.post(`${SERVER_URL}/api/blackout/add`, {
          blocks: batches,
        });
        setBlacks(result.data);
      } catch (err) {
        console.log(err);
      }
      setBatches([]);
      setMode(0);
    } else if (mode === 0) {
      setMode(2);
    }
  };

  const onUnblackoutHandler = async () => {
    if (mode === 3 && batches.length > 0) {
      try {
        const SERVER_URL =
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001";
        const result = await axios.post(`${SERVER_URL}/api/blackout/remove`, {
          blocks: batches,
        });
        setBlacks(result.data);
      } catch (err) {
        console.log(err);
      }
      setBatches([]);
      setMode(0);
    } else if (mode === 0) {
      setMode(3);
    }
  };

  return (
    <Box position={"relative"}>
      <PixelMapContainer ref={boardRef}>
        <Tooltip
          componentsProps={{
            popper: {
              sx: {
                display:
                  currentPos.x === -1 || (width ?? 0) < 600 ? "none" : "block",
              },
            },
          }}
          title={
            <React.Fragment>
              <p>
                <strong>Pixel:</strong> ({currentPos.x + 1}, {currentPos.y + 1})
              </p>
              <p>
                <strong>Owner:</strong>{" "}
                {getTruncatedAddress(
                  blocks[~~(currentPos.x / 10) * 100 + ~~(currentPos.y / 10)]
                    .owner,
                  blocks[~~(currentPos.x / 10) * 100 + ~~(currentPos.y / 10)]
                    .name,
                  address
                )}
              </p>
              {blocks[~~(currentPos.x / 10) * 100 + ~~(currentPos.y / 10)]
                .colors && (
                <p>
                  <strong>Color:</strong>{" "}
                  {(
                    blocks[~~(currentPos.x / 10) * 100 + ~~(currentPos.y / 10)]
                      .colors?.[
                      (currentPos.y % 10) * 10 + (currentPos.x % 10)
                    ] ?? ""
                  ).toUpperCase()}
                </p>
              )}
            </React.Fragment>
          }
          followCursor
          arrow
        >
          <Box textAlign={"center"}>
            <Box
              component={"img"}
              width={`${size * 1000}px`}
              height={`${size * 1000}px`}
              sx={{ cursor: "pointer" }}
              textAlign={"center"}
              src={canvasURI}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src =
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAsCAIAAACc+L0RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVFhH7c0xAQAADMOgua79yeAJBrhR9VA9VA/VQ/VQPVQP1UP1UD1UD9VD9VA9RPvtARYvEa+8KgvGAAAAAElFTkSuQmCC";
              }}
            ></Box>
            <canvas
              ref={canvasRef}
              width={`${size * 1000}px`}
              height={`${size * 1000}px`}
              onClick={onCanvasMouseDown}
              onMouseMove={onCanvasMouseMove}
              onMouseLeave={onCanvasMouseOut}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "0",
                left: (width ?? 0) >= size * 1000 ? "50%" : "0",
                transform:
                  (width ?? 0) >= size * 1000 ? "translateX(-50%)" : "none",
              }}
            ></canvas>
          </Box>
        </Tooltip>

        {isLoading && (
          <Loading open={isLoading} message={"Loading Blocks..."}></Loading>
        )}
      </PixelMapContainer>
      <Box position={"absolute"} top={"20px"} right={"20px"}>
        <MyBlockList></MyBlockList>
        <BlackBlockList></BlackBlockList>
      </Box>
      <Box
        display={"flex"}
        position={"absolute"}
        bottom={"20px"}
        right={"20px"}
      >
        <ZoomButton onClick={zoomIn} disabled={size === 3}>
          <BsPlusLg></BsPlusLg>
        </ZoomButton>
        <ZoomButton onClick={zoomOut} disabled={size === 0.5}>
          <BsDashLg></BsDashLg>
        </ZoomButton>
      </Box>
      {mode > 0 && batches.length > 0 && (
        <Box
          position={"absolute"}
          bottom={"40px"}
          left={"50%"}
          sx={{ transform: "translateX(-50%)" }}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          {mode === 1 && ethers.BigNumber.isBigNumber(price) && (
            <Box
              color={"white"}
              mb={"10px"}
              fontWeight={"600"}
              fontSize={"18px"}
            >
              {parseFloat(ethers.utils.formatEther(price.mul(batches.length)))}{" "}
              MOONs
            </Box>
          )}
          <ZoomButton onClick={onCancelSelection}>
            <MdClose></MdClose>
          </ZoomButton>
        </Box>
      )}
      {owner && (owner as string).toLowerCase() === address?.toLowerCase() ? (
        <Box
          position={"absolute"}
          bottom={"63px"}
          right={"16px"}
          display={"flex"}
          flexDirection={"column"}
        >
          <BlackoutButton
            mode={mode}
            onClick={onBlackoutHandler}
            type={2}
          ></BlackoutButton>
          <BlackoutButton
            mode={mode}
            onClick={onUnblackoutHandler}
            type={3}
          ></BlackoutButton>
        </Box>
      ) : null}
    </Box>
  );
};

const PixelMapContainer = styled(Box)`
  width: 100vw;
  height: calc(100vh - 184px);
  overflow: scroll;
  position: relative;

  @media (max-width: 899px) {
    height: calc(100vh - 174px);
  }
  @media (max-width: 599px) {
    height: calc(100vh - 225px);
  }
`;

const ZoomButton = styled<any>(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.disabled ? "#3d4660" : "#0a1123")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0 3px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: #97afd5;
  transform: scale(1);
  transition: all 0.3 ease-in;

  :hover {
    background-color: ${(props) => (props.disabled ? "#3d4660" : "#152142")};
    transform: scale(1.02);
  }
  :active {
    background-color: ${(props) => (props.disabled ? "#3d4660" : "#121c36")};
    transform: scale(1);
  }
`;

export default PixelMap;
