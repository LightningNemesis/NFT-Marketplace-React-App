import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppContext } from "../../../contexts/Context";

import NftCard from "../Nft-card/NftCard";
import { NFT__DATA } from "../../../assets/data/data.js";

import "./live-auction.css";
// import { getOwnedNFTs } from "../../contracts/contractInteraction.js";

const LiveAuction = () => {
  const { nfts, ownedNfts } = useContext(AppContext);

  useEffect(() => {
    // getOwnedNFTs();
  }, [nfts, ownedNfts]);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Live Auction</h3>
              <span>
                <Link to="/market">Explore more</Link>
              </span>
            </div>
          </Col>

          {/* {NFT__DATA.slice(0, 4).map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4">
              <NftCard key={item.id} item={item} />
            </Col>
          ))} */}

          {nfts.length > 0 ? (
            nfts.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard
                  item={item}
                  // setLoading={setLoading} // Pass setLoading separately
                  // setStatus={setStatus} // Pass setStatus separately
                  // buyNFTSuccess={buyNFTSuccess}
                  // buyNFTFail={buyNFTFail}
                  // listNFTSuccess={listNFTSuccess}
                  // listNFTFail={listNFTFail}
                />
              </Col>
            ))
          ) : (
            <Col>
              <p>No NFTs found</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default LiveAuction;
