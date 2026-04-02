import 'nativewind/metro';

declare module 'nativewind' {
  export interface Colors {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    destructive: string;
  }
}
