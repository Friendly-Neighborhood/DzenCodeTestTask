import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createOrder as createOrderRequest, fetchOrders, removeOrder, type Order } from '@orders-hub/shared'

interface OrdersState {
  items: Order[]
  selectedId: number | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  mutating: boolean
}

const initialState: OrdersState = {
  items: [],
  selectedId: null,
  status: 'idle',
  error: null,
  mutating: false
}

export const loadOrders = createAsyncThunk('orders/load', fetchOrders)

export const addOrder = createAsyncThunk('orders/add', async (input: { title: string; description: string }) => createOrderRequest(input))

export const deleteOrder = createAsyncThunk('orders/delete', async (id: number) => {
  const removed = await removeOrder(id)
  return { id, removed }
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    selectOrder: (state, action: PayloadAction<number>) => {
      state.selectedId = action.payload
    },
    closeOrder: (state) => {
      state.selectedId = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'ready'
        if (state.selectedId && !action.payload.some((order) => order.id === state.selectedId)) {
          state.selectedId = null
        }
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Unknown error'
      })
      .addCase(addOrder.pending, (state) => {
        state.mutating = true
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.mutating = false
        state.items.unshift(action.payload)
        state.selectedId = action.payload.id
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.mutating = false
        state.error = action.error.message ?? 'Unable to create order'
      })
      .addCase(deleteOrder.pending, (state) => {
        state.mutating = true
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.mutating = false
        if (action.payload.removed) {
          state.items = state.items.filter((order) => order.id !== action.payload.id)
          if (state.selectedId === action.payload.id) {
            state.selectedId = null
          }
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.mutating = false
        state.error = action.error.message ?? 'Unable to delete order'
      })
  }
})

export const { selectOrder, closeOrder } = ordersSlice.actions
export default ordersSlice.reducer
