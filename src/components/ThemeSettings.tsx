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

  const handleColorChange = (colorKey: keyof GradientTheme, value: string) => {
    if (colorKey === "angle") return;
    const newTheme = { ...localTheme, [colorKey]: value };
    setLocalTheme(newTheme);
    onUpdate({ [colorKey]: value });
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
            <h3>グラデーション色</h3>
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

