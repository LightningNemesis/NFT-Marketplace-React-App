// Function to check if a tokenId is in the ownedNFTs array
export const checkTokenOwnership = (tokenId, ownedNFTs) => {
  // Check if ownedNFTs contains the tokenId
  const isOwned = ownedNFTs.find((nft) => nft.id === tokenId);

  // Return 1 if token is not owned, otherwise return 0
  return isOwned ? 1 : 0;
};

// Example usage
// const ownedNFTs = [{ id: "1" }, { id: "2" }, { id: "3" }];
// const tokenId = "4";
// const result = checkTokenOwnership(tokenId, ownedNFTs);
// console.log(result); // Outputs: 1 (because tokenId '4' is not owned)
