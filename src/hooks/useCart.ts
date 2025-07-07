"use client";

import { useEffect, useState } from "react";

import { CartItem, Product } from "@/types";

interface StorageData<T = unknown> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

const setLocalStorage = <T>(key: string, value: T, expiresInDays: number = 1): void => {
  const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;
  const storageData: StorageData<T> = {
    data: value,
    timestamp: Date.now(),
    expiresIn: expiresInMs,
  };

  try {
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error saving to localStorage:", errorMessage);
  }
};

const getLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const storageData: StorageData<T> = JSON.parse(item);
    const now = Date.now();

    if (now - storageData.timestamp > storageData.expiresIn) {
      localStorage.removeItem(key);
      return null;
    }

    return storageData.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error reading from localStorage:", errorMessage);
    return null;
  }
};

interface CartStore {
  cart: CartItem[];
  selectedItems: Set<string>;
  addToCart: (product: Product, quantity: number, selectedSize: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getCartItemByProduct: () => number;
  loadCart: () => void;

  // Selection methods
  toggleItemSelection: (id: string, size: string) => void;
  toggleCategorySelection: (category: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  getSelectedItems: () => CartItem[];
  getSelectedTotal: () => number;
  getSelectedCount: () => number;
  isCategorySelected: (category: string) => boolean;
  isCategoryPartiallySelected: (category: string) => boolean;
  removeSelectedItems: () => void;
}

interface CartState {
  cart: CartItem[];
  selectedItems: Set<string>;
}

const createCartStore = () => {
  let state: CartState = {
    cart: [],
    selectedItems: new Set(),
  };

  const listeners = new Set<() => void>();
  const CART_STORAGE_KEY = "lindway_cart";
  const SELECTION_STORAGE_KEY = "lindway_cart_selection";

  const setState = (newState: Partial<CartState>) => {
    state = { ...state, ...newState };

    if (state.cart.length > 0) {
      setLocalStorage<CartItem[]>(CART_STORAGE_KEY, state.cart, 1);
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }

    // Save selection state
    if (state.selectedItems.size > 0) {
      setLocalStorage<string[]>(SELECTION_STORAGE_KEY, Array.from(state.selectedItems), 1);
    } else {
      localStorage.removeItem(SELECTION_STORAGE_KEY);
    }

    listeners.forEach((listener) => listener());
  };

  const getState = (): CartState => state;

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // Helper function to create unique key for cart item
  const getItemKey = (id: string, size: string): string => `${id}-${size}`;

  // Helper function to find cart item by id and size
  const findCartItem = (cart: CartItem[], id: string, size: string): CartItem | undefined => {
    return cart.find((item) => item.id === id && item.selectedSize === size);
  };

  // Helper function to get items by category
  const getItemsByCategory = (cart: CartItem[], category: string): CartItem[] => {
    return cart.filter((item) => item.category === category);
  };

  const store: CartStore = {
    get cart() {
      return getState().cart;
    },

    get selectedItems() {
      return getState().selectedItems;
    },

    addToCart: (product: Product, quantity: number, selectedSize: string) => {
      const currentCart = getState().cart;
      const existingItem = findCartItem(currentCart, product.id, selectedSize);

      if (existingItem) {
        // If item with same id and size exists, increase quantity
        setState({
          cart: currentCart.map((item) => (item.id === product.id && item.selectedSize === selectedSize ? { ...item, quantity: item.quantity + quantity } : item)),
        });
      } else {
        // Add new item to cart with default selection state
        const newItem: CartItem = {
          ...product,
          quantity,
          selectedSize,
          isSelected: false,
          category: product.category || "uncategorized",
        };

        setState({
          cart: [...currentCart, newItem],
        });
      }
    },

    updateQuantity: (id: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        store.removeFromCart(id, size);
        return;
      }

      const currentCart = getState().cart;
      setState({
        cart: currentCart.map((item) => (item.id === id && item.selectedSize === size ? { ...item, quantity } : item)),
      });
    },

    removeFromCart: (id: string, size: string) => {
      const currentCart = getState().cart;
      const currentSelected = getState().selectedItems;
      const itemKey = getItemKey(id, size);

      // Remove from selection if selected
      const newSelected = new Set(currentSelected);
      newSelected.delete(itemKey);

      setState({
        cart: currentCart.filter((item) => !(item.id === id && item.selectedSize === size)),
        selectedItems: newSelected,
      });
    },

    clearCart: () => {
      setState({ cart: [], selectedItems: new Set() });
    },

    getCartTotal: () => {
      return getState().cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    getCartItemCount: () => {
      return getState().cart.reduce((count, item) => count + item.quantity, 0);
    },

    getCartItemByProduct: () => {
      return getState().cart.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)).length;
    },

    loadCart: () => {
      const savedCart = getLocalStorage<CartItem[]>(CART_STORAGE_KEY);
      const savedSelection = getLocalStorage<string[]>(SELECTION_STORAGE_KEY);

      if (savedCart && Array.isArray(savedCart)) {
        const cartWithSelection = savedCart.map((item) => ({
          ...item,
          isSelected: false,
          category: item.category,
        }));

        const selectedSet = savedSelection && Array.isArray(savedSelection) ? new Set(savedSelection) : new Set<string>();

        setState({
          cart: cartWithSelection,
          selectedItems: selectedSet,
        });
      }
    },

    // Selection methods
    toggleItemSelection: (id: string, size: string) => {
      const currentSelected = getState().selectedItems;
      const itemKey = getItemKey(id, size);
      const newSelected = new Set(currentSelected);

      if (newSelected.has(itemKey)) {
        newSelected.delete(itemKey);
      } else {
        newSelected.add(itemKey);
      }

      setState({
        selectedItems: newSelected,
      });
    },

    toggleCategorySelection: (category: string) => {
      const currentCart = getState().cart;
      const currentSelected = getState().selectedItems;
      const categoryItems = getItemsByCategory(currentCart, category);
      const newSelected = new Set(currentSelected);

      // Check if all items in category are selected
      const allCategorySelected = categoryItems.every((item) => newSelected.has(getItemKey(item.id, item.selectedSize)));

      if (allCategorySelected) {
        // Deselect all items in category
        categoryItems.forEach((item) => {
          newSelected.delete(getItemKey(item.id, item.selectedSize));
        });
      } else {
        // Select all items in category
        categoryItems.forEach((item) => {
          newSelected.add(getItemKey(item.id, item.selectedSize));
        });
      }

      setState({
        selectedItems: newSelected,
      });
    },

    selectAllItems: () => {
      const currentCart = getState().cart;
      const allItemKeys = currentCart.map((item) => getItemKey(item.id, item.selectedSize));

      setState({
        selectedItems: new Set(allItemKeys),
      });
    },

    deselectAllItems: () => {
      setState({
        selectedItems: new Set<string>(),
      });
    },

    getSelectedItems: () => {
      const currentCart = getState().cart;
      const currentSelected = getState().selectedItems;

      return currentCart.filter((item) => currentSelected.has(getItemKey(item.id, item.selectedSize)));
    },

    getSelectedTotal: () => {
      return store.getSelectedItems().reduce((total, item) => total + item.price * item.quantity, 0);
    },

    getSelectedCount: () => {
      return store.getSelectedItems().reduce((count, item) => count + item.quantity, 0);
    },

    isCategorySelected: (category: string) => {
      const currentCart = getState().cart;
      const currentSelected = getState().selectedItems;
      const categoryItems = getItemsByCategory(currentCart, category);

      if (categoryItems.length === 0) return false;

      return categoryItems.every((item) => currentSelected.has(getItemKey(item.id, item.selectedSize)));
    },

    isCategoryPartiallySelected: (category: string) => {
      const currentCart = getState().cart;
      const currentSelected = getState().selectedItems;
      const categoryItems = getItemsByCategory(currentCart, category);

      if (categoryItems.length === 0) return false;

      const selectedInCategory = categoryItems.filter((item) => currentSelected.has(getItemKey(item.id, item.selectedSize)));

      return selectedInCategory.length > 0 && selectedInCategory.length < categoryItems.length;
    },

    removeSelectedItems: () => {
      const currentCart = getState().cart;
      const currentSelected = getState().selectedItems;

      const remainingItems = currentCart.filter((item) => !currentSelected.has(getItemKey(item.id, item.selectedSize)));

      setState({
        cart: remainingItems,
        selectedItems: new Set<string>(),
      });
    },
  };

  return { store, subscribe };
};

const { store: cartStore, subscribe } = createCartStore();

export const useCartStore = () => {
  const [, forceUpdate] = useState<Record<string, never>>({});

  useEffect(() => {
    cartStore.loadCart();

    const unsubscribe = subscribe(() => {
      forceUpdate({});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return cartStore;
};
