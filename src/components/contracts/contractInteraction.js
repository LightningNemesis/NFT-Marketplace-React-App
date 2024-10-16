import { ethers } from "ethers";
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

export const handleBuy = async ({ currentBid, id }) => {
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
      console.log("NFT purchased successfully");

      // Optionally update context or state here
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  } else {
    console.error("MetaMask is not installed.");
  }
};
