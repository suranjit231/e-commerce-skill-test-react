import styles from "./admin.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductApiAsync,
  productSelector,
  deleteProductApiAsync,
} from "../../redux/productReducer";
import { errorSelector } from "../../redux/errorReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import { IoReturnUpBackOutline } from "react-icons/io5";

export default function AdminPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector(loadingSelector);
  const { errorMessage } = useSelector(errorSelector);
  const { products } = useSelector(productSelector);
  const navigate = useNavigate();

  // Show errorMessage if any error
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  // Load all products when page loads
  useEffect(() => {
    dispatch(getAllProductApiAsync());
  }, [dispatch]);

  // Handle click on delete product button
  async function handleClickDeleteProduct(productId) {
    const result = await dispatch(deleteProductApiAsync({ productId }));
    if (result.type === "product/deleteProductApi/fulfilled") {
      toast.success("Product is deleted successfully");
    }
  }

  // Handle click on edit product button (simple console log for now)
  function handleClickEditProduct(product) {
    navigate(`/admin/product/editProduct/${product.id}`, { state: { product } });
  }

  // Handle click on add product button
  function handleClickAddProduct() {
    navigate("/admin/product/addProduct");
  }

  return (
    <div className={styles.adminPageContainer}>
       <Link to={"/"}>
            <IoReturnUpBackOutline /> Back To Home 
       </Link>
      <div className={styles.header}>
        <h1>Admin Page</h1>
        <button className={styles.addButton} onClick={handleClickAddProduct}>
          Add Product
        </button>
      </div>
      {loading ? (
        <div className={styles.loaderContainer}>
          <ClipLoader size={50} color="#123abc" />
        </div>
      ) : (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.length>0 && products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.images}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.stock}</td>
                <td>${product.price}</td>
                <td>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => handleClickEditProduct(product)}
                  />
                  <RiDeleteBin6Line
                    className={styles.deleteIcon}
                    onClick={() => handleClickDeleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
