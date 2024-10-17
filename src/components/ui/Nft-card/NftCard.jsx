import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./nft-card.css";

import Modal from "../Modal/Modal";
// import BuyModal from "../Modal/BuyModal";

import { AppContext } from "../../../contexts/Context";

// import { avatarImages } from "../../utility/avatarGenerator";
import { getAvatarForAddress } from "../../utility/avatarGenerator";
import { addressToName } from "../../utility/accountToNames";
import { handleBuy, handleListNFT } from "../../contracts/contractInteraction";
import { checkTokenOwnership } from "../../utility/buyOrList";

import { LoadingModal } from "../Modal/LoadingModal";

const NftCard = ({ item }) => {
  const {
    walletInfo,
    accountNames,
    addressAvatarMap,
    nfts,
    ownedNfts,
    updateNFTs,
    updateOwnedNFTs,
  } = useContext(AppContext);

  const { title, id, currentBid, creatorImg, imgUrl, creator, owner, royalty } =
    item;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [status, setStatus] = useState("Loading"); // New status state

  const buyNFTSuccess = () => {
    toast.success("NFT bought successfully!");
  };

  const buyNFTFail = () => {
    toast.error("NFT buy failed!");
  };

  const listNFTSuccess = () => {
    toast.success("NFT listed successfully!");
  };

  const listNFTFail = () => {
    toast.error("NFT listing failed!");
  };

  useEffect(() => {}, []);

  return (
    <div className="single__nft__card">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 111112 }}
      />
      {loading && <LoadingModal status={status} />}
      <div className="nft__img">
        <img
          src={imgUrl}
          alt=""
          style={{
            width: "250px",
            height: "250px",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${id}`}>{title}</Link>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
          <div className="creator__img">
            {/* <img src={creatorImg} alt="" className="w-100" /> */}
            <img
              src={getAvatarForAddress(addressAvatarMap, creator)}
              alt="Creator Avatar"
              className="w-100"
            />
          </div>

          <div className="creator__info w-100 d-flex justify-content-between">
            <div className="small-text">
              <h6 className="small-heading">Owned By</h6>
              <p style={{ fontSize: "0.85rem" }}>
                {addressToName(accountNames, owner)}
              </p>
              <br />
              <h6 className="small-heading">Created By</h6>
              <p style={{ fontSize: "0.70rem" }}>
                {addressToName(accountNames, creator)}
              </p>
            </div>

            <div className="small-text">
              <h6 className="small-heading">Current Bid</h6>
              <p style={{ fontSize: "0.85rem" }}>{currentBid} ETH</p>
              <br />
              <h6 className="small-heading">Royalty</h6>
              <p style={{ fontSize: "0.85rem" }}>{royalty} %</p>
            </div>
          </div>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            // onClick={() => setShowModal(true)}
            onClick={() =>
              checkTokenOwnership(id, ownedNfts)
                ? setShowModal(true)
                : handleBuy({
                    currentBid,
                    id,
                    nfts,
                    ownedNfts,
                    updateNFTs,
                    updateOwnedNFTs,

                    setLoading,
                    setStatus,
                    buyNFTSuccess,
                    buyNFTFail,
                  })
            }
          >
            {checkTokenOwnership(id, ownedNfts) ? "List on Marketplace" : "Buy"}
            {/* <i class="ri-shopping-bag-line"></i> Place Bid */}
          </button>
          {showModal && (
            <Modal
              setShowModal={setShowModal}
              id={id}
              setLoading={setLoading} // Corrected
              setStatus={setStatus} // Corrected
              listNFTSuccess={listNFTSuccess}
              listNFTFail={listNFTFail}
            />
          )}

          <span className="history__link">
            <Link to="#">View History</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
