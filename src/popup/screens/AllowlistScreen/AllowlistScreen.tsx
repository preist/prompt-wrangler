import { useState, useEffect } from 'react';
import type { AllowlistItem as AllowlistItemType } from '@lib/storage/allowlist';
import {
  getAllowlist,
  removeFromAllowlist,
  cleanExpiredAllowlistItems,
} from '@lib/storage/allowlist';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import { AllowlistItem } from '@popup/components/AllowlistItem/AllowlistItem';

export function AllowlistScreen() {
  const [allowlist, setAllowlist] = useState<AllowlistItemType[]>([]);

  useEffect(() => {
    void (async () => {
      await cleanExpiredAllowlistItems();
      const items = await getAllowlist();
      setAllowlist(items);
    })();
  }, []);

  const handleRemove = async (value: string, type: AllowlistItemType['type']) => {
    await removeFromAllowlist(value, type);
    await cleanExpiredAllowlistItems();
    const items = await getAllowlist();
    setAllowlist(items);
  };

  const handleClearAll = async () => {
    for (const item of allowlist) {
      await removeFromAllowlist(item.value, item.type);
    }
    await cleanExpiredAllowlistItems();
    const items = await getAllowlist();
    setAllowlist(items);
  };

  if (allowlist.length === 0) {
    return (
      <div className="allowlist-screen">
        <ProtectedModeToggle />
        <div className="allowlist-screen__empty">
          <div className="allowlist-screen__empty-title">Allowlist empty</div>
          <div className="allowlist-screen__empty-description">
            Items you allow will appear here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="allowlist-screen">
      <ProtectedModeToggle />

      <div className="allowlist-screen__panel">
        <div className="allowlist-screen__header">
          <h2 className="allowlist-screen__title">Allow list</h2>
          <button
            type="button"
            className="allowlist-screen__clear-button"
            onClick={() => {
              void handleClearAll();
            }}
          >
            Clear all
          </button>
        </div>

        <div className="allowlist-screen__list">
          {allowlist.map((item, index) => (
            <AllowlistItem
              key={`${item.value}-${item.type}-${index.toString()}`}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
