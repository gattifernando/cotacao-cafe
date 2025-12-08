declare module 'asciichart' {
  interface PlotConfig {
    height?: number;
    colors?: number[];
    format?: (x: number, i?: number) => string;
    offset?: number;
    padding?: string;
    min?: number;
    max?: number;
  }

  function plot(series: number[] | number[][], config?: PlotConfig): string;

  const green: number;
  const red: number;
  const blue: number;
  const yellow: number;
  const magenta: number;
  const cyan: number;
  const lightgray: number;
  const default_: number;
  const darkgray: number;
  const lightred: number;
  const lightgreen: number;
  const lightyellow: number;
  const lightblue: number;
  const lightmagenta: number;
  const lightcyan: number;
  const white: number;

  export = {
    plot,
    green,
    red,
    blue,
    yellow,
    magenta,
    cyan,
    lightgray,
    default: default_,
    darkgray,
    lightred,
    lightgreen,
    lightyellow,
    lightblue,
    lightmagenta,
    lightcyan,
    white,
  };
}
