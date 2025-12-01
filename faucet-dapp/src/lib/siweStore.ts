export type SiweSession = {
  token: string;
  address: string;
  message: string;
  nonce: string;
};

const store = new Map<string, SiweSession>();

export function saveSiweSession(session: SiweSession) {
  store.set(session.token, session);
}

export function getSiweSession(token: string): SiweSession | undefined {
  return store.get(token);
}

export function deleteSiweSession(token: string) {
  store.delete(token);
}
