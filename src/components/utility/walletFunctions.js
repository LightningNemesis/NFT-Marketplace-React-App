import { ethers } from "ethers";

export const connectWallet = async (updateWalletInfo) => {
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
