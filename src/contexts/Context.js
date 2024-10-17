import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getNFTs,
  getOwnedNFTs,
  getUnlistedNFTs,
} from "../components/contracts/contractInteraction.js";
import { generateRandomName } from "../components/utility/randomNameGenerator.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState({});
  const [nfts, setNfts] = useState([]);
  const [mintedNfts, setMintedNfts] = useState([]);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [accountNames, setAccountNames] = useState({});
  const [addressAvatarMap, setAddressAvatarMap] = useState({});

  const avatarImages = [
    "ava-01.png",
    "ava-02.png",
    "ava-03.png",
    "ava-04.png",
    "ava-05.png",
    "ava-06.png",
  ];

  useEffect(() => {
    const storedWalletInfo = JSON.parse(localStorage.getItem("walletInfo"));

    // const storedAccountNames =
    //   JSON.parse(localStorage.getItem("accountNames")) || {};

    // const storedAvatarMap =
    //   JSON.parse(localStorage.getItem("addressAvatarMap")) || {};

    // const storedNFTs = localStorage.getItem("nfts");
    // const storedMintedNFTs = localStorage.getItem("mintedNfts");
    // const storedOwnedNFTs = localStorage.getItem("ownedNfts");

    if (storedWalletInfo && Object.keys(storedWalletInfo).length > 0) {
      setWalletInfo(storedWalletInfo);
    }
    // if (Object.keys(storedAccountNames).length > 0) {
    //   setAccountNames(storedAccountNames);
    // }
    // if (Object.keys(storedAvatarMap).length > 0) {
    //   setAddressAvatarMap(storedAvatarMap);
    // }
    // if (storedNFTs) {
    //   setNfts(JSON.parse(storedNFTs));
    // }
    // if (storedMintedNFTs) {
    //   setMintedNfts(JSON.parse(storedMintedNFTs));
    // }
    // if (storedOwnedNFTs) {
    //   setOwnedNfts(JSON.parse(storedOwnedNFTs));
    // }
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

  // Fetch unlisted minted NFTs
  const fetchMintedNFTs = useCallback(async () => {
    try {
      const fetchedMintedNFTs = await getUnlistedNFTs();
      console.log("Fetched Minted NFTs:", fetchedMintedNFTs);
      setMintedNfts(fetchedMintedNFTs); // Store them in a separate state variable
    } catch (error) {
      console.error("Error fetching minted NFTs:", error);
    }
  }, []);

  // Update minted NFTs and store them in localStorage
  const updateMintedNFTs = (newMintedNFTs) => {
    setMintedNfts(newMintedNFTs); // Store in state variable for minted NFTs
    localStorage.setItem("mintedNfts", JSON.stringify(newMintedNFTs)); // Save to localStorage
  };

  const fetchOwnedNFTs = useCallback(async () => {
    try {
      const fetchedOwnedNFTs = await getOwnedNFTs();
      console.log("Fetched Owned NFTs:", fetchedOwnedNFTs);
      setOwnedNfts(fetchedOwnedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, []);

  const updateOwnedNFTs = (newOwnedNFTs) => {
    setOwnedNfts(newOwnedNFTs);
    localStorage.setItem("ownedNfts", JSON.stringify(newOwnedNFTs));
  };

  const updateWalletInfo = (newWalletInfo) => {
    const { account } = newWalletInfo;

    let updatedAccountNames = { ...accountNames };
    let updatedAvatarMap = { ...addressAvatarMap };

    // Assign name if the account is new
    if (!updatedAccountNames[account]) {
      updatedAccountNames[account] = generateRandomName();
    }

    // Assign avatar if the account is new
    if (!updatedAvatarMap[account]) {
      const randomAvatar =
        avatarImages[Math.floor(Math.random() * avatarImages.length)];
      updatedAvatarMap[account] = randomAvatar;
    }

    const fullWalletInfo = {
      ...newWalletInfo,
      name: updatedAccountNames[account],
      avatar: updatedAvatarMap[account],
    };

    // Update states and localStorage
    setWalletInfo(fullWalletInfo);
    setAccountNames(updatedAccountNames);
    setAddressAvatarMap(updatedAvatarMap);

    localStorage.setItem("walletInfo", JSON.stringify(fullWalletInfo));
    localStorage.setItem("accountNames", JSON.stringify(updatedAccountNames));
    localStorage.setItem("addressAvatarMap", JSON.stringify(updatedAvatarMap));
  };

  const valuesToShare = {
    mintedNfts,
    fetchMintedNFTs,
    updateMintedNFTs,
    nfts,
    fetchNFTs,
    updateNFTs,
    ownedNfts,
    fetchOwnedNFTs,
    updateOwnedNFTs,
    walletInfo,
    accountNames,
    addressAvatarMap,
    updateWalletInfo,
  };

  return (
    <AppContext.Provider value={valuesToShare}>{children}</AppContext.Provider>
  );
};
