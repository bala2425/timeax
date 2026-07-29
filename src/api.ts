const nativeFetch = globalThis.fetch.bind(globalThis);

export function installApiClient() {
  globalThis.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (!url.startsWith('/api')) {
      return nativeFetch(input, init);
    }

    const headers = new Headers(init.headers);
    const token = localStorage.getItem('timex_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return nativeFetch(input, { ...init, headers });
  };
}
