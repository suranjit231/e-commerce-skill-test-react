import styles from "./ProductDetails.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductByIdApiAsync } from "../../redux/productReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import {authSelector } from "../../redux/authReducer";
import { addCartApiAsync } from "../../redux/cartReducer";
import { toast } from "react-toastify";

export default function ProductDetails() {

    const dispatch = useDispatch();
    const [product, setPrroduct] = useState(null);
    const params = useParams();
    const {loading} = useSelector(loadingSelector);
    const [cartQuantity, setCartQuanity] = useState(1);
    const navigate = useNavigate();
    const {isLoggedIn, user} = useSelector(authSelector);

    
    useEffect(()=>{
        async function getProduct(){
            try{

                const result = await  dispatch(getProductByIdApiAsync(params.productId));
               // console.log("result  for get product details: ", result);

                if(result.type==="product/getProductByIdApi/fulfilled"){
                    setPrroduct(result.payload);
                }

            }catch(error){
                console.log("error get product details:  ", error);
            }
        }
        
        getProduct();

    },[])


   
    //===== handle carts quantity ======//
    function handleCartQuantity(val){
        if(!isLoggedIn) return navigate("/user/signin");
        if(cartQuantity===0 && val===-1) return;
        setCartQuanity((prev)=>prev + val);
    }

    async function handleAddToCartsClick(){
        if(cartQuantity<1) return;
        if(!isLoggedIn) return navigate("/user/signin");
        //====== dispatch add to carts ======//
        try{

            const result = await dispatch(addCartApiAsync({user:user._id,
                 productId:product.id, quantity:cartQuantity}));

                 if(result.type==='cart/addCartApi/fulfilled'){
                    toast.success("Items added in you carts");
                 }

            // console.log("result for add items in carts: ", result);

        }catch(error){
            console.log("error add items in carts: ", error);
        }


    }
    

   
    return (
        <div className={styles.productDetailsPageContainer}>

            {loading? (
                
                <ClipLoader color="blue" size={50} className="clipLoader"/>
            
        
            ):product && (
                <>
                
            <div className={styles.leftContainer}>
                <div className={styles.mainImageBox}>
                    <img src={product.images} alt="Laptop" />
                </div>

                <div className={styles.imageController}>
                    <div className={styles.imageView}>
                        <img src={product.images} alt="Laptop" />
                    </div>
                    <div className={styles.imageView}>
                        <img src={product.images} alt="Laptop" />
                    </div>
                    <div className={styles.imageView}>
                        <img src={product.images} alt="Laptop" />
                    </div>
                    <div className={styles.imageView}>
                        <img src={product.images} alt="Laptop" />
                    </div>
                </div>
            </div>

            <div className={styles.rightContainer}>
                <div className={styles.rightNameAndPriceDiv}>
                    <h3 className={styles.nameDiv}>{product.name}</h3>
                    <div className={styles.ratingDiv}>
                        {/* Static placeholder for stars */}
                        <p>⭐⭐⭐⭐⭐</p>
                        <p>(5)</p>
                    </div>
                    <p className={styles.price}>${product.price}</p>
                </div>

                <div className={styles.sizeContainer}>
                    <div className={styles.leftSizeBox}>
                        <p>Available Sizes</p>
                        <div className={styles.sizeBtnContainer}>
                            <div className={styles.size}>S</div>
                            <div className={styles.size}>M</div>
                            <div className={styles.size}>L</div>
                        </div>
                    </div>

                    <div className={styles.rightSizeBox}>
                        <p>Available Colors</p>
                        <div className={styles.colorBtnContainer}>
                            <div className={styles.color}></div>
                            <div className={styles.color}></div>
                            <div className={styles.color}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.cartContainer}>
                    <div className={styles.cartHeading}>
                        <p>Last {product.stock} left</p>
                        <span>-</span>
                        <p>make it yours!</p>
                    </div>

                    <div className={styles.cartControl}>
                        <div onClick={()=>handleCartQuantity(-1)} className={styles.decreased}>-</div>
                        <div className={styles.quantityCount}>{cartQuantity}</div>
                        <div  onClick={()=>handleCartQuantity(1)}
                         className={styles.increased}>+</div>
                        <div onClick={()=>handleAddToCartsClick()}
                         className={styles.addToCartBtn}>Add to cart</div>
                    </div>
                </div>

                <div className={styles.descriptionContainer}>
                    <h4>{product.name}:</h4>
                    <p>{product.description}</p>
                </div>
            </div>

            <div className={styles.reviewsContainer}>
                <div className={styles.reviewHeaderDiv}>
                    <h3>Reviews (3):</h3>
                    <div className={styles.addReviewBtn}>Add review</div>
                </div>

                <div className={styles.reviewBoxWrapper}>
                    <div className={styles.userImageDiv}>
                        <img src="https://t4.ftcdn.net/jpg/06/48/39/19/360_F_648391979_uMz6EwAlKNIJnK9r46UpTiM17nT8GuLl.jpg" alt="User" />
                    </div>
                    <div className={styles.userNameAndReview}>
                        <p>John Kathrimpy <span className={styles.reviewDate}>12/Aug/2024</span></p>
                        <p className={styles.rateComment}>Great product, loved it!</p>
                        <p className={styles.borderButton}></p>
                    </div>
                </div>

                <div className={styles.reviewBoxWrapper}>
                    <div className={styles.userImageDiv}>
                        <img src="https://t4.ftcdn.net/jpg/06/48/39/19/360_F_648391979_uMz6EwAlKNIJnK9r46UpTiM17nT8GuLl.jpg" alt="User" />
                    </div>
                    <div className={styles.userNameAndReview}>
                        <p>Jane Doe <span className={styles.reviewDate}>15/Aug/2024</span></p>
                        <p className={styles.rateComment}>Good value for the money.</p>
                        <p className={styles.borderButton}></p>
                    </div>
                </div>
            </div>

            </>)}
        </div>
    );
}
