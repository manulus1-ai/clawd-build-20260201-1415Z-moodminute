export function encodePayload(obj: any): string {
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return encodeURIComponent(b64);
}

export function decodePayload(payload: string): any {
  const b64 = decodeURIComponent(payload);
  const json = decodeURIComponent(escape(atob(b64)));
  return JSON.parse(json);
}
