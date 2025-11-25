import { useRef, useEffect, useState, useCallback } from "react";
import "./ColorWheel.css";

interface ColorWheelProps {
  size: number;
  angleSpread: number; // ピッカー間の角度間隔（度）
  onColorsChange: (color1: string, color2: string, color3: string) => void;
}

// 極座標の型
interface PolarCoordinate {
  angle: number; // 0-360度
  radius: number; // 0-1の範囲（0が中心、1が外側）
}

export const ColorWheel = ({ size, angleSpread, onColorsChange }: ColorWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 中央ピッカーの位置（極座標）
  const [mainPicker, setMainPicker] = useState<PolarCoordinate>({
    angle: 270, // 初期位置：上
    radius: 0.7, // 初期位置：外側寄り
  });

  // HSVからRGBへの変換
  const hsvToRgb = useCallback((h: number, s: number, v: number): [number, number, number] => {
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }, []);

  // RGBから16進数への変換
  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  }, []);

  // 極座標からHSV値を計算
  const polarToHSV = useCallback((polar: PolarCoordinate): [number, number, number] => {
    const h = polar.angle;
    const s = Math.min(100, polar.radius * 100); // 外側ほど高彩度
    const v = Math.max(10, polar.radius * 90 + 10); // 中心が暗く（10）、外側が明るい（100）
    return [h, s, v];
  }, []);

  // 極座標から16進数カラーへの変換
  const polarToHex = useCallback((polar: PolarCoordinate): string => {
    const [h, s, v] = polarToHSV(polar);
    const [r, g, b] = hsvToRgb(h, s, v);
    return rgbToHex(r, g, b);
  }, [polarToHSV, hsvToRgb, rgbToHex]);

  // デカルト座標から極座標への変換
  const cartesianToPolar = useCallback((x: number, y: number, centerX: number, centerY: number, maxRadius: number): PolarCoordinate => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(1, distance / maxRadius); // 0-1に正規化
    
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    angle = (angle + 360) % 360; // 0-360に正規化
    
    return { angle, radius };
  }, []);

  // 極座標からデカルト座標への変換（ピッカー表示用）
  const polarToCartesian = useCallback((polar: PolarCoordinate, centerX: number, centerY: number, maxRadius: number): { x: number; y: number } => {
    const actualRadius = polar.radius * maxRadius;
    const angleRad = (polar.angle * Math.PI) / 180;
    const x = centerX + actualRadius * Math.cos(angleRad);
    const y = centerY + actualRadius * Math.sin(angleRad);
    return { x, y };
  }, []);

  // サテライトピッカーの位置を計算（重力効果あり）
  const calculateSatellitePositions = useCallback((main: PolarCoordinate): [PolarCoordinate, PolarCoordinate] => {
    // 半径は中央ピッカーと同じ（平行配置）
    const satelliteRadius = main.radius;
    
    // 角度オフセット：中心に近いほど小さく（重力効果）
    // radiusが0（中心）に近いほどオフセットが小さくなる
    const gravityEffect = 30; // 最大30度の追加
    const angleOffset = angleSpread + (1 - main.radius) * gravityEffect;
    
    const leftPicker: PolarCoordinate = {
      angle: (main.angle - angleOffset + 360) % 360,
      radius: satelliteRadius,
    };
    
    const rightPicker: PolarCoordinate = {
      angle: (main.angle + angleOffset) % 360,
      radius: satelliteRadius,
    };
    
    return [leftPicker, rightPicker];
  }, [angleSpread]);

  // HSVカラーホイールを描画
  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 10;

    // キャンバスをクリア
    ctx.clearRect(0, 0, size, size);

    // ピクセルごとにカラーホイールを描画
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= maxRadius) {
          const polar = cartesianToPolar(x, y, centerX, centerY, maxRadius);
          const [h, s, v] = polarToHSV(polar);
          const [r, g, b] = hsvToRgb(h, s, v);
          
          const index = (y * size + x) * 4;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = 255; // alpha
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [size, cartesianToPolar, polarToHSV, hsvToRgb]);

  // カラーホイールを描画
  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  // 3色を更新
  const updateColors = useCallback((main: PolarCoordinate) => {
    const [left, right] = calculateSatellitePositions(main);
    
    const color1 = polarToHex(left);
    const color2 = polarToHex(main);
    const color3 = polarToHex(right);
    
    onColorsChange(color1, color2, color3);
  }, [calculateSatellitePositions, polarToHex, onColorsChange]);

  // マウス/タッチ座標から極座標を取得してピッカーを更新
  const handleDrag = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 10;

    const newPolar = cartesianToPolar(x, y, centerX, centerY, maxRadius);
    
    setMainPicker(newPolar);
    updateColors(newPolar);
  }, [size, cartesianToPolar, updateColors]);

  // マウスイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleDrag(e.clientX, e.clientY);
  }, [handleDrag]);

  // タッチイベントハンドラー
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches[0]) {
      setIsDragging(true);
      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleDrag]);

  // グローバルイベントリスナー
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleDrag(e.clientX, e.clientY);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) {
        handleDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, handleDrag]);

  // 初期カラーを設定
  useEffect(() => {
    updateColors(mainPicker);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // angleSpreadが変更されたときにカラーを更新
  useEffect(() => {
    updateColors(mainPicker);
  }, [angleSpread, mainPicker, updateColors]);

  // ピッカーの位置を計算
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2 - 10;

  const mainPos = polarToCartesian(mainPicker, centerX, centerY, maxRadius);
  const [leftPicker, rightPicker] = calculateSatellitePositions(mainPicker);
  const leftPos = polarToCartesian(leftPicker, centerX, centerY, maxRadius);
  const rightPos = polarToCartesian(rightPicker, centerX, centerY, maxRadius);

  const mainColor = polarToHex(mainPicker);
  const leftColor = polarToHex(leftPicker);
  const rightColor = polarToHex(rightPicker);

  return (
    <div ref={containerRef} className="color-wheel-container">
      <div className="color-wheel-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="color-wheel-canvas"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        />
        
        {/* ピッカー表示 */}
        <div className="color-wheel-pickers">
          {/* 左側のサテライトピッカー */}
          <div
            className="color-picker-satellite"
            style={{
              left: `${leftPos.x}px`,
              top: `${leftPos.y}px`,
              backgroundColor: leftColor,
            }}
          />
          
          {/* 中央のメインピッカー */}
          <div
            className="color-picker-main"
            style={{
              left: `${mainPos.x}px`,
              top: `${mainPos.y}px`,
              backgroundColor: mainColor,
              cursor: isDragging ? "grabbing" : "grab",
            }}
          />
          
          {/* 右側のサテライトピッカー */}
          <div
            className="color-picker-satellite"
            style={{
              left: `${rightPos.x}px`,
              top: `${rightPos.y}px`,
              backgroundColor: rightColor,
            }}
          />
        </div>
      </div>
    </div>
  );
};
