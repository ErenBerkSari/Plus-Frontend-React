import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContact, updateContact } from "../redux/slices/contactSlice";
import Loader from "./Loader";
import EditIcon from "@mui/icons-material/Edit";
import {
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Contact() {
  const dispatch = useDispatch();
  const { contact, isLoading } = useSelector((state) => state.contact);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);
  const [editedContact, setEditedContact] = useState({
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    contactOpeningHours: "",
  });

  useEffect(() => {
    dispatch(getContact());
  }, [dispatch]);

  useEffect(() => {
    if (contact) {
      setEditedContact(contact);
    }
  }, [contact]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(updateContact(editedContact));
    handleClose();
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
        id="contact"
        className="contact section  light-background"
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
            <span>İletişim</span>
          </p>
        </div>

        <div className="container">
          <div className="mb-5">
            <iframe
              style={{ width: "100%", height: "400px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.729497661683!2d32.81961007504335!3d39.96980017151497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34ea7f6f02951%3A0xe65e0a9de3911e32!2sRolling%20Ball%20Bowling!5e0!3m2!1str!2str!4v1743111490074!5m2!1str!2str"
              frameBorder="0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="row gy-4">
            <div className="col-md-6">
              <div className="info-item d-flex align-items-center">
                <i className="icon bi bi-geo-alt"></i>
                <div>
                  <h3>Adres</h3>
                  <p>{contact.contactAddress}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item d-flex align-items-center">
                <i className="icon bi bi-telephone"></i>
                <div>
                  <h3>Telefon</h3>
                  <p>{contact.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item d-flex align-items-center">
                <i className="icon bi bi-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>{contact.contactEmail}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item d-flex align-items-center">
                <i className="icon bi bi-clock"></i>
                <div>
                  <h3>Çalışma Günleri</h3>
                  <p>{contact.contactOpeningHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            İletişim Bilgilerini Güncelle
          </Typography>

          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <TextField
            fullWidth
            margin="normal"
            label="Adres"
            name="contactAddress"
            value={editedContact.contactAddress}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Telefon"
            name="contactPhone"
            value={editedContact.contactPhone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="contactEmail"
            value={editedContact.contactEmail}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Çalışma Saatleri"
            name="contactOpeningHours"
            value={editedContact.contactOpeningHours}
            onChange={handleChange}
          />

          <Grid container justifyContent="flex-end" spacing={2} mt={2}>
            <Grid item>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
              >
                İptal
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleSave} variant="contained" color="primary">
                Kaydet
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default Contact;
