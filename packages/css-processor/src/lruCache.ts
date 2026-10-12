/**
 * Bounded LRU cache: reads touch the key as most-recent, writes evict the
 * oldest once `maxSize` is reached. Avoids re-parsing repeated inline CSS
 * without unbounded memory growth.
 */
export interface LRUCache<K, V extends {}> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

export function createLRUCache<K, V extends {}>(
  maxSize: number
): LRUCache<K, V> {
  const map = new Map<K, V>();
  return {
    get(key) {
      const value = map.get(key);
      if (value !== undefined) {
        // LRU touch: move to most-recent end.
        map.delete(key);
        map.set(key, value);
      }
      return value;
    },
    set(key, value) {
      // Only evict when adding a new key; replacing an existing key updates
      // in place and must not free an unrelated slot.
      if (map.size >= maxSize && !map.has(key)) {
        const oldest = map.keys().next().value;
        if (oldest !== undefined) {
          map.delete(oldest);
        }
      }
      map.set(key, value);
    }
  };
}
