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

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  // 色をRGBに変換
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      console.warn(`Invalid hex color: ${hex}`);
      return { r: 0, g: 0, b: 0 };
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };

  // RGBをHEXに変換
  const rgbToHex = (r: number, g: number, b: number) => {
    const roundR = Math.round(Math.max(0, Math.min(255, r)));
    const roundG = Math.round(Math.max(0, Math.min(255, g)));
    const roundB = Math.round(Math.max(0, Math.min(255, b)));
    return (
      "#" +
      [roundR, roundG, roundB]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
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
    const originalRgbs = colors.map((c) => hexToRgb(c));
    const originalBaseRgb = originalRgbs[baseIndex];

    // 基準色からの相対的な変化量を計算
    const deltaR = baseRgb.r - originalBaseRgb.r;
    const deltaG = baseRgb.g - originalBaseRgb.g;
    const deltaB = baseRgb.b - originalBaseRgb.b;

    // 各色に変化量を適用（距離に応じて減衰）
    const newColors = originalRgbs.map((rgb, index) => {
      if (index === baseIndex) return baseColor;

      // 距離に応じた減衰係数を計算（0.3-1.0の範囲）
      const distance = Math.abs(index - baseIndex) / 3; // 0-1の距離
      const factor = Math.max(0.3, 1 - distance * 0.4); // 距離が遠いほど影響を減らす（最小30%は保持）

      // 変化量を適用
      const newR = rgb.r + deltaR * factor;
      const newG = rgb.g + deltaG * factor;
      const newB = rgb.b + deltaB * factor;

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
    const newTheme = { ...localTheme, ...adjustedColors };

    setLocalTheme(newTheme);
    onUpdate(newTheme);
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
            </div>
            <div className="unified-mode-hint">
              中央の大きなピッカーを操作すると、周りの小さなピッカーも連動して変化します
            </div>
            <div className="color-pickers-unified-container">
              {[
                { key: "color1", label: "開始色" },
                { key: "color2", label: "中間色1" },
                { key: "color3", label: "中間色2" },
                { key: "color4", label: "終了色" },
              ].map((colorInfo, index) => (
                <div key={colorInfo.key} className="color-picker-group">
                  <div className="color-picker-main-wrapper">
                    <input
                      type="color"
                      value={localTheme[colorInfo.key as keyof GradientTheme] as string}
                      onChange={(e) =>
                        handleColorChange(
                          colorInfo.key as keyof GradientTheme,
                          e.target.value
                        )
                      }
                      className="color-picker-main"
                    />
                    <label className="color-picker-label">
                      {colorInfo.label}
                    </label>
                  </div>
                  <div className="color-picker-satellites">
                    {[
                      { key: "color1", label: "開始" },
                      { key: "color2", label: "中間1" },
                      { key: "color3", label: "中間2" },
                      { key: "color4", label: "終了" },
                    ]
                      .filter((_, i) => i !== index)
                      .map((satellite) => (
                        <input
                          key={satellite.key}
                          type="color"
                          value={
                            localTheme[
                              satellite.key as keyof GradientTheme
                            ] as string
                          }
                          onChange={(e) =>
                            handleColorChange(
                              satellite.key as keyof GradientTheme,
                              e.target.value
                            )
                          }
                          className="color-picker-satellite"
                          title={satellite.label}
                        />
                      ))}
                  </div>
                </div>
              ))}
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

