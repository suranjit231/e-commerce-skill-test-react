import styles from "./Cart.module.css";
import { IoBagHandleSharp, IoClose } from "react-icons/io5";
import { getInitialCartApiAsync, decreasedCartItemsApiAsync,
    removedCartApiAsync, increasedCartItemApiAsync, cartSelector

 } from "../../redux/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import { loadingSelector } from "../../redux/loadingReducer";
import { ClipLoader} from "react-spinners";
import { toast } from "react-toastify";
import { createNewOrderApiAsync } from "../../redux/orderReducer";


export default function Cart(){
    const [cartQuantity, setCartQuanity] = useState(1);
    const {carts} = useSelector(cartSelector);
    const {loading } = useSelector(loadingSelector)
    const dispatch = useDispatch();
    const params = useParams()

   // console.log("carts: ", carts)


    //===== handle carts quantity ======//
    // function handleCartQuantity(val){
    //     if(cartQuantity===0 && val===-1) return;

    //     setCartQuanity((prev)=>prev + val);
    // }


    useEffect(()=>{
        dispatch(getInitialCartApiAsync({user:params.userId}));

    },[])

    function calculateTotalCartsPrice(cartList){
        const totalPrice = cartList.reduce((acc, item)=>acc + (Number(item.price)*item.quantity), 0);
        return totalPrice;
    }

    //===== handle click increase carts quanity ======//
    async function handleClickIncreaseQuantity(id){
        try{
            const result = await dispatch(increasedCartItemApiAsync({id:id, user:params.userId}));
            toast.success("carts quanity increased.");

        }catch(error){
            toast.error("error in increased items carts.")
        }
    }

    //====== handle click decreased quanity =========//
    async function handleClickDecreasedQuanity(id){
        try{
            const result = await dispatch(decreasedCartItemsApiAsync({id:id, user:params.userId}));
            toast.success("carts quanity decreased.")

        }catch(error){
            toast.error("error in decreased items carts.")
        }

    }


    //====== function handle click removed items from carts =======//
    async function handleClickRemovedCartItem(id) {
        try{
            const result = await dispatch(removedCartApiAsync({id:id, user:params.userId}));
            if(result){
                toast.success("items is removed from cart.")
            }

        }catch(error){
            toast.error("error removed items from cart.")
        }
        
    }


    //======= handle click order for checkout ============//
    async function handleClickProceedsToCheckout(){
        try{

            if(carts.length<1){
                toast.error("You have no items in carts.");
            }

            const result = await dispatch(createNewOrderApiAsync({user:params.userId, carts:carts}));
           
            console.log("result for deispatch create order: ", result);
            if(result.type==='order/createNewOrderApi/fulfilled'){
                console.log("result for deispatch create order: ", result);
                toast.success("your order has done successfully.")
            }

        }catch(error){
            toast.error(error);
        }
    }
    

    return(<>

        {loading?<ClipLoader size={50} color="blue" className="clipLoader"/>:carts && carts.length>0?(

        <div className={styles.cartContainer}>
            <div className={styles.cartsPageHeader}>
                    <IoBagHandleSharp className={styles.cartsIcon} />
                    <h1>My Carts</h1>
            
            </div>

            <div className={styles.mainCartsContainer}>
                <div className={styles.cartListHeadingDiv}>
                    <div className={styles.headingImg}>Image</div>
                    <div className={styles.headingName}>Name</div>
                    <div className={styles.headingControlQhantity}>Quantity</div>
                    <div className={styles.headingPrice}>Price</div>

                </div>

                <div className={styles.cartListContainer}>

                {carts?.length>0 && carts.map((cart)=>(

               
                    <div key={cart.id} className={styles.cartItems}>
                        <IoClose onClick={()=>handleClickRemovedCartItem(cart.id)}
                         className={styles.removeCartsBtn}/>

                        <div className={styles.image}>
                            <img src={cart.images} alt="Laptop" />
                            
                        </div>
                        <div className={styles.name}>
                            {cart.name}
                        </div>


                        <div className={styles.controlQhantity}>
                            <i onClick={()=>handleClickIncreaseQuantity(cart.id)}
                             className={`fa-solid fa-plus`}></i>

                            <p className={styles.quantity}>{cart.quantity}</p>

                            <i onClick={()=>handleClickDecreasedQuanity(cart.id)}
                             className={`fa-solid fa-minus`}></i>
                            
                        </div>

                        <div className={styles.price}>
                            {cart.price}
                        </div>
                    </div>

                ))}


                </div>


            </div>

            {/* ========= carts footer start here ========= */}

            <div className={styles.cartsFooterContainer}>
                <p>Carts Total: $ {calculateTotalCartsPrice(carts)}</p>
                <button onClick={()=>handleClickProceedsToCheckout()}
                 className={styles.checkOutBtn}>PROCCED TO CHECKOUT</button>
            </div>

        </div>


):<div className="noData-div">
        <h1>No items in your carts</h1>
    </div>}


    </>)
}