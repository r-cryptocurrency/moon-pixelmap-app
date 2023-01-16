import { Box } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import React from "react";
import { useAccount, useContractRead } from "wagmi";

import { Token } from "../../contracts/config";
import logo from "../../assets/image/logo.png";

const BalanceChip: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useContractRead({
    address: Token.address[42170],
    abi: Token.abi,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  return isConnected && BigNumber.isBigNumber(balance) ? (
    <Box
      display={"flex"}
      alignItems={"center"}
      sx={{
        borderRadius: "50rem",
        border: "2px solid #97afd5",
        p: { xs: "6px 8px", sm: "7px 10px", md: "11px 15px" },
      }}
      mr={"5px"}
    >
      <Box
        component={"img"}
        src={logo.src}
        sx={{
          width: { xs: "18px", sm: "22px", md: "24px" },
          marginRight: {
            xs: "2px",
            sm: "5px",
            md: "15px",
          },
        }}
      ></Box>
      <Box
        component={"span"}
        display={"flex"}
        justifyContent={"center"}
        sx={{
          verticalAlign: "middle",
        }}
        color={"#97afd5"}
        fontSize={{ xs: "12px", sm: "14px", md: "16px" }}
        fontWeight={600}
      >
        {parseFloat(ethers.utils.formatEther(balance)).toFixed(2)}
      </Box>
    </Box>
  ) : null;
};

export default BalanceChip;
