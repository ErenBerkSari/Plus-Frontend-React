import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { getAbout, updateAbout } from "../redux/slices/aboutSlice";
import EditIcon from "@mui/icons-material/Edit";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";
import "../css/About.css";

function About() {
  const dispatch = useDispatch();
  const { about, isLoading } = useSelector((state) => state.about);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editedAbout, setEditedAbout] = useState({
    aboutImage: "",
    aboutContact: "",
    aboutIntro: "",
    aboutList: [],
    aboutLastText: "",
    aboutVideo: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [newListItem, setNewListItem] = useState("");

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setEditedAbout(about);
      // Görselin yolu göreceli ise, gerektiğinde API temel URL'sini ekleyin
      setPreviewImage(
        about.aboutImage?.startsWith("/")
          ? `${import.meta.env.VITE_API_BASE_URL}${about.aboutImage}`
          : about.aboutImage
      );

      // Video yolu göreceli ise, gerektiğinde API temel URL'sini ekleyin
      setPreviewVideo(
        about.aboutVideo?.startsWith("/")
          ? `${import.meta.env.VITE_API_BASE_URL}${about.aboutVideo}`
          : about.aboutVideo
      );
    }
  }, [about]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
    setVideoFile(null);
    setNewListItem("");
  };

  const handleOpenVideoModal = () => setVideoModalOpen(true);
  const handleCloseVideoModal = () => setVideoModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAbout((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "aboutImage") {
        setImageFile(files[0]);
        setPreviewImage(URL.createObjectURL(files[0]));
      } else if (name === "aboutVideo") {
        setVideoFile(files[0]);
        setPreviewVideo(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleAddListItem = () => {
    if (newListItem.trim() !== "") {
      setEditedAbout((prev) => ({
        ...prev,
        aboutList: [...(prev.aboutList || []), newListItem.trim()],
      }));
      setNewListItem("");
    }
  };

  // Liste öğesi silme
  const handleRemoveListItem = (index) => {
    setEditedAbout((prev) => ({
      ...prev,
      aboutList: prev.aboutList.filter((_, i) => i !== index),
    }));
  };

  // New list item değişikliği
  const handleNewListItemChange = (e) => {
    setNewListItem(e.target.value);
  };

  // Enter tuşu ile liste öğesi ekleme
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddListItem();
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("aboutContact", editedAbout.aboutContact || "");
    formData.append("aboutIntro", editedAbout.aboutIntro || "");
    formData.append("aboutLastText", editedAbout.aboutLastText || "");

    // Liste öğelerini ekle
    if (editedAbout.aboutList && editedAbout.aboutList.length > 0) {
      // API'ye gönderilecek aboutList formatını ayarla
      formData.append("aboutList", JSON.stringify(editedAbout.aboutList));
    } else {
      formData.append("aboutList", JSON.stringify([]));
    }

    if (imageFile) {
      formData.append("aboutImage", imageFile);
    } else if (editedAbout.aboutImage) {
      formData.append("aboutImage", editedAbout.aboutImage);
    }

    if (videoFile) {
      formData.append("aboutVideo", videoFile);
    } else if (editedAbout.aboutVideo) {
      formData.append("aboutVideo", editedAbout.aboutVideo);
    }

    dispatch(updateAbout(formData));
    handleClose();
  };

  // Görsel veya video kaynakları için tam URL alın
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/"))
      return `${import.meta.env.VITE_API_BASE_URL}${path}`;
    return path;
  };

  const videoUrl = getFullUrl(about.aboutVideo);

  if (isLoading && authIsLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Loader />
        <div>Yükleniyor, lütfen bekleyin...</div>
      </div>
    );
  }

  return (
    <div>
      <section
        style={{ position: "relative" }}
        id="about"
        className="about section"
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
        <div className="container section-title">
          <p>
            <span className="description-title">Hakkımızda</span>
          </p>
        </div>

        <div className="container">
          <div className="row gy-4">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1, // İçeriğe göre esnek büyüme
              }}
              className="col-lg-7"
            >
              <img
                style={{
                  flexGrow: 1, // Resim içeriğe göre büyüsün
                  width: "100%", // Konteynere tam otursun
                  height: "auto",
                }}
                src={previewImage || about.aboutImage}
                className="img-fluid mb-4 responsive-image-about"
                alt="aboutImage"
              />
              <div style={{ borderRadius: "5px" }} className="book-a-table">
                <h3>İletişim</h3>
                <p>{about.aboutContact}</p>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="content ps-0 ps-lg-5">
                <p className="fst-italic">{about.aboutIntro}</p>
                <ul>
                  {about.aboutList?.map((item, index) => (
                    <li key={index}>
                      <i className="bi bi-check-circle-fill"></i> {item}
                    </li>
                  ))}
                </ul>
                <p>{about.aboutLastText}</p>
                {/* Video izleme butonu yerine direkt videoya koyalım */}
                <div className="position-relative mt-4">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    <div
                      className="btn-watch-video d-flex align-items-center"
                      onClick={handleOpenVideoModal}
                      style={{ cursor: "pointer" }}
                    >
                      <PlayCircleIcon style={{ marginRight: "5px" }} />
                      <span>Videoyu İzle</span>
                    </div>
                  )}
                </div>
              </div>
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
            Hakkımızda Bölümünü Düzenle
          </Typography>

          <TextField
            fullWidth
            label="İletişim"
            name="aboutContact"
            value={editedAbout.aboutContact || ""}
            onChange={handleChange}
            margin="normal"
            sx={{ borderRadius: "8px" }}
          />

          <TextField
            fullWidth
            label="Giriş"
            name="aboutIntro"
            value={editedAbout.aboutIntro || ""}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            sx={{ borderRadius: "8px" }}
          />

          {/* Liste Bölümü */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Liste Öğeleri
            </Typography>
            <List sx={{ bgcolor: "#f5f5f5", borderRadius: "8px", p: 1 }}>
              {editedAbout.aboutList?.map((item, index) => (
                <ListItem key={index} dense>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveListItem(index)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: "flex", mt: 1 }}>
              <TextField
                fullWidth
                label="Yeni Liste Öğesi"
                value={newListItem}
                onChange={handleNewListItemChange}
                onKeyPress={handleKeyPress}
                margin="normal"
                size="small"
                sx={{ borderRadius: "8px" }}
              />
              <IconButton
                onClick={handleAddListItem}
                sx={{ mt: 2, ml: 1 }}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Son Paragraf"
            name="aboutLastText"
            value={editedAbout.aboutLastText || ""}
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
              name="aboutImage"
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
              name="aboutVideo"
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

      {/* Video Modalı */}
      <Modal
        open={videoModalOpen}
        onClose={handleCloseVideoModal}
        aria-labelledby="video-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: "1000px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <IconButton onClick={handleCloseVideoModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "70vh" }}
            />
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <p>Video bulunamadı</p>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default About;
