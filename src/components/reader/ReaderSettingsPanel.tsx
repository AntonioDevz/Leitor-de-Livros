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
  { key: 'light', label: 'Claro', colors: ['#ffffff', '#221d17'] },
  { key: 'sepia', label: 'Sépia', colors: ['#f4ecd8', '#5c4b37'] },
  { key: 'dark', label: 'Escuro', colors: ['#1b1f2b', '#e2e8f0'] },
  { key: 'black', label: 'Preto', colors: ['#000000', '#d4d4d8'] },
  { key: 'custom', label: 'Ajuste', colors: ['#ffffff', '#221d17'] },
];

const pageModes: { key: PageMode; label: string }[] = [
  { key: 'single', label: 'Uma página' },
  { key: 'double', label: 'Duas páginas' },
  { key: 'scroll', label: 'Scroll' },
];

const animations: { key: PageAnimation; label: string }[] = [
  { key: 'flip', label: 'Page Flip' },
  { key: 'slide', label: 'Slide' },
  { key: 'fade', label: 'Fade' },
  { key: 'none', label: 'Nenhuma' },
];

function OptionButton({
  active, onClick, children, theme,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  theme: ThemeConfig;
}) {
  return (
    <button
      onClick={onClick}
      className="py-2 px-3 rounded-xl text-xs font-medium border transition-all duration-200"
      style={
        active
          ? { borderColor: `color-mix(in srgb, ${theme.accent} 60%, transparent)`, background: `color-mix(in srgb, ${theme.accent} 16%, transparent)`, color: theme.accent }
          : { borderColor: theme.border, color: theme.muted, background: 'transparent' }
      }
    >
      {children}
    </button>
  );
}

function SectionTitle({ children, theme }: { children: React.ReactNode; theme: ThemeConfig }) {
  return (
    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.foreground }}>
      <span className="w-1 h-4 rounded-full" style={{ background: theme.accent }} />
      {children}
    </h3>
  );
}

function SliderRow({
  label, value, display, min, max, step, onChange, theme,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  theme: ThemeConfig;
}) {
  return (
    <div>
      <label className="text-xs mb-1.5 flex justify-between items-center" style={{ color: theme.muted }}>
        <span>{label}</span>
        <span className="tabular-nums font-medium" style={{ color: theme.accent }}>{display}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: theme.accent,
          background: `linear-gradient(to right, ${theme.accent} ${((value - min) / (max - min)) * 100}%, color-mix(in srgb, currentColor 15%, transparent) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}

function Toggle({
  label, checked, onChange, theme,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  theme: ThemeConfig;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none py-1">
      <span className="text-sm" style={{ color: theme.foreground }}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-10 h-[22px] rounded-full transition-colors duration-200"
        style={{
          background: checked ? theme.accent : `color-mix(in srgb, currentColor 20%, transparent)`,
        }}
      >
        <span
          className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </button>
    </label>
  );
}

export default function ReaderSettingsPanel({
  settings,
  onChangeSettings,
  onClose,
  theme,
}: ReaderSettingsPanelProps) {
  return (
    <div
      data-panel="settings"
      className="absolute inset-x-2 bottom-2 md:inset-x-auto md:right-5 md:top-14 md:bottom-auto md:w-[21rem] max-h-[75dvh] md:max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border shadow-2xl z-30 animate-slide-up md:animate-slide-down hide-scrollbar"
      style={{
        background: theme.background,
        borderColor: theme.border,
        boxShadow: `0 12px 40px color-mix(in srgb, ${theme.accent} 18%, rgba(0,0,0,0.4))`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: theme.border, background: theme.background }}>
        <span className="md:hidden w-10 h-1 rounded-full mx-auto" style={{ background: `color-mix(in srgb, currentColor 25%, transparent)` }} />
        <p className="text-sm font-semibold" style={{ color: theme.foreground }}>Aparência</p>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors md:hidden"
          style={{ color: theme.muted }}
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <SectionTitle theme={theme}>Tema</SectionTitle>
          <div className="grid grid-cols-5 gap-2">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => onChangeSettings({ ...settings, theme: t.key })}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-200"
                style={
                  settings.theme === t.key
                    ? { boxShadow: `0 0 0 2px ${theme.accent}`, background: `color-mix(in srgb, ${theme.accent} 12%, transparent)` }
                    : { background: 'transparent' }
                }
              >
                <div
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                  style={{ background: t.colors[0], borderColor: theme.border }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ background: t.colors[1] }} />
                </div>
                <span className="text-[10px] leading-none" style={{ color: theme.muted }}>{t.label}</span>
              </button>
            ))}
          </div>
          {settings.theme === 'custom' && (
            <div className="mt-3 p-3 rounded-xl border space-y-2.5 animate-slide-down" style={{ borderColor: theme.border }}>
              {([
                ['Fundo', 'background', (v: string) => ({ ...settings, customTheme: { ...settings.customTheme, background: v } })],
                ['Texto', 'foreground', (v: string) => ({ ...settings, customTheme: { ...settings.customTheme, foreground: v } })],
                ['Destaque', 'accent', (v: string) => ({ ...settings, customTheme: { ...settings.customTheme, accent: v } })],
              ] as const).map(([label, key, apply]) => (
                <div key={key} className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={settings.customTheme?.[key] || '#ffffff'}
                    onChange={(e) => onChangeSettings(apply(e.target.value) as ReaderSettings)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs" style={{ color: theme.muted }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <SectionTitle theme={theme}>Tipografia</SectionTitle>
          <div className="space-y-3.5">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: theme.muted }}>Família</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => onChangeSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: theme.border, background: theme.background, color: theme.foreground }}
              >
                {fontOptions.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <SliderRow
              label="Tamanho"
              value={settings.fontSize}
              display={`${settings.fontSize}px`}
              min={12} max={32} step={1}
              onChange={(v) => onChangeSettings({ ...settings, fontSize: v })}
              theme={theme}
            />
            <SliderRow
              label="Altura da linha"
              value={settings.lineHeight}
              display={settings.lineHeight.toFixed(1)}
              min={1.2} max={2.5} step={0.1}
              onChange={(v) => onChangeSettings({ ...settings, lineHeight: v })}
              theme={theme}
            />
            <SliderRow
              label="Espaçamento do parágrafo"
              value={settings.paragraphSpacing}
              display={settings.paragraphSpacing.toFixed(2)}
              min={0.5} max={3} step={0.25}
              onChange={(v) => onChangeSettings({ ...settings, paragraphSpacing: v })}
              theme={theme}
            />
            <SliderRow
              label="Largura do conteúdo"
              value={settings.contentWidth}
              display={`${settings.contentWidth}px`}
              min={480} max={960} step={40}
              onChange={(v) => onChangeSettings({ ...settings, contentWidth: v })}
              theme={theme}
            />
          </div>
        </div>

        <div>
          <SectionTitle theme={theme}>Presets</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
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
                className="px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 hover:border-current text-left"
                style={{ borderColor: theme.border, color: theme.foreground, background: 'color-mix(in srgb, currentColor 4%, transparent)' }}
              >
                <span className="font-semibold block" style={{ fontFamily: preset.fontFamily }}>{preset.label}</span>
                <span className="text-[10px]" style={{ color: theme.muted }}>AaBbCc</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle theme={theme}>Página</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {pageModes.map((mode) => (
              <OptionButton
                key={mode.key}
                active={settings.pageMode === mode.key}
                onClick={() => onChangeSettings({ ...settings, pageMode: mode.key })}
                theme={theme}
              >
                {mode.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle theme={theme}>Animação</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {animations.map((anim) => (
              <OptionButton
                key={anim.key}
                active={settings.pageAnimation === anim.key}
                onClick={() => onChangeSettings({ ...settings, pageAnimation: anim.key })}
                theme={theme}
              >
                {anim.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: theme.border }}>
          <Toggle
            label="Virar com clique"
            checked={settings.clickToTurn}
            onChange={(v) => onChangeSettings({ ...settings, clickToTurn: v })}
            theme={theme}
          />
          <Toggle
            label="Virar com swipe"
            checked={settings.swipeToTurn}
            onChange={(v) => onChangeSettings({ ...settings, swipeToTurn: v })}
            theme={theme}
          />
          <Toggle
            label="Salvar progresso"
            checked={settings.autoSaveProgress}
            onChange={(v) => onChangeSettings({ ...settings, autoSaveProgress: v })}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}