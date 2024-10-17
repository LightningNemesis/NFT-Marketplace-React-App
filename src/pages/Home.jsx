import React, { useEffect, useContext } from "react";
import { ethers } from "ethers";

import HeroSection from "../components/ui/HeroSection";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import SellerSection from "../components/ui/Seller-section/SellerSection";

import Trending from "../components/ui/Trending-section/OwnedTokens";

import StepSection from "../components/ui/Step-section/StepSection";

import { AppContext } from "../contexts/Context";

import { connectWallet } from "../components/utility/walletFunctions";

const Home = () => {
  const {
    mintedNfts,
    nfts,
    ownedNfts,
    walletInfo,
    updateWalletInfo,
    accountNames,

    fetchNFTs,
    fetchOwnedNFTs,
  } = useContext(AppContext);

  useEffect(() => {
    // if (window.ethereum) {
    //   const handleAccountsChanged = (accounts) => {
    //     if (accounts.length > 0) {
    //       connectWallet(updateWalletInfo); // Reconnect and update wallet info
    //     }
    //   };
    //   window.ethereum.on("accountsChanged", handleAccountsChanged);
    //   return () => {
    //     window.ethereum.removeListener(
    //       "accountsChanged",
    //       handleAccountsChanged
    //     );
    //   };
    // }
    // console.log("minted nfts", mintedNfts);
    // console.log("listed nfts", nfts);
    // console.log("owned nfts", ownedNfts);
    fetchNFTs();
  }, [walletInfo, accountNames]);

  return (
    <>
      <HeroSection />
      <LiveAuction />
      {/* <SellerSection /> */}
      <Trending />
      {/* <StepSection /> */}
    </>
  );
};

export default Home;
