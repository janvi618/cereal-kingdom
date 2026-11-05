// Cereal Kingdom live relay.
// Live, room-wide messages (lobby, start signal, live scores, ticker events) go over MQTT on secure
// WebSockets to two free public brokers at once, deduplicated, so either one can drop out.
// ntfy.sh stays the durable store for final scores and a fallback start channel for networks
// that block the brokers' ports.

const te = new TextEncoder(), td = new TextDecoder();
export const DEFAULT_BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
export const NTFY = 'https://ntfy.sh/';

const str = s => { const b = te.encode(s); return [b.length >> 8, b.length & 255, ...b]; };
const varint = n => { const o = []; do { let d = n % 128; n = Math.floor(n / 128); if (n > 0) d |= 128; o.push(d); } while (n > 0); return o; };
const packet = (type, body) => new Uint8Array([type, ...varint(body.length), ...body]);
export const uid = (n = 10) => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');

// One MQTT 3.1.1 connection (QoS 0 only), with reconnect, keepalive and an outbox for while it's down.
class Conn {
  constructor(url, onPublish, onChange){
    this.url = url; this.onPublish = onPublish; this.onChange = onChange;
    this.filters = new Set(); this.retained = new Map(); this.queue = []; this.up = false; this.closed = false; this.tries = 0; this.pid = 1;
    this.open();
  }
  open(){
    if (this.closed) return;
    let ws;
    try { ws = new WebSocket(this.url, ['mqtt']); } catch { this.retry(); return; }
    ws.binaryType = 'arraybuffer'; this.ws = ws; this.buf = new Uint8Array(0);
    const giveUp = setTimeout(() => { if (!this.up) try { ws.close(); } catch {} }, 7000);
    ws.onopen = () => ws.send(packet(0x10, [...str('MQTT'), 4, 0x02, 0, 40, ...str('ck' + uid(12))]));
    ws.onmessage = e => this.feed(new Uint8Array(e.data));
    ws.onclose = ws.onerror = () => { clearTimeout(giveUp); if (this.ws !== ws) return; this.ws = null; const was = this.up; this.up = false; clearInterval(this.ping); if (was) this.onChange(); this.retry(); };
  }
  retry(){ if (this.closed) return; const wait = Math.min(12000, 800 * 2 ** this.tries++); setTimeout(() => this.open(), wait); }
  feed(chunk){
    const b = new Uint8Array(this.buf.length + chunk.length); b.set(this.buf); b.set(chunk, this.buf.length); this.buf = b;
    for (;;) {
      if (this.buf.length < 2) return;
      let len = 0, mul = 1, i = 1, byte;
      do { if (i >= this.buf.length) return; byte = this.buf[i++]; len += (byte & 127) * mul; mul *= 128; } while (byte & 128 && i < 5);
      if (this.buf.length < i + len) return;
      const h = this.buf[0], body = this.buf.slice(i, i + len); this.buf = this.buf.slice(i + len);
      this.handle(h, body);
    }
  }
  handle(h, body){
    const type = h >> 4;
    if (type === 2) {                                   // CONNACK
      if (body[1] !== 0) { try { this.ws.close(); } catch {} return; }
      this.up = true; this.tries = 0;
      for (const f of this.filters) this.sendSub(f);
      for (const [t, m] of this.retained) this.sendPub(t, m, true);
      for (const [t, m] of this.queue.splice(0)) this.sendPub(t, m, false);
      this.ping = setInterval(() => this.raw(new Uint8Array([0xC0, 0])), 15000);
      this.onChange();
    } else if (type === 3) {                            // PUBLISH
      const qos = (h >> 1) & 3, tl = (body[0] << 8) | body[1], topic = td.decode(body.slice(2, 2 + tl));
      let off = 2 + tl;
      if (qos) { this.raw(new Uint8Array([0x40, 2, body[off], body[off + 1]])); off += 2; }
      const payload = td.decode(body.slice(off));
      if (payload) this.onPublish(topic, payload, !!(h & 1));
    }
  }
  raw(p){ if (this.ws && this.ws.readyState === 1) try { this.ws.send(p); } catch {} }
  sendSub(f){ const id = this.pid++ & 0xffff || 1; this.raw(packet(0x82, [id >> 8, id & 255, ...str(f), 0])); }
  sendPub(topic, msg, retain){ this.raw(packet(0x30 | (retain ? 1 : 0), [...str(topic), ...te.encode(msg)])); }
  subscribe(f){ this.filters.add(f); if (this.up) this.sendSub(f); }
  publish(topic, msg, retain){
    if (retain) { if (msg) this.retained.set(topic, msg); else this.retained.delete(topic); }
    if (this.up) this.sendPub(topic, msg, retain);
    else if (!retain) { this.queue.push([topic, msg]); if (this.queue.length > 40) this.queue.shift(); }
  }
  close(){ this.closed = true; clearInterval(this.ping); if (this.ws) { this.raw(new Uint8Array([0xE0, 0])); try { this.ws.close(); } catch {} } }
}

// createRelay: channels are short names under one room prefix ("ctl", "ev", "p/<id>", "p/+").
export function createRelay({ room, brokers = DEFAULT_BROKERS, onMessage, onStatus }){
  const prefix = `ck26/${room}/`, seen = new Map();
  const deliver = (topic, payload, retained) => {
    let d; try { d = JSON.parse(payload); } catch { return; }
    if (!d || typeof d !== 'object') return;
    const key = d.mid || payload; if (seen.has(key)) return;
    seen.set(key, 1); if (seen.size > 1500) seen.delete(seen.keys().next().value);
    onMessage && onMessage(topic.slice(prefix.length), d, retained);
  };
  const conns = brokers.map(u => new Conn(u, deliver, () => onStatus && onStatus(api.status())));
  const api = {
    subscribe(ch){ conns.forEach(c => c.subscribe(prefix + ch)); },
    publish(ch, obj, retain = false){ obj = { v: 1, mid: uid(8), t: Date.now(), ...obj }; const s = JSON.stringify(obj); conns.forEach(c => c.publish(prefix + ch, s, retain)); return obj; },
    clear(ch){ conns.forEach(c => c.publish(prefix + ch, '', true)); },
    status(){ return { up: conns.filter(c => c.up).length, of: conns.length }; },
    close(){ conns.forEach(c => c.close()); }
  };
  return api;
}

// ntfy helpers: one POST, or a live stream (EventSource) that reconnects with backoff.
export async function ntfyPost(topic, obj, tries = 3){
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(NTFY + topic, { method: 'POST', body: JSON.stringify(obj) }); if (r.ok) return true; } catch {}
    await new Promise(r => setTimeout(r, 1200 * (i + 1)));
  }
  return false;
}
export function ntfyStream(topic, { since = 'all', onMessage, onStatus }){
  let es = null, closed = false, tries = 0, lastId = null;
  const open = () => {
    if (closed) return;
    es = new EventSource(`${NTFY}${topic}/sse?since=${lastId || since}`);
    es.onopen = () => { tries = 0; onStatus && onStatus(true); };
    es.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch { return; } if (m.event !== 'message') return; lastId = m.id; onMessage(m); };
    es.onerror = () => { onStatus && onStatus(false); es.close(); setTimeout(open, Math.min(30000, 2000 * 2 ** tries++)); };
  };
  open();
  return { close(){ closed = true; if (es) es.close(); } };
}
