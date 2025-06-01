import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { logout } from "../redux/slices/authSlice";
function Header() {
  const dispatch = useDispatch();
  const { user, authIsLoading, isLoggedIn } = useSelector(
    (store) => store.auth
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };
  // Sayfada kaydırma işlemini dinleyerek aktif bölümü belirleyen fonksiyon
  //Test
  //
  if (authIsLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  console.log("isLogged:", isLoggedIn);
  console.log("user:", user);

  return (
    <header
      id="header"
      className={`header d-flex align-items-center sticky-top ${
        isMobileMenuOpen ? "mobile-nav-active" : ""
      }`}
    >
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <a
          href="#hero"
          className="logo d-flex align-items-center me-auto me-xl-0"
        >
          <h1 className="sitename">Plus</h1>
          <span>.</span>
        </a>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <a onClick={handleMenuClick} href="#hero">
                Anasayfa
              </a>
            </li>
            <li>
              <a onClick={handleMenuClick} href="#about">
                Hakkımızda
              </a>
            </li>
            <li>
              <a onClick={handleMenuClick} href="#why-us">
                Neden Biz?
              </a>
            </li>
            <li>
              <a onClick={handleMenuClick} href="#menu">
                Ürünler
              </a>
            </li>
            <li>
              <a onClick={handleMenuClick} href="#gallery">
                Galeri
              </a>
            </li>
            <li>
              <a onClick={handleMenuClick} href="#owners">
                Ortaklar
              </a>
            </li>

            <li>
              <a onClick={handleMenuClick} href="#contact">
                İletişim
              </a>
            </li>
            {/* 📌 Mobilde Navbar İçine Eklenen Buton */}
            <li className="mobile-auth-button d-xl-none">
              {user ? (
                <Link onClick={handleLogout} className="btn-getstarted">
                  Çıkış Yap
                </Link>
              ) : (
                <Link className="btn-getstarted" to="/login">
                  Yönetici Girişi
                </Link>
              )}
            </li>
          </ul>
          <i
            className={`mobile-nav-toggle d-xl-none bi ${
              isMobileMenuOpen ? "bi-x" : "bi-list"
            }`}
            onClick={toggleMobileMenu}
          ></i>
        </nav>

        <div className="auth-buttons d-none d-xl-flex">
          {user ? (
            <Link onClick={handleLogout} className="btn-getstarted">
              Çıkış Yap
            </Link>
          ) : (
            <Link className="btn-getstarted" to="/login">
              Yönetici Girişi
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
