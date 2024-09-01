import styles from "./Maincarosel.module.css";
import { useEffect, useState } from "react";


export default function Maincarosel(){

    
    const [currentCarosel, setCurrentCarosel] = useState(0);
    const caroselData = [
        { id: 1, caption: "Special Offers", imgSrc: "https://static.vecteezy.com/system/resources/previews/011/871/820/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg" },
        { id: 2, caption: "Electronics", imgSrc: "https://static.vecteezy.com/system/resources/thumbnails/002/006/774/small/paper-art-shopping-online-on-smartphone-and-new-buy-sale-promotion-backgroud-for-banner-market-ecommerce-free-vector.jpg" },
        { id: 3, caption: "Latest Gadgets", imgSrc: "https://graphicsfamily.com/wp-content/uploads/edd/2022/11/Simple-E-commerce-Banner-Design-scaled.jpg" },
        { id: 4, caption: "Black Friday Deals", imgSrc: "https://img.freepik.com/premium-psd/black-friday-sale-social-media-post-instagram-post-web-banner-facebook-cover-template_220443-1074.jpg?semt=ais_hybrid" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCarosel((prevIndex) => (prevIndex + 1) % caroselData.length);
        }, 6000); // 6 seconds interval for slide change
        return () => clearInterval(interval);
    }, [caroselData.length]);

    const handlePrevious = () => {
        setCurrentCarosel((prevIndex) => (prevIndex - 1 + caroselData.length) % caroselData.length);
    };

    const handleNext = () => {
        setCurrentCarosel((prevIndex) => (prevIndex + 1) % caroselData.length);
    };

    return (
            <div 
                className={styles.mainCaroselContainer} 
                style={{ backgroundImage: `url(${caroselData[currentCarosel].imgSrc})` }}
            >
                <div className={styles.captionContainer}>
                    <h2>{caroselData[currentCarosel].caption}</h2>
                </div>

                <div className={styles.previousIconDiv} onClick={handlePrevious}>
                    <i className="fa-solid fa-angle-left"></i>
                </div>

                <div className={styles.nextIconDiv} onClick={handleNext}>
                    <i className="fa-solid fa-angle-right"></i>
                </div>
            </div>
       
    );
}