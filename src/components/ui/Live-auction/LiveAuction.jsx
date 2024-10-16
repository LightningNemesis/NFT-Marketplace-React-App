import React, { useEffect, useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import { AppContext } from "../../../contexts/Context";

import NftCard from "../Nft-card/NftCard";
import { NFT__DATA } from "../../../assets/data/data.js";

import "./live-auction.css";

const LiveAuction = () => {
  const { nfts } = useContext(AppContext);

  useEffect(() => {}, []);

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
            nfts.slice(0, 6).map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} />
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
