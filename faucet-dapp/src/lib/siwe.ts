import { SiweMessage } from "siwe";

export function createSiweMessage(address: string, nonce: string) {
  return new SiweMessage({
    domain: "localhost",
    address,
    statement: "Inicia sesión para reclamar tokens del Faucet.",
    uri: "http://localhost:3000",
    version: "1",
    chainId: 11155111,
    nonce,
  });
}
