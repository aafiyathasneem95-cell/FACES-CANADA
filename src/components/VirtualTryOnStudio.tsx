import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Download,
  RotateCcw,
  ShoppingBag,
  Sliders,
  Check,
  Sun,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  PRODUCTS,
  EDITORIAL_LOOKS,
  TRYON_MODEL_PORTRAIT,
  Product,
  ProductShade,
  TryOnZone,
  FinishType,
  EditorialLook,
} from '../data/catalog';

export interface ActiveTryOnState {
  lips: { product: Product; shade: ProductShade; intensity: number; finish: FinishType; enabled: boolean };
  cheeks: { product: Product; shade: ProductShade; intensity: number; finish: FinishType; enabled: boolean };
  eyes: { product: Product; shade: ProductShade; intensity: number; finish: FinishType; enabled: boolean };
  complexion: { product: Product; shade: ProductShade; intensity: number; finish: FinishType; enabled: boolean };
}

interface VirtualTryOnStudioProps {
  activeState: ActiveTryOnState;
  onUpdateZone: (
    zone: TryOnZone,
    updates: Partial<ActiveTryOnState[TryOnZone]>
  ) => void;
  onApplyEditorialLook: (look: EditorialLook) => void;
  onAddSingleToBag: (product: Product, shade: ProductShade) => void;
  onAddLookToBag: () => void;
  focusedZone: TryOnZone;
  onSelectFocusedZone: (zone: TryOnZone) => void;
}

type StudioSubjectMode = 'warm-honey' | 'neutral-ivory' | 'rich-espresso' | 'custom-upload' | 'live-camera';
type LightingMode = 'studio' | 'daylight' | 'golden' | 'evening';

const LIGHTING_PRESETS: Record<
  LightingMode,
  { label: string; kelvin: string; tint: string; contrast: number; brightness: number }
> = {
  studio: {
    label: 'Studio Softbox',
    kelvin: '4800K',
    tint: 'rgba(255, 252, 248, 0.02)',
    contrast: 1.02,
    brightness: 1.0,
  },
  daylight: {
    label: 'Daylight',
    kelvin: '5500K',
    tint: 'rgba(235, 245, 255, 0.06)',
    contrast: 1.04,
    brightness: 1.03,
  },
  golden: {
    label: 'Golden Hour',
    kelvin: '3200K',
    tint: 'rgba(255, 198, 130, 0.12)',
    contrast: 1.03,
    brightness: 1.01,
  },
  evening: {
    label: 'Evening Lounge',
    kelvin: '2700K',
    tint: 'rgba(195, 130, 155, 0.14)',
    contrast: 1.08,
    brightness: 0.95,
  },
};

export const VirtualTryOnStudio: React.FC<VirtualTryOnStudioProps> = ({
  activeState,
  onUpdateZone,
  onApplyEditorialLook,
  onAddSingleToBag,
  onAddLookToBag,
  focusedZone,
  onSelectFocusedZone,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const customImageRef = useRef<HTMLImageElement | null>(null);

  const [subjectMode, setSubjectMode] = useState<StudioSubjectMode>('warm-honey');
  const [lightingMode, setLightingMode] = useState<LightingMode>('studio');
  const [splitPosition, setSplitPosition] = useState<number>(78); // % of canvas showing After vs Before
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [showCalibration, setShowCalibration] = useState<boolean>(false);
  const [verticalOffset, setVerticalOffset] = useState<number>(0);
  const [scaleAdjust, setScaleAdjust] = useState<number>(100);
  const [lookAddedFeedback, setLookAddedFeedback] = useState<boolean>(false);

  // Load default studio portrait image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      baseImageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(true); // fallback procedural portrait will render cleanly
    };
    img.src = TRYON_MODEL_PORTRAIT;
  }, []);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Start live camera when selected
  const handleSelectSubject = async (mode: StudioSubjectMode) => {
    setCameraError(null);
    if (mode !== 'live-camera') {
      stopCamera();
      setSubjectMode(mode);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setSubjectMode('live-camera');
      }
    } catch {
      setCameraError(
        'Camera access is unavailable or blocked in this browser frame. Using Studio Portrait mode.'
      );
      setSubjectMode('warm-honey');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        customImageRef.current = img;
        stopCamera();
        setSubjectMode('custom-upload');
        setShowCalibration(true);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Draw procedural fallback portrait if needed
  const drawFallbackPortrait = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#EFECE6');
    bgGrad.addColorStop(1, '#E2DDD5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle neck and face silhouette
    ctx.save();
    ctx.fillStyle = '#C99B78';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.46, w * 0.24, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Render the base image + makeup zones onto the canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Determine source image/video
    const drawBaseSubject = (applyToneShift: boolean) => {
      ctx.save();
      const light = LIGHTING_PRESETS[lightingMode];

      let filterStr = `contrast(${light.contrast}) brightness(${light.brightness})`;
      if (applyToneShift) {
        if (subjectMode === 'neutral-ivory') {
          filterStr = `contrast(1.01) brightness(1.09) saturate(0.92)`;
        } else if (subjectMode === 'rich-espresso') {
          filterStr = `contrast(1.07) brightness(0.84) saturate(1.08)`;
        }
      }
      ctx.filter = filterStr;

      if (subjectMode === 'live-camera' && videoRef.current && cameraActive) {
        const vw = videoRef.current.videoWidth || 600;
        const vh = videoRef.current.videoHeight || 800;
        const scale = Math.max(w / vw, h / vh);
        const dw = vw * scale;
        const dh = vh * scale;
        ctx.translate(w, 0);
        ctx.scale(-1, 1); // Mirror camera horizontally
        ctx.drawImage(videoRef.current, (w - dw) / 2, (h - dh) / 2, dw, dh);
      } else if (subjectMode === 'custom-upload' && customImageRef.current) {
        const img = customImageRef.current;
        const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      } else if (baseImageRef.current) {
        const img = baseImageRef.current;
        const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      } else {
        drawFallbackPortrait(ctx, w, h);
      }
      ctx.restore();
    };

    // 1. Draw the full base portrait (Before layer)
    drawBaseSubject(true);

    // 2. Clip the left portion up to `splitPosition`% for the "After (Virtual Try-On)" layer
    const splitX = (splitPosition / 100) * w;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, h);
    ctx.clip();

    // Coordinate transform for facial landmarks
    const s = scaleAdjust / 100;
    const cyOffset = (verticalOffset / 100) * h;

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5 + cyOffset);
    ctx.scale(s, s);
    ctx.translate(-w * 0.5, -h * 0.5);

    // --- ZONE A: COMPLEXION (3-in-1 Foundation Veil) ---
    if (activeState.complexion.enabled) {
      const { shade, intensity, finish } = activeState.complexion;
      const alpha = (intensity / 100) * 0.34;
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      const faceGrad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.47,
        w * 0.04,
        w * 0.5,
        h * 0.47,
        w * 0.28
      );
      faceGrad.addColorStop(0, hexToRgba(shade.hex, alpha));
      faceGrad.addColorStop(0.75, hexToRgba(shade.hex, alpha * 0.65));
      faceGrad.addColorStop(1, hexToRgba(shade.hex, 0));
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.47, w * 0.26, h * 0.29, 0, 0, Math.PI * 2);
      ctx.fill();

      // If HD Dewy finish, add subtle cheekbone & bridge highlight
      if (finish === 'HD Dewy' || finish === 'High-Shine Gloss') {
        ctx.globalCompositeOperation = 'screen';
        const dewyGrad = ctx.createRadialGradient(
          w * 0.5,
          h * 0.46,
          w * 0.01,
          w * 0.5,
          h * 0.46,
          w * 0.14
        );
        dewyGrad.addColorStop(0, 'rgba(255, 246, 235, 0.16)');
        dewyGrad.addColorStop(1, 'rgba(255, 246, 235, 0)');
        ctx.fillStyle = dewyGrad;
        ctx.fillRect(w * 0.25, h * 0.25, w * 0.5, h * 0.45);
      }
      ctx.restore();
    }

    // --- ZONE B: CHEEKS (Berry Blush & Glow) ---
    if (activeState.cheeks.enabled) {
      const { shade, intensity, finish } = activeState.cheeks;
      const alpha = (intensity / 100) * 0.42;
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';

      // Left Cheekbone drape
      const leftCheek = ctx.createRadialGradient(
        w * 0.355,
        h * 0.515,
        w * 0.01,
        w * 0.355,
        h * 0.515,
        w * 0.105
      );
      leftCheek.addColorStop(0, hexToRgba(shade.hex, alpha));
      leftCheek.addColorStop(0.6, hexToRgba(shade.hex, alpha * 0.45));
      leftCheek.addColorStop(1, hexToRgba(shade.hex, 0));
      ctx.fillStyle = leftCheek;
      ctx.beginPath();
      ctx.ellipse(w * 0.355, h * 0.515, w * 0.11, h * 0.075, -0.28, 0, Math.PI * 2);
      ctx.fill();

      // Right Cheekbone drape
      const rightCheek = ctx.createRadialGradient(
        w * 0.645,
        h * 0.515,
        w * 0.01,
        w * 0.645,
        h * 0.515,
        w * 0.105
      );
      rightCheek.addColorStop(0, hexToRgba(shade.hex, alpha));
      rightCheek.addColorStop(0.6, hexToRgba(shade.hex, alpha * 0.45));
      rightCheek.addColorStop(1, hexToRgba(shade.hex, 0));
      ctx.fillStyle = rightCheek;
      ctx.beginPath();
      ctx.ellipse(w * 0.645, h * 0.515, w * 0.11, h * 0.075, 0.28, 0, Math.PI * 2);
      ctx.fill();

      if (finish === 'Satin Crème' || finish === 'High-Shine Gloss') {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 235, 225, 0.12)';
        ctx.beginPath();
        ctx.ellipse(w * 0.36, h * 0.495, w * 0.045, h * 0.02, -0.3, 0, Math.PI * 2);
        ctx.ellipse(w * 0.64, h * 0.495, w * 0.045, h * 0.02, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // --- ZONE C: EYES (Magneteyes Kajal & Winged Liner) ---
    if (activeState.eyes.enabled) {
      const { shade, intensity } = activeState.eyes;
      const alpha = (intensity / 100) * 0.78;
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = hexToRgba(shade.hex, alpha);
      ctx.fillStyle = hexToRgba(shade.hex, alpha * 0.9);
      ctx.filter = 'blur(1.2px)';

      // Left Eye Upper Wing + Waterline Kajal
      ctx.beginPath();
      ctx.moveTo(w * 0.335, h * 0.422); // Outer wing tip
      ctx.quadraticCurveTo(w * 0.39, h * 0.398, w * 0.438, h * 0.426); // Upper lash arch
      ctx.quadraticCurveTo(w * 0.39, h * 0.406, w * 0.345, h * 0.426);
      ctx.closePath();
      ctx.fill();

      // Left lower waterline smudge
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.431);
      ctx.quadraticCurveTo(w * 0.392, h * 0.442, w * 0.432, h * 0.431);
      ctx.stroke();

      // Right Eye Upper Wing + Waterline Kajal
      ctx.beginPath();
      ctx.moveTo(w * 0.665, h * 0.422); // Outer wing tip
      ctx.quadraticCurveTo(w * 0.61, h * 0.398, w * 0.562, h * 0.426); // Upper lash arch
      ctx.quadraticCurveTo(w * 0.61, h * 0.406, w * 0.655, h * 0.426);
      ctx.closePath();
      ctx.fill();

      // Right lower waterline smudge
      ctx.beginPath();
      ctx.moveTo(w * 0.65, h * 0.431);
      ctx.quadraticCurveTo(w * 0.608, h * 0.442, w * 0.568, h * 0.431);
      ctx.stroke();

      ctx.restore();
    }

    // --- ZONE D: LIPS (Weightless / Ultime Pro / Comfy Matte) ---
    if (activeState.lips.enabled) {
      const { shade, intensity, finish } = activeState.lips;
      const alpha = (intensity / 100) * 0.72;

      ctx.save();
      ctx.filter = 'blur(2.2px)';

      const traceLipsPath = () => {
        ctx.beginPath();
        // Left corner
        ctx.moveTo(w * 0.422, h * 0.612);
        // Left upper lip slope to left cupid's bow peak
        ctx.bezierCurveTo(w * 0.445, h * 0.596, w * 0.468, h * 0.587, w * 0.484, h * 0.589);
        // Cupid's bow center dip
        ctx.quadraticCurveTo(w * 0.5, h * 0.594, w * 0.516, h * 0.589);
        // Right cupid's bow peak to right corner
        ctx.bezierCurveTo(w * 0.532, h * 0.587, w * 0.555, h * 0.596, w * 0.578, h * 0.612);
        // Lower lip plush cushion curve back to left corner
        ctx.bezierCurveTo(w * 0.558, h * 0.648, w * 0.442, h * 0.648, w * 0.422, h * 0.612);
        ctx.closePath();
      };

      // Primary pigment pass (multiply preserves natural lip creases)
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = hexToRgba(shade.hex, alpha);
      traceLipsPath();
      ctx.fill();

      // Secondary colour richness pass
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = hexToRgba(shade.hex, alpha * 0.75);
      traceLipsPath();
      ctx.fill();

      // Inner lip depth line
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = hexToRgba(shade.hex, alpha * 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.432, h * 0.612);
      ctx.quadraticCurveTo(w * 0.5, h * 0.616, w * 0.568, h * 0.612);
      ctx.stroke();

      // Finish-specific specular highlights vs velvet diffusion
      if (finish === 'Satin Crème') {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 245, 245, 0.22)';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.625, w * 0.036, h * 0.007, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (finish === 'High-Shine Gloss' || finish === 'HD Dewy') {
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(1px)';
        ctx.fillStyle = 'rgba(255, 250, 250, 0.42)';
        ctx.beginPath();
        ctx.ellipse(w * 0.485, h * 0.624, w * 0.025, h * 0.006, -0.05, 0, Math.PI * 2);
        ctx.ellipse(w * 0.522, h * 0.623, w * 0.014, h * 0.005, 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore(); // End landmark transform

    // Ambient lighting colour wash
    ctx.fillStyle = LIGHTING_PRESETS[lightingMode].tint;
    ctx.fillRect(0, 0, splitX, h);

    ctx.restore(); // End split clip

    // 3. Draw vertical split divider line
    ctx.save();
    ctx.strokeStyle = 'rgba(251, 251, 249, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, h);
    ctx.stroke();
    ctx.restore();
  }, [
    activeState,
    cameraActive,
    lightingMode,
    scaleAdjust,
    splitPosition,
    subjectMode,
    verticalOffset,
  ]);

  // Animation loop when live camera is running, or single draw when static
  useEffect(() => {
    let rafId: number;
    if (subjectMode === 'live-camera' && cameraActive) {
      const loop = () => {
        renderCanvas();
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    } else {
      renderCanvas();
    }
  }, [renderCanvas, subjectMode, cameraActive, imageLoaded]);

  // Pointer drag handler for Before/After split slider
  const updateSplitFromPointer = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSplitPosition(Math.round(relX * 100));
  };

  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height + 90;
    const ectx = exportCanvas.getContext('2d');
    if (!ectx) return;

    ectx.fillStyle = '#141312';
    ectx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ectx.drawImage(canvas, 0, 0);

    // Draw clean editorial look card footer
    ectx.fillStyle = '#FBFBF9';
    ectx.font = '600 20px "Cormorant Garamond", Georgia, serif';
    ectx.fillText('FACES CANADA — VIRTUAL TRY-ON LOOK CARD', 24, canvas.height + 36);

    ectx.fillStyle = '#C9C4BC';
    ectx.font = '400 12px "IBM Plex Mono", monospace';
    const summaryText = `LIPS: ${activeState.lips.shade.name} (${activeState.lips.shade.sku}) · EYES: ${activeState.eyes.shade.name} · CHEEKS: ${activeState.cheeks.shade.name}`;
    ectx.fillText(summaryText, 24, canvas.height + 64);

    const link = document.createElement('a');
    link.download = `faces-canada-look-${activeState.lips.shade.sku.toLowerCase()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const handleAddCompleteLook = () => {
    onAddLookToBag();
    setLookAddedFeedback(true);
    setTimeout(() => setLookAddedFeedback(false), 2200);
  };

  const currentZoneConfig = activeState[focusedZone];
  const zoneProducts = PRODUCTS.filter((p) => p.tryOnZone === focusedZone);

  const totalLookPrice =
    (activeState.lips.enabled ? activeState.lips.product.priceInr : 0) +
    (activeState.eyes.enabled ? activeState.eyes.product.priceInr : 0) +
    (activeState.cheeks.enabled ? activeState.cheeks.product.priceInr : 0) +
    (activeState.complexion.enabled ? activeState.complexion.product.priceInr : 0);

  return (
    <section
      id="virtual-try-on"
      className="py-16 lg:py-24 border-t border-[#141312]/10 bg-[#F4F2EE]"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-[#6B6661] mb-2">
              02. Interactive Shade Mirror · Real-Time Pigment Simulation · Multi-Zone Calibration
            </p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-[#141312]">
              Virtual Try-On Studio
            </h2>
          </div>

          {/* Curated Editorial Look Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#6B6661] mr-1">Editorial Presets:</span>
            {EDITORIAL_LOOKS.map((look) => {
              const isCurrent =
                activeState.lips.shade.id === look.lipShadeId &&
                activeState.eyes.shade.id === look.eyeShadeId;
              return (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => onApplyEditorialLook(look)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#141312] text-[#FBFBF9]'
                      : 'bg-[#FBFBF9] text-[#141312] border border-[#141312]/12 hover:border-[#141312]/40'
                  }`}
                >
                  {look.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Studio Grid: Left Mirror Viewport (5 cols) + Right Shade & Formulation Controls (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Interactive Canvas Mirror */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className="relative aspect-[3/4] w-full bg-[#E8E4DC] rounded-xl overflow-hidden border border-[#141312]/12 select-none touch-none"
              onPointerDown={(e) => {
                setIsDraggingSplit(true);
                updateSplitFromPointer(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isDraggingSplit) {
                  updateSplitFromPointer(e.clientX);
                }
              }}
              onPointerUp={() => setIsDraggingSplit(false)}
              onPointerLeave={() => setIsDraggingSplit(false)}
            >
              {/* Hidden video element for webcam stream */}
              <video ref={videoRef} playsInline muted className="hidden" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* High-Resolution Try-On Canvas */}
              <canvas
                ref={canvasRef}
                width={600}
                height={800}
                className="w-full h-full object-cover cursor-ew-resize"
              />

              {/* Top Overlay: Before / After Labels & Lighting Readout */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 text-[11px] font-medium bg-[#141312]/75 text-[#FBFBF9] backdrop-blur-sm rounded">
                  With FACES CANADA ({splitPosition}%)
                </span>
                <span className="px-2.5 py-1 text-[11px] font-medium bg-[#141312]/60 text-[#FBFBF9] backdrop-blur-sm rounded">
                  Bare Skin
                </span>
              </div>

              {/* Interactive Drag Handle Pill on the Split Line */}
              <div
                style={{ left: `${splitPosition}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#FBFBF9] text-[#141312] shadow-md border border-[#141312]/20 flex items-center justify-center pointer-events-none"
              >
                <span className="text-[11px] font-mono tracking-tighter">↔</span>
              </div>

              {/* Bottom Scrim Overlay: Active Shade Swatch Strip */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-10 text-[#FBFBF9] pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-[#E5E0D8]">
                      Active Lip · {activeState.lips.product.name}
                    </p>
                    <p className="text-sm font-semibold">
                      {activeState.lips.shade.code} {activeState.lips.shade.name} ·{' '}
                      <span className="font-mono text-xs">{activeState.lips.finish}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['lips', 'eyes', 'cheeks', 'complexion'] as TryOnZone[]).map((z) => {
                      const st = activeState[z];
                      if (!st.enabled) return null;
                      return (
                        <span
                          key={z}
                          className="w-5 h-5 rounded-full border border-white/70"
                          style={{ backgroundColor: st.shade.hex }}
                          title={`${z}: ${st.shade.name}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mirror Source & Utility Controls Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#EAE6DF] rounded-lg">
                <button
                  type="button"
                  onClick={() => handleSelectSubject('warm-honey')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    subjectMode === 'warm-honey'
                      ? 'bg-[#FBFBF9] text-[#141312] shadow-xs'
                      : 'text-[#57524E] hover:text-[#141312]'
                  }`}
                >
                  Warm Honey
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSubject('neutral-ivory')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    subjectMode === 'neutral-ivory'
                      ? 'bg-[#FBFBF9] text-[#141312] shadow-xs'
                      : 'text-[#57524E] hover:text-[#141312]'
                  }`}
                >
                  Neutral Ivory
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSubject('rich-espresso')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    subjectMode === 'rich-espresso'
                      ? 'bg-[#FBFBF9] text-[#141312] shadow-xs'
                      : 'text-[#57524E] hover:text-[#141312]'
                  }`}
                >
                  Rich Caramel
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FBFBF9] text-[#141312] border border-[#141312]/15 rounded-lg hover:border-[#141312]/40 transition-colors whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    subjectMode === 'live-camera'
                      ? handleSelectSubject('warm-honey')
                      : handleSelectSubject('live-camera')
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    subjectMode === 'live-camera'
                      ? 'bg-[#9E1B32] text-white'
                      : 'bg-[#FBFBF9] text-[#141312] border border-[#141312]/15 hover:border-[#141312]/40'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  {subjectMode === 'live-camera' ? 'Exit Live Cam' : 'Live Camera'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSnapshot}
                  title="Download Look Snapshot"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FBFBF9] text-[#141312] border border-[#141312]/15 rounded-lg hover:border-[#141312]/40 transition-colors whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Card
                </button>
              </div>
            </div>

            {cameraError && (
              <p className="mt-2 text-xs text-[#9E1B32] bg-[#9E1B32]/8 px-3 py-2 rounded-md">
                {cameraError}
              </p>
            )}

            {/* Quick Before/After Split & Alignment Controls */}
            <div className="mt-3 flex items-center justify-between text-xs text-[#57524E] pt-3 border-t border-[#141312]/8">
              <div className="flex items-center gap-3">
                <span>Comparison:</span>
                <button
                  type="button"
                  onClick={() => setSplitPosition(100)}
                  className={`hover:text-[#141312] ${
                    splitPosition === 100 ? 'font-semibold text-[#141312] underline' : ''
                  }`}
                >
                  Full Try-On
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setSplitPosition(50)}
                  className={`hover:text-[#141312] ${
                    splitPosition === 50 ? 'font-semibold text-[#141312] underline' : ''
                  }`}
                >
                  50/50 Split
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setSplitPosition(0)}
                  className={`hover:text-[#141312] ${
                    splitPosition === 0 ? 'font-semibold text-[#141312] underline' : ''
                  }`}
                >
                  Bare Skin
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowCalibration(!showCalibration)}
                className="inline-flex items-center gap-1 text-xs text-[#57524E] hover:text-[#141312]"
              >
                <Sliders className="w-3.5 h-3.5" />
                {showCalibration ? 'Hide Fit Adjust' : 'Fine-Tune Fit'}
              </button>
            </div>

            {showCalibration && (
              <div className="mt-3 p-3.5 bg-[#FBFBF9] rounded-lg border border-[#141312]/10 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#57524E]">Vertical Alignment</span>
                    <span className="font-mono tabular-nums">{verticalOffset}%</span>
                  </div>
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    value={verticalOffset}
                    onChange={(e) => setVerticalOffset(Number(e.target.value))}
                    className="w-full accent-[#9E1B32]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#57524E]">Zone Scale</span>
                    <span className="font-mono tabular-nums">{scaleAdjust}%</span>
                  </div>
                  <input
                    type="range"
                    min={85}
                    max={115}
                    value={scaleAdjust}
                    onChange={(e) => setScaleAdjust(Number(e.target.value))}
                    className="w-full accent-[#9E1B32]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Multi-Zone Shade Selector, Pigment Physics & Instant Purchase */}
          <div className="lg:col-span-7 bg-[#FBFBF9] rounded-xl border border-[#141312]/10 p-6 lg:p-8">
            {/* Step 1: Zone Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#141312]/10">
              <div className="flex items-center gap-1.5 p-1 bg-[#F4F2EE] rounded-lg">
                {(
                  [
                    { id: 'lips', label: '01. Lips' },
                    { id: 'eyes', label: '02. Eyes & Kajal' },
                    { id: 'cheeks', label: '03. Cheek Tint' },
                    { id: 'complexion', label: '04. Foundation' },
                  ] as { id: TryOnZone; label: string }[]
                ).map((tab) => {
                  const active = focusedZone === tab.id;
                  const zoneState = activeState[tab.id];
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onSelectFocusedZone(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#141312] text-[#FBFBF9]'
                          : 'text-[#57524E] hover:text-[#141312]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                        style={{
                          backgroundColor: zoneState.enabled ? zoneState.shade.hex : 'transparent',
                        }}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Zone Visibility Toggle */}
              <button
                type="button"
                onClick={() =>
                  onUpdateZone(focusedZone, { enabled: !currentZoneConfig.enabled })
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57524E] hover:text-[#141312] whitespace-nowrap"
              >
                {currentZoneConfig.enabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#9E1B32]" />
                    Zone Enabled
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Zone Muted
                  </>
                )}
              </button>
            </div>

            {/* Step 2: Select Formulation within Focused Zone */}
            <div className="py-5 border-b border-[#141312]/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#57524E]">
                  Select FACES CANADA Formulation
                </span>
                <span className="text-xs font-mono text-[#6B6661] tabular-nums">
                  SKU: {currentZoneConfig.shade.sku}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {zoneProducts.map((prod) => {
                  const isSelected = currentZoneConfig.product.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() =>
                        onUpdateZone(focusedZone, {
                          product: prod,
                          shade: prod.shades[0],
                          finish: prod.defaultFinish,
                          enabled: true,
                        })
                      }
                      className={`text-left p-3.5 rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-[#9E1B32] bg-[#9E1B32]/4'
                          : 'border-[#141312]/10 hover:border-[#141312]/30 bg-white'
                      }`}
                    >
                      <p className="text-[11px] text-[#6B6661] mb-0.5">
                        {prod.collection} · {prod.wearTime}
                      </p>
                      <p className="text-sm font-semibold text-[#141312] line-clamp-1">
                        {prod.name}
                      </p>
                      <p className="text-xs font-mono tabular-nums text-[#141312] mt-1.5">
                        ₹{prod.priceInr}{' '}
                        <span className="text-[#6B6661] line-through ml-1">₹{prod.mrpInr}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Calibrated Shade Swatch Bar */}
            <div className="py-5 border-b border-[#141312]/10">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <div>
                  <span className="text-xs text-[#6B6661] block">Active Shade Selection</span>
                  <h3 className="text-xl font-semibold text-[#141312]">
                    {currentZoneConfig.shade.code} — {currentZoneConfig.shade.name}
                  </h3>
                </div>
                <span className="text-xs text-[#57524E]">
                  Undertone: <strong className="text-[#141312]">{currentZoneConfig.shade.undertone}</strong> · Hex{' '}
                  <span className="font-mono">{currentZoneConfig.shade.hex}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                {currentZoneConfig.product.shades.map((sh) => {
                  const isActiveShade = currentZoneConfig.shade.id === sh.id;
                  return (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() =>
                        onUpdateZone(focusedZone, {
                          shade: sh,
                          enabled: true,
                        })
                      }
                      className={`group flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                        isActiveShade
                          ? 'border-[#141312] bg-[#F4F2EE]'
                          : 'border-[#141312]/10 hover:border-[#141312]/30'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shrink-0 border border-black/15 flex items-center justify-center"
                        style={{ backgroundColor: sh.hex }}
                      >
                        {isActiveShade && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#141312] truncate">
                          {sh.code} {sh.name}
                        </p>
                        <p className="text-[11px] text-[#6B6661] truncate">{sh.undertone}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#57524E] leading-relaxed">
                {currentZoneConfig.shade.description}
              </p>
            </div>

            {/* Step 4: Pigment Intensity, Texture Finish & Ambient Lighting Controls */}
            <div className="py-5 border-b border-[#141312]/10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pigment Load Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-[#141312]">
                    Pigment Payoff (Blotted Stain → Full Coat)
                  </span>
                  <span className="font-mono tabular-nums text-[#9E1B32] font-medium">
                    {currentZoneConfig.intensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={currentZoneConfig.intensity}
                  onChange={(e) =>
                    onUpdateZone(focusedZone, { intensity: Number(e.target.value), enabled: true })
                  }
                  className="w-full accent-[#9E1B32] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#6B6661] mt-1">
                  <span>Sheer Tint (20%)</span>
                  <span>One-Stroke (65%)</span>
                  <span>Runway Coat (100%)</span>
                </div>
              </div>

              {/* Surface Finish Switcher */}
              <div>
                <span className="block text-xs font-medium text-[#141312] mb-2">
                  Finish & Light Refraction
                </span>
                <div className="flex items-center gap-1 p-1 bg-[#F4F2EE] rounded-lg">
                  {(['Velvet Matte', 'Satin Crème', 'High-Shine Gloss'] as FinishType[]).map(
                    (fin) => (
                      <button
                        key={fin}
                        type="button"
                        onClick={() =>
                          onUpdateZone(focusedZone, { finish: fin, enabled: true })
                        }
                        className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          currentZoneConfig.finish === fin
                            ? 'bg-[#FBFBF9] text-[#141312] shadow-xs'
                            : 'text-[#57524E] hover:text-[#141312]'
                        }`}
                      >
                        {fin}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Ambient Lighting Temperature Bar */}
            <div className="py-4 border-b border-[#141312]/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#57524E]">
                <Sun className="w-4 h-4 text-[#9E1B32]" />
                <span>Ambient Lighting Environment:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(Object.keys(LIGHTING_PRESETS) as LightingMode[]).map((modeKey) => {
                  const preset = LIGHTING_PRESETS[modeKey];
                  const active = lightingMode === modeKey;
                  return (
                    <button
                      key={modeKey}
                      type="button"
                      onClick={() => setLightingMode(modeKey)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#141312] text-[#FBFBF9] font-medium'
                          : 'bg-[#F4F2EE] text-[#57524E] hover:text-[#141312]'
                      }`}
                    >
                      {preset.label} · <span className="font-mono text-[11px]">{preset.kelvin}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Active Look Breakdown & Direct Purchase Actions */}
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#6B6661]">
                  Selected Zone · {currentZoneConfig.product.name}
                </p>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-lg font-semibold font-mono tabular-nums text-[#141312]">
                    ₹{currentZoneConfig.product.priceInr}
                  </span>
                  <span className="text-xs text-[#6B6661]">
                    · Complete 4-Zone Look: <strong className="font-mono tabular-nums text-[#141312]">₹{totalLookPrice}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onAddSingleToBag(currentZoneConfig.product, currentZoneConfig.shade)
                  }
                  className="px-4 py-2.5 text-xs font-semibold text-[#141312] bg-[#F4F2EE] border border-[#141312]/15 rounded-lg hover:border-[#141312] transition-colors whitespace-nowrap"
                >
                  Add {currentZoneConfig.shade.name} (₹{currentZoneConfig.product.priceInr})
                </button>

                <button
                  type="button"
                  onClick={handleAddCompleteLook}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#9E1B32] rounded-lg hover:bg-[#821428] transition-colors whitespace-nowrap"
                >
                  {lookAddedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      Complete Look Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add Complete Look (₹{totalLookPrice})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 158;
  const g = parseInt(clean.substring(2, 4), 16) || 27;
  const b = parseInt(clean.substring(4, 6), 16) || 50;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
