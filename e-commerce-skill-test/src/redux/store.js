import { configureStore } from "@reduxjs/toolkit";
import { errorReducer } from "./errorReducer";
import { loadingReducer } from "./loadingReducer";
import { authReducer } from "./authReducer";
import { productReducer } from "./productReducer";
import { cartReducer } from "./cartReducer";
import { orderReducer } from "./orderReducer";

const store = configureStore({
    reducer:{
        loadingReducer,
        errorReducer,
        authReducer,
        productReducer,
        cartReducer,
        orderReducer
        
       
    }
});


export default store;