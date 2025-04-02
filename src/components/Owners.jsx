import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOwner,
  deleteOwner,
  getAllOwner,
  updateOwner,
} from "../redux/slices/ownerSlice";
import Loader from "./Loader";
import "../css/Owners.css";
function Owners() {
  const dispatch = useDispatch();
  const { owners, isLoading } = useSelector((state) => state.owner);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const [ownerData, setOwnerData] = useState({
    ownerName: "",
    ownerDesc: "",
    ownerTitle: "",
    ownerImage: null,
  });

  useEffect(() => {
    dispatch(getAllOwner());
  }, [dispatch]);

  const handleSaveOwner = () => {
    const formData = new FormData();
    formData.append("ownerName", ownerData.ownerName);
    formData.append("ownerDesc", ownerData.ownerDesc);
    formData.append("ownerTitle", ownerData.ownerTitle);

    if (ownerData.ownerImage) {
      formData.append("ownerImage", ownerData.ownerImage);
    }

    if (editMode && selectedOwner) {
      // ID ve data'yı doğru formatta gönder
      dispatch(
        updateOwner({
          id: selectedOwner._id,
          updatedData: formData,
        })
      );
    } else {
      dispatch(addOwner(formData));
    }

    // İşlem sonrası temizlik
    setShowModal(false);
    setEditMode(false);
    setSelectedOwner(null);
    setOwnerData({
      ownerName: "",
      ownerDesc: "",
      ownerTitle: "",
      ownerImage: null,
    });
  };

  const handleEditOwner = (owner) => {
    setSelectedOwner(owner);
    setOwnerData({
      ownerName: owner.ownerName,
      ownerDesc: owner.ownerDesc,
      ownerTitle: owner.ownerTitle,
      ownerImage: null, // Yeni resim seçilmezse mevcut resim korunacak
    });
    setEditMode(true);
    setShowModal(true);
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
    <div>
      <section
        style={{ position: "relative" }}
        id="owners"
        className="chefs section"
      >
        {user && (
          <button
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "red",
            }}
            onClick={() => {
              setEditMode(false);
              setSelectedOwner(null);
              setOwnerData({
                ownerName: "",
                ownerDesc: "",
                ownerTitle: "",
                ownerImage: null,
              });
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            Ortak Ekle
          </button>
        )}
        <div className="container section-title" data-aos="fade-up">
          <p>
            <span className="description-title">Ortaklar</span>
          </p>
        </div>

        <div className="container">
          <div className="row gy-4">
            {owners?.map((owner, index) => (
              <div
                key={owner._id || index}
                className="col-lg-4 d-flex align-items-stretch"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <div className="team-member">
                  <div className="member-img">
                    <img
                      src={getFullUrl(owner.ownerImage)}
                      className="img-fluid"
                      alt={owner.ownerName}
                    />
                  </div>
                  <div className="member-info">
                    <h4>{owner.ownerName}</h4>
                    <span>{owner.ownerTitle}</span>
                    <p>{owner.ownerDesc}</p>
                    {user && (
                      <div>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handleEditOwner(owner)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => dispatch(deleteOwner(owner._id))}
                        >
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ad.."
                  value={ownerData.ownerName}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      ownerName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Unvan.."
                  value={ownerData.ownerTitle}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      ownerTitle: e.target.value,
                    })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Açıklama.."
                  value={ownerData.ownerDesc}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      ownerDesc: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      ownerImage: e.target.files[0],
                    })
                  }
                />
                {editMode &&
                  selectedOwner?.ownerImage &&
                  !ownerData.ownerImage && (
                    <div className="mb-2">
                      <small className="text-muted">
                        Mevcut resim kullanılacaktır. Değiştirmek için yeni bir
                        resim seçin.
                      </small>
                      <img
                        src={getFullUrl(selectedOwner.ownerImage)}
                        alt="Mevcut resim"
                        style={{
                          width: "100px",
                          height: "auto",
                          display: "block",
                          marginTop: "5px",
                        }}
                      />
                    </div>
                  )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Kapat
                </button>
                <button className="btn btn-primary" onClick={handleSaveOwner}>
                  {editMode ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Owners;
