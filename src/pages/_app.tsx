import type { AppProps } from "next/app";
import NextHead from "next/head";
import * as React from "react";
import { useAccount, useContract, useProvider, WagmiConfig } from "wagmi";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { BigNumber } from "ethers";
import axios from "axios";
import { EthersMulticall } from "@morpho-labs/ethers-multicall";

import { client } from "../wagmi";
import GlobalStyle from "../style/global";
import theme from "../style/theme";
import { EditBlockModalContext } from "../hooks/useEditBlockModal";
import EditBlockModal from "../components/Modal/EditBlockModal";
import { TxLoadingContext } from "../hooks/useTxLoadingContext";
import Loading from "../components/Loading";
import { BlockInfo } from "../common/types";
import { BoardContext } from "../hooks/useBoardContext";
import { PixelMap as PixelMapContract } from "../contracts/config";
import { getColorsFromURI } from "../common/utils";
import { PixelSizeContext } from "../hooks/usePixelSizeContext";
import { ViewBlockContext } from "../hooks/useViewBlockContext";
import { BatchContext } from "../hooks/useBatchContext";
import WalletConnectModal from "../components/Modal/WalletConnectModal";
import { WalletModalContext } from "../hooks/useWalletModalContext";
import AccountInfoModal from "../components/Modal/AccountInfoModal";
import { RedditNameContext } from "../hooks/useRedditNameContext";
import useWindowSize from "../hooks/useWindowSize";
import { PinchContext } from "../hooks/usePinchContext";
import { BlackListContext } from "../hooks/useBlackListContext";

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  const provider = useProvider();
  const multicall = new EthersMulticall(provider);
  const pixelMapContract = multicall.wrap(
    useContract({
      address: PixelMapContract.address[42170],
      abi: PixelMapContract.abi,
      signerOrProvider: provider,
    })!
  );

  const { address } = useAccount();
  const [editProps, setEditProps] = React.useState<{
    x: number;
    y: number;
    open: boolean;
  }>({ x: 0, y: 0, open: false });
  const [txLoading, setTxLoading] = React.useState(false);
  const [blocks, setBlocks] = React.useState<BlockInfo[]>(
    Array(10000)
      .fill(0)
      .map(
        (_): BlockInfo => ({
          owner: undefined,
          colors: undefined,
          src: undefined,
          name: undefined,
        })
      )
  );
  const [blocksLoading, setBlocksLoading] = React.useState(false);
  const [pixelSize, setPixelSize] = React.useState(0);
  const [viewBlock, setViewBlock] = React.useState(false);

  const [batchMode, setBatchMode] = React.useState(0);
  const [batches, setBatches] = React.useState<{ x: number; y: number }[]>([]);
  const [walletMode, setWalletMode] = React.useState(0);
  const [redditName, setRedditName] = React.useState<string | undefined>(
    undefined
  );
  const [nameAlert, setNameAlert] = React.useState(false);
  const [pinchStartDistance, setPinchStartDistance] = React.useState(0);
  const [pinchStartSize, setPinchStartSize] = React.useState(0);
  const [blackBlocks, setBlackBlocks] = React.useState<number[]>([]);
  const [blackShow, setBlackShow] = React.useState(false);
  const { width, height } = useWindowSize();

  const setPixelFixSize = (size: number) => {
    setPixelSize(Number(size.toFixed(2)));
  };

  const fetchPixels = async () => {
    setBlocksLoading(true);
    const blockData: BlockInfo[] = Array(10000)
      .fill(0)
      .map(
        (_): BlockInfo => ({
          owner: undefined,
          colors: undefined,
          src: undefined,
          name: undefined,
        })
      );
    try {
      const errorColors = Array(100).fill("red");
      const soldBlocks = await pixelMapContract?.getAllSoldBlocks();
      if (soldBlocks && soldBlocks.length > 0) {
        await Promise.all(
          soldBlocks.map(async (block: BigNumber) => {
            const x = Math.floor(block.toNumber() / 100),
              y = block.toNumber() % 100;
            const blockInfo = await pixelMapContract?.getBlockInfo(x, y);
            let colorData = errorColors;
            try {
              colorData = await getColorsFromURI(blockInfo.uri);
            } catch (err) {
              console.error(
                "Failed to get colors from image URI",
                blockInfo.uri,
                err
              );
            }
            const newBlock: BlockInfo = {
              owner: blockInfo.owner,
              colors: colorData,
              src: blockInfo.uri,
              name: blockInfo.name,
            };
            blockData[block.toNumber()] = newBlock;
          })
        );
        setBlocks(blockData);
      }
    } catch (err) {
      console.log(err);
    }
    setBlocksLoading(false);
  };

  const fetchRedditName = async () => {
    try {
      const name = await pixelMapContract?.getName(address?.toString());
      setRedditName(name);
    } catch (err) {
      setRedditName("");
    }
  };

  const fetchBlacks = async () => {
    try {
      const uri = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001";
      const blacks = await axios.get(`${uri}/api/blackout/all`);
      setBlackBlocks(blacks.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    setMounted(true);
    fetchBlacks();
    fetchPixels();
  }, []);

  React.useEffect(() => {
    if (width && height && pixelSize === 0) {
      const boardHeight =
        height - (width < 600 ? 225 : width < 900 ? 174 : 184);
      setPixelSize(Math.min((width - 10) / 1000, (boardHeight - 14) / 1000));
    }
  }, [width, height]);

  React.useEffect(() => {
    setNameAlert(false);
    setRedditName(undefined);
    if (address) {
      fetchRedditName();
    }
  }, [address]);

  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig client={client}>
        <GlobalStyle />
        <NextHead>
          <title>MoonPlace</title>
          <link rel="shortcut icon" href="/favicon.png"></link>
        </NextHead>

        <SnackbarProvider maxSnack={3}>
          <BoardContext.Provider
            value={{
              blocks,
              isLoading: blocksLoading,
              setBlocks,
              setLoading: setBlocksLoading,
              fetchBlocks: fetchPixels,
            }}
          >
            <EditBlockModalContext.Provider
              value={{
                x: editProps.x,
                y: editProps.y,
                open: editProps.open,
                setOpen: setEditProps,
              }}
            >
              <TxLoadingContext.Provider
                value={{
                  open: txLoading,
                  setOpen: setTxLoading,
                }}
              >
                <PixelSizeContext.Provider
                  value={{
                    size: pixelSize,
                    setSize: setPixelFixSize,
                  }}
                >
                  <ViewBlockContext.Provider
                    value={{ open: viewBlock, setOpen: setViewBlock }}
                  >
                    <BatchContext.Provider
                      value={{
                        mode: batchMode,
                        batches,
                        setBatches,
                        setMode: setBatchMode,
                      }}
                    >
                      <WalletModalContext.Provider
                        value={{
                          mode: walletMode,
                          setMode: setWalletMode,
                        }}
                      >
                        <RedditNameContext.Provider
                          value={{
                            name: redditName,
                            setName: setRedditName,
                            fetchName: fetchRedditName,
                            alert: nameAlert,
                            setAlert: setNameAlert,
                          }}
                        >
                          <PinchContext.Provider
                            value={{
                              startDistance: pinchStartDistance,
                              startSize: pinchStartSize,
                              setStartDistance: setPinchStartDistance,
                              setStartSize: setPinchStartSize,
                            }}
                          >
                            <BlackListContext.Provider
                              value={{
                                blacks: blackBlocks,
                                fetchBlacks,
                                open: blackShow,
                                setOpen: setBlackShow,
                                setBlacks: setBlackBlocks,
                              }}
                            >
                              {mounted && (
                                <>
                                  {txLoading ? (
                                    <Loading
                                      open={true}
                                      message={
                                        "Sending transaction, please wait...."
                                      }
                                    ></Loading>
                                  ) : null}
                                  <Component {...pageProps} />
                                  <EditBlockModal></EditBlockModal>
                                  <WalletConnectModal></WalletConnectModal>
                                  <AccountInfoModal></AccountInfoModal>
                                </>
                              )}
                            </BlackListContext.Provider>
                          </PinchContext.Provider>
                        </RedditNameContext.Provider>
                      </WalletModalContext.Provider>
                    </BatchContext.Provider>
                  </ViewBlockContext.Provider>
                </PixelSizeContext.Provider>
              </TxLoadingContext.Provider>
            </EditBlockModalContext.Provider>
          </BoardContext.Provider>
        </SnackbarProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
