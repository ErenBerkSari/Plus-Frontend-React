import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { getHero, updateHero } from "../redux/slices/heroSlice";
import EditIcon from "@mui/icons-material/Edit";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CloseIcon from "@mui/icons-material/Close";
import {
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import GLightbox from "glightbox";

function Hero() {
  const dispatch = useDispatch();
  const { hero, isLoading } = useSelector((state) => state.hero);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  // const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editedHero, setEditedHero] = useState({
    heroTitle: "",
    heroDesc: "",
    heroVideo: "",
    heroImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    dispatch(getHero());
  }, [dispatch]);

  useEffect(() => {
    if (hero) {
      setEditedHero(hero);
      // Görselin yolu göreceli ise, gerektiğinde API temel URL'sini ekleyin
      setPreviewImage(
        hero.heroImage?.startsWith("/")
          ? `${import.meta.env.VITE_API_BASE_URL}${hero.heroImage}`
          : hero.heroImage
      );

      // Video yolu göreceli ise, gerektiğinde API temel URL'sini ekleyin
      setPreviewVideo(
        hero.heroVideo?.startsWith("/")
          ? `${import.meta.env.VITE_API_BASE_URL}${hero.heroVideo}`
          : hero.heroVideo
      );
    }
  }, [hero]);
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
      onOpen: () => {
        setVideoLoading(true);
      },
      onClose: () => {
        setVideoLoading(false);
      },
      onReady: () => {
        setVideoLoading(false);
      }
    });
    return () => lightbox.destroy();
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
    setVideoFile(null);
  };

  // const handleOpenVideoModal = () => setVideoModalOpen(true);
  // const handleCloseVideoModal = () => setVideoModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedHero((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "heroImage") {
        setImageFile(files[0]);
        setPreviewImage(URL.createObjectURL(files[0]));
      } else if (name === "heroVideo") {
        setVideoFile(files[0]);
        setPreviewVideo(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("heroTitle", editedHero.heroTitle || "");
    formData.append("heroDesc", editedHero.heroDesc || "");

    if (imageFile) {
      formData.append("heroImage", imageFile);
    } else if (editedHero.heroImage) {
      formData.append("heroImage", editedHero.heroImage);
    }

    if (videoFile) {
      formData.append("heroVideo", videoFile);
    } else if (editedHero.heroVideo) {
      formData.append("heroVideo", editedHero.heroVideo);
    }

    dispatch(updateHero(formData));
    handleClose();
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  if (isLoading && authIsLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Loader />
        <div>Yükleniyor, lütfen bekleyin...</div>
      </div>
    );
  }
  console.log("hero component:", hero);
  // Görsel veya video kaynakları için tam URL alın
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${path}`;
    return path;
  };

  const videoUrl = getFullUrl(hero.heroVideo);

  return (
    <div className="main">
      <section
        id="hero"
        className="hero section light-background"
        style={{ position: "relative" }} // Hero bölümünü konumlandırıyoruz
      >
        {user && (
          <EditIcon
            onClick={handleOpen}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 10,
              transform: "scale(1.5)",
            }}
          />
        )}

        <div className="container">
          <div className="row gy-4 justify-content-center justify-content-lg-between">
            <div className="col-lg-5 d-flex flex-column justify-content-center">
              <h1 style={{ textAlign: "center" }}>{hero.heroTitle}</h1>
              <div style={{ textAlign: "center" }}>
                <p maxLength={200}>{hero.heroDesc}</p>
              </div>

              <div
                className="d-flex justify-content-center mt-1"
                data-aos-delay="200"
              >
                {videoUrl && (
                  <a
                    href={videoUrl}
                    className="btn-watch-video d-flex align-items-center glightbox"
                    data-gallery="videoGallery"
                    data-type="video"
                    style={{
                      cursor: "pointer",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      color: "inherit",
                      position: "relative",
                    }}
                  >
                    {videoLoading ? (
                      <CircularProgress size={20} style={{ marginRight: "8px" }} />
                    ) : (
                      <PlayCircleIcon />
                    )}
                    <span>Videoyu İzle</span>
                  </a>
                )}
              </div>
            </div>

            <div className="col-lg-5 order-1 order-lg-2 hero-img d-flex justify-content-center align-items-center">
              <img
                style={{
                  borderRadius: "10px",
                  maxHeight: "500px",
                  width: "auto",
                }}
                className="img-fluid animated img-responsive"
                src={getFullUrl(hero.heroImage)}
                alt="Hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Düzenleme Modalı */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            height: "fit-content",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "12px", // Daha yumuşak köşeler
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Hero Bölümünü Düzenle
          </Typography>

          <TextField
            fullWidth
            label="Başlık"
            name="heroTitle"
            value={editedHero.heroTitle || ""}
            onChange={handleChange}
            margin="normal"
            sx={{ borderRadius: "8px" }}
          />
          <TextField
            fullWidth
            label="Açıklama"
            name="heroDesc"
            value={editedHero.heroDesc || ""}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            sx={{ borderRadius: "8px" }}
          />

          {/* Görsel Yükleme */}
          <div className="mt-3">
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Görsel:
            </label>
            <input
              type="file"
              name="heroImage"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </div>

          {/* Video Yükleme */}
          <div className="mt-3">
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Video:
            </label>
            <input
              type="file"
              name="heroVideo"
              accept="video/*"
              onChange={handleFileChange}
              className="form-control"
            />
            {previewVideo && (
              <video
                src={previewVideo}
                controls
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
            sx={{
              mt: 3,
              borderRadius: "8px",
              fontWeight: "bold",
              py: 1.5, // Butonu biraz daha büyük yap
            }}
          >
            Kaydet
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Hero;
