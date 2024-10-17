import React from "react";
import { useNavigate } from "react-router-dom";

import { useContext, useEffect } from "react";

import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import { AppContext } from "../../contexts/Context";
import { connectWallet } from "../utility/walletFunctions";

const Layout = () => {
  const navigate = useNavigate();
  const {
    fetchMintedNFTs,
    fetchNFTs,
    fetchOwnedNFTs,
    walletInfo,
    updateWalletInfo,
  } = useContext(AppContext);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          navigate("/");
          connectWallet(updateWalletInfo); // Reconnect and update wallet info
          fetchMintedNFTs();
          fetchNFTs();
          fetchOwnedNFTs();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [fetchMintedNFTs, fetchNFTs, fetchOwnedNFTs, walletInfo]);

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
