import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, ProductInitialState } from '../../../types/products/productsTypes'

const initialState: ProductInitialState = {
  productList: [],
  isLoading: true,
  error: null,
  product: null
}
const productDetailsSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    getProductsData: (state, action: PayloadAction<Product[]>) => {
      state.productList = action.payload
      state.isLoading = false
    },
    getOneProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload
      state.isLoading = false
    },
    getError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    resetProductInfo: (state) => {
      state.isLoading = true
      state.product = initialState.product
    }
  }
})
export default productDetailsSlice.reducer
export const productDetailsAtions = productDetailsSlice.actions
