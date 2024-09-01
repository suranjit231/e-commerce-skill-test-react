import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc,updateDoc, query, where, addDoc, doc, getDoc } from "firebase/firestore";
import { setError } from "./errorReducer";
import { setLoading, clearLoading } from "./loadingReducer";
import { db } from "../firebaseInit";

const initialState = {
    loading: false,
    products: [],
    categories:[],
};


// Fetch a single product by ID from Firestore
export const getProductByIdApiAsync = createAsyncThunk(
    "product/getProductByIdApi", 
    async (productId, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading());
            const productDocRef = doc(db, "products", productId);
            const productSnapshot = await getDoc(productDocRef);
            
            if (productSnapshot.exists()) {
                const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                thunkAPI.dispatch(clearLoading());
                console.log("productData: ", productData);
                return productData;
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            thunkAPI.dispatch(setError("Product not found!"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Product not found");
        }
    }
);
// Fetch all products from Firestore
export const getAllProductApiAsync = createAsyncThunk(
    "product/getAllProductApi", 
    async (_, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading());
            const productsCollection = collection(db, "products");
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            thunkAPI.dispatch(clearLoading());
            return productsList;
        } catch (error) {
            thunkAPI.dispatch(setError("Products not found!"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Products not found");
        }
    }
);

// Delete a product from Firestore
export const deleteProductApiAsync = createAsyncThunk(
    "product/deleteProductApi", 
    async (arg, thunkAPI) => {
        try {
            const { productId } = arg;
            thunkAPI.dispatch(setLoading());
            await deleteDoc(doc(db, "products", productId));
            thunkAPI.dispatch(clearLoading());
            return { productId, success: true };
        } catch (error) {
            thunkAPI.dispatch(setError("Failed to delete product"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Failed to delete product");
        }
    }
);

//====== update product api async ===========//
export const updateProductApiAsync = createAsyncThunk("product/updateProductApi",
    async(product, thunkAPI)=>{
        try {
            thunkAPI.dispatch(setLoading());
            
            const { id, ...updatedData } = product;
            const productDocRef = doc(db, "products", id);
            await updateDoc(productDocRef, updatedData);

            thunkAPI.dispatch(clearLoading());
            return { id, ...updatedData }; // Return the updated product data
        } catch (error) {
            thunkAPI.dispatch(setError("Failed to edit Product"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Failed to edit Product");
        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
)



// Search products in Firestore
export const searchProdctApiAsync = createAsyncThunk(
    "product/searchProduct", 
    async (arg, thunkAPI) => {
        try {

         
            thunkAPI.dispatch(setLoading());

            const productsCollection = collection(db, "products");
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter products client-side using regex
            const searchQuery = arg.searchQuery.toLowerCase();
            const regex = new RegExp(searchQuery, 'i'); 

            const filteredProducts = productsList.filter(product => 
                regex.test(product.name.toLowerCase()) || 
                regex.test(product.description.toLowerCase()) 
            );

            thunkAPI.dispatch(clearLoading());

            if(filteredProducts?.length<1){
                
                throw new Error("product not found")
            }

            return filteredProducts;
        } catch (error) {

            console.log("error: ", error);
            thunkAPI.dispatch(setError("Products not found!"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Products not found");
        }
    }
);


// Filter products with price, category, and regex pattern for name
export const filterProductApiAsync = createAsyncThunk(
    "product/filterProductApi",
    async (arg, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading());

            console.log("filterProduct called arg: ", arg)

            const productsCollection = collection(db, "products");
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Apply client-side filters
            const { maxPrice, category } = arg.filterCriteria;

            const filteredProducts = productsList.filter(product => {
                // Price filter
                const withinPriceRange = !maxPrice || parseFloat(product.price) <= parseFloat(maxPrice);

                // Category filter
                const inSelectedCategories = !category || category.includes(product.category);

                return withinPriceRange && inSelectedCategories;
            });

            thunkAPI.dispatch(clearLoading());
            return filteredProducts;
        } catch (error) {
            thunkAPI.dispatch(setError("Products not found!"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Products not found");
        }
    }
);

// Add new product to Firestore
export const addProductApiAsync = createAsyncThunk(
    "product/addProductApi", 
    async (arg, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading());
            const docRef = await addDoc(collection(db, "products"), arg);
            const newProduct = { id: docRef.id, ...arg };
            thunkAPI.dispatch(clearLoading());
            return newProduct;
        } catch (error) {
            thunkAPI.dispatch(setError("Failed to add product"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Failed to add product");
        }
    }
);

//======= filtered product by selected category apiAsync ==========//
export const filterProductByCategoryApiAsync = createAsyncThunk("product/filterProductByCategoryApi",
    async(category, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());
            const q = query(collection(db, "products"), where("category", "==", category));

            const productsSnapshot = await getDocs(q);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("product list filtered by category: ", productsList);

            return productsList;

        }catch(error){
            thunkAPI.dispatch(setError("Failed to add product"));
            thunkAPI.dispatch(clearLoading());
            return thunkAPI.rejectWithValue("Failed to add product");
        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
)



// Create productSlice for state management
const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProductApiAsync.fulfilled, (state, action) => {
                state.products = [...action.payload];
            })
            .addCase(searchProdctApiAsync.fulfilled, (state, action) => {
                state.products = [...action.payload];
            })
            .addCase(filterProductApiAsync.fulfilled, (state, action) => {
                state.products = [...action.payload];
            })
            .addCase(addProductApiAsync.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(deleteProductApiAsync.fulfilled, (state, action) => {
                const { productId } = action.payload;
                state.products = state.products.filter(prod => prod.id !== productId);
            })

            .addCase(updateProductApiAsync.fulfilled, (state, action) => {
                const updatedProduct = action.payload;
                state.products = state.products.map(prod => 
                    prod.id === updatedProduct.id ? updatedProduct : prod
                );
            })

            .addCase(filterProductByCategoryApiAsync.fulfilled, (state, action)=>{
                state.products = [...action.payload];
            })

            
    }
});

export const productReducer = productSlice.reducer;
export const productActions = productSlice.actions;
export const productSelector = (state) => state.productReducer;
