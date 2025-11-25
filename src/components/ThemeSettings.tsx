import { useState, useEffect } from "react";
import type { GradientTheme } from "../types";
import "./ThemeSettings.css";

interface ThemeSettingsProps {
  theme: GradientTheme;
  onUpdate: (updates: Partial<GradientTheme>) => void;
  onReset: () => void;
  onClose: () => void;
}

export const ThemeSettings = ({
  theme,
  onUpdate,
  onReset,
  onClose,
}: ThemeSettingsProps) => {
  const [localTheme, setLocalTheme] = useState<GradientTheme>(theme);
  const [unifiedMode, setUnifiedMode] = useState(true); // 一括操作モード

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  // 色をRGBに変換
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // RGBをHEXに変換
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  // 一括操作: 基準色に基づいて他の色を自動調整
  const adjustColorsUnified = (
    baseColor: string,
    baseIndex: number,
    currentTheme: GradientTheme
  ) => {
    const baseRgb = hexToRgb(baseColor);
    const colors = [
      currentTheme.color1,
      currentTheme.color2,
      currentTheme.color3,
      currentTheme.color4,
    ];
    const baseRgbs = colors.map((c) => hexToRgb(c));

    // 基準色からの相対的な変化量を計算
    const deltaR = baseRgb.r - baseRgbs[baseIndex].r;
    const deltaG = baseRgb.g - baseRgbs[baseIndex].g;
    const deltaB = baseRgb.b - baseRgbs[baseIndex].b;

    // 各色に変化量を適用（距離に応じて減衰）
    const newColors = colors.map((color, index) => {
      if (index === baseIndex) return baseColor;

      const rgb = hexToRgb(color);
      const distance = Math.abs(index - baseIndex) / 3; // 0-1の距離
      const factor = 1 - distance * 0.5; // 距離が遠いほど影響を減らす

      const newR = Math.max(
        0,
        Math.min(255, rgb.r + deltaR * factor)
      );
      const newG = Math.max(
        0,
        Math.min(255, rgb.g + deltaG * factor)
      );
      const newB = Math.max(
        0,
        Math.min(255, rgb.b + deltaB * factor)
      );

      return rgbToHex(newR, newG, newB);
    });

    return {
      color1: newColors[0],
      color2: newColors[1],
      color3: newColors[2],
      color4: newColors[3],
    };
  };

  const handleColorChange = (colorKey: keyof GradientTheme, value: string) => {
    if (colorKey === "angle") return;

    let newTheme: GradientTheme;

    if (unifiedMode) {
      // 一括操作モード: 変更した色に基づいて他の色も調整
      const colorIndexMap: Record<string, number> = {
        color1: 0,
        color2: 1,
        color3: 2,
        color4: 3,
      };
      const adjustedColors = adjustColorsUnified(
        value,
        colorIndexMap[colorKey],
        localTheme
      );
      newTheme = { ...localTheme, ...adjustedColors };
    } else {
      // 個別操作モード: 選択した色のみ変更
      newTheme = { ...localTheme, [colorKey]: value };
    }

    setLocalTheme(newTheme);
    // 一括操作の場合は全色を更新、個別操作の場合は選択した色のみ更新
    if (unifiedMode) {
      onUpdate(newTheme);
    } else {
      onUpdate({ [colorKey]: value });
    }
  };

  const handleAngleChange = (angle: number) => {
    const newTheme = { ...localTheme, angle };
    setLocalTheme(newTheme);
    onUpdate({ angle });
  };

  const handleReset = () => {
    onReset();
  };

  const getGradientCSS = () => {
    return `linear-gradient(${localTheme.angle}deg, ${localTheme.color1} 0%, ${localTheme.color2} 30%, ${localTheme.color3} 60%, ${localTheme.color4} 100%)`;
  };

  return (
    <div className="theme-settings-overlay" onClick={onClose}>
      <div
        className="theme-settings-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-settings-header">
          <h2>背景テーマ設定</h2>
          <button className="theme-settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="theme-settings-content">
          {/* プレビューエリア */}
          <div className="theme-preview-section">
            <h3>プレビュー</h3>
            <div
              className="theme-preview"
              style={{ background: getGradientCSS() }}
            />
          </div>

          {/* カラーピッカーエリア */}
          <div className="theme-colors-section">
            <div className="theme-colors-header">
              <h3>グラデーション色</h3>
              <label className="unified-mode-toggle">
                <input
                  type="checkbox"
                  checked={unifiedMode}
                  onChange={(e) => setUnifiedMode(e.target.checked)}
                />
                <span>一括操作</span>
              </label>
            </div>
            {unifiedMode && (
              <div className="unified-mode-hint">
                1つの色を変更すると、他の色も自動的に調整されます
              </div>
            )}
            <div className="color-pickers-grid">
              <div className="color-picker-item">
                <label>開始色</label>
                <input
                  type="color"
                  value={localTheme.color1}
                  onChange={(e) => handleColorChange("color1", e.target.value)}
                  className="color-picker"
                />
              </div>
              <div className="color-picker-item">
                <label>中間色1</label>
                <input
                  type="color"
                  value={localTheme.color2}
                  onChange={(e) => handleColorChange("color2", e.target.value)}
                  className="color-picker"
                />
              </div>
              <div className="color-picker-item">
                <label>中間色2</label>
                <input
                  type="color"
                  value={localTheme.color3}
                  onChange={(e) => handleColorChange("color3", e.target.value)}
                  className="color-picker"
                />
              </div>
              <div className="color-picker-item">
                <label>終了色</label>
                <input
                  type="color"
                  value={localTheme.color4}
                  onChange={(e) => handleColorChange("color4", e.target.value)}
                  className="color-picker"
                />
              </div>
            </div>
          </div>

          {/* 角度設定 */}
          <div className="theme-angle-section">
            <h3>グラデーション方向</h3>
            <div className="angle-control">
              <input
                type="range"
                min="0"
                max="360"
                value={localTheme.angle}
                onChange={(e) => handleAngleChange(Number(e.target.value))}
                className="angle-slider"
              />
              <span className="angle-value">{localTheme.angle}°</span>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="theme-actions">
            <button className="btn-reset" onClick={handleReset}>
              リセット
            </button>
            <button className="btn-close" onClick={onClose}>
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

