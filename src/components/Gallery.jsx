import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import GLightbox from "glightbox";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "glightbox/dist/css/glightbox.min.css";

import {
  getAllImages,
  addImage,
  deleteImage,
} from "../redux/slices/gallerySlice";
import Loader from "./Loader";

function Gallery() {
  const dispatch = useDispatch();
  const { images, isLoading } = useSelector((state) => state.gallery);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(getAllImages());
  }, [dispatch]);
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true, // Dokunmatik destek
      loop: true, // Döngü içinde ilerleme
      autoplayVideos: true, // Video otomatik oynatma
    });

    return () => lightbox.destroy(); // Unmount edildiğinde temizle
  }, [images]); // products değiştiğinde çalıştır
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("imageUrl", selectedFile);
      dispatch(addImage(formData));
      setSelectedFile(null);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteImage(id));
  };

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };
  if (isLoading && authIsLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Loader />
        <div>Yükleniyor, lütfen bekleyin...</div>
      </div>
    );
  }
  return (
    <section id="gallery" className="gallery section light-background">
      <div className="container section-title" data-aos="fade-up">
        <p>
          <span>Galerimiz</span>
        </p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {isLoading ? (
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-2">Yükleniyor...</p>
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            loop={true}
            speed={600}
            autoplay={{ delay: 5000 }}
            centeredSlides={true}
            pagination={{ clickable: true, el: ".swiper-pagination" }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1200: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="swiper init-swiper"
          >
            <div className="swiper-wrapper align-items-center">
              {images.map((image) => (
                <SwiperSlide key={image._id} className="position-relative">
                  <a
                    className="glightbox"
                    data-gallery="images-gallery"
                    href={getFullUrl(image.imageUrl)}
                  >
                    <img
                      src={getFullUrl(image.imageUrl)}
                      className="img-fluid"
                      alt="gallery"
                      style={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        height: "240px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </a>
                  {user && (
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="btn btn-danger btn-sm position-absolute"
                      style={{
                        bottom: "10px",
                        right: "10px",
                        opacity: "0.8",
                        transition: "opacity 0.3s",
                      }}
                      title="Sil"
                    >
                      <i className="bi bi-trash"></i> Sil
                    </button>
                  )}
                </SwiperSlide>
              ))}
            </div>
            <div className="swiper-pagination"></div>
          </Swiper>
        )}
      </div>
      {user && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Yeni Resim Ekle</h5>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleUpload}
                      disabled={!selectedFile}
                    >
                      <i className="bi bi-upload"></i> Yükle
                    </button>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 text-success">
                      <small>{selectedFile.name} seçildi</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
