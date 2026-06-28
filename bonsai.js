(function () {
  const pre = document.getElementById("bonsai");
  const data = window.BONSAI;
  if (!pre || !data) return;

  const W = data.w;
  const H = data.h;
  const events = data.e;

  const GROW_MS = 3500;
  const FONT_FAMILY = 'ui-monospace, "Courier New", monospace';
  const FONT_WEIGHT = 700;
  const LINE_HEIGHT = 1.05;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const grid = Array.from({ length: H }, () => new Array(W).fill(null));

  function escapeChar(ch) {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return ch;
  }

  function fitFont() {
    const wrapW = pre.parentElement.clientWidth;
    if (!wrapW) return;
    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:pre;font-family:" +
      FONT_FAMILY +
      ";font-weight:" + FONT_WEIGHT +
      ";font-size:100px";
    probe.textContent = "M".repeat(20);
    document.body.appendChild(probe);
    const ratio = probe.getBoundingClientRect().width / 20 / 100; // char width per px of font
    document.body.removeChild(probe);

    const fontPx = wrapW / (W * ratio);
    pre.style.fontSize = fontPx + "px";
  }

  function render() {
    let html = "";
    for (let r = 0; r < H; r++) {
      const row = grid[r];
      let runColor = null;
      let runText = "";
      for (let c = 0; c < W; c++) {
        const cell = row[c];
        if (cell) {
          if (cell.color !== runColor) {
            if (runText) html += `<span style="color:${runColor}">${runText}</span>`;
            runColor = cell.color;
            runText = escapeChar(cell.char);
          } else {
            runText += escapeChar(cell.char);
          }
        } else {
          if (runText) html += `<span style="color:${runColor}">${runText}</span>`;
          runColor = null;
          runText = "";
          html += " ";
        }
      }
      if (runText) html += `<span style="color:${runColor}">${runText}</span>`;
      html += "\n";
    }
    pre.innerHTML = html;
  }

  function applyUpTo(index) {
    for (let i = applyUpTo.cursor; i < index; i++) {
      const ev = events[i];
      grid[ev[0]][ev[1]] = { char: ev[2], color: ev[3] };
    }
    applyUpTo.cursor = index;
  }
  applyUpTo.cursor = 0;

  pre.style.fontFamily = FONT_FAMILY;
  pre.style.fontWeight = FONT_WEIGHT;
  pre.style.lineHeight = LINE_HEIGHT;
  pre.style.whiteSpace = "pre";
  pre.style.margin = "0";
  fitFont();
  window.addEventListener("resize", fitFont);

  if (reduceMotion) {
    applyUpTo(events.length);
    render();
    return;
  }

  const start = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - start) / GROW_MS);
    const target = Math.floor(progress * events.length);
    if (target > applyUpTo.cursor) {
      applyUpTo(target);
      render();
    }
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
