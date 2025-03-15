import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  productId: string | null;
  productName: string | null;
  price: number | null;
  description: string | null;
}

const initialState: ProductState = {
  productId: null,
  productName: null,
  price: null,
  description: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductData: (state, action: PayloadAction<ProductState>) => {
      return { ...state, ...action.payload };
    },
    clearProductData: () => initialState,
  },
});

export const { setProductData, clearProductData } = productSlice.actions;
export default productSlice.reducer;