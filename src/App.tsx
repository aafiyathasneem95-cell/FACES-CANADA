/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  PRODUCTS,
  HERO_CAMPAIGN_IMAGE,
  Product,
  ProductShade,
  TryOnZone,
  EditorialLook,
} from './data/catalog';
import { VirtualTryOnStudio, ActiveTryOnState } from './components/VirtualTryOnStudio';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShadeFinderAndHeritage } from './components/ShadeFinderAndHeritage';
import { CartDrawer, CartItem } from './components/CartDrawer';

const CART_STORAGE_KEY = 'faces_canada_cart_v1';

export default function App() {
  // Initialize Virtual Try-On State with default products for each of the 4 facial zones
  const [tryOnState, setTryOnState] = useState<ActiveTryOnState>(() => {
    const lipProd = PRODUCTS.find((p) => p.id === 'weightless-matte-lipstick')!;
    const cheekProd = PRODUCTS.find((p) => p.id === 'berry-blush-baked-cheek-tint')!;
    const eyeProd = PRODUCTS.find((p) => p.id === 'magneteyes-kajal-eyeliner-duo')!;
    const compProd = PRODUCTS.find((p) => p.id === 'hydra-matte-3in1-foundation')!;

    return {
      lips: {
        product: lipProd,
        shade: lipProd.shades[0],
        intensity: 75,
        finish: lipProd.defaultFinish,
        enabled: true,
      },
      cheeks: {
        product: cheekProd,
        shade: cheekProd.shades[0],
        intensity: 60,
        finish: cheekProd.defaultFinish,
        enabled: true,
      },
      eyes: {
        product: eyeProd,
        shade: eyeProd.shades[0],
        intensity: 75,
        finish: eyeProd.defaultFinish,
        enabled: true,
      },
      complexion: {
        product: compProd,
        shade: compProd.shades[2], // 03 Golden Sand
        intensity: 55,
        finish: compProd.defaultFinish,
        enabled: true,
      },
    };
  });

  const [focusedZone, setFocusedZone] = useState<TryOnZone>('lips');

  // Shopping Bag State (persisted to localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    const starterProd = PRODUCTS[1]; // Ultime Pro HD Intense Matte Lips + Primer
    const starterShade = starterProd.shades[0]; // 14 Tease Scarlet
    return [
      {
        key: `${starterProd.id}-${starterShade.id}`,
        product: starterProd,
        shade: starterShade,
        quantity: 1,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Product Detail Modal State
  const [detailModalState, setDetailModalState] = useState<{
    product: Product | null;
    shade: ProductShade | null;
  }>({ product: null, shade: null });

  // Handlers for Virtual Try-On
  const handleUpdateZone = (
    zone: TryOnZone,
    updates: Partial<ActiveTryOnState[TryOnZone]>
  ) => {
    setTryOnState((prev) => ({
      ...prev,
      [zone]: {
        ...prev[zone],
        ...updates,
      },
    }));
  };

  const handleApplyEditorialLook = (look: EditorialLook) => {
    const lipProd = PRODUCTS.find((p) => p.id === look.lipProductId)!;
    const lipShade = lipProd.shades.find((s) => s.id === look.lipShadeId) || lipProd.shades[0];

    const cheekProd = PRODUCTS.find((p) => p.id === look.cheekProductId)!;
    const cheekShade =
      cheekProd.shades.find((s) => s.id === look.cheekShadeId) || cheekProd.shades[0];

    const eyeProd = PRODUCTS.find((p) => p.id === look.eyeProductId)!;
    const eyeShade = eyeProd.shades.find((s) => s.id === look.eyeShadeId) || eyeProd.shades[0];

    const compProd = PRODUCTS.find((p) => p.id === look.complexionProductId)!;
    const compShade =
      compProd.shades.find((s) => s.id === look.complexionShadeId) || compProd.shades[0];

    setTryOnState({
      lips: {
        product: lipProd,
        shade: lipShade,
        intensity: 80,
        finish: lipProd.defaultFinish,
        enabled: true,
      },
      cheeks: {
        product: cheekProd,
        shade: cheekShade,
        intensity: 65,
        finish: cheekProd.defaultFinish,
        enabled: true,
      },
      eyes: {
        product: eyeProd,
        shade: eyeShade,
        intensity: 80,
        finish: eyeProd.defaultFinish,
        enabled: true,
      },
      complexion: {
        product: compProd,
        shade: compShade,
        intensity: 60,
        finish: compProd.defaultFinish,
        enabled: true,
      },
    });
  };

  const handleTryOnFromCatalog = (product: Product, shade: ProductShade) => {
    const zone = product.tryOnZone;
    handleUpdateZone(zone, {
      product,
      shade,
      finish: product.defaultFinish,
      enabled: true,
    });
    setFocusedZone(zone);
    const el = document.getElementById('virtual-try-on');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyPairingToMirror = (
    foundationProduct: Product,
    foundationShade: ProductShade,
    lipProduct: Product,
    lipShade: ProductShade
  ) => {
    setTryOnState((prev) => ({
      ...prev,
      complexion: {
        ...prev.complexion,
        product: foundationProduct,
        shade: foundationShade,
        enabled: true,
      },
      lips: {
        ...prev.lips,
        product: lipProduct,
        shade: lipShade,
        enabled: true,
      },
    }));
    setFocusedZone('lips');
    const el = document.getElementById('virtual-try-on');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart Handlers
  const handleAddToBag = (product: Product, shade: ProductShade, quantity = 1) => {
    const key = `${product.id}-${shade.id}`;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { key, product, shade, quantity }];
    });
  };

  const handleAddCompleteLookToBag = () => {
    (['lips', 'eyes', 'cheeks', 'complexion'] as TryOnZone[]).forEach((z) => {
      const zoneState = tryOnState[z];
      if (zoneState.enabled) {
        handleAddToBag(zoneState.product, zoneState.shade, 1);
      }
    });
    setIsCartOpen(true);
  };

  const handleAddPairingToBag = (
    foundationProduct: Product,
    foundationShade: ProductShade,
    lipProduct: Product,
    lipShade: ProductShade
  ) => {
    handleAddToBag(foundationProduct, foundationShade, 1);
    handleAddToBag(lipProduct, lipShade, 1);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#141312]">
      {/* TOP NAVIGATION BAR (Strict 3-Zone Contract: Single Wordmark — 4 Nav Links — 2 Actions) */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#141312]/10">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single Text Element Wordmark */}
          <a
            href="#"
            className="font-display text-2xl font-semibold tracking-tight text-[#141312] whitespace-nowrap"
          >
            FACES CANADA
          </a>

          {/* Zone 2: 4 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#45413E]">
            <a
              href="#catalog"
              className="hover:text-[#141312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Collection
            </a>
            <a
              href="#virtual-try-on"
              className="hover:text-[#141312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Virtual Try-On
            </a>
            <a
              href="#shade-finder"
              className="hover:text-[#141312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Shade Match
            </a>
            <a
              href="#heritage"
              className="hover:text-[#141312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Studio Proof
            </a>
          </nav>

          {/* Zone 3: 2 Primary Actions */}
          <div className="flex items-center gap-3">
            <a
              href="#virtual-try-on"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#141312] bg-[#F4F2EE] rounded-lg hover:bg-[#EAE6DF] transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9E1B32]" />
              Virtual Mirror
            </a>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#141312] rounded-lg hover:bg-[#9E1B32] transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({totalBagCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* SECTION 1: STOREFRONT CAMPAIGN HERO */}
        <section className="py-12 lg:py-20 max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Narrative (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#6B6661]">
                <span>Toronto Formulated</span>
                <span aria-hidden="true">·</span>
                <span>Est. 1974</span>
                <span aria-hidden="true">·</span>
                <span>Ultime Pro HD & Weightless Edit</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#141312] leading-[1.08]">
                Second-Skin Pigment, Calibrated for Every Undertone.
              </h1>

              <p className="text-base text-[#45413E] leading-relaxed">
                From our signature ceramide-infused Ultime Pro HD lip crayons to 24-hour
                humidity-proof foundations, experience high-impact Canadian colour chemistry crafted
                without parabens, mineral oils, or grey cast.
              </p>

              {/* Single Dominant Action Pair */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#9E1B32] rounded-lg hover:bg-[#821428] transition-colors whitespace-nowrap"
                >
                  Explore Signature Collection
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#virtual-try-on"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-[#141312] bg-[#F4F2EE] border border-[#141312]/15 rounded-lg hover:border-[#141312] transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-[#9E1B32]" />
                  Try Shades in Virtual Mirror
                </a>
              </div>

              {/* Quantitative Rigor & Proof Bar */}
              <div className="pt-6 border-t border-[#141312]/10 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-mono font-semibold text-sm tabular-nums text-[#141312]">
                    16Hr Wear
                  </p>
                  <p className="text-[#6B6661] mt-0.5">Transfer-proof botanical lock</p>
                </div>
                <div>
                  <p className="font-mono font-semibold text-sm tabular-nums text-[#141312]">
                    26 Shades
                  </p>
                  <p className="text-[#6B6661] mt-0.5">Warm, neutral & cool calibrated</p>
                </div>
                <div>
                  <p className="font-mono font-semibold text-sm tabular-nums text-[#141312]">
                    ₹799+ Free
                  </p>
                  <p className="text-[#6B6661] mt-0.5">Climate-controlled dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Campaign Visual (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#EAE6DF] border border-[#141312]/10">
                <img
                  src={HERO_CAMPAIGN_IMAGE}
                  alt="FACES CANADA Editorial Campaign featuring Weightless Matte Lipstick in 01 Crimson Silk"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Measured Contrast Scrim for Media Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[#FBFBF9]">
                    <div>
                      <p className="text-xs text-[#E5E0D8] mb-1">
                        Featured Runway Shade · Weightless Matte Finish Lipstick
                      </p>
                      <p className="text-xl font-display font-semibold">
                        01 Crimson Silk — ₹299
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleTryOnFromCatalog(PRODUCTS[0], PRODUCTS[0].shades[0])
                        }
                        className="px-4 py-2 text-xs font-semibold bg-[#FBFBF9] text-[#141312] rounded-lg hover:bg-[#EAE6DF] transition-colors whitespace-nowrap"
                      >
                        Try Shade Live
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddToBag(PRODUCTS[0], PRODUCTS[0].shades[0], 1);
                          setIsCartOpen(true);
                        }}
                        className="px-4 py-2 text-xs font-semibold bg-[#9E1B32] text-white rounded-lg hover:bg-[#821428] transition-colors whitespace-nowrap"
                      >
                        Add to Bag · ₹299
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SIGNATURE PRODUCT CATALOG */}
        <ProductCatalogSection
          onTryOnProductShade={handleTryOnFromCatalog}
          onAddToBag={handleAddToBag}
          onOpenProductDetail={(product, shade) =>
            setDetailModalState({ product, shade })
          }
        />

        {/* SECTION 3: INTERACTIVE VIRTUAL TRY-ON STUDIO */}
        <VirtualTryOnStudio
          activeState={tryOnState}
          onUpdateZone={handleUpdateZone}
          onApplyEditorialLook={handleApplyEditorialLook}
          onAddSingleToBag={(product, shade) => {
            handleAddToBag(product, shade, 1);
            setIsCartOpen(true);
          }}
          onAddLookToBag={handleAddCompleteLookToBag}
          focusedZone={focusedZone}
          onSelectFocusedZone={setFocusedZone}
        />

        {/* SECTION 4: UNDERTONE SHADE DIAGNOSTIC & ATTRIBUTABLE PROOF */}
        <ShadeFinderAndHeritage
          onApplyPairingToMirror={handleApplyPairingToMirror}
          onAddPairingToBag={handleAddPairingToBag}
        />
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="bg-[#141312] text-[#FBFBF9] py-14 border-t border-[#141312]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/12">
            <div className="md:col-span-5 space-y-3">
              <p className="font-display text-2xl font-semibold tracking-tight text-[#FBFBF9]">
                FACES CANADA
              </p>
              <p className="text-xs text-[#C9C4BC] max-w-sm leading-relaxed">
                Born in Toronto in 1974. High-performance colour cosmetics and botanical skincare
                calibrated for global undertones. 100% cruelty-free and dermatologically tested.
              </p>
              <p className="text-xs text-[#C9C4BC] pt-1">
                Privilege Offer: Apply code <span className="font-mono text-white">FACES15</span> in
                your Shopping Bag for 15% savings.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <p className="font-semibold text-white mb-2.5">Formulations</p>
              <ul className="space-y-2 text-[#C9C4BC]">
                <li>
                  <a href="#catalog" className="hover:text-white transition-colors">
                    Ultime Pro HD Lip Crayons
                  </a>
                </li>
                <li>
                  <a href="#catalog" className="hover:text-white transition-colors">
                    Weightless Matte Bullet Lipsticks
                  </a>
                </li>
                <li>
                  <a href="#catalog" className="hover:text-white transition-colors">
                    3-in-1 All Day Hydra Matte Foundation
                  </a>
                </li>
                <li>
                  <a href="#catalog" className="hover:text-white transition-colors">
                    Magneteyes 24Hr Kajal & Liner
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <p className="font-semibold text-white mb-2.5">Digital Studio & Care</p>
              <ul className="space-y-2 text-[#C9C4BC]">
                <li>
                  <a href="#virtual-try-on" className="hover:text-white transition-colors">
                    Interactive 4-Zone Virtual Try-On Mirror
                  </a>
                </li>
                <li>
                  <a href="#shade-finder" className="hover:text-white transition-colors">
                    Undertone & Wrist Vein Shade Diagnostic
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Express Checkout & Cash on Delivery Verification
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E9890]">
            <p>© {new Date().getFullYear()} Faces Cosmetics India Pvt. Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Cruelty-Free Certified</span>
              <span>·</span>
              <span>Ophthalmologically & Dermatologically Tested</span>
            </div>
          </div>
        </div>
      </footer>

      {/* CONTIGUOUS PRODUCT DETAIL MODAL (PDP) */}
      <ProductDetailModal
        product={detailModalState.product}
        initialShade={detailModalState.shade}
        onClose={() => setDetailModalState({ product: null, shade: null })}
        onAddToBag={handleAddToBag}
        onTryOn={handleTryOnFromCatalog}
      />

      {/* SLIDE-OVER SHOPPING BAG & CHECKOUT DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
