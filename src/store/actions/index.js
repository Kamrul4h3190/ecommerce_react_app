import api from "../../api/api"

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addToCart =
    (data, qty = 1, toast) =>
    async (dispatch) => {
        try {
            const { data: cartData } = await api.post(
                `/carts/products/${data.productId}/quantity/${qty}`
            );

            dispatch({
                type: "SET_CART",
                payload: cartData,
            });

            toast.success(`${data.productName} added to the cart`);
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    };



export const increaseCartQuantity =
    (data, toast) =>
    async (dispatch) => {
        try {
            const { data: cartData } = await api.put(
                `/cart/products/${data.productId}/quantity/increase`
            );

            dispatch({
                type: "SET_CART",
                payload: cartData,
            });
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to increase quantity"
            );
        }
    };




export const decreaseCartQuantity =
    (data, toast) =>
    async (dispatch) => {
        try {
            const { data: cartData } = await api.put(
                `/cart/products/${data.productId}/quantity/decrease`
            );

            dispatch({
                type: "SET_CART",
                payload: cartData,
            });
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to decrease quantity"
            );
        }
    };


export const removeFromCart =
    (data, cartId, toast) =>
    async (dispatch) => {
        try {
            await api.delete(
                `/carts/${cartId}/product/${data.productId}`
            );

            const { data: cartData } =
                await api.get("/carts/users/cart");

            dispatch({
                type: "SET_CART",
                payload: cartData,
            });

            toast.success(
                `${data.productName} removed from cart`
            );
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to remove product from cart"
            );
        }
    };




export const authenticateSignInUser =
    (sendData, toast, reset, navigate, setLoader) =>
    async (dispatch) => {
        try {
            setLoader(true);

            const { data } = await api.post("/auth/signin", sendData);

            dispatch({
                type: "LOGIN_USER",
                payload: data,
            });

            localStorage.setItem("auth", JSON.stringify(data));

            // Load the logged-in user's cart
            const { data: cartData } =
                await api.get("/carts/users/cart");

            dispatch({
                type: "SET_CART",
                payload: cartData,
            });

            reset();
            toast.success("Login Success");
            navigate("/");
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Internal Server Error"
            );
        } finally {
            setLoader(false);
        }
    };


export const registerNewUser
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login ");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};

export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type: "LOG_OUT" });
    dispatch({ type: "CLEAR_CART" });

    localStorage.removeItem("auth");
    localStorage.removeItem("cartItems");

    navigate("/login");
};


export const addUpdateUserAddress =
     (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
    // const { user } = getState().auth;
    dispatch({ type:"BUTTON_LOADER" });
    try {
        const { data } = await api.post("/addresses", sendData);
        toast.success("Address saved successfully");
        dispatch({type:"IS_SUCCESS"});
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        dispatch({ type:"IS_ERROR", payload: null });
    } finally {
        setOpenAddressModal(false);
    }
};

export const getUserAddresses = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        // const { data } = await api.get(`/addresses`);
        const { data } = await api.get(`/users/addresses`);
        dispatch({type: "USER_ADDRESS", payload: data});
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
        });
    }
};

export const getUserCart = () => async (dispatch) => {
    try {
        dispatch({ type: "CART_FETCHING" });

        const { data } = await api.get("/carts/users/cart");

        dispatch({
            type: "SET_CART",
            payload: data,
        });

        dispatch({ type: "CART_SUCCESS" });
    } catch (error) {
        console.log(error);

        dispatch({
            type: "CART_ERROR",
            payload:
                error?.response?.data?.message ||
                "Failed to fetch cart",
        });
    }
};

