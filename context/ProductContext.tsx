import React, { createContext, useContext, useState } from 'react';

// Default Data
const INITIAL_INVENTORY = [
  { 
    id: '1', 
    title: 'Calculus Textbook', 
    price: '₹50/day', 
    status: 'Available', 
    requestCount: 2, 
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    category: 'Books'
  },
  { 
    id: '2', 
    title: 'Graphing Calculator', 
    price: '₹20/hr', 
    status: 'Rented', 
    requestCount: 0, 
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee1f620?w=600&q=80',
    category: 'Tech'
  },
];

// CRITICAL FIX: Initialize with default values instead of 'null' to prevent crashes
const ProductContext = createContext({
    userProducts: INITIAL_INVENTORY,
    addProduct: (product: any) => {},
    toggleProductStatus: (id: string, status: string) => {}
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProducts, setUserProducts] = useState(INITIAL_INVENTORY);

  const addProduct = (product: any) => {
    setUserProducts((prev) => [product, ...prev]);
  };

  const toggleProductStatus = (id: string, currentStatus: string) => {
    setUserProducts((prev: any[]) => prev.map(item => 
      item.id === id ? { ...item, status: currentStatus === 'Blocked' ? 'Available' : 'Blocked' } : item
    ));
  };

  return (
    <ProductContext.Provider value={{ userProducts, addProduct, toggleProductStatus }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);