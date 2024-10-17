import ava01 from "../../assets/images/ava-01.png";
import ava02 from "../../assets/images/ava-02.png";
import ava03 from "../../assets/images/ava-03.png";
import ava04 from "../../assets/images/ava-04.png";
import ava05 from "../../assets/images/ava-05.png";
import ava06 from "../../assets/images/ava-06.png";

export const avatarImages = {
  "ava-01.png": ava01,
  "ava-02.png": ava02,
  "ava-03.png": ava03,
  "ava-04.png": ava04,
  "ava-05.png": ava05,
  "ava-06.png": ava06,
  default: ava06,
};

export const getAvatarForAddress = (addressAvatarMap, address) => {
  if (addressAvatarMap && addressAvatarMap[address]) {
    return avatarImages[addressAvatarMap[address]]; // Return the avatar image based on the index
  } else {
    return avatarImages.default; // Fallback to default image if no avatar found
  }
};
