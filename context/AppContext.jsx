'use client';
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
}

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isBem, setIsBem] = useState(false);  // New state for BEM role
  const [isKantek, setIsKantek] = useState(false);
  const [isKandok, setIsKandok] = useState(false);
  const [isKantel, setIsKantel] = useState(false);
  const [isKansip, setIsKansip] = useState(false);
  const [isBerkah, setIsBerkah] = useState(false);
  const [isKantintn, setIsKantintn] = useState(false);
  const [isTaniamart, setIsTaniamart] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [bankSampahData, setBankSampahData] = useState([]);

  // Fetch Bank Sampah data
  const fetchBankSampahData = async () => {
    try {
      const { data } = await axios.get('/api/bank-sampah/get');
      if (data.success) {
        setBankSampahData(data.bankSampah);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching Bank Sampah data', error);
    }
  };

  // Fetch Product Data
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === 'seller') {
        setIsSeller(true);
      }
      if (user?.publicMetadata?.role === 'bem') {
        setIsBem(true);
      }
      if (user?.publicMetadata?.role === 'kantek') {
        setIsKantek(true);
      }
      if (user?.publicMetadata?.role === 'kandok') {
        setIsKandok(true);
      }
      if (user?.publicMetadata?.role === 'kantel') {
        setIsKantel(true);
      }
      if (user?.publicMetadata?.role === 'kansip') {
        setIsKansip(true);
      }
      if (user?.publicMetadata?.role === 'kantintn') {
        setIsKantintn(true);
      }
      if (user?.publicMetadata?.role === 'berkah') {
        setIsBerkah(true);
      }
      if (user?.publicMetadata?.role === 'taniamart') {
        setIsTaniamart(true);
      }

      const token = await getToken();

      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user?.cartItems ?? {}); // <--- pake safe access dan fallback
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  // Add item to cart
  const addToCart = async (itemId) => {
    if (!user) {
      return toast('Please login', {
        icon: '⚠️',
      });
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Item added to cart');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Cart Updated');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Get total cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  // Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      // Check if itemInfo is found before accessing offerPrice
      if (itemInfo && itemInfo.offerPrice) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      } else {
        console.warn(`Product not found or missing offerPrice for item: ${items}`);
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Fetch necessary data on component mount
  useEffect(() => {
    fetchProductData();
    fetchBankSampahData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user, getToken, currency, router,
    isSeller, setIsSeller,
    isBem, setIsBem,
    isKantek, setIsKantek,
    isKandok, setIsKandok,
    isKantel, setIsKantel,
    isKansip, setIsKansip,
    isBerkah, setIsBerkah,
    isKantintn, setIsKantintn,
    isTaniamart, setIsTaniamart,
  userData, fetchUserData,
  products, fetchProductData,
  cartItems, setCartItems,
  addToCart, updateCartQuantity,
  getCartCount, getCartAmount,
  bankSampahData, fetchBankSampahData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
