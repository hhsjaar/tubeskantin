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
  const [isBem, setIsBem] = useState(false);
  const [isKantek, setIsKantek] = useState(false);
  const [isKandok, setIsKandok] = useState(false);
  const [isKantel, setIsKantel] = useState(false);
  const [isKansip, setIsKansip] = useState(false);
  const [isBerkah, setIsBerkah] = useState(false);
  const [isKantintn, setIsKantintn] = useState(false);
  const [isTaniamart, setIsTaniamart] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [bankSampahData, setBankSampahData] = useState([]);

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

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Gagal memuat data produk");
    }
  };

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
        setCartItems(data.user?.cartItems ?? {});
      } else {
        toast.error("Gagal memuat data pengguna");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data pengguna");
    }
  };

  const addToCart = async (itemId) => {
    if (!user) {
      return toast('Silakan login terlebih dahulu', {
        icon: '⚠️',
      });
    }

    // Cek apakah produk tersedia
    const product = products.find(p => p._id === itemId);
    if (product && product.isAvailable === false) {
      return toast.error('Produk ini tidak tersedia saat ini');
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
        toast.success('Produk berhasil ditambahkan ke keranjang');
      } catch (error) {
        toast.error("Gagal menambahkan ke keranjang");
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    // Jika kuantitas 0, hapus dari keranjang
    if (quantity === 0) {
      let cartData = structuredClone(cartItems);
      delete cartData[itemId];
      setCartItems(cartData);
      if (user) {
        try {
          const token = await getToken();
          await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Produk berhasil dihapus dari keranjang');
        } catch (error) {
          toast.error("Gagal memperbarui keranjang");
        }
      }
      return;
    }

    // Cek apakah produk tersedia jika menambah kuantitas
    const product = products.find(p => p._id === itemId);
    if (product && product.isAvailable === false) {
      return toast.error('Produk ini tidak tersedia saat ini');
    }

    // Update kuantitas
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Keranjang berhasil diperbarui');
      } catch (error) {
        toast.error("Gagal memperbarui keranjang");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      // Cek apakah produk tersedia
      const itemInfo = products.find((product) => product._id === items);
      
      // Hanya hitung produk yang tersedia (isAvailable !== false) dan kuantitas > 0
      if (cartItems[items] > 0 && itemInfo && itemInfo.isAvailable !== false) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      // Hanya hitung produk yang tersedia (isAvailable !== false)
      if (itemInfo && itemInfo.offerPrice && itemInfo.isAvailable !== false) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      } else if (!itemInfo || !itemInfo.offerPrice) {
        console.warn(`Produk tidak ditemukan atau harga tidak tersedia untuk item: ${items}`);
      }
      // Jika produk tidak tersedia, tidak dihitung dalam total
    }
    return Math.floor(totalAmount * 100) / 100;
  };

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
