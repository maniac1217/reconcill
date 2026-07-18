import React, { useState, useEffect } from 'react';
import { Product, CartItem, DepositOrder, AppView, SmsLog, BankAccount, Category, Banner } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data';
import CustomerPanel from './components/CustomerPanel';
import AdminPanel from './components/AdminPanel';
import { ShieldCheck, UserCheck, LayoutGrid, Info, MessageSquare, Send, Bell } from 'lucide-react';

export default function App() {
  // Global States (synchronized to localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('luminous_products');
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const local = localStorage.getItem('luminous_categories');
    return local ? JSON.parse(local) : [
      { id: 'electronics', label: '전자기기', icon: '📱' },
      { id: 'fashion', label: '의류잡화', icon: '🧥' },
      { id: 'home', label: '인테리어', icon: '🛋️' },
      { id: 'beauty', label: '뷰티케어', icon: '💄' }
    ];
  });

  const [orders, setOrders] = useState<DepositOrder[]>(() => {
    const local = localStorage.getItem('luminous_orders');
    return local ? JSON.parse(local) : INITIAL_ORDERS;
  });

  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(() => {
    const local = localStorage.getItem('luminous_sms_logs');
    return local ? JSON.parse(local) : [];
  });

  const [bankAccount, setBankAccount] = useState<BankAccount>(() => {
    const local = localStorage.getItem('luminous_bank_account');
    return local ? JSON.parse(local) : {
      bankName: '하나은행 (Hana Bank)',
      accountNumber: '123-456-7890-12',
      holderName: '(주) 인디고'
    };
  });

  const [banner, setBanner] = useState<Banner>(() => {
    const local = localStorage.getItem('luminous_banner');
    return local ? JSON.parse(local) : {
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpwbowHKPauFkNlqJKToudemD6e6F_ES36UjWYoHV7nj1xWfPVvdCfqKlvDnIj2Ct5y6lUvlrLHjMQcUgc693KKMUdFZugV9UaCelH65bNBTEP4tJua9unmG6JcbLKTVnNMXerffVaRjZ5Gg9WB_PFE-fYOeHScQnhN6owkuXTTwVQSCuaJzx8G7LX-uwTPzPIPLxsgTo6TBzi19DzIjJkMXxTnXhSOYOIYfC2JNusRQy9XW7Y-JzT',
      phrase: '일상의 질을 높이는 에센셜 컬렉션'
    };
  });

  const [activeSmsAlert, setActiveSmsAlert] = useState<{
    id: string;
    sender: string;
    receiver: string;
    message: string;
    timestamp: string;
  } | null>(null);


  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('luminous_cart');
    return local ? JSON.parse(local) : [
      {
        product: INITIAL_PRODUCTS[0], // Premium headphones
        quantity: 1,
        selectedColor: 'Black'
      },
      {
        product: INITIAL_PRODUCTS[1], // Ceramic vase
        quantity: 1,
        selectedColor: 'White'
      }
    ];
  });

  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<DepositOrder | null>(null);
  const [showTourHelper, setShowTourHover] = useState<boolean>(false);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('luminous_admin_auth') === 'true';
  });
  const [pendingAdminView, setPendingAdminView] = useState<AppView | null>(null);

  // Load initial data from the backend APIs on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodRes, catRes, orderRes, smsRes, bankRes, bannerRes] = await Promise.all([
          fetch('/api/products').then(res => res.json()),
          fetch('/api/categories').then(res => res.json()),
          fetch('/api/orders').then(res => res.json()),
          fetch('/api/sms-logs').then(res => res.json()),
          fetch('/api/bank-account').then(res => res.json()),
          fetch('/api/banner').then(res => res.json())
        ]);
        
        if (Array.isArray(prodRes)) setProducts(prodRes);
        if (Array.isArray(catRes)) setCategories(catRes);
        if (Array.isArray(orderRes)) setOrders(orderRes);
        if (Array.isArray(smsRes)) setSmsLogs(smsRes);
        if (bankRes && bankRes.bankName) setBankAccount(bankRes);
        if (bannerRes && bannerRes.phrase) setBanner(bannerRes);
      } catch (err) {
        console.warn('Backend API connection failed, using local storage fallback:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Sync banner back to LocalStorage
  useEffect(() => {
    localStorage.setItem('luminous_banner', JSON.stringify(banner));
  }, [banner]);

  // Sync cart back to LocalStorage (Cart remains client-side)
  useEffect(() => {
    localStorage.setItem('luminous_cart', JSON.stringify(cart));
  }, [cart]);

  // Operations synchronized to backend
  const handleAddProduct = async (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
    } catch (err) {
      console.error('Failed to sync new product to backend:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: DepositOrder['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    }));
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to update order status on backend:', err);
    }
  };

  const handleAddCart = (newItem: CartItem) => {
    const existingIdx = cart.findIndex(
      item => item.product.id === newItem.product.id && item.selectedColor === newItem.selectedColor
    );
    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += newItem.quantity;
      setCart(updated);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const handleUpdateCartQty = (idx: number, change: number) => {
    const updated = [...cart];
    updated[idx].quantity += change;
    setCart(updated);
  };

  const handleRemoveCart = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (
    depositorName: string, 
    amount: number, 
    items: CartItem[], 
    shippingAddress?: { receiver: string; phone: string; address: string }
  ) => {
    const newOrder: DepositOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }),
      depositorName,
      amount,
      bankName: bankAccount.bankName,
      status: 'PENDING',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      items,
      shippingAddress: shippingAddress || {
        receiver: depositorName,
        phone: '010-1234-5678',
        address: '서울특별시 강남구 테헤란로 123 (역삼동) INDIGO 타워 18층'
      }
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send simulated automatic SMS notification: "000씨로 부터 신규주문이 있습니다" to 01099901806
    const smsMessage = `${depositorName}씨로 부터 신규주문이 있습니다`;
    const newSmsLog: SmsLog = {
      id: `SMS-${Math.floor(100000 + Math.random() * 900000)}`,
      sender: 'Luminous 쇼핑몰',
      receiver: '010-9990-1806',
      message: smsMessage,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      status: 'SUCCESS'
    };

    setSmsLogs(prev => [newSmsLog, ...prev]);
    setActiveSmsAlert({
      id: newSmsLog.id,
      sender: newSmsLog.sender,
      receiver: newSmsLog.receiver,
      message: newSmsLog.message,
      timestamp: newSmsLog.timestamp
    });

    // Auto-dismiss notification after 7 seconds
    setTimeout(() => {
      setActiveSmsAlert(null);
    }, 7000);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      await fetch('/api/sms-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSmsLog)
      });
    } catch (err) {
      console.error('Failed to sync order and SMS to backend:', err);
    }
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    handleSetView('PRODUCT_DETAIL');
  };

  const handleToggleProductSuspend = async (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, isSuspended: !p.isSuspended };
      }
      return p;
    }));
    try {
      await fetch(`/api/products/${productId}/suspend`, {
        method: 'PUT'
      });
    } catch (err) {
      console.error('Failed to toggle product suspension on backend:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete product on backend:', err);
    }
  };

  const handleUpdateProductCategory = async (productId: string, category: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, category };
      }
      return p;
    }));
    try {
      await fetch(`/api/products/${productId}/category`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
    } catch (err) {
      console.error('Failed to update product category on backend:', err);
    }
  };

  const handleAddCategory = async (newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
    } catch (err) {
      console.error('Failed to add category on backend:', err);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    try {
      await fetch(`/api/categories/${catId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete category on backend:', err);
    }
  };

  const handleUpdateBankAccount = async (bank: BankAccount) => {
    setBankAccount(bank);
    try {
      await fetch('/api/bank-account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bank)
      });
    } catch (err) {
      console.error('Failed to update bank account on backend:', err);
    }
  };

  const handleUpdateBanner = async (newBanner: Banner) => {
    setBanner(newBanner);
    try {
      await fetch('/api/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
    } catch (err) {
      console.error('Failed to update banner on backend:', err);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('luminous_admin_auth', 'true');
    if (pendingAdminView) {
      setCurrentView(pendingAdminView);
      setPendingAdminView(null);
    } else {
      setCurrentView('ADMIN_DASHBOARD');
    }
  };

  // Safe navigation with auth verification
  const handleSetView = (view: AppView) => {
    const adminViews = ['ADMIN_DASHBOARD', 'ADMIN_DEPOSIT', 'ADMIN_PRODUCT_REG', 'ADMIN_LOGIN'];
    const currentIsAdmin = adminViews.includes(currentView);
    const targetIsAdmin = adminViews.includes(view);

    // Transitioning from customer screen into admin screen -> always clear session & require PIN
    if (targetIsAdmin && !currentIsAdmin) {
      setIsAdminAuthenticated(false);
      localStorage.removeItem('luminous_admin_auth');
      setPendingAdminView(view === 'ADMIN_LOGIN' ? 'ADMIN_DASHBOARD' : view);
      setCurrentView('ADMIN_LOGIN');
      return;
    }

    if (adminViews.includes(view) && view !== 'ADMIN_LOGIN') {
      if (!isAdminAuthenticated) {
        setPendingAdminView(view);
        setCurrentView('ADMIN_LOGIN');
        return;
      }
    }
    setCurrentView(view);
  };

  // Check if view is admin mode
  const isAdminView = ['ADMIN_LOGIN', 'ADMIN_DASHBOARD', 'ADMIN_DEPOSIT', 'ADMIN_PRODUCT_REG'].includes(currentView);

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans antialiased text-[#191c1e] select-none relative">
      {/* Real-time Simulated SMS Push Notification */}
      {activeSmsAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-bounce">
          <div className="bg-black/95 backdrop-blur-md border border-white/10 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3525cd] to-[#4f46e5] flex items-center justify-center text-white shrink-0 text-lg shadow-inner">
              💬
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#dae2fd] uppercase tracking-wider">SMS 자동 전송</span>
                <span className="text-[10px] text-gray-400 font-mono">{activeSmsAlert.timestamp}</span>
              </div>
              <h4 className="text-xs font-extrabold text-white mt-0.5">수신번호: {activeSmsAlert.receiver}</h4>
              <p className="text-xs text-gray-200 mt-1.5 leading-relaxed bg-white/5 border border-white/5 rounded-lg p-2 font-medium">
                {activeSmsAlert.message}
              </p>
            </div>
            <button 
              onClick={() => setActiveSmsAlert(null)}
              className="text-gray-400 hover:text-white text-xs font-bold leading-none self-start p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Render based on view status */}
      {isAdminView ? (
        <AdminPanel 
          products={products}
          orders={orders}
          smsLogs={smsLogs}
          bankAccount={bankAccount}
          categories={categories}
          banner={banner}
          onUpdateBankAccount={handleUpdateBankAccount}
          onUpdateBanner={handleUpdateBanner}
          onAddProduct={handleAddProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          currentView={currentView}
          setCurrentView={handleSetView}
          onNavigateToOrder={(order) => {
            setCurrentOrder(order);
            handleSetView('ORDER_DETAIL');
          }}
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onToggleProductSuspend={handleToggleProductSuspend}
          onDeleteProduct={handleDeleteProduct}
          onUpdateProductCategory={handleUpdateProductCategory}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      ) : (
        <CustomerPanel 
          products={products}
          cart={cart}
          orders={orders}
          bankAccount={bankAccount}
          categories={categories}
          banner={banner}
          onAddCart={handleAddCart}
          onUpdateCartQty={handleUpdateCartQty}
          onRemoveCart={handleRemoveCart}
          onClearCart={handleClearCart}
          onPlaceOrder={handlePlaceOrder}
          currentView={currentView}
          setCurrentView={handleSetView}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onSelectProduct={handleSelectProduct}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
        />
      )}

      {/* Elegant Floating Tour Switcher Card for review testing - Hidden in Admin View */}
      {!isAdminView && (
        <div className="fixed bottom-18 left-4 z-50 max-w-[280px]">
          {showTourHelper ? (
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#c7c4d8]/60 shadow-xl space-y-3 animate-fade-in text-xs">
              <div className="flex justify-between items-center">
                <span className="font-black text-[#3525cd] flex items-center gap-1">
                  <LayoutGrid className="w-4 h-4" />
                  화면 이동 가이드 (13개 뷰)
                </span>
                <button 
                  onClick={() => setShowTourHover(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold px-1"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-[10px] text-[#464555] leading-relaxed">
                요청하신 디자인 시안의 **모든 화면(사용자/어드민 총 13개 뷰)**을 즉석에서 자유롭게 전환하며 체험할 수 있는 툴바입니다.
              </p>

              {/* Quick switcher buttons */}
              <div className="space-y-1.5 pt-1.5 border-t">
                <div className="text-[10px] font-bold text-[#777587]">쇼핑몰 고객 모드 (User)</div>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <button onClick={() => { setSelectedProduct(null); handleSetView('HOME'); }} className={`py-1 rounded text-center border font-bold ${currentView === 'HOME' ? 'bg-[#3525cd] text-white' : 'bg-gray-50'}`}>
                    메인 홈
                  </button>
                  <button onClick={() => { setSelectedProduct(null); handleSetView('SHOP'); }} className={`py-1 rounded text-center border font-bold ${currentView === 'SHOP' ? 'bg-[#3525cd] text-white' : 'bg-gray-50'}`}>
                    목록 및 필터
                  </button>
                  <button onClick={() => handleSelectProduct(products[0])} className={`py-1 rounded text-center border font-bold ${currentView === 'PRODUCT_DETAIL' ? 'bg-[#3525cd] text-white' : 'bg-gray-50'}`}>
                    상세 페이지
                  </button>
                  <button onClick={() => handleSetView('CART')} className={`py-1 rounded text-center border font-bold ${currentView === 'CART' ? 'bg-[#3525cd] text-white' : 'bg-gray-50'}`}>
                    장바구니
                  </button>
                  <button onClick={() => handleSetView('CHECKOUT')} className={`py-1 rounded text-center border font-bold ${currentView === 'CHECKOUT' ? 'bg-[#3525cd] text-white' : 'bg-gray-50'}`}>
                    입금 결제하기
                  </button>
                  <button onClick={() => handleSetView('MYPAGE')} className={`py-1 rounded text-center border font-bold ${currentView === 'MYPAGE' ? 'bg-[#3525cd] text-white' : 'bg-gray-50'}`}>
                    마이페이지
                  </button>
                </div>

                <div className="pt-2 border-t mt-1.5 text-center">
                  <p className="text-[10px] text-[#464555] font-semibold leading-relaxed">
                    🔒 <span className="font-bold text-[#3525cd]">관리자 및 판매자 모드</span>는<br />
                    휴대폰 최하단 바의 <span className="font-bold bg-[#dae2fd] text-[#3323cc] px-1 rounded">Admin (⚙️)</span> 버튼을 눌러<br />
                    접속하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowTourHover(true)}
              className="bg-[#3525cd] text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all font-bold text-xs"
              title="화면 가이드 열기 (도움말)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>도움말 (가이드)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

