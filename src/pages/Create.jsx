import React, { useState, useContext } from "react";
import { ethers, parseEther } from "ethers"; // Import parseEther directly
import { Container, Row, Col } from "reactstrap";

import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";

import { AppContext } from "../contexts/Context";
import MyNFTContract from "../components/contracts/NFTMarketplace.json";
import {
  ipfsToHttp,
  uploadFileToIPFS,
  uploadMetadataToIPFS,
} from "../components/utility/ipfsUtility";

import "../styles/create-item.css";

const item = {
  id: "01",
  title: "Guard",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam adipisci cupiditate officia, nostrum et deleniti vero corrupti facilis minima laborum nesciunt nulla error natus saepe illum quasi ratione suscipit tempore dolores. Recusandae, similique modi voluptates dolore repellat eum earum sint.",
  imgUrl: img,
  creator: "Trista Francis",
  creatorImg: avatar,
  currentBid: 7.89,
};

const Create = () => {
  const MARKETPLACE_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  const { nfts, updateNFTs } = useContext(AppContext); // Access context

  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [royalty, setRoyalty] = useState(0); // New state for royalty

  const handlePriceChange = (e) => {
    const inputPrice = e.target.value;
    if (!isNaN(inputPrice) && Number(inputPrice) >= 0) {
      setPrice(inputPrice);
    } else {
      console.error("Invalid price entered");
    }
  };

  const handleRoyaltyChange = (e) => {
    const inputRoyalty = e.target.value;
    if (
      !isNaN(inputRoyalty) &&
      Number(inputRoyalty) >= 0 &&
      Number(inputRoyalty) <= 100
    ) {
      setRoyalty(inputRoyalty);
    } else {
      console.error("Invalid royalty entered");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Starting file upload to IPFS...");
      const fileURI = await uploadFileToIPFS(file);
      console.log("File uploaded to IPFS:", fileURI);

      console.log("Creating metadata...");
      const metadata = {
        name: title,
        description: description,
        image: fileURI,
      };

      console.log("Uploading metadata to IPFS...");
      const metadataURI = await uploadMetadataToIPFS(metadata);
      console.log("Metadata uploaded to IPFS:", metadataURI);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          MARKETPLACE_CONTRACT_ADDRESS,
          MyNFTContract.abi,
          signer
        );

        console.log("Minting NFT...");
        // Pass royalty percentage when minting
        const tx = await contract.mint(metadataURI, royalty);
        const receipt = await tx.wait();

        // Extract tokenId from the Transfer event
        const transferLog = receipt.logs.find(
          (log) =>
            log.topics[0] === contract.interface.getEvent("Transfer").topicHash
        );

        const tokenId = contract.interface
          .parseLog(transferLog)
          .args.tokenId.toString();
        console.log("Minted NFT with token ID:", tokenId);

        if (price) {
          console.log("Listing NFT for sale...");
          const ethPrice = parseEther(price.toString());
          const listTx = await contract.listNFT(tokenId, ethPrice);
          await listTx.wait();
          console.log("NFT listed successfully");
        }

        // Update context with new NFT
        const newNFT = {
          id: tokenId,
          title: metadata.name,
          desc: metadata.description,
          imgUrl: ipfsToHttp(fileURI),
          creator: await signer.getAddress(),
          owner: await signer.getAddress(),
          creatorImg: "", // Add logic to fetch or set creator image if needed
          currentBid: price || "0",
          royalty: royalty, // Include royalty in the NFT data
        };

        updateNFTs([...nfts, newNFT]);
      }
    } catch (error) {
      console.error("Error creating NFT:", error);
    }
  };

  return (
    <>
      <CommonSection title="Create Item" />
      <section>
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              <NftCard item={item} />
            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form onSubmit={handleSubmit}>
                  <div className="form__input">
                    <label htmlFor="">Upload File</label>
                    <input
                      type="file"
                      className="upload__input"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Price</label>
                    <input
                      type="number"
                      placeholder="Enter price for one item (ETH)"
                      value={price}
                      min="0"
                      step="0.000001" // Allows small decimal values
                      onChange={handlePriceChange}
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Royalty (%)</label>
                    <input
                      type="number"
                      placeholder="Enter royalty percentage"
                      value={royalty}
                      step="0.000001" // Allows small decimal values
                      onChange={handleRoyaltyChange}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Description</label>
                    <textarea
                      rows="7"
                      placeholder="Enter description"
                      className="w-100"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bid__btn d-flex align-items-center gap-1"
                  >
                    <i className="ri-shopping-bag-line"></i> Create NFT
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
