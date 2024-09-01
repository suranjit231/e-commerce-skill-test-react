import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebaseInit'; 
import { setError } from './errorReducer';
import { setLoading, clearLoading} from "./loadingReducer";
import  {doc, getDoc, collection, deleteDoc, query, where, getDocs, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { createNewOrderApiAsync } from './orderReducer';

const initialState = {
  loading: false,
  carts: [],
};

// Add item to cart
export const addCartApiAsync = createAsyncThunk(
  'cart/addCartApi',
  async ({ user, productId, quantity }, thunkAPI) => {
    try {

      console.log(`add carts arg: user:${user} - productId:${productId} - quantity:${quantity}`)
      thunkAPI.dispatch(setLoading());

      const cartsRef = collection(db, 'cartItems');

      // Query to check if a cart already exists for the given user and productId
      const cartQuery = query(
        cartsRef,
        where('user', '==', user),
        where('productId', '==', productId)
      );

      const querySnapshot = await getDocs(cartQuery);
      if (!querySnapshot.empty) {
        // If a document exists, update the quantity
        const cartDoc = querySnapshot.docs[0]; 
        const cartData = cartDoc.data();
        const newQuantity = cartData.quantity + quantity;

        await updateDoc(cartDoc.ref, { quantity: newQuantity });
      } else {
        // If no document exists, create a new one
        await addDoc(cartsRef, {
          user: user,
          productId: productId,
          quantity: quantity,
        });
      }

      thunkAPI.dispatch(getInitialCartApiAsync({user:user}))
      return { user, productId, quantity };
    } catch (error) {
      console.log("Error adding to cart: ", error);
      thunkAPI.dispatch(setError(error.message));
      return thunkAPI.rejectWithValue('Server error');
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);



// Fetch initial cart items for the user
export const getInitialCartApiAsync = createAsyncThunk(
  'cart/getInitialCartApi',
  async (userInfo, thunkAPI) => {
    try {
      const { user } = userInfo;
      thunkAPI.dispatch(setLoading());

      // Query to find all cart documents for the given userId
      const cartQuery = query(collection(db, 'cartItems'), where('user', '==', user));

      const cartSnapshot = await getDocs(cartQuery);

      if (!cartSnapshot.empty) {
        const productsInfo = [];

        // Loop through all cart documents for the user
        for (const cartDoc of cartSnapshot.docs) {
          const cartData = cartDoc.data();
          const { productId, quantity } = cartData;

          // Fetch product information based on productId
          const productRef = doc(db, 'products', productId);
          const productDoc = await getDoc(productRef);

         // console.log(productDoc.data());

          if (productDoc.exists()) {
            productsInfo.push({
              ...productDoc.data(),
              productId,
              user,
              quantity,
              id: cartDoc.id,
            });
          }
        }
        return productsInfo;
      } else {
        return [];
      }
    } catch (error) {
      console.log('Error fetching cart items: ', error);
      thunkAPI.dispatch(setError(error.message));
      return thunkAPI.rejectWithValue('Server error');
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

// Increase cart item quantity
export const increasedCartItemApiAsync = createAsyncThunk(
  'cart/increasedCartItemApi',
  async ({ id, user }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading());

      const cartRef = doc(db, 'cartItems', id);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const newQuantity = cartData.quantity + 1;

        await updateDoc(cartRef, { quantity: newQuantity });

        return { id, user, productId: cartData.productId, quantity: newQuantity };
      }
    } catch (error) {
      console.log('Error increasing cart item: ', error);
      thunkAPI.dispatch(setError(error.message));
      return thunkAPI.rejectWithValue('Server error');
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

// Decrease cart item quantity
export const decreasedCartItemsApiAsync = createAsyncThunk(
  'cart/decreasedCartItemsApi',
  async ({ id, user }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading());

      const cartRef = doc(db, 'cartItems', id);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const newQuantity = cartData.quantity - 1;

        if (newQuantity > 0) {
          await updateDoc(cartRef, { quantity: newQuantity });
        } else {
          await deleteDoc(cartRef);
        }

        return { id, user, productId: cartData.productId, quantity: newQuantity };
      }
    } catch (error) {
      //console.log('Error decreasing cart item: ', error);
      thunkAPI.dispatch(setError(error.message));
      return thunkAPI.rejectWithValue('Server error');
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

// Remove item from cart
export const removedCartApiAsync = createAsyncThunk(
  'cart/removedCartApi',
  async ({ id, user }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading());

      const cartRef = doc(db, 'cartItems', id);

      await deleteDoc(cartRef);

      return { id, user };
    } catch (error) {
      console.log('Error removing cart item: ', error);
      thunkAPI.dispatch(setError(error.message));
      return thunkAPI.rejectWithValue('Server error');
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInitialCartApiAsync.fulfilled, (state, action) => {
        state.carts = action.payload;
      })
      .addCase(increasedCartItemApiAsync.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const itemIndex = state.carts.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
          state.carts[itemIndex].quantity = quantity;
        }
      })
      .addCase(decreasedCartItemsApiAsync.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const itemIndex = state.carts.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
          if (quantity > 0) {
            state.carts[itemIndex].quantity = quantity;
          } else {
            state.carts.splice(itemIndex, 1);
          }
        }
      })
      .addCase(removedCartApiAsync.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.carts = state.carts.filter((item) => item.id !== id);
      })
      
      //======== clear carts when order is created successfull ===========//
      .addCase(createNewOrderApiAsync.fulfilled, (state, action)=>{
       state.carts= state.carts.filter((cart)=>cart.user !== action.payload.user)
      })

  },
});



export const cartReducer = cartSlice.reducer;
export const cartSelector = (state) => state.cartReducer;