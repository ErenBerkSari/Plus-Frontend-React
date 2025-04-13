import React, { Suspense, useEffect } from "react";

import Header from "./Header";
import Hero from "./Hero";
import About from "./About";

import WhyUs from "./WhyUs";
import Gallery from "./Gallery";
import Contact from "./Contact";
import Menu from "./Menu";
import Owners from "./Owners";
function Home() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/ping`)
      .then(() => console.log("Backend pinglendi"))
      .catch((err) => console.log("Ping hatası"));
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <About />
      <WhyUs />
      <Menu />
      <Gallery />
      <Owners />
      <Contact />
    </>
  );
}

export default Home;
