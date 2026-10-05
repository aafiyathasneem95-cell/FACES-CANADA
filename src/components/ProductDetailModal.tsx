import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import { Product, ProductShade } from '../data/catalog';

interface ProductDetailModalProps {
  product: Product | null;
  initialShade: ProductShade | null;
  onClose: () => void;
  onAddToBag: (product: Product, shade: ProductShade, quantity: number) => void;
  onTryOn: (product: Product, shade: ProductShade) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialShade,
  onClose,
  onAddToBag,
  onTryOn,
}) => {
  const [selectedShade, setSelectedShade] = useState<ProductShade | null>(initialShade);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedShade(initialShade || product.shades[0]);
      setQuantity(1);
    }
  }, [product, initialShade]);

  if (!product || !selectedShade) return null;

  const handleAdd = () => {
    onAddToBag(product, selectedShade, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div className="relative w-full max-w-4xl bg-[#FBFBF9] border border-[#141312]/12 rounded-2xl overflow-hidden shadow-2xl my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FBFBF9]/90 border border-[#141312]/12 flex items-center justify-center text-[#141312] hover:bg-[#141312] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* LEFT: Sticky Product Visual & Swatch Preview */}
          <div className="md:col-span-6 bg-[#F4F2EE] flex flex-col justify-between p-6 lg:p-8">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#EAE6DF]">
              <img
                src={product.image}
                alt={`${product.name} — ${selectedShade.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md bg-[#141312]/80 backdrop-blur-xs text-[#FBFBF9] flex items-center gap-2 text-xs"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/60"
                  style={{ backgroundColor: selectedShade.hex }}
                />
                <span>
                  {selectedShade.code} {selectedShade.name}
                </span>
              </div>
            </div>

            {/* Key Actives & Ritual */}
            <div className="mt-6 pt-6 border-t border-[#141312]/10 space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#141312] mb-1">
                  Active Botanicals & Dermatological Profile
                </p>
                <p className="text-xs text-[#57524E]">
                  {product.keyActives.join(' · ')} · Paraben & Mineral Oil Free
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#141312] mb-1">
                  Studio Application Ritual
                </p>
                <p className="text-xs text-[#57524E] leading-relaxed">
                  {product.applicationRitual}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-1.5 text-xs text-[#6B6661] mb-2">
                <span>{product.collection}</span>
                <span aria-hidden="true">·</span>
                <span>{product.defaultFinish}</span>
                <span aria-hidden="true">·</span>
                <span>{product.netWeight}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-800 font-medium">In Stock</span>
              </div>

              <h2
                id="pdp-title"
                className="text-2xl lg:text-3xl font-semibold text-[#141312] leading-tight mb-3"
              >
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-[#141312]/10">
                <span className="text-2xl font-semibold font-mono tabular-nums text-[#141312]">
                  ₹{product.priceInr}
                </span>
                <span className="text-sm font-mono tabular-nums text-[#6B6661] line-through">
                  MRP ₹{product.mrpInr}
                </span>
                <span className="text-xs text-[#9E1B32] font-medium">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-sm text-[#45413E] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variant / Shade Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold text-[#141312]">
                    Shade: {selectedShade.code} {selectedShade.name}
                  </span>
                  <span className="font-mono text-[#6B6661]">
                    SKU: {selectedShade.sku} · {selectedShade.undertone}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-3">
                  {product.shades.map((sh) => {
                    const active = sh.id === selectedShade.id;
                    return (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setSelectedShade(sh)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                          active
                            ? 'border-[#141312] bg-[#F4F2EE]'
                            : 'border-[#141312]/10 hover:border-[#141312]/30'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-black/15 mb-1 flex items-center justify-center"
                          style={{ backgroundColor: sh.hex }}
                        >
                          {active && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                        </span>
                        <span className="text-[11px] font-medium text-[#141312] truncate w-full text-center">
                          {sh.code}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-[#57524E]">
                  {selectedShade.description}
                </p>
              </div>
            </div>

            {/* Contiguous Purchase Controls */}
            <div className="pt-5 border-t border-[#141312]/10 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#141312]/15 rounded-lg bg-[#F4F2EE]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#141312] hover:bg-[#E5E1D9] rounded-l-lg transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono tabular-nums font-semibold text-[#141312]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#141312] hover:bg-[#E5E1D9] rounded-r-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Buy CTA */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    addedFeedback
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#9E1B32] text-white hover:bg-[#821428]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag · ₹{product.priceInr * quantity}
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Virtual Try-On Trigger */}
              <button
                type="button"
                onClick={() => {
                  onTryOn(product, selectedShade);
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#141312] bg-[#F4F2EE] border border-[#141312]/15 rounded-lg hover:border-[#141312] transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#9E1B32]" />
                Try {selectedShade.name} in Virtual Try-On Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
