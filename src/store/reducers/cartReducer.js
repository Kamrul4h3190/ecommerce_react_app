const initialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {

        case "SET_CART":
            return {
                ...state,
                cart: action.payload.products || [],
                totalPrice: action.payload.totalPrice || 0,
                cartId: action.payload.cartId || null,
            };

        case "ADD_CART": {
            const productToAdd = action.payload;

            const existingProduct = state.cart.find(
                (item) => item.productId === productToAdd.productId
            );

            if (existingProduct) {
                const updatedCart = state.cart.map((item) => {
                    if (item.productId === productToAdd.productId) {
                        return productToAdd;
                    }

                    return item;
                });

                return {
                    ...state,
                    cart: updatedCart,
                };
            }

            return {
                ...state,
                cart: [...state.cart, productToAdd],
            };
        }

        case "REMOVE_CART":
            return {
                ...state,
                cart: state.cart.filter(
                    (item) =>
                        item.productId !== action.payload.productId
                ),
            };

        case "GET_USER_CART_PRODUCTS":
            return {
                ...state,
                cart: action.payload,
                totalPrice: action.totalPrice,
                cartId: action.cartId,
            };

        case "CLEAR_CART":
            return {
                ...initialState,
            };

        default:
            return state;
    }
};
