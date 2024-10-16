import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

import "./nft-card.css";

import Modal from "../Modal/Modal";
import BuyModal from "../Modal/BuyModal";

import { AppContext } from "../../../contexts/Context";

import { avatarImages } from "../../utility/avatarGenerator";
import { handleBuy } from "../../contracts/contractInteraction";

const NftCard = (props) => {
  // const MARKETPLACE_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
  const { walletInfo, accountNames, addressAvatarMap } = useContext(AppContext);
  const { title, id, currentBid, creatorImg, imgUrl, creator } = props.item;

  const [showModal, setShowModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const addressToName = (address) => {
    if (accountNames && accountNames[address]) {
      return accountNames[address];
    } else {
      return address.slice(0, 5);
    }
  };

  // Function to retrieve the avatar image based on the address
  const getAvatarForAddress = (address) => {
    if (addressAvatarMap && addressAvatarMap[address]) {
      return avatarImages[addressAvatarMap[address]]; // Return the avatar image based on the index
    } else {
      return avatarImages.default; // Fallback to default image if no avatar found
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={imgUrl} alt="" className="w-100" />
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${id}`}>{title}</Link>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
          <div className="creator__img">
            {/* <img src={creatorImg} alt="" className="w-100" /> */}
            <img
              src={getAvatarForAddress(creator)}
              alt="Creator Avatar"
              className="w-100"
            />
          </div>

          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              <h6>Created By</h6>
              <p>{addressToName(creator)}</p>
            </div>

            <div>
              <h6>Current Bid</h6>
              <p>{currentBid} ETH</p>
            </div>
          </div>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            // onClick={() => setShowModal(true)}
            onClick={() => handleBuy({ currentBid, id })}
          >
            <i class="ri-shopping-bag-line"></i> Place Bid
          </button>

          {showModal && <Modal setShowModal={setShowModal} />}
          {/* {showBuyModal && (
            <BuyModal
              onClose={() => setShowBuyModal(false)}
              image={imgUrl}
              price={currentBid}
              onConfirm={() => {
                console.log("bought item");
              }}
            />
          )} */}

          <span className="history__link">
            <Link to="#">View History</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
