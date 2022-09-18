import create from 'zustand';

export const useOrderBook = create((set) => ({
  orderBook: {},
  addOrder: (key, value) =>
    set((state) => ({
      orderBook: Object.assign(state.orderBook, { [key]: value }),
    })),
}));
