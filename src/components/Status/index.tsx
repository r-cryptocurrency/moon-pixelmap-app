import { Box } from "@mui/material";
import { ethers } from "ethers";
import React from "react";
import { useContractRead } from "wagmi";
import { PixelMap } from "../../contracts/config";
import useBoardContext from "../../hooks/useBoardContext";

const Status: React.FC = () => {
  const { blocks } = useBoardContext();
  const { data: cost } = useContractRead({
    address: PixelMap.address[42170],
    abi: PixelMap.abi,
    functionName: "costForBuy",
  });

  return (
    <Box
      width={"100%"}
      bgcolor={"#0f1932"}
      color={"#97afd5"}
      fontSize={{ xs: "10px", sm: "12px" }}
      py={"2px"}
      display={"flex"}
      justifyContent={"end"}
      alignItems={"center"}
    >
      <Box mx={"5px"}>
        Sold: {blocks.filter((block) => block.owner !== undefined).length}
      </Box>
      |
      <Box mx={"5px"}>
        Left:{" "}
        {10000 - blocks.filter((block) => block.owner !== undefined).length}
      </Box>
      |
      <Box mx={"5px"} display={"flex"} alignItems={"center"}>
        <span style={{ marginRight: "3px" }}>
          Moons Burned:{" "}
          {ethers.BigNumber.isBigNumber(cost)
            ? ethers.utils.formatEther(
                cost.mul(
                  blocks.filter((block) => block.owner !== undefined).length
                )
              )
            : 0}
        </span>
        🔥
      </Box>
    </Box>
  );
};

export default Status;
