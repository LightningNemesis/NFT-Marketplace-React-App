import React, { useEffect, useContext } from "react";
import { ethers } from "ethers";

import HeroSection from "../components/ui/HeroSection";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import SellerSection from "../components/ui/Seller-section/SellerSection";

import Trending from "../components/ui/Trending-section/OwnedTokens";

import StepSection from "../components/ui/Step-section/StepSection";

import { AppContext } from "../contexts/Context";

const Home = () => {
  const { walletInfo, updateWalletInfo, accountNames } = useContext(AppContext);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request access to accounts
        await provider.send("eth_requestAccounts", []);

        // Get the signer and address
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Fetch and format the balance
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);

        // Fetch the network information
        const network = await provider.getNetwork();

        // Generate a random name for the account

        // Store the fetched details in an object
        const newWalletInfo = {
          account: address,
          balance: formattedBalance + " ETH",
          networkName: network.name || "unknown",
          networkChainId: network.chainId.toString(),
        };

        console.log("New Wallet Info:", newWalletInfo);

        updateWalletInfo(newWalletInfo);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  };

  useEffect(() => {
    // console.log("Wallet Info:", walletInfo);
    // console.log("Account Names:", accountNames);
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          connectWallet(); // Reconnect and update wallet info
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
