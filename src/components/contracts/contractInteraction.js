import { ethers } from "ethers";
import MyNFTContract from "../contracts/NFTMarketplace.json";

const contractAddress = "0x8C14266C725bb26E48aCdd2780d094aD4D33FE98";
const contractABI = MyNFTContract.abi;

function ipfsToHttp(url) {
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`;
  }
  return url;
}

// Gets a list of all NFTs listed on the marketplace
export const getNFTs = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask or another Ethereum wallet");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

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

        const owner = await contract.ownerOf(tokenId);
        console.log("Owner:", owner);

        // Use getNFTListing to fetch listing details
        const { price, seller } = await contract.getNFTListing(tokenId);
        console.log("Listing:", { price, seller });

        nfts.push({
          id: tokenId.toString(),
          title: metadata.name,
          desc: metadata.description,
          imgUrl: ipfsToHttp(metadata.image),
          creator: owner,
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
