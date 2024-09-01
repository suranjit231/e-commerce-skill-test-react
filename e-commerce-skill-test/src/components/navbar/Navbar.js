import styles from "./Navbar.module.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import UserProfile from "../sidebar/UserProfile";
import { useNavbar } from "../../context/NavbarContext";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authSelector } from "../../redux/authReducer";
import { searchProdctApiAsync } from "../../redux/productReducer";

export default function Navbar() {
    const { 
        isSearchBar, 
        toggleSearchbar, 
        isUserProfileBar, 
        toggleUserProfileBar,
        isShowFiltered,
        toggleFilteredDiv 
    } = useNavbar();

    const currentPage = useLocation().pathname;
    const [isMobile, setIsMobile] = useState(false);
    const {  isLoggedIn } = useSelector(authSelector);
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();

    //====== show filtered icons only when device width is below 520px;
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 520px)");
        setIsMobile(mediaQuery.matches);

        const handleResize = () => setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleResize);

        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);


    //======== useEffect for handle search =================//
    //======= search the todo implemnts here =====//
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchText) {
                dispatch(searchProdctApiAsync({searchQuery:searchText}));
            }
        }, 300); 
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchText, dispatch]);



    return (
        <>
            <div className={styles.navContainer}>
                <Link className={styles.logo} to={"/"}>
                    <div className={styles.logo}>
                        eCommerce
                    </div>
                </Link>
               

                <div className={styles.rightNavbar}>
                    {currentPage === "/" && 
                        <>
                        <div
                            className={styles.searchControll}
                            onClick={() => toggleSearchbar()}>
                            <i className={`fa-solid ${!isSearchBar ? "fa-magnifying-glass" : null}`}></i>
                        </div>

                        {isMobile && (
                            <div onClick={()=>toggleFilteredDiv()}
                                className={styles.fiteredToggleIcon}>
                                <i className="fa-solid fa-filter"></i>
                            </div>
                        )}
                        </>
                    }

                    {/* If logged in, show user profile icon; otherwise, show login */}
                    {!isLoggedIn ? (

                    <Link to={"/user/signin"}>

                        <div className={styles.loginBtn}>
                            <span className={styles.loginText}>Login</span>
                        </div>
                        
                    </Link>
                       
                    ) : (
                        <div onClick={toggleUserProfileBar} className={styles.userProfileDiv}>
                            <img src="https://images.pexels.com/photos/3777564/pexels-photo-3777564.jpeg?cs=srgb&dl=pexels-olly-3777564.jpg&fm=jpg" alt="User" />
                        </div>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            {currentPage === "/" && 
                <div className={`${styles.searchBar} ${isSearchBar ? styles.showSearch : styles.hideSearch}`}>
                    <input value={searchText} onChange={(e)=>setSearchText(e.target.value)}
                    type="text" placeholder="Search ..." className={styles.searchInput} />


                    <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
                    <div  onClick={() => toggleSearchbar()} className={styles.closedSearchDiv}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
            }

            {/* Render user profile sidebar conditionally */}
          
                <UserProfile toggleUserProfileBar={toggleUserProfileBar} isUserProfileBar={isUserProfileBar} />
            

            <Outlet />
        </>
    );
}
