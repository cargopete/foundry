/** Foundry: the house instruments. The 3D ones need window.THREE (three@0.149.0 build/three.min.js). */
export interface Instrument { dispose(): void }
export interface NeedleGaugeProps { min?: number; max?: number; value?: number; label?: string; unit?: string; warnAt?: number; digits?: number; ticks?: number }
export interface NixieCounterProps { digits?: number; value?: number }
export interface ValveRadioProps { min?: number; max?: number; value?: number; label?: string; digits?: number }
export interface CRTTerminalProps { title?: string; lines?: string[] }
export declare const Foundry: {
  version: string;
  NeedleGauge(el: HTMLElement, props: NeedleGaugeProps): Instrument & { set(v: number): void };
  NixieCounter(el: HTMLElement, props: NixieCounterProps): Instrument & { set(n: number): void };
  ValveRadio(el: HTMLElement, props: ValveRadioProps): Instrument & { set(v: number): void };
  CRTTerminal(el: HTMLElement, props: CRTTerminalProps): Instrument & { push(line: string): void; setLines(lines: string[]): void };
};
