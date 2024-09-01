import styles from "./FilteredProduct.module.css";
import { useState, useEffect } from "react";
import { useNavbar } from "../../context/NavbarContext";
import { filterProductApiAsync } from "../../redux/productReducer";
import { useDispatch } from "react-redux";


export default function FilteredProduct(){

    const [isVisible, setIsVisible] = useState(false);
    const [price, setPrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { isShowFiltered, toggleFilteredDiv } = useNavbar();
    const dispatch = useDispatch();
  
   

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prevCategories =>
            checked
                ? [...prevCategories, value]
                : prevCategories.filter(category => category !== value)
        );
    };


    const handleApplyFilters = async (event) => {
        event.preventDefault();

        let filterCriteria = {};

        if(price){
            filterCriteria.maxPrice = price;
        }
        if(selectedCategories.length >0){
            filterCriteria.category = selectedCategories;
        }

        if (Object.keys(filterCriteria).length === 0) return;
        
        console.log("filteredCriteria: ", filterCriteria);

       await dispatch(filterProductApiAsync({filterCriteria:filterCriteria}));

       if(isShowFiltered){
        toggleFilteredDiv();
       }


    };



    return(
        <div className={styles.filteredContainer} style={{ display: isShowFiltered ? 'flex' : '' }} >

            {isShowFiltered && 
            
            <i onClick={()=>toggleFilteredDiv()} 
            className={`fa-solid fa-xmark ${styles.closeFilterDiv}`}></i>
            
            }

      

            <div className={styles.sideBarWrapper}>
                <div className={styles.filterheader}>
                    <span><i className="fa-solid fa-filter-circle-dollar"></i></span>
                    <span>Filter</span>
                </div>

                <form onSubmit={handleApplyFilters}>
                    <div className={styles.priceRangeDiv}>
                        <label htmlFor="priceRange">Price: {price}</label>
                        <input
                            type="range"
                            id="priceRange"
                            min="100"
                            max="200000"
                            value={price}
                            onChange={handlePriceChange}
                            className={styles.priceRangeInput}
                        />
                    </div>

                    <div className={styles.categoryFilterDiv}>
                        <p>Category</p>

                        <div>
                            <label htmlFor="mans-cloth">
                                <input
                                    type="checkbox"
                                    id="mans-cloth"
                                    value="Men's Clothing"
                                    checked={selectedCategories.includes("Men's Clothing")}
                                    onChange={handleCategoryChange}
                                />
                                Man's Clothing
                            </label>
                        </div>

                        <div>
                            <label htmlFor="womens-cloth">
                                <input
                                    type="checkbox"
                                    id="womens-cloth"
                                    value="Women's Clothing"
                                    checked={selectedCategories.includes("Women's Clothing")}
                                    onChange={handleCategoryChange}
                                />
                                Women's Clothing
                            </label>
                        </div>

                        <div>
                            <label htmlFor="electronics">
                                <input
                                    type="checkbox"
                                    id="electronics"
                                    value="Electronics"
                                    checked={selectedCategories.includes("Electronics")}
                                    onChange={handleCategoryChange}
                                />
                                Electronics
                            </label>
                        </div>

                        <div>
                            <label htmlFor="Jewellery">
                                <input
                                    type="checkbox"
                                    id="jewellery"
                                    value="Jewellery"
                                    checked={selectedCategories.includes("Jewellery")}
                                    onChange={handleCategoryChange}
                                />
                                Jewellery
                            </label>
                        </div>
                    </div>

                    <div className={styles.applyFilter}>
                        <button type="submit">Apply</button>
                    </div>
                </form>
            </div>
        </div>
    )

}