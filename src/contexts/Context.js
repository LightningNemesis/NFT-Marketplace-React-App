import React, { createContext, useState, useEffect, useCallback } from "react";

import { getNFTs } from "../components/contracts/contractInteraction.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      setAccount(storedAccount);
    }
    const storedNFTs = localStorage.getItem("nfts");
    if (storedNFTs) {
      setNfts(JSON.parse(storedNFTs));
    }
  }, []);

  const fetchNFTs = useCallback(async () => {
    try {
      const fetchedNFTs = await getNFTs();
      console.log("Fetched NFTs:", fetchedNFTs);
      setNfts(fetchedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, []);

  const updateNFTs = (newNFTs) => {
    setNfts(newNFTs);
    localStorage.setItem("nfts", JSON.stringify(newNFTs));
  };

  const updateAccount = (newAccount) => {
    setAccount(newAccount);
    localStorage.setItem("account", newAccount);
  };

  const valuesToShare = {
    nfts,
    fetchNFTs,
    updateNFTs,
    account,
    updateAccount,
  };

  return (
    <AppContext.Provider value={valuesToShare}>{children}</AppContext.Provider>
  );
};
