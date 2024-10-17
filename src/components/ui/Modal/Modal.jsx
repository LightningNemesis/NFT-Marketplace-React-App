import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./modal.css";
import { handleListNFT } from "../../contracts/contractInteraction";

import { AppContext } from "../../../contexts/Context";

const Modal = ({
  setShowModal,
  id,

  setLoading,
  setStatus,
  listNFTSuccess,
  listNFTFail,
}) => {
  const { nfts, ownedNfts, updateNFTs, updateOwnedNFTs } =
    useContext(AppContext);

  const [price, setPrice] = useState("");

  const handleListing = async () => {
    if (!price || isNaN(price) || Number(price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setShowModal(false);
    await handleListNFT({
      tokenId: id,
      price,
      nfts,
      updateNFTs,
      ownedNfts,
      updateOwnedNFTs,

      setStatus,
      setLoading,
      listNFTSuccess,
      listNFTFail,
    });
  };

  return (
    <div className="modal__wrapper">
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
