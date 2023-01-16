import React from "react";

import LeaderBoardPanel from "../../components/LeaderBoard";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const LeaderBoard: React.FC = () => {
  return (
    <>
      <Header></Header>
      <LeaderBoardPanel></LeaderBoardPanel>
      <Footer></Footer>
    </>
  );
};

export default LeaderBoard;
