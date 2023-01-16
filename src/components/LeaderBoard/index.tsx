import { Box, Container, Grid, Pagination, Skeleton } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useContractRead } from "wagmi";

import { getAbbrAddress } from "../../common/utils";
import { PixelMap } from "../../contracts/config";
import useBoardContext from "../../hooks/useBoardContext";
import useWindowSize from "../../hooks/useWindowSize";
import SVG from "../SVG";

interface BlockData {
  owner: string;
  name: string;
  counts: number;
}

const LeaderBoard: React.FC = () => {
  const { blocks, isLoading } = useBoardContext();
  const { data: cost, isLoading: isCostLoading } = useContractRead({
    address: PixelMap.address[42170],
    abi: PixelMap.abi,
    functionName: "costForBuy",
  });
  const [blockInfo, setBlockInfo] = useState<BlockData[]>([]);
  const [soldBlocks, setSoldBlocks] = useState(0);
  const { width } = useWindowSize();
  const [pageItems, setPageItems] = useState(12);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (blocks) {
      const blocksByOwner: BlockData[] = [];
      let totalCounts = 0;
      blocks.forEach((block, index) => {
        if (block.owner) {
          const id = blocksByOwner.findIndex(
            (item) => item.owner === block.owner
          );
          if (id === -1) {
            blocksByOwner.push({
              owner: block.owner,
              name: block.name ?? "",
              counts: 1,
            });
          } else {
            blocksByOwner[id].counts += 1;
          }
          totalCounts++;
        }
      });
      blocksByOwner.sort((a, b) =>
        a.counts < b.counts ? 1 : a.counts === b.counts ? 0 : -1
      );
      setBlockInfo(blocksByOwner);
      setSoldBlocks(totalCounts);
    }
  }, [blocks]);

  useEffect(() => {
    const items = (width ?? 0) <= 600 ? 6 : (width ?? 0) <= 900 ? 10 : 12;
    if (items !== pageItems) {
      setPage(~~((pageItems * (page - 1)) / items) + 1);
      setPageItems(items);
    }
  }, [width]);

  const onPageHandler = (event: React.ChangeEvent<unknown>, value: number) => {
    if (page !== value) setPage(value);
  };

  return (
    <Container>
      <Box
        minHeight={{
          xs: "calc(100vh - 195px)",
          sm: "calc(100vh - 146px)",
          md: "calc(100vh - 156px)",
        }}
      >
        <Grid container spacing={1.3} color={"white"}>
          <Grid
            container
            item
            xs={12}
            mt={{ xs: "10px", sm: "40px" }}
            mb={"20px"}
          >
            <Grid item container bgcolor={"#29334c"} padding={"10px"}>
              <Grid item>
                <Box fontWeight={600}>Current Status</Box>
              </Grid>
              <Grid container item mt={"5px"}>
                <Grid item xs={12} sm={6} md={3} p={"10px"}>
                  {isLoading || isCostLoading ? (
                    <Skeleton
                      variant={"text"}
                      height={"55px"}
                      sx={{ fontSize: "48px", bgcolor: "#474f65" }}
                    ></Skeleton>
                  ) : (
                    <Box fontSize={"48px"}>10000</Box>
                  )}
                  <Box fontWeight={600} color={"#aaa"}>
                    Total Tiles
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3} p={"10px"}>
                  {isLoading || isCostLoading ? (
                    <Skeleton
                      variant={"text"}
                      height={"55px"}
                      sx={{ fontSize: "48px", bgcolor: "#474f65" }}
                    ></Skeleton>
                  ) : (
                    <Box fontSize={"48px"}>{soldBlocks}</Box>
                  )}
                  <Box fontWeight={600} color={"#aaa"}>
                    Sold Tiles
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3} p={"10px"}>
                  {isLoading || isCostLoading ? (
                    <Skeleton
                      variant={"text"}
                      height={"55px"}
                      sx={{ fontSize: "48px", bgcolor: "#474f65" }}
                    ></Skeleton>
                  ) : (
                    <Box fontSize={"48px"}>
                      {ethers.BigNumber.isBigNumber(cost)
                        ? parseFloat(ethers.utils.formatEther(cost)).toFixed(2)
                        : "0.00"}
                    </Box>
                  )}
                  <Box fontWeight={600} color={"#aaa"}>
                    Price Per Tile
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3} p={"10px"}>
                  {isLoading || isCostLoading ? (
                    <Skeleton
                      variant={"text"}
                      height={"55px"}
                      sx={{ fontSize: "48px", bgcolor: "#474f65" }}
                    ></Skeleton>
                  ) : (
                    <Box fontSize={"48px"}>{blockInfo.length}</Box>
                  )}
                  <Box fontWeight={600} color={"#aaa"}>
                    Holders
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={1.3} mb={"30px"}>
            {isLoading || isCostLoading
              ? Array((width ?? 0) <= 600 ? 3 : (width ?? 0) <= 900 ? 4 : 6)
                  .fill(0)
                  .map((_, id) => (
                    <Grid container item xs={12} sm={6} md={4} key={id}>
                      <Skeleton
                        variant={"rounded"}
                        width={"100%"}
                        height={"80px"}
                        sx={{ bgcolor: "#474f65" }}
                      ></Skeleton>
                    </Grid>
                  ))
              : blockInfo
                  .slice(pageItems * (page - 1), pageItems * page)
                  .map((block, id) => (
                    <Grid
                      container
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      wrap={"nowrap"}
                      key={id}
                    >
                      <Grid
                        item
                        container
                        bgcolor={"#29334c"}
                        padding={"18px 10px"}
                        wrap={"nowrap"}
                      >
                        <Grid
                          item
                          p={"5px"}
                          pr={"20px"}
                          container
                          alignItems={"center"}
                          width={"auto"}
                        >
                          <SVG address={block.owner} size={50}></SVG>
                        </Grid>
                        <Grid item xs={12} sm>
                          <Box py={"4px"}>
                            <span style={{ color: "#aaa" }}>Name:</span>{" "}
                            <span>{block.name}</span>
                          </Box>
                          <Box py={"4px"}>
                            <span style={{ color: "#aaa" }}>Address:</span>{" "}
                            <span>{getAbbrAddress(block.owner)}</span>
                          </Box>
                          <Box py={"4px"}>
                            <span style={{ color: "#aaa" }}>Tiles:</span>{" "}
                            <span>{block.counts}</span>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
          </Grid>
          {
            <Grid xs={12} mb={"50px"} item container justifyContent={"center"}>
              <StyledPagination
                count={Math.ceil(blockInfo.length / pageItems)}
                size={
                  (width ?? 0) <= 600
                    ? "small"
                    : (width ?? 0) <= 900
                    ? "medium"
                    : "large"
                }
                page={page}
                onChange={onPageHandler}
              ></StyledPagination>
            </Grid>
          }
        </Grid>
      </Box>
    </Container>
  );
};

const StyledPagination = styled(Pagination)`
  & .MuiPaginationItem-root {
    color: white;

    &.Mui-selected {
      background-color: #29334c;
    }
  }
`;

export default LeaderBoard;
