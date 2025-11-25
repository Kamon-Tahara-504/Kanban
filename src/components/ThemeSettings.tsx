import { useState, useEffect } from "react";
import type { GradientTheme } from "../types";
import { ColorWheel } from "./ColorWheel";
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
  const [angleSpread, setAngleSpread] = useState<number>(15); // ピッカー間の角度間隔

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  // ColorWheelから3色を受け取る
  const handleColorsChange = (color1: string, color2: string, color3: string) => {
    const newTheme: GradientTheme = {
      color1,
      color2,
      color3,
      angle: localTheme.angle,
    };
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
    // onReset()が呼ばれると、親のthemeがDEFAULT_GRADIENT_THEMEに更新される
    // useEffectでthemeが変更されたときにlocalThemeも更新される
  };

  // プレビュー用のグラデーションCSS
  const getGradientCSS = () => {
    return `linear-gradient(${localTheme.angle}deg, ${localTheme.color1} 0%, ${localTheme.color2} 50%, ${localTheme.color3} 100%)`;
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
          {/* カラーホイールセクション */}
          <div className="theme-color-wheel-section">
            <h3>カラー選択</h3>
            <div className="color-wheel-wrapper">
              <ColorWheel 
                size={400}
                angleSpread={angleSpread}
                initialColor={localTheme.color2}
                onColorsChange={handleColorsChange}
              />
            </div>
            <p className="color-wheel-hint">
              中央の大きいピッカーをドラッグして、3色を同時に選択できます
            </p>
          </div>

          {/* ピッカー間隔設定 */}
          <div className="theme-angle-section">
            <h3>ピッカー間隔</h3>
            <div className="angle-control">
              <input
                type="range"
                min="0"
                max="30"
                value={angleSpread}
                onChange={(e) => setAngleSpread(Number(e.target.value))}
                className="angle-slider"
              />
              <span className="angle-value">{angleSpread}°</span>
            </div>
          </div>

          {/* グラデーションプレビュー */}
          <div className="theme-preview-section">
            <h3>グラデーションプレビュー</h3>
            <div
              className="theme-preview-gradient"
              style={{ background: getGradientCSS() }}
            />
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

          {/* カラー情報表示 */}
          <div className="theme-colors-info">
            <div className="color-info-item">
              <div 
                className="color-info-swatch" 
                style={{ backgroundColor: localTheme.color1 }}
              />
              <span className="color-info-label">Color 1:</span>
              <span className="color-info-value">{localTheme.color1}</span>
            </div>
            <div className="color-info-item">
              <div 
                className="color-info-swatch" 
                style={{ backgroundColor: localTheme.color2 }}
              />
              <span className="color-info-label">Color 2:</span>
              <span className="color-info-value">{localTheme.color2}</span>
            </div>
            <div className="color-info-item">
              <div 
                className="color-info-swatch" 
                style={{ backgroundColor: localTheme.color3 }}
              />
              <span className="color-info-label">Color 3:</span>
              <span className="color-info-value">{localTheme.color3}</span>
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
