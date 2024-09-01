import { useState, useEffect } from "react";
import styles from "./AddProductForm.module.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadingSelector } from "../../redux/loadingReducer";
import { addProductApiAsync, updateProductApiAsync } from "../../redux/productReducer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";


export default function AddProductForm() {
    const location = useLocation();
    const productToEdit = location.state?.product || null;
    const { loading } = useSelector(loadingSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [formFields, setFormFields] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        images: ""
    });

    useEffect(() => {
        if (productToEdit) {
            setFormFields({
                name: productToEdit.name || "",
                description: productToEdit.description || "",
                price: productToEdit.price || "",
                stock: productToEdit.stock || "",
                category: productToEdit.category || "",
                brand: productToEdit.brand || "",
                images: productToEdit.images || ""
            });
        }
    }, [productToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const field in formFields) {
            if (!formFields[field]) {
                toast.error(`Please fill out the ${field} field.`);
                return;
            }
        }

        try {
            let res;
            if (productToEdit) {
                // Update existing product
                res = await dispatch(updateProductApiAsync({ ...formFields, id: productToEdit.id }));
                if (res.payload) {
                    toast.success("Product is updated successfully.");
                }

               
            } else {
                // Add new product
                res = await dispatch(addProductApiAsync(formFields));
                if (res.payload) {
                    toast.success("Product is added successfully.");
                }
            }
            clearInput();
            navigate("/admin");
        } catch (error) {
            console.error("There was an error uploading the product:", error);
        }
    };

    const clearInput = () => {
        setFormFields({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            brand: "",
            images: ""
        });
    };

    if (loading) {
        return <h1>Loading..................</h1>;
    }

    return (
        <div className={styles.productFormPageContainer}>
             <Link to={"/admin"} className={styles.backBtn}>
                <IoReturnUpBackOutline /> Back To Admin
            </Link>
            <form className={styles.productForm} onSubmit={handleSubmit}>
                <h3>{productToEdit ? "Edit Product" : "Add New Product"}</h3>
                {["name", "description", "price", "stock", "category", "brand"].map((field) => (
                    <div key={field} className={styles.formControlDiv}>
                        <input
                            type={field === "price" || field === "stock" ? "number" : "text"}
                            name={field}
                            value={formFields[field]}
                            onChange={handleInputChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                    </div>
                ))}
                <div className={styles.formControlDiv}>
                    <input
                        type="text"
                        name="images"
                        value={formFields.images}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    {productToEdit ? "Update Product" : "Submit"}
                </button>
            </form>
        </div>
    );
}