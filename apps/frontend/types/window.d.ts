/**
 * Type definitions for window.ethereum (EIP-1193)
 */

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>
  on(event: string, handler: (...args: unknown[]) => void): void
  removeListener(event: string, handler: (...args: unknown[]) => void): void
}

interface Window {
  ethereum?: EthereumProvider
}

