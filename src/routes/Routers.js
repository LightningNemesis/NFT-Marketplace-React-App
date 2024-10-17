import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
// import { ToastProvider, useToasts } from "react-toast-notifications";

import Home from "../pages/Home";
import Market from "../pages/Market";
import Create from "../pages/Create";
import Contact from "../pages/Contact";

import Wallet from "../pages/Wallet";
import NftDetails from "../pages/NftDetails";

const Routers = () => {
  return (
    // <ToastProvider autoDismiss autoDismissTimeout={4000}>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/create" element={<Create />} />
      {/* <Route path="/contact" element={<Contact />} /> */}
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/market/:id" element={<NftDetails />} />
    </Routes>
    // </ToastProvider>
  );
};

export default Routers;
