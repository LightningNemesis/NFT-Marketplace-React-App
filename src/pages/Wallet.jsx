import React, { useContext, useEffect } from "react";
import { ethers } from "ethers";
import CommonSection from "../components/ui/Common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { AppContext } from "../contexts/Context";

import "../styles/wallet.css";

const wallet__data = [
  {
    title: "Bitcoin",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium accusamus repellat rerum consequatur explicabo? Reiciendis!",
    icon: "ri-bit-coin-line",
  },
  {
    title: "Coinbase",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium accusamus repellat rerum consequatur explicabo? Reiciendis!",
    icon: "ri-coin-line",
  },
  {
    title: "Metamask",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium accusamus repellat rerum consequatur explicabo? Reiciendis!",
    icon: "ri-money-cny-circle-line",
  },
  {
    title: "Authereum",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium accusamus repellat rerum consequatur explicabo? Reiciendis!",
    icon: "ri-bit-coin-line",
  },
];

const Wallet = () => {
  const { walletInfo, updateWalletInfo, accountNames } = useContext(AppContext);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request access to accounts
        await provider.send("eth_requestAccounts", []);

        // Get the signer and address
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Fetch and format the balance
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);

        // Fetch the network information
        const network = await provider.getNetwork();

        // Generate a random name for the account

        // Store the fetched details in an object
        const newWalletInfo = {
          account: address,
          balance: formattedBalance + " ETH",
          networkName: network.name || "unknown",
          networkChainId: network.chainId.toString(),
        };

        console.log("New Wallet Info:", newWalletInfo);

        updateWalletInfo(newWalletInfo);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  };

  useEffect(() => {
    // console.log("Wallet Info:", walletInfo);
    // console.log("Account Names:", accountNames);
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          connectWallet(updateWalletInfo); // Reconnect and update wallet info
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [walletInfo, accountNames]);

  return (
    <>
      <CommonSection title="Connect Wallet" />
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <div className="w-50 m-auto">
                <h3 className="text-light">Connect your wallet</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Minima numquam nisi, quam obcaecati a provident voluptas sequi
                  unde officiis placeat!
                </p>
                <button onClick={connectWallet} className="btn btn-primary">
                  {Object.keys(walletInfo).length === 0
                    ? "Get Wallet Info"
                    : "Update Wallet Information"}
                </button>
                {Object.keys(walletInfo).length > 0 && (
                  <>
                    <p>Account name: {walletInfo.name}</p>
                    <p>Account address: {walletInfo.account}</p>
                    <p>Account Balance: {walletInfo.balance}</p>
                    <p>Network ChainID: {walletInfo.networkChainId}</p>
                  </>
                )}
              </div>
            </Col>

            {wallet__data.map((item, index) => (
              <Col lg="3" md="4" sm="6" key={index} className="mb-4">
                <div className="wallet__item">
                  <span>
                    <i className={item.icon}></i>
                  </span>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Wallet;
