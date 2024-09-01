import Navbar from "./components/navbar/Navbar";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import { NavbarProvider } from "./context/NavbarContext";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Cart from "./pages/carts/Cart";
import OrderPage from "./pages/orders/Order";
import LoginForm from "./pages/authForm/loginForm";
import SignupForm from "./pages/authForm/signupForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

import { checkIsLoginAsync, authSelector } from "./redux/authReducer";
import { loadingSelector } from "./redux/loadingReducer";
import { useDispatch,useSelector } from "react-redux";
import AddProductForm from "./pages/productForm/AddProductForm";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminPage from "./pages/admin/admin";

function App() {
  const dispatch = useDispatch();
  const {loading} = useSelector(authSelector);


  useEffect(() => {

    dispatch(checkIsLoginAsync());
}, [dispatch]);


      //======= create router for different routes =========//
      const router = createBrowserRouter([
        {
            path: "/",
            element: <Navbar />,
            children: [
                { index: true, element: <Home /> },
                { path: "product-details/:productId", element: <ProductDetails /> },
                { path: "carts/:userId", element: <ProtectedRoute><Cart /></ProtectedRoute> },
                { path: "orders/:userId", element: <ProtectedRoute><OrderPage /></ProtectedRoute> },
                { path: "user/signin", element: <LoginForm /> },
                { path: "user/signup", element: <SignupForm /> },
                // { path: "product/addProduct", element: <ProtectedRoute><AddProductForm /></ProtectedRoute> }
            ]
        },

        {
          path:"/admin", element:<ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>,
    
        },
        {path:"/admin/product/addProduct", element:<ProtectedRoute>
          <AddProductForm />
        </ProtectedRoute>},

        {
          path:"/admin/product/editProduct/:productId", element:<ProtectedRoute>
              <AddProductForm />
          </ProtectedRoute>
        }
    ]);

  

  //========== show the loader is loading ===========//
  if (loading) {
    return <div className="spinner-container"><ClipLoader size={50} color={"#123abc"} loading={true} /></div>;
}





  return (
    <div className="App">
      
            <NavbarProvider>
                <RouterProvider router={router} />
            </NavbarProvider>
            <ToastContainer className="custom-toast-container"/>
    </div>
  );
}

export default App;
