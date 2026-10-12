import { createLRUCache } from '../lruCache';

describe('createLRUCache', () => {
  it('returns undefined for a missing key', () => {
    const cache = createLRUCache<string, number>(8);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('returns the value previously set under a key', () => {
    const cache = createLRUCache<string, number>(8);
    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);
  });

  it('evicts the least-recently-used entry once maxSize is reached', () => {
    const cache = createLRUCache<string, number>(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3); // evicts 'a'
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  it('touches an entry on get so it is no longer the LRU', () => {
    const cache = createLRUCache<string, number>(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a'); // touch 'a' — 'b' is now LRU
    cache.set('c', 3); // evicts 'b'
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('c')).toBe(3);
  });

  it('updates an existing key in place without evicting other entries', () => {
    const cache = createLRUCache<string, number>(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('b', 99); // replace — must not evict 'a'
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(99);
  });

  it('evicts the previous entry on every new key when maxSize is 1', () => {
    const cache = createLRUCache<string, number>(1);
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
  });
});
