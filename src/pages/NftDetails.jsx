import React, { useContext, useEffect } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { NFT__DATA } from "../assets/data/data";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import { AppContext } from "../contexts/Context";
import { getAvatarForAddress } from "../components/utility/avatarGenerator";

import "../styles/nft-details.css";

import { Link } from "react-router-dom";
import { addressToName } from "../components/utility/accountToNames";
import { checkTokenOwnership } from "../components/utility/buyOrList";

const NftDetails = () => {
  const { nfts, ownedNfts, addressAvatarMap, accountNames } =
    useContext(AppContext);
  const { id } = useParams();

  const singleNft = [...nfts, ...ownedNfts].find((item) => item.id === id);

  useEffect(() => {
    // console.log(ownedNfts);
    // console.log("singleNft is:", singleNft);
    // console.log(getAvatarForAddress(addressAvatarMap, singleNft.creator));
    // console.log(ownedNfts);
    // console.log(checkTokenOwnership(singleNft.id, ownedNfts));
  }, []);

  return (
    <>
      <CommonSection title={singleNft.title} />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <img
                src={singleNft.imgUrl}
                alt=""
                className="w-100 single__nft-img"
              />
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="single__nft__content">
                <h2>{singleNft.title}</h2>

                <div className=" d-flex align-items-center justify-content-between mt-4 mb-4">
                  <div className=" d-flex align-items-center gap-4 single__nft-seen">
                    <span>
                      <i class="ri-eye-line"></i> 234
                    </span>
                    <span>
                      <i class="ri-heart-line"></i> 123
                    </span>
                  </div>

                  <div className=" d-flex align-items-center gap-2 single__nft-more">
                    <span>
                      <i class="ri-send-plane-line"></i>
                    </span>
                    <span>
                      <i class="ri-more-2-line"></i>
                    </span>
                  </div>
                </div>

                <div className="nft__creator d-flex gap-3 align-items-center justify-content-between">
                  <div className="creator__img">
                    <img
                      src={getAvatarForAddress(
                        addressAvatarMap,
                        singleNft.creator
                      )}
                      alt=""
                      className="w-100"
                    />
                  </div>

                  <div className="creator__detail">
                    <p>Owned By</p>
                    <h6>{addressToName(accountNames, singleNft.owner)}</h6>
                    <br />
                    <p>Created By</p>
                    <h6>{addressToName(accountNames, singleNft.creator)}</h6>
                  </div>

                  <div className="creator__detail">
                    <p>Owner Address</p>
                    <h6>{singleNft.owner.slice(0, 10)}</h6>
                    <br />
                    <p>Creator Address</p>
                    <h6>{singleNft.creator.slice(0, 10)}</h6>
                  </div>

                  <div className="creator__detail">
                    <p>Current Price</p>
                    <h6>{singleNft.currentBid}</h6>
                    <br />
                    <p>Royalty</p>
                    <h6>{singleNft.royalty} %</h6>
                  </div>
                </div>

                <h2 className="my-3" style={{ fontSize: "1.5rem" }}>
                  Description:
                </h2>
                <p className="my-2">{singleNft.desc}</p>

                <button className="singleNft-btn d-flex align-items-center gap-2 w-100">
                  <i class="ri-shopping-bag-line"></i>
                  <Link to="/wallet">
                    {checkTokenOwnership(singleNft.id, ownedNfts)
                      ? "List on Marketplace"
                      : "Buy"}
                  </Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <LiveAuction />
    </>
  );
};

export default NftDetails;
