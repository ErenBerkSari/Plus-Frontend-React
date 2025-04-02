import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWhyUs, updateWhyUs } from "../redux/slices/whyUsSlice";
import Loader from "./Loader";
import EditIcon from "@mui/icons-material/Edit";
import {
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function WhyUs() {
  const dispatch = useDispatch();
  const { whyUs, isLoading } = useSelector((state) => state.whyUs);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setAutoScroll(false); // Kullanıcı müdahale edince otomatik kaydırmayı durdur
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setAutoScroll(true), 3000); // 3 saniye sonra tekrar otomatik kaydırma başlat
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Sürükleme hassasiyeti
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const [editedWhyUs, setEditedWhyUs] = useState({
    whyUsTitle: "",
    whyUsMainText: "",
    features: [],
  });

  useEffect(() => {
    dispatch(getWhyUs());
  }, [dispatch]);

  useEffect(() => {
    if (whyUs) {
      setEditedWhyUs(whyUs);
    }
  }, [whyUs]);
  const [autoScroll, setAutoScroll] = useState(true); // Kullanıcı müdahale ederse duracak

  // 🎯 Otomatik kaydırma efekti
  useEffect(() => {
    if (!autoScroll) return; // Kullanıcı müdahale ettiyse çalıştırma

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 2; // Her adımda 2px kaydır
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollLeft = 0; // Başa döndür
        }
      }
    }, 50); // 20ms'de bir kaydır

    return () => clearInterval(interval);
  }, [autoScroll]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      setEditedWhyUs((prev) => {
        const updatedFeatures = [...prev.features];
        updatedFeatures[index] = { ...updatedFeatures[index], [name]: value };
        return { ...prev, features: updatedFeatures };
      });
    } else {
      setEditedWhyUs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    const updatedData = {
      whyUsTitle: editedWhyUs.whyUsTitle || "",
      whyUsMainText: editedWhyUs.whyUsMainText || "",
      features: editedWhyUs.features || [],
    };

    dispatch(updateWhyUs(updatedData));
    handleClose();
  };

  const handleAddFeature = () => {
    setEditedWhyUs((prev) => ({
      ...prev,
      features: [...prev.features, { icon: "", title: "", description: "" }],
    }));
  };

  const handleRemoveFeature = (index) => {
    setEditedWhyUs((prev) => {
      const updatedFeatures = prev.features.filter((_, i) => i !== index);
      return { ...prev, features: updatedFeatures };
    });
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
    <div>
      <section
        style={{ position: "relative" }}
        id="why-us"
        className="why-us section light-background"
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
          <div className="row gy-4">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div style={{ height: "100%" }} className="why-box">
                <h3 style={{ fontSize: "2.5rem" }}>{whyUs.whyUsTitle}</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                  {whyUs.whyUsMainText}
                </p>
              </div>
            </div>

            <div className="col-lg-8">
              <div
                ref={scrollRef}
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "15px",
                  cursor: isDown ? "grabbing" : "grab",
                  userSelect: "none",
                  scrollbarWidth: "none", // Firefox için scrollbar gizleme
                  msOverflowStyle: "none", // IE/Edge için scrollbar gizleme
                }}
                data-aos="fade-up"
                data-aos-delay="200"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {whyUs.features?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      width: "280px",
                      flex: "0 0 280px",
                    }}
                    data-aos="fade-up"
                    data-aos-delay={300 + index * 100}
                  >
                    <div
                      className="icon-box"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "15px",
                          borderRadius: "8px",
                        }}
                      >
                        <i
                          className={item.icon}
                          style={{ fontSize: "32px" }}
                        ></i>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "5px",
                          textAlign: "center",
                        }}
                      >
                        <h4 style={{ margin: 0 }}>{item.title}</h4>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "5px",
                          color: "white",
                          flexGrow: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ margin: 0 }}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yeni Modal Tasarımı */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="why-us-modal-title"
        disableEscapeKeyDown={false}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: 800,
            maxHeight: "90vh",
            overflowY: "auto",
            p: 0,
            borderRadius: 2,
            boxShadow: 24,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {/* Modal İçerik */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Ana Bilgiler
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Başlık"
                  name="whyUsTitle"
                  value={editedWhyUs.whyUsTitle || ""}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ana Metin"
                  name="whyUsMainText"
                  value={editedWhyUs.whyUsMainText || ""}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  size="small"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Özellikler */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Özellikler
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddFeature}
                size="small"
              >
                Yeni Özellik Ekle
              </Button>
            </Box>

            <Grid container spacing={2}>
              {(editedWhyUs?.features || []).map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    variant="outlined"
                    sx={{ transition: "all 0.2s", "&:hover": { boxShadow: 2 } }}
                  >
                    <CardContent sx={{ pb: 1, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="İkon Sınıfı"
                            name="icon"
                            value={feature.icon}
                            onChange={(e) => handleChange(e, index)}
                            variant="outlined"
                            size="small"
                            placeholder="örn: bi bi-gem"
                          />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            label="Başlık"
                            name="title"
                            value={feature.title}
                            onChange={(e) => handleChange(e, index)}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Açıklama"
                            name="description"
                            value={feature.description}
                            onChange={(e) => handleChange(e, index)}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", py: 1 }}>
                      <Button
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        color="error"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        Sil
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Alt Butonlar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Lütfen bekleyin.." : "Kaydet"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
}

export default WhyUs;
