// src/utils/ipfsUtils.js
import axios from "axios";
import FormData from "form-data";

const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_API_SECRET;

const pinataApiUrl = "https://api.pinata.cloud";

export async function uploadFileToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${pinataApiUrl}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
}

export async function uploadMetadataToIPFS(metadata) {
  try {
    const response = await axios.post(
      `${pinataApiUrl}/pinning/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw error;
  }
}

export async function getMetadataFromIPFS(tokenURI) {
  try {
    const cid = tokenURI.replace("ipfs://", "");
    const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching metadata from IPFS:", error);
    throw error;
  }
}
