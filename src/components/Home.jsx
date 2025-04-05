import React, { Suspense } from "react";

import Header from "./Header";
import Hero from "./Hero";
import About from "./About";

import WhyUs from "./WhyUs";
import Gallery from "./Gallery";
import Contact from "./Contact";
import Menu from "./Menu";
import Owners from "./Owners";
function Home() {
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
