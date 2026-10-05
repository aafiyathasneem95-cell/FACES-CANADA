import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ShoppingBag, Check, ArrowUpRight } from 'lucide-react';
import {
  PRODUCTS,
  Product,
  ProductShade,
  UndertoneType,
} from '../data/catalog';

interface ProductCatalogSectionProps {
  onTryOnProductShade: (product: Product, shade: ProductShade) => void;
  onAddToBag: (product: Product, shade: ProductShade, quantity?: number) => void;
  onOpenProductDetail: (product: Product, initialShade: ProductShade) => void;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  onTryOnProductShade,
  onAddToBag,
  onOpenProductDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Lips' | 'Face' | 'Eyes'>('All');
  const [selectedUndertone, setSelectedUndertone] = useState<'All' | UndertoneType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Track active shade per product card
  const [selectedShades, setSelectedShades] = useState<Record<string, ProductShade>>(() => {
    const initial: Record<string, ProductShade> = {};
    PRODUCTS.forEach((p) => {
      initial[p.id] = p.shades[0];
    });
    return initial;
  });

  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedUndertone !== 'All') {
        const hasUndertone = product.shades.some((s) => s.undertone === selectedUndertone);
        if (!hasUndertone) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.name.toLowerCase().includes(q);
        const matchesCollection = product.collection.toLowerCase().includes(q);
        const matchesShade = product.shades.some(
          (s) => s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q)
        );
        const matchesActives = product.keyActives.some((a) => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCollection && !matchesShade && !matchesActives) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceInr - b.priceInr;
      if (sortBy === 'price-desc') return b.priceInr - a.priceInr;
      return 0;
    });
  }, [selectedCategory, selectedUndertone, searchQuery, sortBy]);

  const handleSelectCardShade = (productId: string, shade: ProductShade) => {
    setSelectedShades((prev) => ({
      ...prev,
      [productId]: shade,
    }));
  };

  const handleQuickAdd = (product: Product, shade: ProductShade) => {
    onAddToBag(product, shade, 1);
    const key = `${product.id}-${shade.id}`;
    setJustAddedId(key);
    setTimeout(() => {
      setJustAddedId((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  return (
    <section id="catalog" className="py-16 lg:py-24 max-w-[1280px] mx-auto px-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs text-[#6B6661] mb-2">
            01. Curated Formulations · Undertone-Calibrated Pigments · Paraben Free
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-[#141312]">
            The Signature Collection
          </h2>
        </div>

        {/* Search Input & Sort Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B6661] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shade, active, or SKU..."
              aria-label="Search products or shades"
              className="pl-9 pr-4 py-2 text-xs bg-[#F4F2EE] border border-[#141312]/10 rounded-lg text-[#141312] placeholder:text-[#6B6661] focus:outline-none focus:border-[#141312] w-60 transition-colors"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
            aria-label="Sort products"
            className="px-3.5 py-2 text-xs font-medium bg-[#F4F2EE] border border-[#141312]/10 rounded-lg text-[#141312] focus:outline-none focus:border-[#141312]"
          >
            <option value="featured">Sort: Featured Edit</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Interactive Filter Bar (Functional Segmented Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-[#141312]/10">
        {/* Category Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#F4F2EE] rounded-lg">
          {(['All', 'Lips', 'Face', 'Eyes'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#FBFBF9] text-[#141312] shadow-xs'
                  : 'text-[#57524E] hover:text-[#141312]'
              }`}
            >
              {cat === 'All' ? 'All Formulations (6)' : cat}
            </button>
          ))}
        </div>

        {/* Undertone Calibration Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B6661]">Undertone Calibration:</span>
          <div className="flex items-center gap-1 p-1 bg-[#F4F2EE] rounded-lg">
            {(['All', 'Warm', 'Neutral', 'Cool'] as const).map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setSelectedUndertone(tone)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedUndertone === tone
                    ? 'bg-[#141312] text-[#FBFBF9]'
                    : 'text-[#57524E] hover:text-[#141312]'
                }`}
              >
                {tone === 'All' ? 'All Tones' : `${tone} Undertone`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#F4F2EE] rounded-xl border border-[#141312]/8">
          <p className="text-base font-medium text-[#141312] mb-2">
            No formulations match your current filter criteria.
          </p>
          <p className="text-xs text-[#6B6661] mb-5">
            Try clearing your search query or switching undertone filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedUndertone('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-[#141312] rounded-lg hover:bg-[#2B2927] transition-colors"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const activeShade = selectedShades[product.id] || product.shades[0];
            const addKey = `${product.id}-${activeShade.id}`;
            const isAdded = justAddedId === addKey;

            return (
              <article
                key={product.id}
                className="group flex flex-col bg-[#FBFBF9] border border-[#141312]/10 rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
              >
                {/* Product Image Container (70% visual weight, uniform #F4F2EE neutral stone backdrop) */}
                <div className="relative aspect-[4/3] w-full bg-[#F4F2EE] overflow-hidden">
                  <img
                    src={product.image}
                    alt={`${product.name} in ${activeShade.name}`}
                    referrerPolicy="no-referrer"
                    onClick={() => onOpenProductDetail(product, activeShade)}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  {/* Top-left single quiet status text (Max 1 subtle tag) */}
                  {product.statusTag && (
                    <span className="absolute top-3.5 left-3.5 text-[11px] font-medium tracking-wide text-[#141312] bg-[#FBFBF9]/90 backdrop-blur-xs px-2.5 py-1 rounded">
                      {product.statusTag}
                    </span>
                  )}

                  {/* Active Shade Swatch Preview Indicator on Image Corner */}
                  <button
                    type="button"
                    onClick={() => onTryOnProductShade(product, activeShade)}
                    title={`Try on ${activeShade.name} in Virtual Mirror`}
                    className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#141312]/85 text-[#FBFBF9] backdrop-blur-xs rounded-lg hover:bg-[#9E1B32] transition-colors whitespace-nowrap"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/60 shrink-0"
                      style={{ backgroundColor: activeShade.hex }}
                    />
                    <Sparkles className="w-3.5 h-3.5" />
                    Virtual Try-On
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Clean Metadata with typographic separators */}
                    <div className="flex items-center gap-1.5 text-xs text-[#6B6661] mb-1.5">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.defaultFinish}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.netWeight}</span>
                    </div>

                    {/* Product Title & Price Baseline */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3
                        onClick={() => onOpenProductDetail(product, activeShade)}
                        className="text-lg font-semibold text-[#141312] group-hover:text-[#9E1B32] transition-colors cursor-pointer leading-snug"
                      >
                        {product.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-[15px] font-semibold font-mono tabular-nums text-[#141312]">
                          ₹{product.priceInr}
                        </span>
                        <span className="block text-[11px] font-mono tabular-nums text-[#6B6661] line-through">
                          ₹{product.mrpInr}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#57524E] line-clamp-2 mb-4 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Interactive Shade Selector Strip */}
                  <div className="pt-4 border-t border-[#141312]/8">
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="font-medium text-[#141312] truncate">
                        Shade {activeShade.code}: {activeShade.name}
                      </span>
                      <span className="text-[11px] text-[#6B6661] shrink-0">
                        {activeShade.undertone} Tone
                      </span>
                    </div>

                    {/* Swatch Row */}
                    <div className="flex items-center gap-2 mb-5">
                      {product.shades.map((sh) => {
                        const isSelected = sh.id === activeShade.id;
                        return (
                          <button
                            key={sh.id}
                            type="button"
                            onClick={() => handleSelectCardShade(product.id, sh)}
                            aria-label={`Select shade ${sh.name}`}
                            title={`${sh.code} ${sh.name} (${sh.undertone})`}
                            className={`w-6 h-6 rounded-full transition-transform ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-[#141312] scale-110'
                                : 'opacity-80 hover:opacity-100 hover:scale-105'
                            }`}
                            style={{ backgroundColor: sh.hex }}
                          />
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => onOpenProductDetail(product, activeShade)}
                        className="ml-auto inline-flex items-center gap-0.5 text-xs font-medium text-[#57524E] hover:text-[#141312] whitespace-nowrap"
                      >
                        Details
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Primary Card Actions */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => onTryOnProductShade(product, activeShade)}
                        className="px-3 py-2 text-xs font-medium text-[#141312] bg-[#F4F2EE] rounded-lg hover:bg-[#E7E3DC] transition-colors whitespace-nowrap truncate"
                      >
                        Try On {activeShade.code}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product, activeShade)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap truncate ${
                          isAdded
                            ? 'bg-emerald-800 text-white'
                            : 'bg-[#141312] text-[#FBFBF9] hover:bg-[#9E1B32]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                            Add · ₹{product.priceInr}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
