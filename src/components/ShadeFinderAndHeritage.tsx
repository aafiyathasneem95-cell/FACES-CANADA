import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS, Product, ProductShade, UndertoneType } from '../data/catalog';

interface ShadeFinderAndHeritageProps {
  onApplyPairingToMirror: (
    foundationProduct: Product,
    foundationShade: ProductShade,
    lipProduct: Product,
    lipShade: ProductShade
  ) => void;
  onAddPairingToBag: (
    foundationProduct: Product,
    foundationShade: ProductShade,
    lipProduct: Product,
    lipShade: ProductShade
  ) => void;
}

export const ShadeFinderAndHeritage: React.FC<ShadeFinderAndHeritageProps> = ({
  onApplyPairingToMirror,
  onAddPairingToBag,
}) => {
  const [skinDepth, setSkinDepth] = useState<'fair-light' | 'medium-golden' | 'deep-rich'>(
    'medium-golden'
  );
  const [veinTone, setVeinTone] = useState<UndertoneType>('Warm');
  const [lipPreference, setLipPreference] = useState<'crimson' | 'nude' | 'berry'>('crimson');
  const [pairingAdded, setPairingAdded] = useState<boolean>(false);

  // Compute recommended Foundation + Lip pairing
  const foundationProduct = PRODUCTS.find((p) => p.id === 'hydra-matte-3in1-foundation')!;
  const lipProduct = PRODUCTS.find((p) => p.id === 'ultime-pro-hd-matte-crayon')!;

  const recommendedFoundationShade = (() => {
    if (skinDepth === 'fair-light') {
      return veinTone === 'Cool' ? foundationProduct.shades[0] : foundationProduct.shades[1];
    }
    if (skinDepth === 'medium-golden') {
      return veinTone === 'Warm' ? foundationProduct.shades[2] : foundationProduct.shades[3];
    }
    return foundationProduct.shades[4];
  })();

  const recommendedLipShade = (() => {
    if (lipPreference === 'crimson') {
      return veinTone === 'Warm' ? lipProduct.shades[0] : lipProduct.shades[4];
    }
    if (lipPreference === 'nude') {
      return veinTone === 'Warm' ? lipProduct.shades[1] : lipProduct.shades[3];
    }
    return lipProduct.shades[2];
  })();

  const handleAddBoth = () => {
    onAddPairingToBag(
      foundationProduct,
      recommendedFoundationShade,
      lipProduct,
      recommendedLipShade
    );
    setPairingAdded(true);
    setTimeout(() => setPairingAdded(false), 2000);
  };

  return (
    <section
      id="shade-finder"
      className="py-16 lg:py-24 max-w-[1280px] mx-auto px-6 border-t border-[#141312]/10"
    >
      {/* Top Diagnostic Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <p className="text-xs text-[#6B6661] mb-2">
            03. Undertone Calibration · Toronto & Mumbai Color Lab
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-[#141312] mb-4">
            Precision Shade Match Diagnostic
          </h2>
          <p className="text-sm text-[#45413E] leading-relaxed mb-6">
            Conventional foundations turn ashy on golden or olive undertones because they use flat
            titanium white bases. Every FACES CANADA complexion and lip pigment is triple-milled
            with warm iron oxides and botanical esters to stay true for 24 hours across 85%
            tropical humidity.
          </p>

          {/* Quantitative Proof Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#141312]/10">
            <div>
              <p className="text-2xl font-semibold font-mono tabular-nums text-[#141312]">
                0.0%
              </p>
              <p className="text-xs text-[#6B6661] mt-1">
                Grey Oxidation Over 16 Hours
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold font-mono tabular-nums text-[#141312]">
                1974
              </p>
              <p className="text-xs text-[#6B6661] mt-1">
                Founded in Toronto, Canada
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold font-mono tabular-nums text-[#141312]">
                100%
              </p>
              <p className="text-xs text-[#6B6661] mt-1">
                Cruelty & Paraben Free
              </p>
            </div>
          </div>
        </div>

        {/* Interactive 3-Step Shade Selector Card */}
        <div className="lg:col-span-7 bg-[#F4F2EE] rounded-xl border border-[#141312]/10 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Step 1: Complexion Depth */}
            <div>
              <label className="block text-xs font-semibold text-[#141312] mb-2.5">
                Step 1. Select Your Complexion Depth
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'fair-light', label: 'Fair to Light', hex: '#ECC9AF' },
                    { id: 'medium-golden', label: 'Medium to Golden', hex: '#D4A57F' },
                    { id: 'deep-rich', label: 'Caramel to Espresso', hex: '#9D6B49' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSkinDepth(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-colors ${
                      skinDepth === item.id
                        ? 'border-[#141312] bg-[#FBFBF9]'
                        : 'border-[#141312]/10 bg-[#FBFBF9]/50 hover:border-[#141312]/30'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 border border-black/15"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs font-medium text-[#141312] truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Natural Wrist Undertone */}
            <div>
              <label className="block text-xs font-semibold text-[#141312] mb-2.5">
                Step 2. Identify Your Wrist Vein Undertone in Daylight
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'Warm', desc: 'Olive / Greenish Veins' },
                    { id: 'Neutral', desc: 'Teal / Balanced Veins' },
                    { id: 'Cool', desc: 'Blue / Violet Veins' },
                  ] as const
                ).map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setVeinTone(tone.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      veinTone === tone.id
                        ? 'border-[#141312] bg-[#FBFBF9]'
                        : 'border-[#141312]/10 bg-[#FBFBF9]/50 hover:border-[#141312]/30'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#141312]">{tone.id} Undertone</p>
                    <p className="text-[11px] text-[#6B6661] mt-0.5 truncate">{tone.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Preferred Lip Statement */}
            <div>
              <label className="block text-xs font-semibold text-[#141312] mb-2.5">
                Step 3. Choose Your Signature Lip Mood
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'crimson', label: 'Editorial Crimson' },
                    { id: 'nude', label: 'Spiced Espresso Nude' },
                    { id: 'berry', label: 'Crushed Wine Berry' },
                  ] as const
                ).map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setLipPreference(mood.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      lipPreference === mood.id
                        ? 'border-[#141312] bg-[#FBFBF9]'
                        : 'border-[#141312]/10 bg-[#FBFBF9]/50 hover:border-[#141312]/30'
                    }`}
                  >
                    <p className="text-xs font-medium text-[#141312] truncate">{mood.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Calibrated Result Pairing Output */}
            <div className="pt-6 border-t border-[#141312]/10 bg-[#FBFBF9] p-5 rounded-xl border border-[#141312]/8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs font-semibold text-[#9E1B32]">
                  Your Calibrated FACES CANADA Pairing
                </span>
                <span className="text-xs font-mono tabular-nums text-[#141312]">
                  Combined Edit: ₹{foundationProduct.priceInr + lipProduct.priceInr}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* Foundation Match */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F4F2EE]">
                  <span
                    className="w-9 h-9 rounded-full shrink-0 border border-black/15"
                    style={{ backgroundColor: recommendedFoundationShade.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#6B6661] truncate">
                      3-in-1 Hydra Matte Foundation
                    </p>
                    <p className="text-xs font-semibold text-[#141312] truncate">
                      {recommendedFoundationShade.code} {recommendedFoundationShade.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#57524E]">
                      ₹{foundationProduct.priceInr} · {recommendedFoundationShade.sku}
                    </p>
                  </div>
                </div>

                {/* Lip Match */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F4F2EE]">
                  <span
                    className="w-9 h-9 rounded-full shrink-0 border border-black/15"
                    style={{ backgroundColor: recommendedLipShade.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#6B6661] truncate">
                      Ultime Pro HD Matte Crayon
                    </p>
                    <p className="text-xs font-semibold text-[#141312] truncate">
                      {recommendedLipShade.code} {recommendedLipShade.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#57524E]">
                      ₹{lipProduct.priceInr} · {recommendedLipShade.sku}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onApplyPairingToMirror(
                      foundationProduct,
                      recommendedFoundationShade,
                      lipProduct,
                      recommendedLipShade
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#141312] bg-[#F4F2EE] border border-[#141312]/15 rounded-lg hover:border-[#141312] transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-[#9E1B32]" />
                  Preview Pairing in Virtual Mirror
                </button>
                <button
                  type="button"
                  onClick={handleAddBoth}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#141312] rounded-lg hover:bg-[#9E1B32] transition-colors whitespace-nowrap"
                >
                  {pairingAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Pairing Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add Both to Bag (₹{foundationProduct.priceInr + lipProduct.priceInr})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjacent Attributable Artist & Customer Testimonials (Claim-to-Proof Adjacency) */}
      <div id="heritage" className="mt-16 pt-12 border-t border-[#141312]/10">
        <p className="text-xs text-[#6B6661] mb-6">
          Verified Studio & Customer Outcomes · Tested Across 12+ Hour Wear Cycles
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <blockquote className="p-6 bg-[#F4F2EE] rounded-xl border border-[#141312]/8 flex flex-col justify-between">
            <p className="text-xs text-[#2B2927] leading-relaxed mb-4">
              “Before switching to Ultime Pro HD Matte Lips + Primer in 14 Tease, bridal clients
              needed lip touch-ups every two hours between ceremonies. The built-in ceramide primer
              holds crisp lip borders through 9 hours of studio lights without flaking.”
            </p>
            <footer className="text-xs text-[#6B6661] pt-3 border-t border-[#141312]/8">
              <strong className="text-[#141312] font-semibold">Meera Deshmukh</strong> · Lead
              Bridal & Editorial Makeup Artist, Mumbai Studio
            </footer>
          </blockquote>

          <blockquote className="p-6 bg-[#F4F2EE] rounded-xl border border-[#141312]/8 flex flex-col justify-between">
            <p className="text-xs text-[#2B2927] leading-relaxed mb-4">
              “Most SPF foundations leave a chalky cast on my medium-golden skin in humid Chennai
              commutes. 3-in-1 All Day Hydra Matte in 03 Golden Sand replaced three separate
              morning steps and stays shine-free for my entire 10-hour hospital shift.”
            </p>
            <footer className="text-xs text-[#6B6661] pt-3 border-t border-[#141312]/8">
              <strong className="text-[#141312] font-semibold">Dr. Ananya Krishnan</strong> ·
              Clinical Dermatologist, Apollo Hospitals Chennai
            </footer>
          </blockquote>

          <blockquote className="p-6 bg-[#F4F2EE] rounded-xl border border-[#141312]/8 flex flex-col justify-between">
            <p className="text-xs text-[#2B2927] leading-relaxed mb-4">
              “The Virtual Try-On split slider let me compare 11 Natural Coco against 08 Subtle
              Mauve under 3200K warm lighting before ordering. The bullet shade that arrived matched
              the studio preview down to the warm cinnamon undertone.”
            </p>
            <footer className="text-xs text-[#6B6661] pt-3 border-t border-[#141312]/8">
              <strong className="text-[#141312] font-semibold">Rhea Kapoor-Sen</strong> · Senior
              Architect, Bengaluru
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
