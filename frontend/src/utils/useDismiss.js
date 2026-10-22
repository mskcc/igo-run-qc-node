import { useEffect } from 'react';

/**
 * Close a popup on a click outside it or on Escape, while it is open.
 *
 * `refs` are the elements that count as inside - the popup, and the button that toggles
 * it, so that clicking the button still toggles rather than closing and reopening.
 */
export const useDismiss = (open, refs, onClose) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const inside = target => refs.some(ref => ref.current && ref.current.contains(target));
    const onMouseDown = event => {
      if (!inside(event.target)) {
        onClose();
      }
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, refs, onClose]);
};
