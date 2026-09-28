import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchProducts, fetchProductTypes, type Product } from '@orders-hub/shared'

interface ProductsState {
  items: Product[]
  types: string[]
  filter: string
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  types: [],
  filter: '',
  status: 'idle',
  error: null
}

export const loadProducts = createAsyncThunk('products/load', async (type?: string) => fetchProducts(type || undefined))
export const loadProductTypes = createAsyncThunk('products/types', fetchProductTypes)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'ready'
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Unknown error'
      })
      .addCase(loadProductTypes.fulfilled, (state, action) => {
        state.types = action.payload
      })
  }
})

export const { setFilter } = productsSlice.actions
export default productsSlice.reducer
