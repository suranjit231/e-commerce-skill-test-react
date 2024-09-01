import { useEffect, useState, useRef } from "react";
import styles from "./HomeCarosel1.module.css";
import { useDispatch } from "react-redux";
import { filterProductByCategoryApiAsync } from "../../redux/productReducer";

export default function HomeCarosel1() {
    const dispatch = useDispatch();
    const [items, setItems] = useState([
        { id: 1, title: "Electronics", imgSrc: "https://st3.depositphotos.com/1005404/13980/i/450/depositphotos_139809276-stock-photo-consumer-and-home-electronics.jpg", category: "Gadgets" },
        { id: 2, title: "Men's Clothing", imgSrc: "https://png.pngtree.com/png-clipart/20190912/ourmid/pngtree-fashion-clothes-collection-for-men-graphic-png-image-png-image_1726895.jpg", category: "Apparel" },
        { id: 3, title: "Women's Clothing", imgSrc: "https://lh6.googleusercontent.com/proxy/cxb2bqUaA2XrEFsg0AQbT3Bb3Dq1PG7srccoy7Ot_DfgWWKuMvw974S4mwcRmA8QNsMjBTTxrxr73JqiF97epA", category: "Apparel" },
        { id: 4, title: "Books", imgSrc: "https://www.freeiconspng.com/thumbs/book-png/book-png-6.png", category: "Literature" },
        { id: 5, title: "Home Appliances", imgSrc: "https://www.pngall.com/wp-content/uploads/11/Home-Appliance-PNG-Images-HD.png", category: "Gadgets" },
        { id: 6, title: "Jewellery", imgSrc: "https://i.pinimg.com/474x/8d/6c/10/8d6c10fe039c920570a66d48926f6390.jpg", category: "Gadgets" },
        { id: 7, title: "Mobile Phones", imgSrc: "https://st3.depositphotos.com/1005404/13980/i/450/depositphotos_139809276-stock-photo-consumer-and-home-electronics.jpg", category: "Gadgets" },
        { id: 8, title: "Grocery", imgSrc: "https://e7.pngegg.com/pngimages/74/72/png-clipart-grocery-store-kabul-farms-supermarket-food-online-grocer-grocery-food-food-supermarket-thumbnail.png", category: "Gadgets" },
        { id: 9, title: "Smart Watches", imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrsC7T01hGg3OEo6s41MtgM9-kR4ABzU2zSg&s", category: "Gadgets" },
        { id: 10, title: "Laptops", imgSrc: "https://clipart-library.com/image_gallery2/Laptop-Free-Download-PNG.png", category: "Gadgets" },
    ]);

    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            moveCarousel();
        }, 3000); // Move every 3 seconds

        return () => clearInterval(interval); // Clean up on unmount
    }, [items]);

    const moveCarousel = () => {
        if (carouselRef.current) {
            // Get the first item
            const firstItem = items[0];

            // Update the state to move the first item to the end
            setItems((prevItems) => [...prevItems.slice(1), firstItem]);
        }
    };

    const filteredByCategory = (category) => {
        dispatch(filterProductByCategoryApiAsync(category));
    };

    return (
        <div className={styles.topCaroselContainer} ref={carouselRef}>
            {items.map((item) => (
                <div onClick={() => filteredByCategory(item.title)} key={item.id} className={styles.categoryBox}>
                    <div className={styles.categoryImgBox}>
                        <img className={styles.categoryImg} src={item.imgSrc} alt={item.title} />
                    </div>
                    <p className={styles.categoryTitle}>{item.title}</p>
                </div>
            ))}
        </div>
    );
}
