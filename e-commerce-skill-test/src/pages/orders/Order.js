import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getInitialOrdersApiAsync, orderSelector } from "../../redux/orderReducer";
import { useParams } from "react-router-dom";
import { loadingSelector } from "../../redux/loadingReducer";
import { ClipLoader } from "react-spinners";
import styles from "./Order.module.css";

const OrderPage = () => {
  const { orders } = useSelector(orderSelector);
  const { loading } = useSelector(loadingSelector);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getInitialOrdersApiAsync({ userId: params.userId }));
  }, [dispatch, params.userId]);

  return (
    <div className={styles.orderPageContainer}>
      {loading ? (
          <ClipLoader size={50} color="blue" className="clipLoader"/>
      ) : (
        <>
          {orders.length === 0 ? (
            <div className={styles.noOrdersMessage}>
              <h2>You have not placed any orders in the last 4 weeks.</h2>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className={styles.orderContainer}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <h1>Order Details</h1>
                  <p>Order #{order._id || "123456789"}</p>
                </div>

                {/* Order Status Timeline */}
                <div className={styles.orderTimeline}>
                  <div className={`${styles.timelineStep} ${styles.completed}`}>
                    <div className={styles.timelineIcon}>✓</div>
                    <p>Ordered</p>
                  </div>
                  <div className={`${styles.timelineStep} ${styles.completed}`}>
                    <div className={styles.timelineIcon}>✓</div>
                    <p>Shipped</p>
                  </div>
                  <div className={styles.timelineStep}>
                    <div className={styles.timelineIcon}>...</div>
                    <p>Out for Delivery</p>
                  </div>
                  <div className={styles.timelineStep}>
                    <div className={styles.timelineIcon}>...</div>
                    <p>Delivered</p>
                  </div>
                </div>

                {/* Order Dates */}
                <div className={styles.orderDates}>
                  <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Total Price: ${order.totalPrice}</p>
                </div>

                {/* Product Details */}
                <div className={styles.productDetailsContainer}>
                  <h2>Products</h2>
                  {order.products.map((product, index) => (
                    <div key={index} className={styles.productItem}>
                      <img
                        src={product.images}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      <div className={styles.productInfo}>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productQuantity}>Quantity: {product.quantity}</p>
                      </div>
                      <div className={styles.productPrice}>${product.price}</div>
                    </div>
                  ))}
                </div>

                {/* Delivery and Payment Info */}
                <div className={styles.orderInfoContainer}>
                  <div className={styles.orderInfoSection}>
                    <h2>Delivery Address</h2>
                    <p>John Doe</p>
                    <p>1234 Elm Street</p>
                    <p>Springfield, IL 62704</p>
                    <p>United States</p>
                  </div>

                  <div className={styles.orderInfoSection}>
                    <h2>Payment Information</h2>
                    <p>Payment Method: Credit Card</p>
                    <p>Total Paid: ${order.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default OrderPage;
