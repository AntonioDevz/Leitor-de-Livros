'use client';

import type { ReaderSettings, ThemeConfig, ReaderTheme, PageMode, PageAnimation } from '@/types';
import { typographyPresets, fontOptions } from '@/lib/typography';

interface ReaderSettingsPanelProps {
  settings: ReaderSettings;
  onChangeSettings: (settings: ReaderSettings) => void;
  onClose: () => void;
  theme: ThemeConfig;
}

const themes: { key: ReaderTheme; label: string; colors: string[] }[] = [
  { key: 'light', label: 'Claro', colors: ['#ffffff', '#1a1a2e'] },
  { key: 'sepia', label: 'Sépia', colors: ['#f4ecd8', '#5c4b37'] },
  { key: 'dark', label: 'Escuro', colors: ['#1a1a2e', '#e2e8f0'] },
  { key: 'black', label: 'Preto', colors: ['#000000', '#d4d4d8'] },
  { key: 'custom', label: 'Personalizado', colors: ['#ffffff', '#1a1a2e'] },
];

const pageModes: { key: PageMode; label: string; icon: string }[] = [
  { key: 'single', label: 'Uma página', icon: '1' },
  { key: 'double', label: 'Duas páginas', icon: '2' },
  { key: 'scroll', label: 'Scroll', icon: '↕' },
];

const animations: { key: PageAnimation; label: string }[] = [
  { key: 'flip', label: 'Page Flip' },
  { key: 'slide', label: 'Slide' },
  { key: 'fade', label: 'Fade' },
  { key: 'none', label: 'Nenhuma' },
];

export default function ReaderSettingsPanel({
  settings,
  onChangeSettings,
  theme,
}: ReaderSettingsPanelProps) {
  return (
    <div
      className="absolute right-4 top-16 w-80 max-h-[80vh] overflow-y-auto rounded-2xl border shadow-xl z-30 animate-slide-down"
      style={{ background: theme.background, borderColor: theme.border }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.foreground }}>Tema</h3>
          <div className="grid grid-cols-5 gap-2">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => onChangeSettings({ ...settings, theme: t.key })}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                  settings.theme === t.key ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ background: t.colors[0], borderColor: theme.border }}>
                  <div className="w-4 h-4 rounded-full" style={{ background: t.colors[1] }} />
                </div>
                <span className="text-[10px]" style={{ color: theme.muted }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.foreground }}>Tipografia</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: theme.muted }}>Família</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => onChangeSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: theme.border, background: theme.background, color: theme.foreground }}
              >
                {fontOptions.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs mb-1.5 flex justify-between" style={{ color: theme.muted }}>
                <span>Tamanho</span>
                <span>{settings.fontSize}px</span>
              </label>
              <input
                type="range"
                min={12}
                max={32}
                value={settings.fontSize}
                onChange={(e) => onChangeSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 flex justify-between" style={{ color: theme.muted }}>
                <span>Altura da linha</span>
                <span>{settings.lineHeight}</span>
              </label>
              <input
                type="range"
                min={1.2}
                max={2.5}
                step={0.1}
                value={settings.lineHeight}
                onChange={(e) => onChangeSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 flex justify-between" style={{ color: theme.muted }}>
                <span>Espaçamento parágrafo</span>
                <span>{settings.paragraphSpacing}</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.25}
                value={settings.paragraphSpacing}
                onChange={(e) => onChangeSettings({ ...settings, paragraphSpacing: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 flex justify-between" style={{ color: theme.muted }}>
                <span>Largura do conteúdo</span>
                <span>{settings.contentWidth}px</span>
              </label>
              <input
                type="range"
                min={480}
                max={960}
                step={40}
                value={settings.contentWidth}
                onChange={(e) => onChangeSettings({ ...settings, contentWidth: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.foreground }}>Presets</h3>
          <div className="space-y-1.5">
            {typographyPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onChangeSettings({
                  ...settings,
                  fontFamily: preset.fontFamily,
                  fontWeight: preset.fontWeight,
                  lineHeight: preset.lineHeight,
                  letterSpacing: preset.letterSpacing,
                })}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition-colors"
                style={{ color: theme.foreground }}
              >
                <span className="font-medium">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.foreground }}>Página</h3>
          <div className="grid grid-cols-3 gap-2">
            {pageModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => onChangeSettings({ ...settings, pageMode: mode.key })}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  settings.pageMode === mode.key
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : ''
                }`}
                style={settings.pageMode !== mode.key ? { borderColor: theme.border, color: theme.muted } : {}}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.foreground }}>Animação</h3>
          <div className="grid grid-cols-2 gap-2">
            {animations.map((anim) => (
              <button
                key={anim.key}
                onClick={() => onChangeSettings({ ...settings, pageAnimation: anim.key })}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  settings.pageAnimation === anim.key
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : ''
                }`}
                style={settings.pageAnimation !== anim.key ? { borderColor: theme.border, color: theme.muted } : {}}
              >
                {anim.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.border }}>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm" style={{ color: theme.foreground }}>Virar com clique</span>
            <input
              type="checkbox"
              checked={settings.clickToTurn}
              onChange={(e) => onChangeSettings({ ...settings, clickToTurn: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm" style={{ color: theme.foreground }}>Virar com swipe</span>
            <input
              type="checkbox"
              checked={settings.swipeToTurn}
              onChange={(e) => onChangeSettings({ ...settings, swipeToTurn: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm" style={{ color: theme.foreground }}>Salvar progresso</span>
            <input
              type="checkbox"
              checked={settings.autoSaveProgress}
              onChange={(e) => onChangeSettings({ ...settings, autoSaveProgress: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
