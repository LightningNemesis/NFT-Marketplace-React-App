import React from "react";
import "./buyModal.css"; // Assuming this is your existing CSS for modals

const BuyModal = ({ onClose, image, price, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirm Purchase</h2>
          <button onClick={onClose} className="close-button">
            ✖
          </button>
        </div>

        <div className="modal-body">
          <img src={image} alt="NFT" className="modal-image" />
          <p>Price: {price} ETH</p>
          <p>Are you sure you want to buy this NFT?</p>
        </div>

        <div className="modal-footer">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm Purchase
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
