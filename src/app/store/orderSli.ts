import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
    id: number;
    name: string;
    email: string;
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState: [] as Order[],
    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            return action.payload;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            return [...state, action.payload];
        },
        deleteOrder: (state, action: PayloadAction<number>) => {
            return state.filter(order => order.id !== action.payload);
        },
        editOrder: (state, action: PayloadAction<{ id: number; updatedOrder: Partial<Order> }>) => {
            return state.map(order =>
                order.id === action.payload.id ? { ...order, ...action.payload.updatedOrder } : order
            );
        },
    },
});

export const { setOrders, addOrder, deleteOrder, editOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
