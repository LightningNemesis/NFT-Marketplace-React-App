import React, { useContext } from "react";
import { Container, Row, Col } from "reactstrap";

import { NFT__DATA } from "../../../assets/data/data";
import "./trending.css";

import NftCard from "../Nft-card/NftCard";

import { AppContext } from "../../../contexts/Context";

const OwnedTokens = () => {
  const { ownedNfts } = useContext(AppContext);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <h3 className="trending__title">Owned Tokens</h3>
          </Col>

          {ownedNfts.length > 0 ? (
            ownedNfts.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} />
              </Col>
            ))
          ) : (
            <Col>
              <p>No NFTs found</p>
            </Col>
          )}

          {/* {NFT__DATA.slice(0, 8).map((item) => (
            <Col lg="3" md="4" sm="6" key={item.id} className="mb-4">
              <NftCard item={item} />
            </Col>
          ))} */}
        </Row>
      </Container>
    </section>
  );
};

export default OwnedTokens;
