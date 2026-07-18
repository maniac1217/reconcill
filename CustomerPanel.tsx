import React, { useState } from 'react';
import { Product, CartItem, DepositOrder, AppView, BankAccount, Category, Banner } from '../types';
import { 
  ShoppingBag, Search, Heart, Plus, Minus, X, Check, Copy, User, ChevronRight, MapPin, 
  Truck, ArrowLeft, Star, Volume2, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle 
} from 'lucide-react';

interface CustomerPanelProps {
  products: Product[];
  cart: CartItem[];
  orders: DepositOrder[];
  bankAccount: BankAccount;
  categories: Category[];
  banner: Banner;
  onAddCart: (item: CartItem) => void;
  onUpdateCartQty: (idx: number, change: number) => void;
  onRemoveCart: (idx: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (
    depositorName: string, 
    amount: number, 
    items: CartItem[], 
    shippingAddress?: { receiver: string; phone: string; address: string }
  ) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  onSelectProduct: (prod: Product) => void;
  currentOrder: DepositOrder | null;
  setCurrentOrder: (order: DepositOrder | null) => void;
}

export default function CustomerPanel({
  products,
  cart,
  orders,
  bankAccount,
  categories,
  banner,
  onAddCart,
  onUpdateCartQty,
  onRemoveCart,
  onClearCart,
  onPlaceOrder,
  currentView,
  setCurrentView,
  selectedProduct,
  setSelectedProduct,
  onSelectProduct,
  currentOrder,
  setCurrentOrder
}: CustomerPanelProps) {
  // Shared search & filter
  const myOrders = orders.filter(o => o.depositorName === '홍길동' || o.shippingAddress.receiver === '홍길동');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('Black');

  // Checkout states
  const [depositorName, setDepositorName] = useState<string>('홍길동');
  const [receiverName, setReceiverName] = useState<string>('홍길동');
  const [phoneNumber, setPhoneNumber] = useState<string>('010-1234-5678');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('서울특별시 강남구 테헤란로 123 (역삼동) INDIGO 타워 18층');
  const [checkoutStep, setCheckoutStep] = useState<number>(2); // 2: Payment info
  const [isCheckoutShake, setIsCheckoutStepShake] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(['prod-1', 'prod-3']);

  const toggleFavorite = (prodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(prodId)) {
      setFavorites(favorites.filter(id => id !== prodId));
    } else {
      setFavorites([...favorites, prodId]);
    }
  };

  const isFavorite = (prodId: string) => favorites.includes(prodId);

  // Copy Account number logic
  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankAccount.accountNumber);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Filter products based on search & category
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Totals calculations
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.product.price;
    const discountFactor = item.product.discount ? (100 - item.product.discount) / 100 : 1;
    return acc + (price * discountFactor) * item.quantity;
  }, 0);
  const cartShippingFee = cartSubtotal >= 100000 || cartSubtotal === 0 ? 0 : 3000;
  const cartTotal = cartSubtotal + cartShippingFee;

  const handleCheckoutSubmit = () => {
    if (!depositorName.trim() || !receiverName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setIsCheckoutStepShake(true);
      setTimeout(() => setIsCheckoutStepShake(false), 500);
      return;
    }
    // Success ordering
    onPlaceOrder(depositorName, cartTotal, [...cart], {
      receiver: receiverName.trim(),
      phone: phoneNumber.trim(),
      address: deliveryAddress.trim()
    });
    setDepositorName('');
    onClearCart();
    
    // Auto navigate to completed state in MyPage
    setCurrentView('MYPAGE');
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-[calc(100vh-56px)] pb-24">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-[#eceef0] flex items-center justify-between px-5 h-14 w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          {currentView !== 'HOME' && (
            <button 
              onClick={() => {
                if (currentView === 'PRODUCT_DETAIL') setCurrentView('SHOP');
                else if (currentView === 'CHECKOUT') setCurrentView('CART');
                else if (currentView === 'ORDER_DETAIL') setCurrentView('MYPAGE');
                else setCurrentView('HOME');
              }}
              className="p-1 hover:bg-[#eceef0] rounded-full active:scale-95 duration-150 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#3525cd]" />
            </button>
          )}
          <h1 className="text-xl font-black text-[#3525cd] tracking-tight font-headline-lg-mobile">
            {currentView === 'HOME' ? 'Luminous' : 'INDIGO'}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentView('CART')}
            className="p-2 text-[#3525cd] hover:bg-[#eceef0] transition-colors rounded-full active:scale-95 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#ba1a1a] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="pt-14">
        {/* VIEW 1: HOME */}
        {currentView === 'HOME' && (
          <div className="space-y-6 animate-fade-in p-5 max-w-xl mx-auto">
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
              <input 
                type="text" 
                placeholder="어떤 상품을 찾으시나요?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentView('SHOP');
                }}
                className="w-full h-12 pl-11 pr-4 bg-white border border-[#c7c4d8] rounded-xl text-sm focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none transition-all"
              />
            </div>

            {/* Premium Hero Banner */}
            <div 
              onClick={() => setCurrentView('SHOP')}
              className="relative overflow-hidden rounded-2xl bg-[#4f46e5] h-64 flex flex-col justify-end p-6 group cursor-pointer shadow-md"
            >
              <div 
                className="absolute inset-0 z-0 opacity-75 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${banner.imageUrl}')` }}
              ></div>
              <div className="relative z-10 space-y-2 max-w-[85%] text-white">
                <span className="inline-block px-3 py-1 bg-white text-[#3525cd] font-bold text-[9px] rounded-full uppercase tracking-wider">
                  New Arrivals
                </span>
                <h2 className="text-xl font-bold leading-tight font-headline-lg-mobile text-[#eff1f3]">
                  {banner.phrase}
                </h2>
                <button className="bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all">
                  지금 구경하기
                </button>
              </div>
            </div>

            {/* Quick Categories */}
            <section className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#191c1e]">카테고리</h3>
                <button onClick={() => { setSelectedCategory('all'); setCurrentView('SHOP'); }} className="text-xs text-[#3525cd] font-semibold">전체보기</button>
              </div>
              <div className="flex overflow-x-auto gap-4 py-2 hide-scrollbar">
                {[
                  { id: 'all', label: '전체', icon: '✨' },
                  ...categories
                ].map((cat) => (
                  <div 
                    key={cat.id} 
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView('SHOP');
                    }}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-white border border-[#eceef0] flex items-center justify-center text-xl transition-all shadow-sm group-hover:scale-105 active:scale-95">
                      {cat.icon || '📁'}
                    </div>
                    <span className="text-[10px] font-bold text-[#464555]">{cat.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-[#191c1e]">추천 인기 상품</h3>
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((prod) => (
                  <div 
                    key={prod.id} 
                    onClick={() => onSelectProduct(prod)}
                    className="flex flex-col group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl bg-[#f2f4f6] overflow-hidden mb-2.5 border border-[#eceef0]">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${prod.isSuspended ? 'opacity-40 grayscale' : ''}`}
                      />
                      {prod.isSuspended && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <span className="bg-[#ba1a1a] text-white font-extrabold text-[10px] px-2 py-1 rounded-lg shadow-md border border-[#ffdad6]/20">
                            판매중지
                          </span>
                        </div>
                      )}
                      <button 
                        onClick={(e) => toggleFavorite(prod.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm z-10"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isFavorite(prod.id) ? 'fill-[#ba1a1a] text-[#ba1a1a]' : 'text-[#464555]'}`} />
                      </button>
                    </div>
                    <div className="space-y-1 px-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[#777587]">
                        {categories.find(c => c.id === prod.category)?.label || prod.category}
                      </p>
                      <h4 className="text-xs font-bold text-[#191c1e] line-clamp-1">{prod.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#3525cd]">₩{prod.price.toLocaleString()}</span>
                        <button 
                          disabled={prod.isSuspended}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (prod.isSuspended) {
                              alert('판매 중지된 상품입니다.');
                              return;
                            }
                            onAddCart({ product: prod, quantity: 1, selectedColor: 'Black' });
                            alert('장바구니에 상품을 추가하였습니다.');
                          }}
                          className={`w-7 h-7 rounded-full text-white flex items-center justify-center active:scale-90 transition-transform shadow-sm ${
                            prod.isSuspended ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3525cd] hover:bg-[#4f46e5]'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SHOP (상품목록 및 필터 / 검색 결과 없음 대응) */}
        {currentView === 'SHOP' && (
          <div className="animate-fade-in p-5 max-w-xl mx-auto space-y-5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
              <input 
                type="text" 
                placeholder="원하시는 키워드로 검색해 보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-white border border-[#c7c4d8] rounded-xl text-sm focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none"
              />
            </div>

            {/* Filter chips horizontal list */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
              {[
                { id: 'all', label: '전체' },
                ...categories.map(c => ({ id: c.id, label: `${c.icon || '📁'} ${c.label}` }))
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    selectedCategory === cat.id 
                      ? 'bg-[#3525cd] text-white' 
                      : 'bg-white border border-[#c7c4d8] text-[#464555] hover:bg-[#eceef0]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {(searchQuery || selectedCategory !== 'all') && (
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-red-100 transition-colors"
                >
                  초기화 ↺
                </button>
              )}
            </div>

            {/* Result Header */}
            <div className="text-xs font-bold text-[#464555] pb-2 border-b">
              총 <span className="text-[#3525cd]">{filteredProducts.length}</span>개의 상품이 준비되어 있습니다.
            </div>

            {/* No Results Handling */}
            {filteredProducts.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto animate-fade-in">
                <div className="w-48 h-48 flex items-center justify-center bg-[#f2f4f6] rounded-3xl border border-[#eceef0] relative mb-6">
                  <div className="absolute -inset-4 bg-[#3525cd]/5 rounded-full blur-2xl"></div>
                  <div className="text-center text-[#777587]/30 select-none">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-2 text-[#3525cd]/20" />
                    <span className="text-xs font-bold text-[#464555]/40 block">검색 결과 없음</span>
                  </div>
                </div>
                <h3 className="text-md font-bold text-[#191c1e] mb-2">검색 결과가 없습니다</h3>
                <p className="text-xs text-[#464555] leading-relaxed mb-6">
                  입력하신 키워드 <span className="font-bold text-[#3525cd]">"{searchQuery}"</span> 또는 선택하신 카테고리와 일치하는 상품이 현재 존재하지 않습니다.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="w-full py-3 bg-[#3525cd] text-white rounded-xl font-bold text-xs hover:bg-[#4f46e5] transition-all shadow-md"
                  >
                    모든 필터 초기화
                  </button>
                </div>

                {/* Recommendations on empty state */}
                <div className="w-full mt-10 space-y-4">
                  <h4 className="text-xs font-bold text-[#191c1e] text-left">이런 상품은 어떠세요?</h4>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    {products.filter(p => !p.isSuspended).slice(0, 2).map((prod) => (
                      <div 
                        key={prod.id} 
                        onClick={() => onSelectProduct(prod)}
                        className="bg-white border border-[#eceef0] p-3 rounded-xl cursor-pointer"
                      >
                        <img src={prod.image} alt={prod.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                        <h5 className="text-[11px] font-bold truncate text-[#191c1e]">{prod.name}</h5>
                        <p className="text-xs font-black text-[#3525cd] mt-1">₩{prod.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {filteredProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    onClick={() => onSelectProduct(prod)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#f2f4f6] mb-2.5 border border-[#eceef0] group-hover:shadow-md transition-shadow">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${prod.isSuspended ? 'opacity-40 grayscale' : ''}`}
                      />
                      {prod.isSuspended && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <span className="bg-[#ba1a1a] text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-md border border-[#ffdad6]/20">
                            판매중지
                          </span>
                        </div>
                      )}
                      {prod.discount && !prod.isSuspended && (
                        <div className="absolute bottom-3 left-3 bg-[#ba1a1a] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
                          -{prod.discount}%
                        </div>
                      )}
                      <button 
                        onClick={(e) => toggleFavorite(prod.id, e)}
                        className="absolute top-3 right-3 w-8.5 h-8.5 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#464555] z-10"
                      >
                        <Heart className={`w-4.5 h-4.5 transition-colors ${isFavorite(prod.id) ? 'fill-[#ba1a1a] text-[#ba1a1a]' : 'text-[#464555]'}`} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-0.5 px-1">
                      <div className="flex items-center gap-1.5 justify-between">
                        <h3 className="text-xs text-[#464555] truncate">{prod.name}</h3>
                        {prod.isSuspended && (
                          <span className="text-[9px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1 rounded shrink-0">
                            판매중지
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-extrabold text-xs text-[#3525cd]">₩{prod.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PRODUCT_DETAIL (상품상세) */}
        {currentView === 'PRODUCT_DETAIL' && selectedProduct && (
          <div className="animate-fade-in pb-12 max-w-xl mx-auto">
            {/* Gallery Images with Dots */}
            <div className="relative bg-[#f2f4f6] h-96 flex items-center justify-center">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="max-h-full max-w-full object-contain p-6"
              />
              <button 
                onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-md text-[#464555]"
              >
                <Heart className={`w-5 h-5 transition-colors ${isFavorite(selectedProduct.id) ? 'fill-[#ba1a1a] text-[#ba1a1a]' : ''}`} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                <span className="w-5 h-1.5 bg-[#3525cd] rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-[#c7c4d8] rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-[#c7c4d8] rounded-full"></span>
              </div>
            </div>

            {/* Product description details */}
            <div className="px-5 mt-6 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[#ba1a1a]">
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5" />
                  <span className="text-xs text-[#464555] font-semibold ml-1">(452 Reviews)</span>
                </div>
                <h2 className="text-lg font-bold text-[#191c1e] tracking-tight mt-1">{selectedProduct.name}</h2>
                <div className="text-xl font-black text-[#3525cd] mt-2">₩{selectedProduct.price.toLocaleString()}</div>
              </div>

              {/* Color Selection Option */}
              <div className="space-y-2 pt-4 border-t border-[#eceef0]">
                <h3 className="text-[10px] font-bold text-[#464555] uppercase tracking-wider">Select Color</h3>
                <div className="flex gap-4">
                  {[
                    { val: 'Black', hex: 'bg-black', border: 'border-black' },
                    { val: 'White', hex: 'bg-white', border: 'border-gray-300' }
                  ].map((color) => (
                    <button 
                      key={color.val}
                      onClick={() => setSelectedColor(color.val)}
                      className="group flex flex-col items-center gap-1.5 outline-none"
                    >
                      <div className={`w-11 h-11 rounded-full border-2 ${color.hex} p-0.5 transition-all ${
                        selectedColor === color.val 
                          ? 'ring-2 ring-[#3525cd] ring-offset-2 scale-105' 
                          : 'opacity-70 hover:opacity-100'
                      }`}>
                        <div className="w-full h-full rounded-full border border-white/20"></div>
                      </div>
                      <span className={`text-[10px] font-bold ${selectedColor === color.val ? 'text-[#3525cd]' : 'text-[#464555]'}`}>
                        {color.val}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Description text */}
              <div className="pt-5 border-t border-[#eceef0] space-y-2">
                <h3 className="text-xs font-bold text-[#191c1e]">Product Description</h3>
                <p className="text-xs text-[#464555] leading-relaxed">
                  {selectedProduct.description}
                </p>
                
                {/* Spec badges */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[#c7c4d8]/40 shadow-sm">
                    <Volume2 className="w-5 h-5 text-[#3525cd]" />
                    <div>
                      <p className="text-[11px] font-bold text-[#191c1e]">40 Hours</p>
                      <p className="text-[8px] uppercase tracking-wider text-[#464555]">Playback</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[#c7c4d8]/40 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-[#3525cd]" />
                    <div>
                      <p className="text-[11px] font-bold text-[#191c1e]">ANC Smart</p>
                      <p className="text-[8px] uppercase tracking-wider text-[#464555]">Active Noise</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free delivery promo banner */}
              <div className="flex items-center gap-3 p-4 bg-[#dae2fd]/30 rounded-xl border border-[#dae2fd]/50">
                <Truck className="w-5 h-5 text-[#3525cd]" />
                <div>
                  <p className="text-xs font-bold text-[#3525cd]">무료 익스프레스 무료배송</p>
                  <p className="text-[10px] text-[#464555] mt-0.5">내일 바로 발송되어 빠른 도착이 예상됩니다.</p>
                </div>
              </div>
            </div>

            {/* Bottom sticky Purchase bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#eceef0] py-3.5 px-5 z-40 flex gap-3 shadow-md max-w-screen-xl mx-auto">
              <button 
                disabled={selectedProduct.isSuspended}
                onClick={() => {
                  onAddCart({ product: selectedProduct, quantity: 1, selectedColor });
                  alert('장바구니에 담겼습니다.');
                }}
                className="w-14 h-14 border border-[#c7c4d8] text-[#464555] rounded-xl flex items-center justify-center hover:bg-[#f2f4f6] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button 
                disabled={selectedProduct.isSuspended}
                onClick={() => {
                  onAddCart({ product: selectedProduct, quantity: 1, selectedColor });
                  setCurrentView('CART');
                }}
                className={`flex-1 h-14 text-white text-xs font-extrabold rounded-xl shadow-md active:scale-95 transition-all ${
                  selectedProduct.isSuspended ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-[#3525cd] hover:bg-[#4f46e5]'
                }`}
              >
                {selectedProduct.isSuspended ? '판매 중지된 상품입니다' : '바로 구매하기'}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: CART (장바구니) */}
        {currentView === 'CART' && (
          <div className="animate-fade-in p-5 max-w-xl mx-auto space-y-6">
            {/* Header checks */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3525cd]" />
                <span className="text-xs font-bold">장바구니 내역 ({cart.length})</span>
              </div>
              {cart.length > 0 && (
                <button 
                  onClick={onClearCart}
                  className="text-xs text-[#ba1a1a] hover:underline"
                >
                  전체 삭제
                </button>
              )}
            </div>

            {/* Cart item rendering */}
            {cart.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-[#eceef0] p-6 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-[#777587]/30 mx-auto mb-2" />
                <p className="text-xs font-bold text-[#464555]">장바구니가 비어 있습니다.</p>
                <button 
                  onClick={() => setCurrentView('SHOP')}
                  className="mt-4 px-5 py-2.5 bg-[#3525cd] text-white text-xs font-bold rounded-lg hover:bg-[#4f46e5]"
                >
                  인기 상품 보러가기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-[#c7c4d8]/40 rounded-xl p-4 flex gap-4 relative shadow-sm"
                  >
                    <button 
                      onClick={() => onRemoveCart(idx)}
                      className="absolute top-3 right-3 text-[#777587] hover:text-[#ba1a1a] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" 
                    />

                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="text-xs font-bold text-[#191c1e] line-clamp-1">{item.product.name}</h4>
                        <p className="text-[10px] text-[#464555] mt-0.5">색상: {item.selectedColor || 'Default'}</p>
                        <p className="text-xs font-extrabold text-[#3525cd] mt-1.5">
                          ₩{(item.product.price * (item.product.discount ? (100 - item.product.discount) / 100 : 1)).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-[#c7c4d8] rounded-lg bg-[#f2f4f6] overflow-hidden">
                          <button 
                            disabled={item.quantity <= 1}
                            onClick={() => onUpdateCartQty(idx, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white text-[#464555] disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateCartQty(idx, 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white text-[#464555]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pricing total card */}
                <div className="bg-[#f2f4f6] rounded-xl p-4 border border-[#c7c4d8]/50 space-y-3">
                  <h4 className="text-xs font-bold text-[#191c1e] border-b pb-2">결제 예상 금액</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#464555]">
                      <span>총 상품 금액</span>
                      <span>₩{cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#464555]">
                      <span>배송비</span>
                      <span>{cartShippingFee === 0 ? '무료배송' : `₩${cartShippingFee.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#191c1e] pt-2 border-t border-[#c7c4d8]/30">
                      <span>최종 결제 금액</span>
                      <span className="text-[#3525cd] text-md">₩{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button 
                  onClick={() => setCurrentView('CHECKOUT')}
                  className="w-full py-4 bg-[#3525cd] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[#4f46e5] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                >
                  주문하기 ({cart.length}개)
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: CHECKOUT (결제정보 및 무통장 입금안내) */}
        {currentView === 'CHECKOUT' && (
          <div className="animate-fade-in p-5 max-w-xl mx-auto space-y-6">
            {/* Steps indicator */}
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              <div className="flex flex-col items-center gap-1 opacity-30">
                <div className="w-2 h-2 rounded-full bg-outline"></div>
                <span className="text-[10px] font-bold text-[#464555]">장바구니</span>
              </div>
              <div className="h-[1.5px] flex-1 bg-[#eceef0] mx-2"></div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3525cd] ring-4 ring-[#dae2fd]"></div>
                <span className="text-[10px] font-extrabold text-[#3525cd]">결제정보</span>
              </div>
              <div className="h-[1.5px] flex-1 bg-[#eceef0] mx-2"></div>
              <div className="flex flex-col items-center gap-1 opacity-30">
                <div className="w-2 h-2 rounded-full bg-outline"></div>
                <span className="text-[10px] font-bold text-[#464555]">주문완료</span>
              </div>
            </div>

            {/* Checkout Form */}
            <section className="space-y-4">
              <div className="bg-white border border-[#c7c4d8]/40 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#191c1e] border-b pb-2">최종 결제 예정 금액</h3>
                <div className="flex justify-between text-xs">
                  <span className="text-[#464555]">결제 총액</span>
                  <span className="font-extrabold text-sm text-[#3525cd]">₩{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Bank Transfer guide */}
              <div className="bg-[#dae2fd]/30 border border-[#dae2fd] rounded-xl p-5 relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#3525cd] uppercase tracking-wider mb-0.5">입금 은행</p>
                      <p className="text-sm font-bold">{bankAccount.bankName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-[#3525cd] uppercase tracking-wider mb-0.5">계좌 번호</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black tracking-normal text-[#191c1e]">{bankAccount.accountNumber}</p>
                      <button 
                        onClick={copyToClipboard}
                        className="p-1.5 bg-white border border-[#c7c4d8] rounded-md hover:bg-[#f2f4f6]"
                        title="계좌 복사"
                      >
                        <Copy className="w-4 h-4 text-[#464555]" />
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#dae2fd]">
                    <p className="text-[10px] font-bold text-[#3525cd] uppercase tracking-wider mb-0.5">예금주</p>
                    <p className="text-xs font-bold">{bankAccount.holderName}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Fields */}
              <div className="bg-white border border-[#c7c4d8]/40 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5 border-b pb-2">
                  <MapPin className="w-4 h-4 text-[#3525cd]" />
                  배송지 주소 정보 입력
                </h3>

                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#464555] block">수령자 이름</label>
                    <input 
                      type="text"
                      placeholder="수령하실 분의 이름을 입력하세요"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#464555] block">연락처 (전화번호)</label>
                    <input 
                      type="text"
                      placeholder="예: 010-1234-5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#464555] block">배송지 주소</label>
                    <textarea 
                      placeholder="상세 주소를 정확히 입력해 주세요"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full h-20 p-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none text-xs resize-none leading-relaxed"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Depositor Field */}
              <div className={`space-y-1.5 ${isCheckoutShake ? 'animate-shake' : ''}`}>
                <label className="text-xs font-bold text-[#464555]">실제 입금자명 입력</label>
                <input 
                  type="text"
                  placeholder="예금주명과 반드시 동일하게 입력하세요"
                  value={depositorName}
                  onChange={(e) => setDepositorName(e.target.value)}
                  className={`w-full h-12 px-4 rounded-xl border bg-white focus:ring-1 transition-all outline-none text-xs ${
                    isCheckoutShake ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]' : 'border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]'
                  }`}
                />
                <p className="text-[10px] text-[#777587]">
                  ※ 24시간 이내 미입금 시 자동 주문 취소 처리가 진행될 수 있습니다.
                </p>
              </div>

              {/* Submit Checkout */}
              <button 
                onClick={handleCheckoutSubmit}
                className="w-full py-4 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-extrabold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                주문 완료 및 대조 요청하기
                <Check className="w-4 h-4" />
              </button>
            </section>

            {/* Notification Toast */}
            {showToast && (
              <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#2d3133] text-[#eff1f3] px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold z-50 animate-fade-in">
                계좌번호가 성공적으로 복사되었습니다!
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: MYPAGE (마이페이지) */}
        {currentView === 'MYPAGE' && (
          <div className="animate-fade-in max-w-xl mx-auto space-y-6 pb-12">
            {/* User profile card */}
            <section className="px-5 py-6 bg-white border-b border-[#eceef0] flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApk3nc0tOM11fyHsjd10JbXf3hL84PoEkhjLIIuX5jqX80RQwV8KETwayNKwdrg4XBmUqukA7WIK2xyAzqLlH-Qa90YpXLxYPWA-0n5wHIIR62RK9b-SkbkHGalREB2IgdbZmyy6OjfgcwoGidpfYcs954oQInvOAgIxrgfKCdx9PiNQsgacXBH_HMASgPg5McOp_BFhgx3kDyvW1cCno8d4t0-8P5XsNf2jc5wWuFh7GrmAMPzG0b" 
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-[#dae2fd]"
                />
                <span className="absolute bottom-0 right-0 bg-[#3525cd] text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                  GOLD
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#191c1e]">홍길동 고객님</h3>
                <p className="text-[10px] text-[#464555] mt-0.5">Luminous 골드 멤버십 혜택 적용 중</p>
                <button className="text-[10px] text-[#3525cd] font-bold flex items-center mt-1.5">
                  멤버십 혜택보기 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Stats Overview */}
            <section className="px-5 grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#dae2fd]/20 rounded-xl border border-[#dae2fd] text-center">
                <p className="text-[9px] font-bold text-[#3f465c] uppercase">쿠폰 잔액</p>
                <p className="text-md font-bold text-[#3525cd] mt-0.5">12 장</p>
              </div>
              <div className="p-4 bg-white border border-[#c7c4d8]/40 rounded-xl text-center shadow-sm">
                <p className="text-[9px] font-bold text-[#464555] uppercase">보유 적립금</p>
                <p className="text-md font-bold text-[#191c1e] mt-0.5">₩ 15,200</p>
              </div>
            </section>

            {/* Deliver tracker status */}
            <section className="px-5 space-y-3">
              <h4 className="text-xs font-bold text-[#191c1e]">주문 배송 추적</h4>
              <div className="bg-white border border-[#c7c4d8]/30 rounded-xl p-4 shadow-sm flex justify-around">
                {[
                  { label: '결제대기', val: myOrders.filter(o => o.status === 'PENDING').length, icon: '💳' },
                  { label: '배송준비', val: myOrders.filter(o => o.status === 'PAID').length, icon: '📦' },
                  { label: '배송중', val: myOrders.filter(o => o.status === 'PREPARING').length, icon: '🚛' },
                  { label: '배송완료', val: myOrders.filter(o => o.status === 'SHIPPED').length + 12, icon: '🏠' }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-lg mb-1">{step.icon}</span>
                    <span className="text-[9px] text-[#464555]">{step.label}</span>
                    <span className="text-xs font-bold text-[#3525cd] mt-1">{step.val}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Settings lists navigation */}
            <section className="px-5">
              <div className="bg-white border border-[#c7c4d8]/30 rounded-xl overflow-hidden shadow-sm">
                <h4 className="text-xs font-bold text-[#191c1e] p-4 bg-gray-50/50 border-b border-[#c7c4d8]/20">최근 구매 주문 목록</h4>
                <div className="divide-y divide-[#eceef0]">
                  {myOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => {
                        setCurrentOrder(order);
                        setCurrentView('ORDER_DETAIL');
                      }}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#191c1e]">{order.depositorName}님의 주문 ({order.id})</p>
                        <p className="text-[10px] text-[#464555]">{order.date} • {order.items[0]?.product.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#3525cd]">
                        상세보기
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 7: ORDER_DETAIL (주문상세) */}
        {currentView === 'ORDER_DETAIL' && currentOrder && (
          <div className="animate-fade-in max-w-xl mx-auto space-y-6 pb-12">
            {/* Status section */}
            <section className="bg-white border-b p-5 space-y-2.5">
              <span className="text-[10px] font-bold text-[#3525cd] uppercase tracking-wider block">Order Status</span>
              <h2 className="text-lg font-bold text-[#3525cd] font-headline-lg-mobile">
                {currentOrder.status === 'PENDING' ? '무통장 입금 대기 중' : currentOrder.status === 'PAID' ? '배송 준비 중' : '배송 중'}
              </h2>
              <p className="text-xs text-[#464555]">운송장 번호: {currentOrder.trackingNumber || '배송 개시 후 생성예정'}</p>
              <p className="text-xs text-[#464555]">주문 일자: {currentOrder.date} | 주문번호: {currentOrder.id}</p>
            </section>

            {/* Address */}
            <section className="px-5 py-3 space-y-3 bg-white border border-[#c7c4d8]/30 rounded-xl mx-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5 border-b pb-2">
                <MapPin className="w-4 h-4 text-[#3525cd]" />
                배송지 주소 정보
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#464555]">받는 사람</span>
                  <span className="font-bold">{currentOrder.shippingAddress.receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#464555]">연락처</span>
                  <span className="font-bold">{currentOrder.shippingAddress.phone}</span>
                </div>
                <div className="flex justify-between text-right">
                  <span className="text-[#464555] shrink-0 mr-4">배송지</span>
                  <span className="font-bold max-w-[70%] leading-relaxed">{currentOrder.shippingAddress.address}</span>
                </div>
              </div>
            </section>

            {/* Items list */}
            <section className="px-5 space-y-3">
              <h3 className="text-xs font-bold text-[#191c1e]">주문 내역 상품</h3>
              <div className="space-y-3 bg-white border border-[#c7c4d8]/30 p-4 rounded-xl shadow-sm">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-cover rounded-lg border bg-gray-50"
                    />
                    <div className="flex flex-col justify-center flex-1 text-xs">
                      <h4 className="font-bold line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-[#464555] mt-0.5">옵션: {item.selectedColor || 'Default'}</p>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[#464555]">{item.quantity}개</span>
                        <span className="font-bold text-[#3525cd]">₩{item.product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Actions footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex gap-3 z-40 max-w-screen-xl mx-auto shadow-md">
              <button 
                onClick={() => alert('교환/반품 신청이 정상 접수되었습니다.')}
                className="flex-1 py-3 border border-[#c7c4d8] text-[#191c1e] text-xs font-bold rounded-xl active:scale-95 transition-all"
              >
                교환/반품 신청
              </button>
              <button 
                onClick={() => alert('배송 추적 결과 현재 간선 하차 대기 중입니다.')}
                className="flex-[2] py-3 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4.5 h-4.5" />
                배송 상태 조회
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Customer Bottom Nav Bar (Mobile layout style) */}
      {['HOME', 'SHOP', 'CART', 'MYPAGE', 'PRODUCT_DETAIL', 'CHECKOUT', 'ORDER_DETAIL'].includes(currentView) && (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 bg-white border-t border-[#eceef0] shadow-lg z-30 max-w-screen-xl mx-auto">
          {[
            { id: 'HOME', label: 'Home', icon: '🏠' },
            { id: 'SHOP', label: 'Shop', icon: '🛍️' },
            { id: 'CART', label: 'Cart', icon: '🛒' },
            { id: 'MYPAGE', label: 'Account', icon: '👤' },
            { id: 'ADMIN_DASHBOARD', label: 'Admin', icon: '⚙️' }
          ].map((tab) => {
            const isActive = currentView === tab.id || 
                             (tab.id === 'SHOP' && currentView === 'PRODUCT_DETAIL') ||
                             (tab.id === 'CART' && currentView === 'CHECKOUT') ||
                             (tab.id === 'MYPAGE' && currentView === 'ORDER_DETAIL') ||
                             (tab.id === 'ADMIN_DASHBOARD' && ['ADMIN_DASHBOARD', 'ADMIN_LOGIN', 'ADMIN_DEPOSIT', 'ADMIN_PRODUCT_REG'].includes(currentView));
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedProduct(null);
                  setCurrentView(tab.id as AppView);
                }}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive 
                    ? 'bg-[#dae2fd] text-[#3323cc] font-extrabold rounded-2xl px-4' 
                    : 'text-[#464555] hover:text-[#3525cd]'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
