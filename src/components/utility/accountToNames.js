export const addressToName = (accountNames, address) => {
  if (!address) return null;

  if (accountNames && accountNames[address]) {
    return accountNames[address];
  } else {
    return address.slice(0, 5);
  }
};
