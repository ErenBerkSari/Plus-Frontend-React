import React, { Suspense } from "react";

import Header from "./Header";
import Hero from "./Hero";
import About from "./About";

import WhyUs from "./WhyUs";
// import Gallery from "./Gallery";
const Gallery = React.lazy(() => import("./Gallery"));
const Contact = React.lazy(() => import("./Contact"));
// import Contact from "./Contact";
import Menu from "./Menu";
import Owners from "./Owners";
import Loader from "./Loader";
function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <WhyUs />
      <Menu />
      <Suspense fallback={<Loader />}>
        <Gallery />
      </Suspense>
      <Owners />
      <Suspense fallback={<Loader />}>
        <Contact />
      </Suspense>
    </>
  );
}

export default Home;
