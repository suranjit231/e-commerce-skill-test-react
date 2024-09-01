import styles from "./UserProfile.module.css";
import { useNavbar } from "../../context/NavbarContext";
import { Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutApiAsync, authSelector } from "../../redux/authReducer";
import { toast } from "react-toastify";
import { AiFillProduct } from "react-icons/ai";
import { loadingSelector } from "../../redux/loadingReducer";
import { ClipLoader } from "react-spinners";


export default function UserProfile() {
    const { isUserProfileBar, toggleUserProfileBar } = useNavbar();
    const {isLoggedIn, user} = useSelector(authSelector);
    const {loading } = useSelector(loadingSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

  
    //====== handle logout click ========//
   async function handleLogoutClick(){
        const result = await dispatch(logoutApiAsync());

     
        if(result?.payload?.success){
            console.log("result logout: ", result);
            toast.success("you are logout suceefully");
            toggleUserProfileBar();

        }

    }

    //======= handleClick carts page ========//
    function showCartsPage(){
        navigate(`/carts/${user._id}`);
        toggleUserProfileBar();

    }

    //====== handleClick show orderPage =======//
    function showOrderPage(){
        navigate(`/orders/${user._id}`);
        toggleUserProfileBar();
    }

    //====== show add productPage ==========//
    function showAddProductPage(){
        navigate("/product/addProduct");
        toggleUserProfileBar();
    }

   

    return (
       <>
       {loading?(<ClipLoader size={50} color="blue" className="clipLoader"/>):user && (



      
        <div className={`${styles.userProfileContainer} 
            ${isUserProfileBar ? styles.showProfile : styles.hideProfile}`}>
            <div className={styles.profileHeader}>
                <img 
                    src="https://images.pexels.com/photos/3777564/pexels-photo-3777564.jpeg?cs=srgb&dl=pexels-olly-3777564.jpg&fm=jpg" 
                    alt="User" 
                    className={styles.profileImage} 
                />
                <h3 className={styles.userName}>John Doe</h3>
            </div>

            <ul className={styles.profileMenu}>

                <li onClick={()=>showOrderPage()}>
                     <i className="fa-solid fa-box"></i> Orders


                </li>



                <li onClick={()=>showCartsPage()}>

                    <i className="fa-solid fa-shopping-cart"></i> Cart
                    
                </li>

                <li><i className="fa-solid fa-history"></i> Search History</li>

                <li><i className="fa-solid fa-heart"></i> Wishlist</li>

                <li><i className="fa-solid fa-cog"></i> Settings</li>

                {/* <li onClick={()=>showAddProductPage()}>
                    <AiFillProduct className={styles.addProductIcon}/> Add Products
                    
                </li> */}

                <Link to={"/admin"}>
                    <li>
                        <AiFillProduct className={styles.addProductIcon}/> Admin
                    </li> 
                </Link>

               

                <li onClick={()=>handleLogoutClick()}><i className="fa-solid fa-sign-out-alt"></i> Logout</li>
               
            </ul>

            <div className={styles.closeBtn} onClick={toggleUserProfileBar}>
                <i className="fa-solid fa-xmark"></i>
            </div>
        </div>

)}


   </> );
}
