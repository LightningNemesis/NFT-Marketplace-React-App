import { ethers, parseEther } from "ethers";
import MyNFTContract from "../contracts/NFTMarketplace.json";
import { ipfsToHttp } from "../utility/ipfsUtility";

// const contractAddress = "0x8C14266C725bb26E48aCdd2780d094aD4D33FE98";
const MARKETPLACE_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = MyNFTContract.abi;

// Gets a list of all NFTs listed on the marketplace
export const getNFTs = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask or another Ethereum wallet");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      MARKETPLACE_CONTRACT_ADDRESS,
      contractABI,
      signer
    );

    console.log("Contract instance created");

    const listedNFTs = await contract.getListedNFTs();
    console.log("Listed NFTs:", listedNFTs);

    const nfts = [];

    for (let i = 0; i < listedNFTs.length; i++) {
      const tokenId = listedNFTs[i];
      console.log("Processing token ID:", tokenId.toString());

      try {
        const tokenURI = await contract.tokenURI(tokenId);
        console.log("Token URI:", tokenURI);

        const httpTokenURI = ipfsToHttp(tokenURI);
        const metadata = await fetch(httpTokenURI).then((res) => res.json());
        console.log("Metadata:", metadata);

        // Fetch owner, creator, and royalty information
        const owner = await contract.ownerOf(tokenId);
        console.log("Owner:", owner);

        const creator = await contract.getCreator(tokenId);
        console.log("Creator:", creator);

        const royalty = await contract.getRoyalty(tokenId);
        console.log("Royalty:", royalty);

        // Use getNFTListing to fetch listing details
        const { price, seller } = await contract.getNFTListing(tokenId);
        console.log("Listing:", { price, seller });

        nfts.push({
          id: tokenId.toString(),
          title: metadata.name,
          desc: metadata.description,
          imgUrl: ipfsToHttp(metadata.image),
          creator: creator,
          owner: owner,
          royalty: royalty.toString(), // Include royalty information
          creatorImg: metadata.creatorImage || "",
          currentBid: ethers.formatEther(price.toString()),
        });
      } catch (error) {
        console.error(`Error processing NFT ${tokenId}:`, error);
      }
    }

    console.log("Processed NFTs:", nfts);
    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

export const getUnlistedNFTs = async (ownerAddress) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask or another Ethereum wallet");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      MARKETPLACE_CONTRACT_ADDRESS,
      contractABI,
      signer
    );

    console.log("Contract instance created");

    // Fetch unlisted NFTs owned by the specified address
    const unlistedNFTs = await contract.getUnlistedMintedNFTs(ownerAddress);
    console.log("Unlisted Minted NFTs:", unlistedNFTs);

    const nfts = [];

    for (let i = 0; i < unlistedNFTs.length; i++) {
      const tokenId = unlistedNFTs[i];
      console.log("Processing token ID:", tokenId.toString());

      try {
        const tokenURI = await contract.tokenURI(tokenId);
        console.log("Token URI:", tokenURI);

        const httpTokenURI = ipfsToHttp(tokenURI);
        const metadata = await fetch(httpTokenURI).then((res) => res.json());
        console.log("Metadata:", metadata);

        // Fetch owner, creator, and royalty information
        const owner = await contract.ownerOf(tokenId);
        console.log("Owner:", owner);

        const creator = await contract.getCreator(tokenId);
        console.log("Creator:", creator);

        const royalty = await contract.getRoyalty(tokenId);
        console.log("Royalty:", royalty);

        nfts.push({
          id: tokenId.toString(),
          title: metadata.name,
          desc: metadata.description,
          imgUrl: ipfsToHttp(metadata.image),
          creator: creator,
          owner: owner,
          royalty: royalty.toString(), // Include royalty information
          creatorImg: metadata.creatorImage || "",
          currentBid: "N/A", // No current bid for unlisted NFTs
        });
      } catch (error) {
        console.error(`Error processing NFT ${tokenId}:`, error);
      }
    }

    console.log("Processed Unlisted NFTs:", nfts);
    return nfts;
  } catch (error) {
    console.error("Error fetching unlisted NFTs:", error);
    return [];
  }
};

export const getOwnedNFTs = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask or another Ethereum wallet");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(
      MARKETPLACE_CONTRACT_ADDRESS,
      contractABI,
      signer
    );

    console.log("Fetching owned NFTs for address:", address);

    const ownedTokenIds = await contract.getOwnedTokens(address);
    console.log("Owned Token IDs:", ownedTokenIds);

    const nfts = [];

    for (const tokenId of ownedTokenIds) {
      try {
        const tokenURI = await contract.tokenURI(tokenId);
        console.log("Token URI:", tokenURI);

        const httpTokenURI = ipfsToHttp(tokenURI);
        const metadata = await fetch(httpTokenURI).then((res) => res.json());
        console.log("Metadata:", metadata);

        // Fetch owner, creator, and royalty information
        const owner = await contract.ownerOf(tokenId);
        console.log("Owner:", owner);

        const creator = await contract.getCreator(tokenId);
        console.log("Creator:", creator);

        const royalty = await contract.getRoyalty(tokenId);
        console.log("Royalty:", royalty);

        // Use getNFTListing to fetch listing details
        const { price } = await contract.getNFTListing(tokenId);

        nfts.push({
          id: tokenId.toString(),
          title: metadata.name,
          desc: metadata.description,
          imgUrl: ipfsToHttp(metadata.image),
          creator: creator,
          owner: owner,
          royalty: royalty.toString(),
          creatorImg: metadata.creatorImage || "",
          currentBid: ethers.formatEther(price.toString()),
        });
      } catch (error) {
        console.error(`Error processing NFT ${tokenId}:`, error);
      }
    }

    console.log("Owned NFTs:", nfts);
    return nfts;
  } catch (error) {
    console.error("Error fetching owned NFTs:", error);
    return [];
  }
};

export const handleListNFT = async ({
  tokenId,
  price,
  nfts,
  updateNFTs,
  ownedNfts,
  updateOwnedNFTs,
}) => {
  if (!window.ethereum) return console.error("MetaMask is not installed.");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      MARKETPLACE_CONTRACT_ADDRESS,
      MyNFTContract.abi,
      signer
    );

    console.log("Listing NFT for sale...");
    const ethPrice = parseEther(price.toString());
    const listTx = await contract.listNFT(tokenId, ethPrice);
    await listTx.wait();
    console.log("NFT listed successfully");

    // Find the NFT in the ownedNFTs list
    const nftToList = ownedNfts.find((nft) => nft.id === tokenId);
    if (nftToList) {
      // Create a new object with updated price while keeping other properties the same
      const listedNFT = {
        ...nftToList,
        currentBid: price, // Update the price with the listing price
      };

      // Update the ownedNFTs list to remove the NFT that is being listed
      const updatedOwnedNFTs = ownedNfts.filter((nft) => nft.id !== tokenId);
      updateOwnedNFTs(updatedOwnedNFTs);

      // Add the NFT to the listed NFTs list
      const updatedListedNFTs = [...nfts, listedNFT];
      updateNFTs(updatedListedNFTs);

      console.log("NFT moved from owned to listed with updated price");
    } else {
      console.error("NFT not found in ownedNFTs list");
    }

    // Optionally update context or state to reflect the listing status
  } catch (error) {
    console.error("Error listing NFT:", error);
    return error;
  }
};

export const handleBuy = async ({
  currentBid,
  id,
  nfts,
  updateNFTs,
  ownedNfts,
  updateOwnedNFTs,
}) => {
  console.log(currentBid, id);
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MyNFTContract.abi,
        signer
      );

      const ethPrice = ethers.parseEther(currentBid.toString());

      console.log("Buying NFT...");
      const tx = await contract.buyNFT(id, { value: ethPrice });
      await tx.wait();

      // Find the purchased NFT in the original nfts array
      const purchasedNFT = nfts.find((nft) => nft.id === id);

      // If the NFT is found, add it to the owned NFTs list
      if (purchasedNFT) {
        // Update the owner property to reflect the current user
        const ownerAddress = await signer.getAddress();
        const ownedNFTWithDetails = { ...purchasedNFT, owner: ownerAddress };

        // Update owned NFTs state
        const updatedOwnedNFTs = [...ownedNfts, ownedNFTWithDetails];
        updateOwnedNFTs(updatedOwnedNFTs);
      } else {
        console.error("NFT not found in the listed NFTs array");
      }

      // Fetch the updated owned and listed NFTs from the blockchain or update the state accordingly
      const updatedListedNFTs = nfts.filter((nft) => nft.id !== id); // Remove purchased NFT from listed NFTs
      updateNFTs(updatedListedNFTs);

      console.log("NFT purchased successfully");

      // Optionally update context or state here
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  } else {
    console.error("MetaMask is not installed.");
  }
};
