import React, { useState } from 'react';
import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle2,
  ArrowLeft,
  Truck,
} from 'lucide-react';
import { Product, ProductShade } from '../data/catalog';

export interface CartItem {
  key: string;
  product: Product;
  shade: ProductShade;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'COD' | 'UPI_CARD';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  timestamp: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Checkout verification fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI_CARD'>('COD');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 799;
  const subtotal = items.reduce((acc, item) => acc + item.product.priceInr * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount === 0 || afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : 79;
  const total = afterDiscount + shipping;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - afterDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (promoCode.trim().toUpperCase() === 'FACES15') {
      setPromoApplied(true);
    } else {
      setPromoError('Enter code FACES15 for 15% privilege savings.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please complete your delivery name, mobile number, address, and PIN code.');
      return;
    }
    setFormError(null);

    const orderNum = `FC-${Math.floor(1000 + Math.random() * 9000)}`;
    const snapshot: ConfirmedOrder = {
      orderNumber: orderNum,
      customerName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim() || 'Mumbai',
      postalCode: postalCode.trim(),
      paymentMethod,
      items: [...items],
      subtotal,
      discount,
      shipping,
      total,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setConfirmedOrder(snapshot);
    onClearCart();
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      <div className="relative w-full max-w-md bg-[#FBFBF9] h-full flex flex-col justify-between shadow-2xl border-l border-[#141312]/10">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#141312]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to shopping bag"
                className="p-1.5 rounded-md hover:bg-[#F4F2EE] text-[#141312]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-[#141312]">
              {step === 'bag' && 'Shopping Bag'}
              {step === 'checkout' && 'Express Checkout'}
              {step === 'confirmed' && 'Order Verification'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              if (step === 'confirmed') setStep('bag');
              onClose();
            }}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#141312] hover:bg-[#F4F2EE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Progress Banner */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-3 bg-[#F4F2EE] border-b border-[#141312]/8 flex items-center gap-2.5 text-xs text-[#141312]">
            <Truck className="w-4 h-4 text-[#9E1B32] shrink-0" />
            {amountToFreeDelivery === 0 ? (
              <span>
                Complimentary Express Delivery unlocked (Threshold: ₹{FREE_DELIVERY_THRESHOLD}).
              </span>
            ) : (
              <span>
                Add <strong className="font-mono tabular-nums">₹{amountToFreeDelivery}</strong> more
                for Free Express Delivery (Free above ₹{FREE_DELIVERY_THRESHOLD}).
              </span>
            )}
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-[#6B6661] mb-3 stroke-[1.5]" />
                  <p className="text-base font-semibold text-[#141312] mb-1">
                    Your FACES CANADA Bag is Empty
                  </p>
                  <p className="text-xs text-[#6B6661] max-w-xs mb-6 leading-relaxed">
                    Explore our undertone-calibrated lipsticks, foundations, and kajals or test
                    shades live in the Virtual Try-On Studio.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#141312] rounded-lg hover:bg-[#9E1B32] transition-colors"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-4 p-3.5 bg-[#F4F2EE] rounded-xl border border-[#141312]/8"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-18 h-18 rounded-lg object-cover bg-[#E6E2DA] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-semibold text-[#141312] truncate">
                            {item.product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-[#6B6661] hover:text-[#9E1B32] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Shade Swatch & SKU */}
                        <div className="flex items-center gap-1.5 mt-1 mb-2.5">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: item.shade.hex }}
                          />
                          <span className="text-[11px] text-[#57524E] truncate">
                            {item.shade.code} {item.shade.name} ·{' '}
                            <span className="font-mono">{item.shade.sku}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-[#141312]/15 rounded-md bg-[#FBFBF9]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, -1)}
                              aria-label="Decrease quantity"
                              className="p-1 text-[#141312] hover:bg-[#EAE6DF]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono tabular-nums font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, 1)}
                              aria-label="Increase quantity"
                              className="p-1 text-[#141312] hover:bg-[#EAE6DF]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-mono tabular-nums font-semibold text-[#141312]">
                            ₹{item.product.priceInr * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code Box */}
                  <form onSubmit={handleApplyPromo} className="pt-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Privilege Code (Try FACES15)"
                        className="flex-1 px-3 py-2 text-xs bg-[#F4F2EE] border border-[#141312]/12 rounded-lg text-[#141312] placeholder:text-[#6B6661] focus:outline-none focus:border-[#141312]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 text-xs font-semibold bg-[#141312] text-white rounded-lg hover:bg-[#2B2927] transition-colors whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-[11px] text-emerald-800 mt-1.5">
                        Code FACES15 applied — 15% privilege discount active.
                      </p>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-[#9E1B32] mt-1.5">{promoError}</p>
                    )}
                  </form>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <p className="text-xs text-[#57524E] leading-relaxed">
                Complete your delivery verification below. Orders ship from our climate-controlled
                Mumbai & Delhi fulfillment centers within 24 hours.
              </p>

              <div>
                <label className="block text-xs font-medium text-[#141312] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aafiya Thasneem"
                  className="w-full px-3.5 py-2 text-xs bg-[#F4F2EE] border border-[#141312]/15 rounded-lg text-[#141312] focus:outline-none focus:border-[#141312]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#141312] mb-1">
                  Mobile Number (For SMS Dispatch Tracking) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 44120"
                  className="w-full px-3.5 py-2 text-xs bg-[#F4F2EE] border border-[#141312]/15 rounded-lg text-[#141312] focus:outline-none focus:border-[#141312]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#141312] mb-1">
                  Street Address & Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="42 Linking Road, Bandra West"
                  className="w-full px-3.5 py-2 text-xs bg-[#F4F2EE] border border-[#141312]/15 rounded-lg text-[#141312] focus:outline-none focus:border-[#141312]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#141312] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-3.5 py-2 text-xs bg-[#F4F2EE] border border-[#141312]/15 rounded-lg text-[#141312] focus:outline-none focus:border-[#141312]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#141312] mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400050"
                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#F4F2EE] border border-[#141312]/15 rounded-lg text-[#141312] focus:outline-none focus:border-[#141312]"
                  />
                </div>
              </div>

              {/* Payment Terms Selection */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#141312] mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'COD'
                        ? 'border-[#9E1B32] bg-[#9E1B32]/5'
                        : 'border-[#141312]/12 bg-[#F4F2EE]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#141312]">Cash on Delivery</p>
                    <p className="text-[11px] text-[#6B6661] mt-0.5">
                      Pay ₹{total} via Cash/UPI at doorstep
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI_CARD')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'UPI_CARD'
                        ? 'border-[#9E1B32] bg-[#9E1B32]/5'
                        : 'border-[#141312]/12 bg-[#F4F2EE]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#141312]">Instant UPI / Card</p>
                    <p className="text-[11px] text-[#6B6661] mt-0.5">
                      Zero convenience fee
                    </p>
                  </button>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-[#9E1B32] bg-[#9E1B32]/8 p-2.5 rounded-lg">
                  {formError}
                </p>
              )}
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-5 py-2">
              <div className="p-4 bg-emerald-950/5 border border-emerald-800/20 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#141312]">
                    Order #{confirmedOrder.orderNumber} Confirmed — Preparing Shipment
                  </p>
                  <p className="text-xs text-[#57524E] mt-1">
                    Verified for {confirmedOrder.customerName} ({confirmedOrder.phone}) ·{' '}
                    {confirmedOrder.timestamp}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F4F2EE] rounded-xl border border-[#141312]/8 space-y-2 text-xs">
                <p className="font-semibold text-[#141312]">Delivery Destination</p>
                <p className="text-[#57524E]">
                  {confirmedOrder.address}, {confirmedOrder.city} — {confirmedOrder.postalCode}
                </p>
                <p className="text-[#57524E] pt-1">
                  Payment Terms:{' '}
                  <strong className="text-[#141312]">
                    {confirmedOrder.paymentMethod === 'COD'
                      ? `Cash on Delivery (₹${confirmedOrder.total} due upon receipt)`
                      : `Prepaid UPI/Card (₹${confirmedOrder.total})`}
                  </strong>
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#141312]">Itemized Shade Receipt</p>
                {confirmedOrder.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-xs py-2 border-b border-[#141312]/8"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                        style={{ backgroundColor: item.shade.hex }}
                      />
                      <span className="text-[#141312] truncate">
                        {item.quantity}x {item.product.name} ({item.shade.code} {item.shade.name})
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-[#141312] shrink-0 ml-2">
                      ₹{item.product.priceInr * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#F4F2EE] rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-[#57524E]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">₹{confirmedOrder.subtotal}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Privilege Savings (FACES15)</span>
                    <span className="font-mono tabular-nums">-₹{confirmedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#57524E]">
                  <span>Express Climate Shipping</span>
                  <span className="font-mono tabular-nums">
                    {confirmedOrder.shipping === 0 ? 'FREE' : `₹${confirmedOrder.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#141312] pt-2 border-t border-[#141312]/10">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums">₹{confirmedOrder.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 border-t border-[#141312]/10 bg-[#FBFBF9] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#57524E]">
                <span>Bag Subtotal</span>
                <span className="font-mono tabular-nums">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Privilege Discount (15%)</span>
                  <span className="font-mono tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#57524E]">
                <span>Express Delivery</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#141312] pt-2 border-t border-[#141312]/10">
                <span>Total Payable</span>
                <span className="font-mono tabular-nums">₹{total}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#9E1B32] rounded-lg hover:bg-[#821428] transition-colors"
              >
                Proceed to Express Checkout · ₹{total}
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#9E1B32] rounded-lg hover:bg-[#821428] transition-colors"
              >
                Confirm Order ({paymentMethod === 'COD' ? 'Cash on Delivery' : 'Instant Pay'}) · ₹{total}
              </button>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 border-t border-[#141312]/10 bg-[#FBFBF9]">
            <button
              type="button"
              onClick={() => {
                setStep('bag');
                onClose();
              }}
              className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#141312] rounded-lg hover:bg-[#2B2927] transition-colors"
            >
              Continue Exploring FACES CANADA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
