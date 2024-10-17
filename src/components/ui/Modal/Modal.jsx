import React, { useState, useContext } from "react";

import "./modal.css";
import { handleListNFT } from "../../contracts/contractInteraction";

import { AppContext } from "../../../contexts/Context";

const Modal = ({ setShowModal, id }) => {
  const { nfts, ownedNfts, updateNFTs, updateOwnedNFTs } =
    useContext(AppContext);

  const [price, setPrice] = useState("");

  const handleListing = async () => {
    await handleListNFT({
      tokenId: id,
      price,
      nfts,
      updateNFTs,
      ownedNfts,
      updateOwnedNFTs,
    });
    setShowModal(false);
  };

  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">Enter listing price</h6>
        {/* <p className="text-center text-light">
          You must bid at least <span className="money">5.89 ETH</span>
        </p> */}

        <div className="input__item mb-4">
          <input
            type="number"
            placeholder="00.00 ETH"
            min="0"
            step="0.000001"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* <div className="input__item mb-3">
          <h6>Enter Quantity, 7 available</h6>
          <input type="number" placeholder="Enter quantity" />
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>You must bid at least</p>
          <span className="money">5.89 ETH</span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Service Fee</p>
          <span className="money">0.89 ETH</span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Total Bid Amount</p>
          <span className="money">5.89 ETH</span>
        </div> */}

        <button className="place__bid-btn" onClick={handleListing}>
          List on Marketplace
        </button>
      </div>
    </div>
  );
};

export default Modal;
