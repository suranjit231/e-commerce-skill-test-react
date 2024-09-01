import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import HomeCarosel1 from "./HomeCarosel1";
import Maincarosel from "./Maincarosel";
import { Link } from "react-router-dom";
import FilteredProduct from "./FilteredProduct";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductApiAsync, productSelector,
     fiterProductApiAsync, searchProdctApiAsync } from "../../redux/productReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { ClipLoader } from "react-spinners";

export default function Home() {
    const dispatch = useDispatch();
    const {products} = useSelector(productSelector);
    const {loading} = useSelector(loadingSelector);
  //  console.log("products: ", products)

    useEffect(()=>{

        dispatch(getAllProductApiAsync());

    },[])

   console.log("products: ", products);


    return (
    <div className={styles.homePageWrapper}>
        <FilteredProduct />
        <div className={styles.homePageContainer}>

            <HomeCarosel1 />
            <Maincarosel />
            <div className={styles.productSection}>
                
            {loading ? (
                        <div className={styles.loaderContainer}>
                            <ClipLoader color={"#123abc"} loading={loading} size={50} />
                        </div>
                    ) : (
                        products && products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className={styles.productBox}>
                                    <div className={styles.productImgBox}>
                                        <img src={product.images} alt={product.name} />
                                    </div>
                                    <div className={styles.productInfoBox}>
                                        <p className={styles.productName}>{product.name}</p>
                                        <p className={styles.price}>${product.price}</p>
                                        <Link to={`/product-details/${product.id}`}>
                                            <button>View Details</button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1 className="noData-products">No Product is in the list</h1>
                        )
                    )}

            </div>
        </div>

        </div>
    );
}
