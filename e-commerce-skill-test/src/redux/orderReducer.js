import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoading, clearLoading } from "./loadingReducer";
import { setError } from "./errorReducer";
import { db } from "../firebaseInit";
import { collection, addDoc, getDocs, query, where, writeBatch } from "firebase/firestore";


//======== define initial state ============//
const initialState = {
    orderLoading: false,
    orders:[],
    orderError: null
}


//======== create new Order asyncThunkApi ============//
export const createNewOrderApiAsync = createAsyncThunk("order/createNewOrderApi", 
    async({ user, carts }, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
             // Calculate total price
             const totalPrice = carts.reduce((total, cart) => total + cart.price * cart.quantity, 0);

             // Create order in Firestore
             const orderRef = await addDoc(collection(db, "orders"), {
                 user: user,
                 products: carts.map(cart => ({
                     product: {
                         price: cart.price,
                         description: cart.description
                     },
                     productId: cart.productId,
                     name:cart.name,
                     images:cart.images,
                     quantity: cart.quantity,
                     price: cart.price,
                 })),
                 totalPrice,
                 orderDate: new Date().toISOString(),
             });
 
             // Delete all carts of the user
             const q = query(collection(db, "cartItems"), where("user", "==", user));
             const querySnapshot = await getDocs(q);
             const batch = writeBatch(db); // Use writeBatch instead of db.batch()
 
             querySnapshot.forEach((doc) => {
                 batch.delete(doc.ref);
             });
             await batch.commit();
            
             return { _id: orderRef.id, user: user, products: carts, totalPrice, orderDate: new Date().toISOString() };


        }catch(error){
            console.log('Error creating cart item: ', error);
            thunkApi.dispatch(setError(error.message));
            return thunkApi.rejectWithValue('Server error');

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)

//========= get orderAsyncThunk ======================//
export const getInitialOrdersApiAsync = createAsyncThunk(
    "order/getInitialOrdersApi",
    async (arg, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading());
            const userId = arg.userId;

            // Fetch orders for the user from Firestore
            const q = query(collection(db, "orders"), where("user", "==", userId));
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));


            return orders;
        } catch (error) {
            //console.log("error in get order api: ", error);
            thunkAPI.dispatch(setError("Error fetching orders"));
            return thunkAPI.rejectWithValue("Error fetching orders");
        } finally {
            thunkAPI.dispatch(clearLoading());
        }
    }
);




//========= create order slice for manage to state of order and reducer ==========//
const orderSlice = createSlice({
    name:"order",
    initialState:initialState,
    reducers:{},

    extraReducers:(builders)=>{
        builders
        //====== update order state for create new order =========//
        .addCase(createNewOrderApiAsync.fulfilled, (state, action)=>{
            console.log("action.payload for create order: ", action.payload);
            state.orders.push({...action.payload});
        })

        //====== update state for get all initial order ==========//
        .addCase(getInitialOrdersApiAsync.fulfilled, (state, action)=>{
            console.log("action.payload: for get all order: ", action.payload);
            state.orders=[...action.payload];
        })
    }
});

export const orderReducer = orderSlice.reducer;
export const orderActions = orderSlice.actions;
export const orderSelector = (state)=>state.orderReducer;