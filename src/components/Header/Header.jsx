import React, { useRef, useEffect, useContext } from "react";
import "./header.css";
import { Container } from "reactstrap";

import { NavLink, Link } from "react-router-dom";

import { AppContext } from "../../contexts/Context";
import { addressToName } from "../utility/accountToNames";

const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
  // {
  //   display: "Contact",
  //   url: "/contact",
  // },
];

const Header = () => {
  const { walletInfo, accountNames } = useContext(AppContext);

  const headerRef = useRef(null);

  const menuRef = useRef(null);

  useEffect(() => {
    // Define the event handler function
    const handleScroll = () => {
      if (headerRef.current) {
        if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
        ) {
          headerRef.current.classList.add("header__shrink");
        } else {
          headerRef.current.classList.remove("header__shrink");
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Ensure the exact same function is passed for removal
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className=" d-flex gap-2 align-items-center ">
              <span>
                <i class="ri-fire-fill"></i>
              </span>
              Artifactory
            </h2>
          </div>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-5">
            <button className="btn d-flex gap-2 align-items-center">
              <span style={{ position: "relative", display: "inline-block" }}>
                {walletInfo && Object.keys(walletInfo).length === 0 ? (
                  <i className="ri-wallet-line"></i>
                ) : (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        top: "-2px", // Adjust as needed
                        right: "-2px", // Adjust as needed
                        width: "8px",
                        height: "8px",
                        backgroundColor: "green",
                        borderRadius: "50%",
                      }}
                    ></span>
                  </>
                )}
              </span>
              <Link to="/wallet">
                {walletInfo && Object.keys(walletInfo).length === 0
                  ? "Connect Wallet"
                  : `Wallet Connected: ${walletInfo.account.slice(
                      0,
                      8
                    )} (${addressToName(accountNames, walletInfo.account)})`}
              </Link>
            </button>

            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
