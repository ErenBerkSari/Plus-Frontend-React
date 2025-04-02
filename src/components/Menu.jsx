import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../redux/slices/menuSlice";
import Loader from "./Loader";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import "../css/menu.css";
function Menu() {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.menu);
  const { user, authIsLoading } = useSelector((store) => store.auth);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productData, setProductData] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    productImage: null,
  });

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true, // Dokunmatik destek
      loop: true, // Döngü içinde ilerleme
      autoplayVideos: true, // Video otomatik oynatma
    });

    return () => lightbox.destroy(); // Unmount edildiğinde temizle
  }, [products]); // products değiştiğinde çalıştır

  const handleSaveProduct = () => {
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productDesc", productData.productDesc);
    formData.append("productPrice", productData.productPrice);

    // Eğer yeni bir resim seçildiyse ekle
    if (productData.productImage) {
      formData.append("productImage", productData.productImage);
    }

    if (editMode && selectedProduct) {
      // ID ve data'yı doğru formatta gönder
      dispatch(
        updateProduct({
          id: selectedProduct._id,
          updatedData: formData,
        })
      );
    } else {
      dispatch(addProduct(formData));
    }

    // İşlem sonrası temizlik
    setShowModal(false);
    setEditMode(false);
    setSelectedProduct(null);
    setProductData({
      productName: "",
      productDesc: "",
      productPrice: "",
      productImage: null,
    });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductData({
      productName: product.productName,
      productDesc: product.productDesc,
      productPrice: product.productPrice,
      productImage: null, // Yeni resim seçilmezse mevcut resim korunacak
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
        id="menu"
        className="menu section "
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
              setSelectedProduct(null);
              setProductData({
                productName: "",
                productDesc: "",
                productPrice: "",
                productImage: null,
              });
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            Ürün Ekle
          </button>
        )}
        <div className="container section-title">
          <p>
            <span className="description-title">Ürünlerimize Göz At</span>
          </p>
        </div>

        <div className="container">
          <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
            <div className="tab-pane fade active show" id="menu-starters">
              <div className="row gy-5">
                {products?.map((product, index) => (
                  <div
                    key={product._id || index}
                    className="col-lg-4 menu-item"
                  >
                    <a
                      href={getFullUrl(product.productImage)}
                      className="glightbox"
                    >
                      <div className="image-container">
                        <img
                          src={getFullUrl(product.productImage)}
                          alt={product.productName}
                        />
                      </div>
                    </a>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        maxHeight: "200px",
                      }}
                    >
                      <h4>{product.productName}</h4>
                      <p className="ingredients">{product.productDesc}</p>
                      <p className="price">₺{product.productPrice}</p>
                      {user && (
                        <div>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleEditProduct(product)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => dispatch(deleteProduct(product._id))}
                          >
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  placeholder="Ürün Adı"
                  value={productData.productName}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productName: e.target.value,
                    })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Ürün Açıklaması"
                  value={productData.productDesc}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productDesc: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Fiyat"
                  value={productData.productPrice}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productPrice: e.target.value,
                    })
                  }
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productImage: e.target.files[0],
                    })
                  }
                />
                {editMode &&
                  selectedProduct?.productImage &&
                  !productData.productImage && (
                    <div className="mb-2">
                      <small className="text-muted">
                        Mevcut resim kullanılacaktır. Değiştirmek için yeni bir
                        resim seçin.
                      </small>
                      <img
                        src={getFullUrl(selectedProduct.productImage)}
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
                <button className="btn btn-primary" onClick={handleSaveProduct}>
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

export default Menu;
