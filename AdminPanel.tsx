import React, { useState, useEffect } from 'react';
import { Product, DepositOrder, AppView, SmsLog, BankAccount, Category, Banner } from '../types';
import { Plus, Check, ArrowLeft, MoreVertical, ShieldAlert, Search, RefreshCw, Smartphone, Image as ImageIcon, CreditCard, Trash2, FolderPlus, Settings } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: DepositOrder[];
  smsLogs: SmsLog[];
  bankAccount: BankAccount;
  categories: Category[];
  banner: Banner;
  onUpdateBankAccount: (bank: BankAccount) => void;
  onUpdateBanner?: (banner: Banner) => void;
  onAddProduct: (newProd: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: DepositOrder['status']) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onNavigateToOrder: (order: DepositOrder) => void;
  onAdminLoginSuccess?: () => void;
  onToggleProductSuspend?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateProductCategory?: (productId: string, category: string) => void;
  onAddCategory?: (newCat: Category) => void;
  onDeleteCategory?: (catId: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  smsLogs,
  bankAccount,
  categories,
  banner,
  onUpdateBankAccount,
  onUpdateBanner,
  onAddProduct,
  onUpdateOrderStatus,
  currentView,
  setCurrentView,
  onNavigateToOrder,
  onAdminLoginSuccess,
  onToggleProductSuspend,
  onDeleteProduct,
  onUpdateProductCategory,
  onAddCategory,
  onDeleteCategory
}: AdminPanelProps) {
  // Login states
  const [pin, setPin] = useState<string>('');
  const [isPinError, setIsPinError] = useState<boolean>(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState<boolean>(false);

  // Deposit verify states
  const [depositSearch, setDepositSearch] = useState<string>('');
  const [currentTimeString, setCurrentTimeString] = useState<string>('08:26:44');

  // New Product states
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdCategory, setNewProdCategory] = useState<string>(categories[0]?.id || 'electronics');
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>('');
  const [newProdStock, setNewProdStock] = useState<number | ''>('');
  const [newProdDiscount, setNewProdDiscount] = useState<number | ''>('');
  const [newProdShipping, setNewProdShipping] = useState<'free' | 'fixed' | 'cod'>('free');
  const [newProdImg, setNewProdImg] = useState<string>('');
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Category management states
  const [newCatId, setNewCatId] = useState<string>('');
  const [newCatLabel, setNewCatLabel] = useState<string>('');
  const [newCatIcon, setNewCatIcon] = useState<string>('');
  const [catError, setCatError] = useState<string>('');

  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProdImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProdImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Bank Account Settings states
  const [isEditingAccount, setIsEditingAccount] = useState<boolean>(false);
  const [editBankName, setEditBankName] = useState<string>('');
  const [editAccountNumber, setEditAccountNumber] = useState<string>('');
  const [editHolderName, setEditHolderName] = useState<string>('');

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBankName.trim() && editAccountNumber.trim() && editHolderName.trim()) {
      onUpdateBankAccount({
        bankName: editBankName.trim(),
        accountNumber: editAccountNumber.trim(),
        holderName: editHolderName.trim()
      });
      setIsEditingAccount(false);
    }
  };

  // Banner Settings states
  const [isEditingBanner, setIsEditingBanner] = useState<boolean>(false);
  const [editBannerImageUrl, setEditBannerImageUrl] = useState<string>('');
  const [editBannerPhrase, setEditBannerPhrase] = useState<string>('');

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBannerImageUrl.trim() && editBannerPhrase.trim() && onUpdateBanner) {
      onUpdateBanner({
        imageUrl: editBannerImageUrl.trim(),
        phrase: editBannerPhrase.trim()
      });
      setIsEditingBanner(false);
    }
  };

  // Clock tick effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeString(`${hrs}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // PIN verification logic
  const handleAddPinDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 6) {
        if (nextPin === '948338') {
          setShowSuccessOverlay(true);
          setTimeout(() => {
            setShowSuccessOverlay(false);
            setPin('');
            if (onAdminLoginSuccess) {
              onAdminLoginSuccess();
            } else {
              setCurrentView('ADMIN_DASHBOARD');
            }
          }, 1500);
        } else {
          setIsPinError(true);
          setTimeout(() => {
            setIsPinError(false);
            setPin('');
          }, 800);
        }
      }
    }
  };

  const handleDeletePinDigit = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  // Stats calculation
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const preparingOrdersCount = orders.filter(o => o.status === 'PREPARING').length;
  const paidOrdersCount = orders.filter(o => o.status === 'PAID').length;
  const pendingAmount = orders
    .filter(o => o.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered orders for deposit checking
  const filteredOrders = orders.filter(o => {
    const searchLower = depositSearch.toLowerCase();
    return (
      o.depositorName.toLowerCase().includes(searchLower) ||
      o.id.toLowerCase().includes(searchLower) ||
      o.bankName.toLowerCase().includes(searchLower)
    );
  });

  // Handle register product submission
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) {
      alert('상품명, 판매가, 재고 수량은 필수 입력 항목입니다.');
      return;
    }

    setIsSubmitLoading(true);

    const defaultImg = newProdImg.trim() || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfmHIwaFP0utBqp5wCnjiEYrOQo1cWENiL8SmqBhFWVu0HRUCqFaHNB1DmLELf4I14gnUIUuLhLGQjP4HcT4uAWry1F6c6jmEkTiVyk7YVNkKW2vN5akkirLhG38bFqnpSyfj-cpbWF-pwB0ZDBEh8JPZqCbpmJ5ZZ0muOgsYWSErk3KLAbXr0Jyd8LvDRnL_JUSV6NtrCZVZe2v0ZK_6T7oewMM8stglunxMpFMhhtXwkASCeNF-n';

    setTimeout(() => {
      const addedProduct: Product = {
        id: `prod-${Date.now()}`,
        name: newProdName,
        category: newProdCategory,
        description: newProdDesc || '상세 정보가 등록되지 않은 상품입니다.',
        price: Number(newProdPrice),
        stock: Number(newProdStock),
        discount: newProdDiscount ? Number(newProdDiscount) : undefined,
        shipping: newProdShipping,
        image: defaultImg,
        isNew: true
      };

      onAddProduct(addedProduct);
      setIsSubmitLoading(false);
      setSubmitSuccess(true);

      // Reset Form
      setNewProdName('');
      setNewProdCategory(categories[0]?.id || 'electronics');
      setNewProdDesc('');
      setNewProdPrice('');
      setNewProdStock('');
      setNewProdDiscount('');
      setNewProdShipping('free');
      setNewProdImg('');

      setTimeout(() => {
        setSubmitSuccess(false);
        setCurrentView('ADMIN_DASHBOARD');
      }, 1500);
    }, 1200);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');

    const trimmedId = newCatId.trim().toLowerCase();
    const trimmedLabel = newCatLabel.trim();
    const trimmedIcon = newCatIcon.trim();

    if (!trimmedId || !trimmedLabel) {
      setCatError('카테고리 ID와 이름은 필수 입력 항목입니다.');
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(trimmedId)) {
      setCatError('카테고리 ID는 영문 소문자, 숫자, -, _ 만 사용 가능합니다.');
      return;
    }

    if (categories.some(c => c.id === trimmedId)) {
      setCatError('이미 존재하는 카테고리 ID입니다.');
      return;
    }

    if (onAddCategory) {
      onAddCategory({
        id: trimmedId,
        label: trimmedLabel,
        icon: trimmedIcon || '📁'
      });
      setNewCatId('');
      setNewCatLabel('');
      setNewCatIcon('');
      setCatError('');
    }
  };

  if (currentView === 'ADMIN_LOGIN') {
    return (
      <div className="relative min-h-[calc(100vh-56px)] bg-[#f7f9fb] text-[#191c1e] flex flex-col items-center justify-center overflow-hidden py-10">
        {/* Background grid dots texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#c7c4d8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <main className="relative z-10 w-full max-w-md px-5 flex flex-col items-center">
          {/* Brand Identity */}
          <div className="mb-6 text-center animate-fade-in">
            <h1 className="text-3xl font-extrabold text-[#3525cd] tracking-tight mb-2 font-headline-lg-mobile">INDIGO</h1>
            <div className="flex items-center justify-center space-x-2 text-[#464555]">
              <span className="w-4 h-4 text-xs font-bold bg-[#c7c4d8] rounded-full inline-flex items-center justify-center">L</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#464555]">Admin Secure Access</p>
            </div>
          </div>

          {/* Prompt */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#191c1e] mb-1">PIN 번호 입력</h2>
            <p className="text-sm text-[#464555] max-w-[280px] mx-auto leading-relaxed">
              관리 기능에 접속하려면 6자리 관리자 암호를 입력해 주세요.
            </p>
          </div>

          {/* Dots Indicator */}
          <div 
            className={`flex justify-center gap-4 mb-10 ${isPinError ? 'animate-shake' : ''}`}
            id="pin-display"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                  i < pin.length
                    ? 'bg-[#3525cd] border-[#3525cd] scale-110 shadow-sm'
                    : isPinError
                    ? 'border-[#ba1a1a] bg-[#ffdad6]'
                    : 'border-[#c7c4d8] bg-transparent'
                }`}
              ></div>
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-y-5 gap-x-8 w-full max-w-[280px] mb-8">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => handleAddPinDigit(num)}
                className="h-14 w-14 mx-auto flex items-center justify-center rounded-full text-lg font-bold hover:bg-[#eceef0] active:scale-90 transition-all bg-white border border-[#eceef0] shadow-sm"
              >
                {num}
              </button>
            ))}
            <div className="h-14 w-14 mx-auto flex items-center justify-center text-[#c7c4d8] opacity-50">
              <Smartphone className="w-5 h-5" />
            </div>
            <button
              onClick={() => handleAddPinDigit('0')}
              className="h-14 w-14 mx-auto flex items-center justify-center rounded-full text-lg font-bold hover:bg-[#eceef0] active:scale-90 transition-all bg-white border border-[#eceef0] shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleDeletePinDigit}
              className="h-14 w-14 mx-auto flex items-center justify-center rounded-full hover:bg-[#eceef0] active:scale-90 text-[#464555] transition-all bg-white border border-[#eceef0] shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 mt-2">
            <button className="text-sm font-semibold text-[#4f46e5] hover:underline px-4 py-1.5 transition-all">
              암호를 잊으셨나요?
            </button>
            <button 
              onClick={() => setCurrentView('HOME')}
              className="text-xs font-bold text-[#464555] hover:text-[#3525cd] bg-white border border-[#eceef0] hover:bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-1 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              쇼핑몰로 돌아가기
            </button>
          </div>
        </main>

        {/* Success Overlay */}
        <div 
          className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
            showSuccessOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-[#dae2fd] text-[#3323cc] flex items-center justify-center mb-6 scale-100 animate-pulse">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <p className="text-xl font-bold text-[#3525cd]">인증 성공</p>
          <p className="text-sm text-[#464555] mt-2">관리자 대시보드로 이동 중...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'ADMIN_DASHBOARD') {
    return (
      <div className="bg-[#f7f9fb] text-[#191c1e] min-h-[calc(100vh-56px)] pb-16">
        {/* Navigation header */}
        <div className="bg-white border-b border-[#eceef0] py-4 px-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#191c1e]">관리자 대시보드</h1>
            <span className="text-[10px] bg-[#3323cc] text-white px-2 py-0.5 rounded-full font-bold">LIVE</span>
          </div>
          <button 
            onClick={() => setCurrentView('ADMIN_DEPOSIT')}
            className="text-xs bg-[#dae2fd] text-[#3f465c] font-bold px-3 py-1.5 rounded-lg hover:bg-[#3525cd] hover:text-white transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            무통장 입금 확인
          </button>
        </div>

        <main className="p-5 max-w-4xl mx-auto space-y-6">
          {/* Today's Summary */}
          <section className="space-y-3">
            <h2 className="text-md font-bold text-[#191c1e] flex items-center justify-between">
              오늘의 요약 
              <span className="text-xs text-[#464555] font-normal">2026.07.16</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="col-span-2 md:col-span-1 p-5 bg-[#3525cd] text-white rounded-xl flex flex-col justify-between h-32 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#dad7ff]">New Orders</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">{orders.length}</span>
                  <span className="text-xs opacity-90">건의 신규 주문</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#c7c4d8]/40 rounded-xl flex flex-col justify-between h-32 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-[#464555] uppercase tracking-widest">Pending</span>
                  <span className="text-xs font-bold text-[#ba1a1a] px-1.5 py-0.5 bg-[#ffdad6] rounded-md">₩</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#191c1e]">{pendingOrdersCount}</span>
                  <span className="text-[10px] text-[#464555]">결제 대기</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#c7c4d8]/40 rounded-xl flex flex-col justify-between h-32 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-[#464555] uppercase tracking-widest">Shipping</span>
                  <span className="text-xs font-bold text-[#3525cd] px-1.5 py-0.5 bg-[#dae2fd] rounded-md">🚛</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#191c1e]">{preparingOrdersCount}</span>
                  <span className="text-[10px] text-[#464555]">출고 예정</span>
                </div>
              </div>
            </div>
          </section>

          {/* 입금 계좌 번호 설정 (Bank Account Settings) */}
          <section className="bg-white border border-[#c7c4d8]/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#191c1e] flex items-center gap-1.5">
                  💳 무통장 입금 계좌 설정
                </h2>
                <p className="text-xs text-[#464555] mt-0.5">고객이 결제 화면에서 보게 될 판매자의 입금용 계좌 정보입니다.</p>
              </div>
              <span className="text-xs font-bold text-[#3525cd] bg-[#dae2fd]/60 px-2 py-0.5 rounded">
                실시간 반영됨
              </span>
            </div>

            {isEditingAccount ? (
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#464555]">입금 은행</label>
                    <input 
                      type="text" 
                      value={editBankName}
                      onChange={(e) => setEditBankName(e.target.value)}
                      placeholder="예: 카카오뱅크(kakao Bank)"
                      className="w-full text-xs font-semibold p-2.5 bg-gray-50 border border-[#c7c4d8] rounded-lg focus:outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#464555]">계좌 번호</label>
                    <input 
                      type="text" 
                      value={editAccountNumber}
                      onChange={(e) => setEditAccountNumber(e.target.value)}
                      placeholder="예: 7942-25-80482"
                      className="w-full text-xs font-semibold p-2.5 bg-gray-50 border border-[#c7c4d8] rounded-lg focus:outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#464555]">예금주</label>
                    <input 
                      type="text" 
                      value={editHolderName}
                      onChange={(e) => setEditHolderName(e.target.value)}
                      placeholder="예: 한용섭"
                      className="w-full text-xs font-semibold p-2.5 bg-gray-50 border border-[#c7c4d8] rounded-lg focus:outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button 
                    type="button"
                    onClick={() => setIsEditingAccount(false)}
                    className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-[#3525cd] text-white rounded-lg text-xs font-bold hover:bg-[#2c1eb3] active:scale-95 transition-all"
                  >
                    설정 저장
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 w-full max-w-2xl">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">입금 은행</span>
                    <span className="text-xs font-bold text-[#191c1e]">{bankAccount.bankName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">계좌 번호</span>
                    <span className="text-xs font-mono font-bold text-[#191c1e]">{bankAccount.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">예금주</span>
                    <span className="text-xs font-bold text-[#191c1e]">{bankAccount.holderName}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setEditBankName(bankAccount.bankName);
                    setEditAccountNumber(bankAccount.accountNumber);
                    setEditHolderName(bankAccount.holderName);
                    setIsEditingAccount(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-[#c7c4d8] text-[#191c1e] hover:bg-gray-50 active:scale-95 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 text-center"
                >
                  수정하기
                </button>
              </div>
            )}
          </section>

          {/* 메인 배너 및 글귀 설정 (Main Banner & Greeting Settings) */}
          <section className="bg-white border border-[#c7c4d8]/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#191c1e] flex items-center gap-1.5">
                  🖼️ 메인 배너 이미지 및 글귀 설정
                </h2>
                <p className="text-xs text-[#464555] mt-0.5">사용자 메인 화면에 노출될 배너 이미지 URL과 안내 글귀를 설정합니다.</p>
              </div>
              <span className="text-xs font-bold text-[#3525cd] bg-[#dae2fd]/60 px-2 py-0.5 rounded">
                실시간 반영됨
              </span>
            </div>

            {isEditingBanner ? (
              <form onSubmit={handleSaveBanner} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#464555]">배너 이미지 URL</label>
                    <input 
                      type="url" 
                      value={editBannerImageUrl}
                      onChange={(e) => setEditBannerImageUrl(e.target.value)}
                      placeholder="예: https://example.com/banner.jpg"
                      className="w-full text-xs font-semibold p-2.5 bg-gray-50 border border-[#c7c4d8] rounded-lg focus:outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#464555]">배너 글귀 (Greeting Phrase)</label>
                    <input 
                      type="text" 
                      value={editBannerPhrase}
                      onChange={(e) => setEditBannerPhrase(e.target.value)}
                      placeholder="예: 일상의 질을 높이는 에센셜 컬렉션"
                      className="w-full text-xs font-semibold p-2.5 bg-gray-50 border border-[#c7c4d8] rounded-lg focus:outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button 
                    type="button"
                    onClick={() => setIsEditingBanner(false)}
                    className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-[#3525cd] text-white rounded-lg text-xs font-bold hover:bg-[#2c1eb3] active:scale-95 transition-all"
                  >
                    설정 저장
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4 w-full">
                  <div 
                    className="w-20 h-12 rounded-lg bg-cover bg-center shrink-0 border shadow-sm"
                    style={{ backgroundImage: `url('${banner.imageUrl || ''}')` }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">현재 배너 문구</span>
                    <span className="text-xs font-bold text-[#191c1e] block truncate">{banner.phrase}</span>
                    <span className="text-[9px] text-[#464555] block truncate mt-0.5">{banner.imageUrl}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setEditBannerImageUrl(banner.imageUrl);
                    setEditBannerPhrase(banner.phrase);
                    setIsEditingBanner(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-[#c7c4d8] text-[#191c1e] hover:bg-gray-50 active:scale-95 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 text-center"
                >
                  수정하기
                </button>
              </div>
            )}
          </section>

          {/* Daily Sales Chart */}
          <section className="bg-white border border-[#c7c4d8]/40 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-sm font-bold text-[#191c1e]">일간 매출 추이</h2>
                <p className="text-xs text-[#464555] mt-0.5">최근 7일간의 실시간 판매 추이입니다.</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#3525cd]">₩1,420,000</span>
                <p className="text-[9px] text-[#464555]">총 매출액</p>
              </div>
            </div>

            {/* Custom Tailwind Bar Chart */}
            <div className="flex items-end justify-between h-36 gap-3 px-2">
              {[
                { label: '월', height: 'h-12', value: '₩120k' },
                { label: '화', height: 'h-20', value: '₩240k' },
                { label: '수', height: 'h-28', value: '₩320k' },
                { label: '목', height: 'h-32', value: '₩349k', active: true },
                { label: '금', height: 'h-16', value: '₩180k' },
                { label: '토', height: 'h-8', value: '₩80k' },
                { label: '일', height: 'h-6', value: '₩60k' },
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group relative">
                  {/* Tooltip */}
                  <span className="absolute -top-7 text-[9px] bg-[#191c1e] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    {bar.value}
                  </span>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out cursor-pointer ${
                      bar.active 
                        ? 'bg-[#3525cd] shadow-lg shadow-[#3525cd]/20' 
                        : 'bg-[#eceef0] group-hover:bg-[#4f46e5]/30'
                    } ${bar.height}`}
                  ></div>
                  <span className={`mt-2 text-[10px] font-semibold ${bar.active ? 'text-[#3525cd]' : 'text-[#464555]'}`}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Orders Section */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#191c1e]">최근 주문 및 입금 내역</h2>
              <button 
                onClick={() => setCurrentView('ADMIN_DEPOSIT')} 
                className="text-xs font-bold text-[#3525cd] hover:underline"
              >
                전체보기 &gt;
              </button>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => {
                const item = order.items[0];
                return (
                  <div 
                    key={order.id} 
                    className="bg-white border border-[#c7c4d8]/40 p-4 rounded-xl flex flex-col gap-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-3">
                        <img 
                          src={item?.product.image} 
                          alt={item?.product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" 
                        />
                        <div>
                          <h3 className="text-sm font-bold text-[#191c1e] line-clamp-1">{item?.product.name}</h3>
                          <p className="text-xs text-[#464555] mt-0.5">주문번호: {order.id}</p>
                          <p className="text-xs text-[#464555] mt-0.5 font-semibold text-[#3525cd]">₩{order.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <span className={`px-2 py-1 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                        order.status === 'PENDING' 
                          ? 'bg-[#ffdad6] text-[#ba1a1a]' 
                          : order.status === 'PAID'
                          ? 'bg-[#dae2fd] text-[#131b2e]'
                          : 'bg-[#eceef0] text-[#464555]'
                      }`}>
                        {order.status === 'PENDING' ? '결제 대기' : order.status === 'PAID' ? '결제 완료' : '배송 준비'}
                      </span>
                    </div>

                    {order.shippingAddress && (
                      <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 text-[10px] text-[#464555] space-y-1">
                        <p><strong className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mr-1">수령인/연락처:</strong> <span className="font-bold text-[#191c1e]">{order.shippingAddress.receiver} ({order.shippingAddress.phone})</span></p>
                        <p><strong className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mr-1">배송지 주소:</strong> <span className="font-bold text-[#191c1e]">{order.shippingAddress.address}</span></p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => onUpdateOrderStatus(order.id, 'PAID')}
                          className="flex-1 py-2.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                        >
                          입금 승인하기
                        </button>
                      )}
                      {order.status === 'PAID' && (
                        <button 
                          onClick={() => onUpdateOrderStatus(order.id, 'PREPARING')}
                          className="flex-1 py-2.5 border border-[#3525cd] text-[#3525cd] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all bg-white hover:bg-[#dae2fd]/20"
                        >
                          배송 준비 처리
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button 
                          onClick={() => onNavigateToOrder(order)}
                          className="flex-1 py-2.5 bg-[#eceef0] text-[#191c1e] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                        >
                          주문 정보 상세 조회
                        </button>
                      )}
                      <button className="w-10 h-10 flex items-center justify-center border border-[#c7c4d8]/60 rounded-lg text-[#464555] hover:bg-gray-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 카테고리 설정 및 관리 Section */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                📁 카테고리 설정 및 관리
              </h2>
              <span className="text-xs text-[#464555] font-semibold">총 {categories.length}개 카테고리</span>
            </div>

            <div className="bg-white border border-[#c7c4d8]/40 rounded-xl p-4 shadow-sm space-y-4">
              {/* Existing categories grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2.5 bg-[#f7f9fb] border border-[#eceef0] rounded-xl hover:border-[#c7c4d8] transition-all">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{cat.icon || '📁'}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#191c1e] truncate">{cat.label}</p>
                        <p className="text-[9px] text-[#777587] font-mono truncate">{cat.id}</p>
                      </div>
                    </div>
                    {/* Delete category button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`'${cat.label}' 카테고리를 삭제하시겠습니까? 등록된 상품들의 카테고리 정보는 그대로 보존되나 카테고리 칩 목록 및 필터에서 제외됩니다.`)) {
                          onDeleteCategory && onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="카테고리 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add category form */}
              <form onSubmit={handleCategorySubmit} className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-[10px] font-bold text-[#464555] uppercase tracking-wider block">새 카테고리 추가</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#777587] font-bold">카테고리 ID (영문/숫자)</label>
                    <input
                      type="text"
                      placeholder="예: camping"
                      value={newCatId}
                      onChange={(e) => setNewCatId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#c7c4d8] rounded-lg text-xs outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#777587] font-bold">카테고리 이름</label>
                    <input
                      type="text"
                      placeholder="예: 캠핑용품"
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#c7c4d8] rounded-lg text-xs outline-none focus:border-[#3525cd]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#777587] font-bold">아이콘 (이모지)</label>
                    <input
                      type="text"
                      placeholder="예: 🏕️"
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#c7c4d8] rounded-lg text-xs outline-none focus:border-[#3525cd]"
                    />
                  </div>
                </div>

                {catError && (
                  <p className="text-[11px] text-[#ba1a1a] font-bold">{catError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  새 카테고리 등록하기
                </button>
              </form>
            </div>
          </section>

          {/* 등록 상품 관리 Section */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                🛍️ 등록 상품 관리 (카테고리 변경 / 중지 / 삭제)
              </h2>
              <span className="text-xs text-[#464555] font-semibold">총 {products.length}개 상품</span>
            </div>

            <div className="bg-white border border-[#c7c4d8]/40 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {products.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  등록된 상품이 없습니다. 새 상품 등록 버튼을 클릭해 추가해 보세요.
                </div>
              ) : (
                products.map((prod) => (
                  <div key={prod.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img 
                          src={prod.image} 
                          alt={prod.name}
                          className={`w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 ${prod.isSuspended ? 'opacity-40 grayscale' : ''}`} 
                        />
                        {prod.isSuspended && (
                          <span className="absolute inset-0 bg-black/40 text-white text-[8px] flex items-center justify-center rounded-lg font-bold">
                            중지됨
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs font-bold text-[#191c1e] truncate">{prod.name}</h3>
                          
                          {/* Interactive Category Selector */}
                          <select
                            value={prod.category}
                            onChange={(e) => onUpdateProductCategory && onUpdateProductCategory(prod.id, e.target.value)}
                            className="text-[10px] font-bold text-[#3525cd] bg-[#dae2fd]/50 hover:bg-[#dae2fd] border-none px-2 py-0.5 rounded outline-none cursor-pointer transition-colors"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.icon || '📁'} {cat.label}
                              </option>
                            ))}
                          </select>

                          {prod.isSuspended && (
                            <span className="bg-[#ffdad6] text-[#ba1a1a] text-[9px] px-1.5 py-0.2 rounded font-bold">
                              판매중지
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#464555] mt-1">₩{prod.price.toLocaleString()} • 재고 {prod.stock}개</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        onClick={() => onToggleProductSuspend && onToggleProductSuspend(prod.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                          prod.isSuspended 
                            ? 'bg-[#3525cd]/10 text-[#3525cd] hover:bg-[#3525cd]/20' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {prod.isSuspended ? '판매재개' : '판매중지'}
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`"${prod.name}" 상품을 정말 삭제하시겠습니까?`)) {
                            if (onDeleteProduct) onDeleteProduct(prod.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] rounded-lg text-xs font-bold transition-all active:scale-95"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 자동 SMS 발송 내역 Section */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#191c1e] flex items-center gap-1.5">
                💬 자동 SMS 발송 내역 (신규주문 알림)
              </h2>
              <span className="text-xs text-[#464555] font-semibold">수신인: 010-9990-1806</span>
            </div>

            <div className="bg-white border border-[#c7c4d8]/40 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {(!smsLogs || smsLogs.length === 0) ? (
                <div className="p-8 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                  <Smartphone className="w-8 h-8 text-gray-300 stroke-[1.5]" />
                  <span>아직 자동 발송된 SMS 내역이 없습니다.<br />사용자 모드에서 신규 주문을 진행해 보세요!</span>
                </div>
              ) : (
                smsLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/30">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#dae2fd]/60 flex items-center justify-center shrink-0 text-xs">
                        📱
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-[#3525cd]">SMS 자동 발송</span>
                          <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                          <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            전송완료
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#191c1e] mt-1 break-all bg-white border border-gray-100 rounded-lg p-2.5 shadow-xs">
                          {log.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="text-[10px] text-[#464555] font-semibold">수신번호: <strong className="font-bold text-[#191c1e]">{log.receiver}</strong></span>
                      <span className="text-[10px] text-[#777587] font-mono sm:mt-1">{log.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick links & Operations */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
              onClick={() => setCurrentView('ADMIN_PRODUCT_REG')}
              className="py-4 bg-white border border-[#c7c4d8]/40 hover:border-[#3525cd] rounded-xl flex flex-col items-center justify-center gap-1 text-[#191c1e] active:scale-95 transition-all shadow-sm group"
            >
              <Plus className="w-6 h-6 text-[#3525cd] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">새 상품 등록</span>
            </button>
            <button 
              onClick={() => setCurrentView('HOME')}
              className="py-4 bg-[#dae2fd]/30 border border-[#dae2fd] hover:bg-[#dae2fd]/50 rounded-xl flex flex-col items-center justify-center gap-1 text-[#3525cd] active:scale-95 transition-all shadow-sm"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs font-bold">사용자 쇼핑몰로 전환</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'ADMIN_DEPOSIT') {
    return (
      <div className="bg-[#f7f9fb] text-[#191c1e] min-h-[calc(100vh-56px)] pb-24">
        {/* Navigation header */}
        <div className="bg-white border-b border-[#eceef0] py-4 px-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('ADMIN_DASHBOARD')}
              className="p-1 hover:bg-[#f2f4f6] rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-[#3525cd]" />
            </button>
            <h1 className="text-md font-bold text-[#191c1e]">무통장 입금 확인</h1>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#464555]">Real-time Sync</span>
          </div>
        </div>

        <main className="p-5 max-w-xl mx-auto space-y-5">
          {/* Header Sync Info */}
          <div className="flex items-center justify-between bg-[#eceef0]/50 p-3.5 rounded-xl border border-[#c7c4d8]/30">
            <div>
              <p className="text-xs font-bold text-[#191c1e]">입금 내역 실시간 동기화</p>
              <p className="text-[10px] text-[#464555] mt-0.5">새로 들어온 대기 입금을 대조 승인합니다.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-[#c7c4d8]/20">
              <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold text-[#3525cd]">{currentTimeString}</span>
            </div>
          </div>

          {/* Stats Bento Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white border border-[#c7c4d8]/40 rounded-xl flex flex-col justify-between h-24">
              <span className="text-[10px] font-bold text-[#464555] uppercase tracking-wider">입금 대기 총액</span>
              <span className="text-lg font-extrabold text-[#3525cd]">₩{pendingAmount.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-[#3525cd] text-white rounded-xl flex flex-col justify-between h-24 shadow-sm">
              <span className="text-[10px] font-bold text-[#dad7ff] uppercase tracking-wider">미확인 건수</span>
              <span className="text-lg font-extrabold">{pendingOrdersCount}건 대기 중</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
            <input 
              type="text"
              placeholder="주문번호, 예금주명, 은행명 검색..."
              value={depositSearch}
              onChange={(e) => setDepositSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-sm focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] transition-all outline-none"
            />
          </div>

          {/* Deposit List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-[#c7c4d8]/30">
                <ShieldAlert className="w-10 h-10 text-[#464555]/30 mx-auto mb-2" />
                <p className="text-xs font-bold text-[#464555]">대치되는 입금 내역이 없습니다.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id}
                  className={`bg-white border border-[#c7c4d8]/40 rounded-xl overflow-hidden shadow-sm transition-opacity duration-300 ${
                    order.status !== 'PENDING' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#eceef0] text-[#3525cd] rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#191c1e]">{order.depositorName}</span>
                            <span className="text-[9px] bg-[#f2f4f6] text-[#464555] px-1.5 py-0.5 rounded">
                              {order.id}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#464555] mt-0.5">
                            {order.bankName} • {order.time} 입금 대기
                          </p>
                        </div>
                      </div>
                      <span className="text-md font-extrabold text-[#3525cd]">
                        ₩{order.amount.toLocaleString()}
                      </span>
                    </div>

                    {order.shippingAddress && (
                      <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-[11px] text-[#464555] space-y-1">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-400">수령인</span>
                          <span className="font-bold text-[#191c1e]">{order.shippingAddress.receiver}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-400">연락처</span>
                          <span className="font-bold text-[#191c1e]">{order.shippingAddress.phone}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="font-semibold text-gray-400 shrink-0">배송지</span>
                          <span className="font-bold text-[#191c1e] text-right break-all">{order.shippingAddress.address}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {order.status === 'PENDING' ? (
                        <>
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, 'PAID')}
                            className="flex-grow py-2.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-lg transition-colors active:scale-95 duration-150"
                          >
                            입금 확인 승인
                          </button>
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, 'PREPARING')}
                            className="px-4 py-2.5 border border-[#c7c4d8] text-xs font-bold text-[#464555] hover:bg-[#f2f4f6] rounded-lg"
                          >
                            보류
                          </button>
                        </>
                      ) : (
                        <div className="flex-grow flex items-center justify-center py-2 bg-[#f2f4f6] rounded-lg text-xs font-bold text-[#464555] gap-1.5">
                          <Check className="w-4 h-4 text-[#10b981]" />
                          처리 완료 ({order.status === 'PAID' ? '결제 완료' : '배송 완료'})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'ADMIN_PRODUCT_REG') {
    return (
      <div className="bg-[#f7f9fb] text-[#191c1e] min-h-[calc(100vh-56px)] pb-24">
        {/* Navigation header */}
        <div className="bg-white border-b border-[#eceef0] py-4 px-5 flex items-center shadow-sm sticky top-0 z-10">
          <button 
            onClick={() => setCurrentView('ADMIN_DASHBOARD')}
            className="p-1 hover:bg-[#f2f4f6] rounded-full mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-[#3525cd]" />
          </button>
          <h1 className="text-md font-bold text-[#191c1e]">새 상품 등록</h1>
        </div>

        <main className="p-5 max-w-xl mx-auto">
          {submitSuccess ? (
            <div className="bg-white border border-[#c7c4d8]/40 p-8 rounded-xl text-center space-y-4 shadow-md animate-fade-in">
              <div className="w-16 h-16 bg-[#dae2fd] text-[#3323cc] rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-lg font-bold text-[#191c1e]">상품 등록 완료</h2>
              <p className="text-xs text-[#464555]">새로운 프리미엄 상품이 목록에 추가되었습니다. 대시보드로 이동합니다.</p>
            </div>
          ) : (
            <form onSubmit={handleProductSubmit} className="space-y-6">
              {/* Image upload preview */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#464555] uppercase tracking-wider block">상품 이미지 등록</label>
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* File Upload Trigger Box / Preview Box */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`col-span-1 flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl bg-white transition-all cursor-pointer group p-3 text-center ${
                      isDragActive 
                        ? 'border-[#3525cd] bg-[#dae2fd]/20 scale-[0.98]' 
                        : 'border-[#c7c4d8] hover:border-[#3525cd] hover:bg-gray-50'
                    }`}
                  >
                    {newProdImg ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img src={newProdImg} alt="Preview" className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-semibold rounded-lg">
                          <ImageIcon className="w-4 h-4 mb-1" />
                          변경하기
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <ImageIcon className="w-6 h-6 text-[#3525cd] group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-[10px] font-bold text-[#191c1e] block">파일 찾기</span>
                        <span className="text-[8px] text-[#777587] mt-0.5 leading-tight block">또는 드래그</span>
                      </div>
                    )}
                  </div>

                  {/* Input field direct reflection or alternative URL */}
                  <div className="col-span-3 bg-white border border-[#c7c4d8] rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#464555] block">방법 1. 이미지 파일 업로드</span>
                      <p className="text-[9px] text-[#777587]">위의 점선 영역을 클릭하여 PC 내의 그림 파일(.jpg, .png 등)을 선택하거나 드래그 앤 드롭 하세요.</p>
                    </div>

                    <div className="border-t pt-2.5 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#464555] block">방법 2. 이미지 URL 직접 입력 (핫링크)</span>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="https://example.com/image.jpg"
                          value={newProdImg.startsWith('data:') ? '' : newProdImg}
                          onChange={(e) => setNewProdImg(e.target.value)}
                          className="text-xs border border-[#c7c4d8] p-2 focus:ring-1 focus:ring-[#3525cd] focus:border-[#3525cd] w-full rounded-lg text-gray-700 placeholder-gray-400 outline-none"
                        />
                        {newProdImg && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewProdImg('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs"
                          >
                            비우기
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-[#777587]">권장 사이즈: 1000 x 1000 px, 파일 업로드 시 URL은 자동으로 연동됩니다.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input details */}
              <div className="space-y-4 bg-white p-5 rounded-xl border border-[#c7c4d8]/30 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#464555]">상품명</label>
                  <input 
                    type="text"
                    placeholder="상품명을 입력하세요"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#c7c4d8] rounded-lg text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#464555]">카테고리</label>
                  <select 
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#c7c4d8] rounded-lg text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon || '📁'} {cat.label} ({cat.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#464555]">상품 설명</label>
                  <textarea 
                    rows={4}
                    placeholder="상품에 대한 특징, 재질, 사이즈 등 상세 스펙을 기재하세요."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#c7c4d8] rounded-lg text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4 bg-white p-5 rounded-xl border border-[#c7c4d8]/30 shadow-sm">
                <h3 className="text-xs font-extrabold text-[#191c1e] border-b pb-2">가격 및 재고 설정</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#464555]">판매가 (₩)</label>
                    <input 
                      type="number"
                      placeholder="₩ 0"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2.5 bg-white border border-[#c7c4d8] rounded-lg text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#464555]">재고 수량</label>
                    <input 
                      type="number"
                      placeholder="0"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2.5 bg-white border border-[#c7c4d8] rounded-lg text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#464555]">할인율 (선택사항, %)</label>
                  <input 
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={newProdDiscount}
                    onChange={(e) => setNewProdDiscount(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full max-w-[50%] px-3 py-2.5 bg-white border border-[#c7c4d8] rounded-lg text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none"
                  />
                </div>
              </div>

              {/* Delivery */}
              <div className="space-y-3 bg-white p-5 rounded-xl border border-[#c7c4d8]/30 shadow-sm">
                <label className="text-xs font-bold text-[#464555] block">배송비 설정</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'free', label: '무료 배송', icon: '🚛' },
                    { val: 'fixed', label: '고정 배송비', icon: '💳' },
                    { val: 'cod', label: '착불 배송', icon: '🤝' },
                  ].map((option) => (
                    <label 
                      key={option.val}
                      className={`flex flex-col items-center justify-center py-3 border rounded-xl cursor-pointer transition-all active:scale-95 ${
                        newProdShipping === option.val
                          ? 'border-[#3525cd] bg-[#dae2fd]/30 text-[#3323cc] font-semibold'
                          : 'border-[#c7c4d8] bg-white text-[#464555] hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="radio"
                        name="shipping"
                        value={option.val}
                        checked={newProdShipping === option.val}
                        onChange={() => setNewProdShipping(option.val as any)}
                        className="hidden"
                      />
                      <span className="text-lg mb-1">{option.icon}</span>
                      <span className="text-[10px]">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={isSubmitLoading}
                className="w-full py-4 bg-[#3525cd] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    등록 중...
                  </div>
                ) : (
                  <>등록하기</>
                )}
              </button>
            </form>
          )}
        </main>
      </div>
    );
  }

  return null;
}
