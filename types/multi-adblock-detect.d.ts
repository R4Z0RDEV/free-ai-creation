declare module 'multi-adblock-detect' {
  export function useAdBlockDetect(): boolean;
  export const detectAdblock: () => Promise<boolean>;
}

declare module 'multi-adblock-detect/lib/index.js' {
  export { useAdBlockDetect, detectAdblock } from 'multi-adblock-detect';
}

