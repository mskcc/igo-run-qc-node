import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { useDismiss } from './useDismiss';

// A toggle button and a popup, as projectPage has them.
const Harness = () => {
  const [open, setOpen] = useState(true);
  const popup = useRef(null);
  const toggle = useRef(null);
  const refs = useRef([popup, toggle]).current;
  useDismiss(open, refs, () => setOpen(false));
  return (
    <div>
      <button id='outside'>elsewhere</button>
      <div id='toggle' ref={toggle} onClick={() => setOpen(o => !o)}>Web Summaries</div>
      {open && <div id='popup' ref={popup}><span id='inside'>an entry</span></div>}
    </div>
  );
};

describe('useDismiss', () => {
  let container;
  let root;
  const mount = () => act(() => { root.render(<Harness />); });
  const isOpen = () => !!container.querySelector('#popup');
  const press = (selector, type = 'mousedown') => act(() => {
    container.querySelector(selector).dispatchEvent(new MouseEvent(type, { bubbles: true }));
  });

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('a click outside closes it', () => {
    mount();
    expect(isOpen()).toBe(true);
    press('#outside');
    expect(isOpen()).toBe(false);
  });

  it('a click inside does not', () => {
    mount();
    press('#inside');
    expect(isOpen()).toBe(true);
  });

  it('Escape closes it', () => {
    mount();
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
    expect(isOpen()).toBe(false);
  });

  it('its toggle button still toggles it shut', () => {
    mount();
    press('#toggle');
    press('#toggle', 'click');
    expect(isOpen()).toBe(false);
  });
});
