'use client';

import { useState, useMemo } from 'react';
import type { ParameterTuningScene, ParameterControl } from '@/lib/learning/types';
import { cn } from '@/lib/utils';

interface ParameterTuningSceneViewProps {
  scene: ParameterTuningScene;
  className?: string;
}

type ControlValues = Record<string, number | boolean | string>;

function interpolate(template: string, values: ControlValues): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(values[key] ?? ''));
}

function ControlInput({
  control,
  value,
  onChange,
}: {
  control: ParameterControl;
  value: number | boolean | string;
  onChange: (val: number | boolean | string) => void;
}) {
  if (control.type === 'toggle') {
    const checked = Boolean(value);
    return (
      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <div>
          <p className="text-sm font-medium text-primary-text">{control.label}</p>
          <p className="text-xs text-meta-text mt-0.5">{control.description}</p>
        </div>
        <div className="relative shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="w-10 h-6 bg-panel border border-border rounded-full peer-checked:bg-accent peer-checked:border-accent transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
        </div>
      </label>
    );
  }

  if (control.type === 'select' && control.options) {
    return (
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-primary-text">{control.label}</p>
        <p className="text-xs text-meta-text">{control.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {control.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                value === opt
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-border text-secondary-text hover:border-accent/30 hover:text-primary-text',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // slider
  const numVal = Number(value);
  const min = control.min ?? 0;
  const max = control.max ?? 100;
  const step = control.step ?? 1;
  const pct = ((numVal - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-primary-text">{control.label}</p>
        <span className="text-sm font-mono text-accent">{numVal}</span>
      </div>
      <p className="text-xs text-meta-text">{control.description}</p>
      <div className="relative mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-accent"
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${pct}%, rgba(255,255,255,0.05) ${pct}%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-meta-text">{min}</span>
          <span className="text-xs text-meta-text">{max}</span>
        </div>
      </div>
    </div>
  );
}

export function ParameterTuningSceneView({ scene, className }: ParameterTuningSceneViewProps) {
  const [values, setValues] = useState<ControlValues>(() =>
    Object.fromEntries(scene.controls.map((c) => [c.id, c.defaultValue])),
  );

  const output = useMemo(() => interpolate(scene.outputTemplate, values), [scene.outputTemplate, values]);

  function update(id: string, val: number | boolean | string) {
    setValues((prev) => ({ ...prev, [id]: val }));
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Setup */}
      <p className="text-secondary-text text-sm leading-relaxed">{scene.setup}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Controls panel */}
        <div className="rounded-xl border border-border bg-panel p-5 space-y-5">
          <p className="text-xs font-semibold text-meta-text uppercase tracking-wider">Parameters</p>
          {scene.controls.map((control) => (
            <ControlInput
              key={control.id}
              control={control}
              value={values[control.id]}
              onChange={(val) => update(control.id, val)}
            />
          ))}
        </div>

        {/* Live output panel */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-canvas p-5 min-h-[140px]">
            <p className="text-xs font-semibold text-meta-text uppercase tracking-wider mb-3">Live resultaat</p>
            <pre className="text-sm text-primary-text font-mono whitespace-pre-wrap leading-relaxed">{output}</pre>
          </div>

          {/* Hidden logic panel */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">💡 Verborgen logica</p>
            <p className="text-secondary-text text-sm">{scene.insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
