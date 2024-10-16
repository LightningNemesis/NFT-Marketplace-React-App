import React from "react";
import { useContext, useEffect } from "react";

import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import { AppContext } from "../../contexts/Context";

const Layout = () => {
  const { fetchNFTs, fetchOwnedNFTs, walletInfo } = useContext(AppContext);

  useEffect(() => {
    fetchNFTs();
    fetchOwnedNFTs();
  }, [fetchNFTs, fetchOwnedNFTs, walletInfo]);

  return (
    <div>
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
