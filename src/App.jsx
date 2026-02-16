import { useState, useEffect } from "react";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "tops",        label: "Tops",        abbr: "TOP", target: 10 },
  { id: "bottoms",     label: "Bottoms",     abbr: "BTM", target: 6  },
  { id: "dresses",     label: "Dresses",     abbr: "DRS", target: 4  },
  { id: "outerwear",   label: "Outerwear",   abbr: "OTR", target: 3  },
  { id: "shoes",       label: "Shoes",       abbr: "SHO", target: 5  },
  { id: "bags",        label: "Bags",        abbr: "BAG", target: 3  },
  { id: "accessories", label: "Accessories", abbr: "ACC", target: 6  },
];

const SEASONS = ["All Season", "Spring/Summer", "Fall/Winter"];

const COLORS = [
  { name: "White",        hex: "#F9F6F1", group: "Neutrals" },
  { name: "Off-White",    hex: "#EDE9E0", group: "Neutrals" },
  { name: "Cream",        hex: "#E8DCCB", group: "Neutrals" },
  { name: "Ivory",        hex: "#F5F0E8", group: "Neutrals" },
  { name: "Beige",        hex: "#C9B99A", group: "Neutrals" },
  { name: "Sand",         hex: "#D4C5A9", group: "Neutrals" },
  { name: "Tan",          hex: "#A68B6C", group: "Neutrals" },
  { name: "Camel",        hex: "#C9956B", group: "Neutrals" },
  { name: "Brown",        hex: "#6B4C3B", group: "Neutrals" },
  { name: "Chocolate",    hex: "#3D2314", group: "Neutrals" },
  { name: "Charcoal",     hex: "#3A3A3A", group: "Neutrals" },
  { name: "Grey",         hex: "#8A8A8A", group: "Neutrals" },
  { name: "Silver",       hex: "#C0BDB8", group: "Neutrals" },
  { name: "Black",        hex: "#1C1C1C", group: "Neutrals" },
  { name: "Light Denim",  hex: "#A8BDD4", group: "Blues & Denim" },
  { name: "Denim",        hex: "#5B7FA6", group: "Blues & Denim" },
  { name: "Dark Denim",   hex: "#2E4057", group: "Blues & Denim" },
  { name: "Sky Blue",     hex: "#87CEEB", group: "Blues & Denim" },
  { name: "Cobalt",       hex: "#2C5BA8", group: "Blues & Denim" },
  { name: "Navy",         hex: "#1B2A4A", group: "Blues & Denim" },
  { name: "Teal",         hex: "#2D7D7D", group: "Blues & Denim" },
  { name: "Mint",         hex: "#A8D5C2", group: "Greens" },
  { name: "Sage",         hex: "#8FAF8F", group: "Greens" },
  { name: "Olive",        hex: "#6B7048", group: "Greens" },
  { name: "Khaki",        hex: "#8B8060", group: "Greens" },
  { name: "Forest",       hex: "#2D4A36", group: "Greens" },
  { name: "Emerald",      hex: "#1A6B4A", group: "Greens" },
  { name: "Blush",        hex: "#D4A4A4", group: "Reds & Pinks" },
  { name: "Dusty Rose",   hex: "#C08080", group: "Reds & Pinks" },
  { name: "Mauve",        hex: "#A07070", group: "Reds & Pinks" },
  { name: "Coral",        hex: "#E8735A", group: "Reds & Pinks" },
  { name: "Red",          hex: "#B02020", group: "Reds & Pinks" },
  { name: "Burgundy",     hex: "#6B1F2A", group: "Reds & Pinks" },
  { name: "Wine",         hex: "#4A1020", group: "Reds & Pinks" },
  { name: "Cream Yellow", hex: "#EDE0A0", group: "Yellows & Oranges" },
  { name: "Mustard",      hex: "#C9A030", group: "Yellows & Oranges" },
  { name: "Terracotta",   hex: "#C46A45", group: "Yellows & Oranges" },
  { name: "Rust",         hex: "#8B3A20", group: "Yellows & Oranges" },
  { name: "Lavender",     hex: "#B8A8D4", group: "Purples" },
  { name: "Lilac",        hex: "#9B7FB5", group: "Purples" },
  { name: "Plum",         hex: "#5C2D5C", group: "Purples" },
  { name: "Other",        hex: "#D1D1D1", group: "Other" },
];

const COLOR_GROUPS = [...new Set(COLORS.map((c) => c.group))];


const OCCASIONS = ["Casual", "Work", "Smart Casual", "Formal", "Active", "Date Night", "Travel", "Weekend"];

const CATEGORY_ATTRS = {
  tops: [
    { key: "sleeve",   label: "Sleeve Length", options: ["Sleeveless", "Short Sleeve", "¾ Sleeve", "Long Sleeve"] },
    { key: "fit",      label: "Fit",           options: ["Oversized", "Relaxed", "Regular", "Slim/Fitted"] },
    { key: "neckline", label: "Neckline",       options: ["Crew", "V-Neck", "Scoop", "Turtleneck", "Off-Shoulder", "Collared"] },
  ],
  bottoms: [
    { key: "rise",   label: "Rise",   options: ["Low Rise", "Mid Rise", "High Rise"] },
    { key: "fit",    label: "Fit",    options: ["Skinny", "Slim", "Straight", "Wide Leg", "Flared", "Relaxed"] },
    { key: "length", label: "Length", options: ["Cropped", "Ankle", "Full Length"] },
  ],
  dresses: [
    { key: "sleeve", label: "Sleeve Length", options: ["Sleeveless", "Short Sleeve", "¾ Sleeve", "Long Sleeve"] },
    { key: "length", label: "Length",        options: ["Mini", "Midi", "Maxi"] },
    { key: "fit",    label: "Fit",           options: ["Relaxed", "Regular", "Fitted", "Wrap"] },
  ],
  outerwear: [
    { key: "length", label: "Length",  options: ["Cropped", "Hip Length", "Knee Length", "Long/Maxi"] },
    { key: "fit",    label: "Fit",     options: ["Oversized", "Relaxed", "Regular", "Fitted"] },
    { key: "sleeve", label: "Closure", options: ["Zip", "Button", "Snap", "Open Front", "Belt Tie"] },
  ],
  shoes: [
    { key: "style", label: "Style",       options: ["Sneaker", "Loafer", "Sandal", "Boot", "Heel", "Mule", "Oxford", "Flat"] },
    { key: "heel",  label: "Heel Height", options: ["Flat", "Low (<1in)", "Mid (1–3in)", "High (3in+)", "Platform"] },
  ],
  bags: [
    { key: "style", label: "Style", options: ["Tote", "Shoulder", "Crossbody", "Clutch", "Backpack", "Bucket", "Mini Bag"] },
    { key: "size",  label: "Size",  options: ["Mini", "Small", "Medium", "Large"] },
  ],
  accessories: [
    { key: "type", label: "Type", options: ["Jewelry", "Belt", "Hat", "Scarf", "Sunglasses", "Watch", "Hair Accessory", "Socks/Hosiery"] },
  ],
};

const EMPTY_ITEM = {
  name: "",
  category: "tops",
  color: "Black",
  brand: "",
  cost: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  timesWorn: 0,
  season: "All Season",
  notes: "",
  photo: null,
  occasions: [],
  attrs: {},
};

const TABS = ["Dashboard", "Wardrobe", "Style", "Goals", "Budget"];

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    height: 100%;
  }

  :root {
    --ink: #1C1916;
    --ink-muted: #6B6560;
    --ink-faint: #A8A39D;
    --parchment: #FAF7F2;
    --canvas: #F2EDE6;
    --border: #DDD8D0;
    --accent: #8B6F4E;
    --accent-light: #C9A97A;
    --accent-pale: #F0E8DC;
    --danger: #A03030;
    --success: #3A6B44;
    --warning: #8B6F4E;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Jost', system-ui, sans-serif;
  }

  body { background: var(--parchment); }

  .app {
    width: 100%;
    min-height: 100vh;
    font-family: var(--sans);
    color: var(--ink);
    background: var(--parchment);
  }

  .header {
    background: var(--ink);
    padding: 24px 40px;
    display: flex;
    align-items: baseline;
    gap: 16px;
  }
  .header h1 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: 28px;
    color: var(--accent-light);
    letter-spacing: 0.04em;
  }
  .header span {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .nav {
    background: var(--canvas);
    border-bottom: 1px solid var(--border);
    display: flex;
    padding: 0 40px;
    gap: 0;
  }
  .nav-tab {
    padding: 14px 20px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-muted);
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    margin-bottom: -1px;
  }
  .nav-tab:hover { color: var(--ink); }
  .nav-tab.active { color: var(--ink); border-bottom-color: var(--accent); }

  .page { padding: 36px 40px; max-width: 100%; margin: 0 auto; }

  .section-title {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .section-sub {
    font-size: 12px;
    color: var(--ink-muted);
    letter-spacing: 0.05em;
    margin-bottom: 28px;
  }

  .card { background: #fff; border: 1px solid var(--border); border-radius: 2px; padding: 24px; }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card { background: #fff; border: 1px solid var(--border); padding: 20px 24px; border-radius: 2px; }
  .stat-card .label { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 8px; }
  .stat-card .value { font-family: var(--serif); font-size: 32px; font-weight: 300; color: var(--ink); line-height: 1; }
  .stat-card .sub { font-size: 11px; color: var(--ink-faint); margin-top: 4px; }
  .stat-card.accent { background: var(--ink); border-color: var(--ink); }
  .stat-card.accent .label { color: var(--accent-light); opacity: 0.7; }
  .stat-card.accent .value { color: var(--accent-light); }
  .stat-card.accent .sub { color: #888; }

  /* ── Item Card ── */
  .item-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .item-card:hover { border-color: var(--accent); box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-1px); }
  .item-card-photo { width: 100%; height: 160px; object-fit: cover; display: block; background: var(--canvas); }
  .item-card-no-photo { width: 100%; height: 90px; display: flex; align-items: center; justify-content: center; background: var(--canvas); font-size: 32px; }
  .item-card-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; }
  .item-card .color-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; border: 1px solid rgba(0,0,0,0.1); margin-right: 6px; vertical-align: middle; }
  .item-card .item-name { font-family: var(--serif); font-size: 16px; font-weight: 400; color: var(--ink); margin-bottom: 3px; }
  .item-card .item-brand { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 6px; }
  .item-card .item-meta { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--canvas); }
  .item-card .cpw { font-family: var(--serif); font-size: 20px; color: var(--ink); }
  .item-card .cpw-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-faint); }
  .item-card .worn-badge { font-size: 11px; color: var(--ink-muted); }
  .item-card .delete-btn {
    position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%;
    background: rgba(255,255,255,0.88); border: 1px solid var(--border); color: var(--ink-faint);
    font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: all 0.15s; backdrop-filter: blur(2px);
  }
  .item-card:hover .delete-btn { opacity: 1; }
  .item-card .delete-btn:hover { background: var(--danger); border-color: var(--danger); color: white; }

  .cpw-good { color: var(--success) !important; }
  .cpw-ok   { color: var(--warning) !important; }
  .cpw-bad  { color: var(--danger)  !important; }

  /* ── Filter bar ── */
  .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; align-items: center; }
  .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: #fff; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; cursor: pointer; color: var(--ink-muted); transition: all 0.15s; }
  .filter-btn:hover { border-color: var(--accent); color: var(--ink); }
  .filter-btn.active { background: var(--ink); border-color: var(--ink); color: white; }
  .filter-spacer { flex: 1; }
  .add-btn { padding: 8px 20px; background: var(--accent); border: none; border-radius: 2px; color: white; font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: background 0.15s; }
  .add-btn:hover { background: var(--ink); }

  /* ── Search ── */
  .search-wrap { position: relative; min-width: 200px; max-width: 280px; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--ink-faint); pointer-events: none; font-size: 12px; }
  .search-input { width: 100%; padding: 7px 12px 7px 30px; border: 1px solid var(--border); border-radius: 20px; font-family: var(--sans); font-size: 12px; color: var(--ink); background: #fff; }
  .search-input:focus { outline: none; border-color: var(--accent); }

  /* ── Goals ── */
  .goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .goal-card { background: #fff; border: 1px solid var(--border); padding: 20px 24px; border-radius: 2px; }
  .goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .goal-count { font-family: var(--serif); font-size: 20px; color: var(--ink-muted); }
  .goal-bar-track { height: 3px; background: var(--canvas); border-radius: 2px; overflow: hidden; margin: 8px 0 6px; }
  .goal-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
  .goal-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); display: flex; justify-content: space-between; }
  .goal-input-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
  .goal-input { width: 64px; padding: 5px 8px; border: 1px solid var(--border); border-radius: 2px; font-family: var(--sans); font-size: 13px; color: var(--ink); background: var(--parchment); text-align: center; }
  .goal-input:focus { outline: none; border-color: var(--accent); }
  .goal-input-label { font-size: 11px; color: var(--ink-muted); }

  /* ── Budget ── */
  .budget-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--canvas); }
  .budget-row:last-child { border-bottom: none; }
  .budget-cat { display: flex; align-items: center; gap: 10px; font-size: 13px; }
  .budget-amt { font-family: var(--serif); font-size: 18px; color: var(--ink); }
  .budget-bar-row { margin: 6px 0; }
  .budget-bar { height: 4px; background: var(--canvas); border-radius: 2px; overflow: hidden; }
  .budget-fill { height: 100%; border-radius: 2px; background: var(--accent); }

  /* ── Modal ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(20,18,15,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(2px); }
  .modal { background: var(--parchment); width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; border-radius: 2px; border: 1px solid var(--border); box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .modal-header { padding: 24px 28px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: baseline; }
  .modal-header h2 { font-family: var(--serif); font-size: 22px; font-weight: 300; }
  .modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--ink-faint); line-height: 1; }
  .modal-body { padding: 24px 28px; }
  .modal-footer { padding: 16px 28px 24px; display: flex; justify-content: flex-end; gap: 10px; }

  /* ── Form ── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-muted); }
  .form-input, .form-select { padding: 9px 12px; border: 1px solid var(--border); border-radius: 2px; font-family: var(--sans); font-size: 13px; color: var(--ink); background: #fff; }
  .form-input:focus, .form-select:focus { outline: none; border-color: var(--accent); }
  .form-textarea { padding: 9px 12px; border: 1px solid var(--border); border-radius: 2px; font-family: var(--sans); font-size: 13px; color: var(--ink); background: #fff; resize: vertical; min-height: 60px; }
  .form-textarea:focus { outline: none; border-color: var(--accent); }

  /* ── Color picker ── */
  .color-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .color-swatch { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s; }
  .color-swatch:hover { transform: scale(1.15); }
  .color-swatch.selected { border-color: var(--ink); box-shadow: 0 0 0 2px var(--parchment); }
  .color-group-label { font-size: 9px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-faint); margin: 10px 0 4px; }

  /* ── Buttons ── */
  .btn { padding: 9px 22px; border-radius: 2px; font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--ink); }
  .btn-ghost { background: transparent; color: var(--ink-muted); border-color: var(--border); }
  .btn-ghost:hover { border-color: var(--ink-muted); color: var(--ink); }

  /* ── Worn tracker ── */
  .worn-ctrl { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
  .worn-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border); background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink-muted); }
  .worn-btn:hover { border-color: var(--accent); color: var(--accent); }
  .worn-count { font-family: var(--serif); font-size: 22px; min-width: 32px; text-align: center; }


  /* ── Occasion & Attribute Chips ── */
  .chip-section { margin-top: 4px; }
  .chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
  .chip {
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: #fff;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    color: var(--ink-muted);
    transition: all 0.15s;
  }
  .chip:hover { border-color: var(--accent); color: var(--ink); }
  .chip.on { background: var(--ink); border-color: var(--ink); color: #fff; }
  .chip.on-accent { background: var(--accent-pale); border-color: var(--accent); color: var(--accent); font-weight: 600; }
  .attr-groups { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
  .attr-group-label { font-size: 9px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 5px; }

  /* ── Item card tags ── */
  .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .card-tag {
    padding: 2px 7px;
    border-radius: 10px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.06em;
    background: var(--canvas);
    color: var(--ink-muted);
    border: 1px solid var(--border);
  }
  .card-tag.occ { background: var(--accent-pale); color: var(--accent); border-color: transparent; }


  /* ── Style AI Tab ── */
  .style-hero {
    background: var(--ink);
    border-radius: 2px;
    padding: 36px 40px;
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .style-hero-title {
    font-family: var(--serif);
    font-size: 26px;
    font-weight: 300;
    color: var(--accent-light);
    letter-spacing: 0.02em;
  }
  .style-hero-sub {
    font-size: 12px;
    color: var(--ink-faint);
    letter-spacing: 0.06em;
  }
  .style-input-row {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }
  .style-textarea {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 13px;
    color: #f0ece6;
    resize: none;
    min-height: 60px;
  }
  .style-textarea::placeholder { color: rgba(255,255,255,0.25); }
  .style-textarea:focus { outline: none; border-color: var(--accent-light); }
  .style-submit {
    padding: 0 24px;
    background: var(--accent);
    border: none;
    border-radius: 2px;
    color: white;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .style-submit:hover:not(:disabled) { background: var(--accent-light); }
  .style-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .quick-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .quick-chip {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.15);
    background: transparent;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: all 0.15s;
  }
  .quick-chip:hover { border-color: var(--accent-light); color: var(--accent-light); }

  .outfit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
  .outfit-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
  }
  .outfit-card-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--canvas);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .outfit-card-title {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 400;
    color: var(--ink);
  }
  .outfit-occasion-badge {
    padding: 3px 10px;
    border-radius: 10px;
    background: var(--accent-pale);
    border: 1px solid var(--accent-light);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--accent);
    white-space: nowrap;
  }
  .outfit-pieces {
    display: flex;
    gap: 0;
    overflow-x: auto;
    padding: 0;
    scrollbar-width: none;
  }
  .outfit-pieces::-webkit-scrollbar { display: none; }
  .outfit-piece {
    flex: 0 0 auto;
    width: 110px;
    border-right: 1px solid var(--canvas);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: background 0.15s;
  }
  .outfit-piece:hover { background: var(--parchment); }
  .outfit-piece:last-child { border-right: none; }
  .outfit-piece-img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    display: block;
    background: var(--canvas);
  }
  .outfit-piece-no-img {
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: var(--canvas);
  }
  .outfit-piece-info {
    padding: 8px 10px;
    flex: 1;
  }
  .outfit-piece-name {
    font-size: 11px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.3;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .outfit-piece-cat {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }
  .outfit-rationale {
    padding: 12px 20px 16px;
    font-size: 12px;
    color: var(--ink-muted);
    line-height: 1.6;
    font-style: italic;
    border-top: 1px solid var(--canvas);
  }
  .outfit-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 60px 20px;
    color: var(--ink-faint);
    font-family: var(--serif);
    font-size: 18px;
  }
  .outfit-loading .big-spinner {
    width: 32px; height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .outfit-error {
    background: #FFF0F0;
    border: 1px solid var(--danger);
    border-radius: 2px;
    padding: 14px 20px;
    font-size: 13px;
    color: var(--danger);
    margin-top: 12px;
  }
  .no-wardrobe-msg {
    text-align: center;
    padding: 48px 20px;
    color: var(--ink-faint);
    font-size: 13px;
  }


  .cat-badge {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: var(--ink-faint);
    background: var(--canvas);
  }
  .cat-badge-sm {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--ink-faint);
    background: var(--canvas);
    border-radius: 2px;
    flex-shrink: 0;
  }
  /* ── Photo upload (item modal) ── */
  .photo-zone { border: 2px dashed var(--border); border-radius: 4px; overflow: hidden; background: var(--canvas); cursor: pointer; transition: all 0.2s; }
  .photo-zone:hover { border-color: var(--accent); background: var(--accent-pale); }
  .photo-zone.has-photo { border-style: solid; border-color: var(--border); cursor: default; }
  .photo-zone img { width: 100%; max-height: 200px; object-fit: contain; display: block; }
  .photo-placeholder { padding: 20px; text-align: center; color: var(--ink-faint); font-size: 12px; }
  .photo-placeholder span { font-size: 24px; display: block; margin-bottom: 6px; }
  .photo-actions { display: flex; gap: 8px; margin-top: 6px; }
  .photo-action-btn { flex: 1; padding: 5px; border: 1px solid var(--border); border-radius: 2px; background: #fff; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); cursor: pointer; }
  .photo-action-btn:hover { border-color: var(--accent); color: var(--accent); }
  .photo-action-btn.danger:hover { border-color: var(--danger); color: var(--danger); }

  /* ── Image Lookup Modal ── */
  .img-drop-zone { border: 2px dashed var(--border); border-radius: 4px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--canvas); }
  .img-drop-zone:hover, .img-drop-zone.drag-over { border-color: var(--accent); background: var(--accent-pale); }
  .img-drop-zone.has-image { padding: 0; border-style: solid; border-color: var(--accent); overflow: hidden; cursor: default; }
  .img-drop-zone img { width: 100%; max-height: 220px; object-fit: contain; display: block; background: var(--canvas); }
  .img-or { display: flex; align-items: center; gap: 12px; margin: 14px 0; color: var(--ink-faint); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
  .img-or::before, .img-or::after { content: ""; flex: 1; height: 1px; background: var(--border); }
  .analyze-btn { width: 100%; padding: 11px; background: var(--ink); border: none; border-radius: 2px; color: var(--accent-light); font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; margin-top: 14px; transition: opacity 0.15s; }
  .analyze-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .analyze-btn:not(:disabled):hover { opacity: 0.85; }
  .detected-card { background: var(--accent-pale); border: 1px solid var(--accent-light); border-radius: 2px; padding: 14px 16px; margin-top: 12px; }
  .detected-card .det-label { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .detected-rows { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; font-size: 12px; }
  .detected-rows .dk { color: var(--ink-muted); }
  .detected-rows .dv { color: var(--ink); font-weight: 500; }
  .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(201,169,122,0.3); border-top-color: var(--accent-light); border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Empty state ── */
  .empty { text-align: center; padding: 60px 20px; color: var(--ink-faint); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-family: var(--serif); font-size: 20px; color: var(--ink-muted); margin-bottom: 6px; }
  .empty-text { font-size: 13px; }

  /* ── Breadcrumb ── */
  .breadcrumb { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 20px; }
  .breadcrumb span { color: var(--accent); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--canvas); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n === undefined || n === null || n === "" ? "—" : "$" + Number(n).toFixed(2);

const cpwValue = (item) => {
  if (!item.cost || !item.timesWorn) return null;
  return item.cost / item.timesWorn;
};

const cpwClass = (v) => {
  if (v === null) return "";
  if (v <= 5) return "cpw-good";
  if (v <= 20) return "cpw-ok";
  return "cpw-bad";
};

const getCatLabel = (catId) => CATEGORIES.find((c) => c.id === catId)?.abbr || "—";
const getColorHex = (name) => COLORS.find((c) => c.name === name)?.hex || "#D1D1D1";

// ── Storage layer (window.storage → localStorage fallback) ───────────────────
const STORAGE_KEY = "capsule_wardrobe_v2";
const GOALS_KEY   = "capsule_goals_v2";
const BUDGET_KEY  = "capsule_budget_v2";

const hasCloudStorage = () =>
  typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";

async function storageGet(key) {
  if (hasCloudStorage()) {
    try {
      const r = await window.storage.get(key);
      return r ? r.value : null;
    } catch { /* fall through */ }
  }
  try { return localStorage.getItem(key); } catch { return null; }
}

async function storageSet(key, value) {
  if (hasCloudStorage()) {
    try { await window.storage.set(key, value); return; } catch { /* fall through */ }
  }
  try { localStorage.setItem(key, value); } catch (e) { console.error("Storage error:", e); }
}

async function loadData() {
  try {
    const raw = await storageGet(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveData(d) {
  await storageSet(STORAGE_KEY, JSON.stringify(d));
}

async function loadGoals() {
  try {
    const raw = await storageGet(GOALS_KEY);
    return raw ? JSON.parse(raw) : Object.fromEntries(CATEGORIES.map((c) => [c.id, c.target]));
  } catch { return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.target])); }
}

async function saveGoals(g) {
  await storageSet(GOALS_KEY, JSON.stringify(g));
}

async function loadBudget() {
  try {
    const raw = await storageGet(BUDGET_KEY);
    return raw ? JSON.parse(raw) : { monthly: 200, annual: 1200 };
  } catch { return { monthly: 200, annual: 1200 }; }
}

async function saveBudget(b) {
  await storageSet(BUDGET_KEY, JSON.stringify(b));
}

// ── AI Image Analysis ─────────────────────────────────────────────────────────
async function analyzeClothingImage({ url, base64, mediaType }) {
  const imageContent = url
    ? { type: "image", source: { type: "url", url } }
    : { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } };

  const validColors = COLORS.map((c) => c.name).join(", ");
  const validCats   = CATEGORIES.map((c) => c.id).join(", ");

  const prompt = `You are a fashion expert. Analyze this clothing image and return ONLY valid JSON — no markdown, no explanation:
{
  "name": "descriptive item name e.g. Ivory Silk Blouse",
  "category": one of exactly [${validCats}],
  "color": one of exactly [${validColors}],
  "brand": "brand name if visible, else empty string",
  "season": one of exactly ["All Season","Spring/Summer","Fall/Winter"],
  "notes": "brief style/fabric note, 1 sentence max"
}`;

  const res  = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [{ role: "user", content: [imageContent, { type: "text", text: prompt }] }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).map((b) => b.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}


// ── AI Outfit Suggestions ─────────────────────────────────────────────────────
async function getOutfitSuggestions(items, prompt) {
  const wardrobeData = items.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    color: i.color,
    brand: i.brand || null,
    occasions: i.occasions || [],
    attrs: i.attrs || {},
    season: i.season,
  }));

  const systemPrompt = `You are a personal stylist AI. The user has a capsule wardrobe with specific items. 
Suggest 3 complete, cohesive outfit combinations using ONLY items from their wardrobe.
Each outfit should have a name, a list of item IDs (2–5 pieces that logically form a complete look), 
a short occasion label (≤3 words), and a one-sentence styling rationale.

IMPORTANT RULES:
- Only use item IDs that exist in the wardrobe data provided
- Every outfit must include at least one top or dress, and shoes if available
- Consider color harmony and occasion appropriateness
- Return ONLY valid JSON — no markdown, no explanation

Response format:
{
  "outfits": [
    {
      "title": "Outfit name",
      "occasion": "Short occasion label",
      "itemIds": ["id1", "id2", "id3"],
      "rationale": "One sentence about why this works."
    }
  ]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `My wardrobe: ${JSON.stringify(wardrobeData)}

I need outfit suggestions for: ${prompt}

Return 3 outfit options as JSON.`
      }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).map((b) => b.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,       setTab]       = useState("Dashboard");
  const [items,     setItems]     = useState([]);
  const [goals,     setGoals]     = useState({});
  const [budget,    setBudget]    = useState({ monthly: 200, annual: 1200 });
  const [filterCat, setFilterCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_ITEM);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([loadData(), loadGoals(), loadBudget()]).then(([d, g, b]) => {
      setItems(d); setGoals(g); setBudget(b); setLoading(false);
    });
  }, []);

  useEffect(() => { if (!loading) saveData(items);    }, [items,  loading]);
  useEffect(() => { if (!loading) saveGoals(goals);   }, [goals,  loading]);
  useEffect(() => { if (!loading) saveBudget(budget); }, [budget, loading]);

  const openAdd  = ()     => { setForm({ ...EMPTY_ITEM }); setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item });       setEditItem(item.id); setModalOpen(true); };
  const closeModal = ()   => setModalOpen(false);

  const openFromImage = (detected) => {
    setForm({ ...EMPTY_ITEM, ...detected });
    setEditItem(null);
    setModalOpen(true);
  };

  const saveItem = () => {
    if (!form.name.trim()) return;
    if (editItem) {
      setItems((prev) => prev.map((i) => (i.id === editItem ? { ...form, id: editItem } : i)));
    } else {
      setItems((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const deleteItem = (id, e) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const adjustWorn = (id, delta) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, timesWorn: Math.max(0, i.timesWorn + delta) } : i)
    );
  };

  const totalItems = items.length;
  const totalSpent = items.reduce((s, i) => s + (Number(i.cost) || 0), 0);
  const totalWears = items.reduce((s, i) => s + (Number(i.timesWorn) || 0), 0);
  const wornItems  = items.filter((i) => i.timesWorn > 0 && i.cost > 0);
  const avgCpw     = wornItems.length > 0
    ? wornItems.reduce((s, i) => s + i.cost / i.timesWorn, 0) / wornItems.length
    : null;

  const filtered = filterCat === "all" ? items : items.filter((i) => i.category === filterCat);

  if (loading)
    return (
      <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink-faint)" }}>Loading your wardrobe…</p>
      </div>
    );

  return (
    <div className="app">
      <div className="header">
        <h1>The Capsule</h1>
        <span>Wardrobe Planner</span>
      </div>
      <nav className="nav">
        {TABS.map((t) => (
          <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>
      <div className="page">
        {tab === "Dashboard" && (
          <DashboardTab items={items} goals={goals} totalItems={totalItems} totalSpent={totalSpent} totalWears={totalWears} avgCpw={avgCpw} adjustWorn={adjustWorn} openEdit={openEdit} />
        )}
        {tab === "Wardrobe" && (
          <WardrobeTab items={filtered} allItems={items} filterCat={filterCat} setFilterCat={setFilterCat} openAdd={openAdd} openEdit={openEdit} deleteItem={deleteItem} adjustWorn={adjustWorn} openFromImage={openFromImage} />
        )}
        {tab === "Style" && (
          <StyleTab items={items} openEdit={openEdit} />
        )}
        {tab === "Goals" && (
          <GoalsTab items={items} goals={goals} setGoals={setGoals} />
        )}
        {tab === "Budget" && (
          <BudgetTab items={items} budget={budget} setBudget={setBudget} totalSpent={totalSpent} />
        )}
      </div>
      {modalOpen && (
        <ItemModal form={form} setForm={setForm} editItem={editItem} onSave={saveItem} onClose={closeModal} />
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardTab({ items, goals, totalItems, totalSpent, totalWears, avgCpw, adjustWorn }) {
  const worn     = items.filter((i) => i.timesWorn > 0 && i.cost > 0);
  const stars    = [...worn].sort((a, b) => a.cost / a.timesWorn - b.cost / b.timesWorn).slice(0, 3);
  const sleeping = [...items.filter((i) => i.cost > 0)].sort((a, b) => (a.timesWorn || 0) - (b.timesWorn || 0)).slice(0, 3);

  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Dashboard</span></p>
      <div className="stat-grid">
        <div className="stat-card accent">
          <div className="label">Total Items</div>
          <div className="value">{totalItems}</div>
          <div className="sub">pieces in wardrobe</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Invested</div>
          <div className="value">{totalSpent > 0 ? "$" + totalSpent.toFixed(0) : "—"}</div>
          <div className="sub">across all items</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Wears</div>
          <div className="value">{totalWears}</div>
          <div className="sub">logged occasions</div>
        </div>
        <div className="stat-card">
          <div className="label">Avg Cost/Wear</div>
          <div className="value">{avgCpw !== null ? "$" + avgCpw.toFixed(2) : "—"}</div>
          <div className="sub">across worn items</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>Best Value Pieces</div>
          {stars.length === 0
            ? <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Log some wears to see top performers.</p>
            : stars.map((item) => {
                const v = cpwValue(item);
                return (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--canvas)" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {item.photo
                        ? <img src={item.photo} style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 2 }} alt="" />
                        : <div className="cat-badge-sm">{getCatLabel(item.category)}</div>}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{item.timesWorn} wears</div>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 18 }} className={cpwClass(v)}>
                      ${v.toFixed(2)}<span style={{ fontSize: 10, color: "var(--ink-faint)" }}>/wear</span>
                    </span>
                  </div>
                );
              })
          }
        </div>

        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>Least Used Items</div>
          {sleeping.length === 0
            ? <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Add items with costs to see insights.</p>
            : sleeping.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--canvas)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {item.photo
                      ? <img src={item.photo} style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 2 }} alt="" />
                      : <div className="cat-badge-sm">{getCatLabel(item.category)}</div>}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{item.timesWorn || 0} wears</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button className="worn-btn" onClick={() => adjustWorn(item.id, 1)} title="Log a wear">＋</button>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink-muted)" }}>{fmt(item.cost)}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>Capsule Goals Progress</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
          {CATEGORIES.map((cat) => {
            const count  = items.filter((i) => i.category === cat.id).length;
            const target = goals[cat.id] || cat.target;
            const pct    = Math.min(100, (count / target) * 100);
            const over   = count > target;
            return (
              <div key={cat.id}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span>{cat.label}</span>
                  <span style={{ fontFamily: "var(--serif)", color: over ? "var(--danger)" : "var(--ink-muted)" }}>{count}/{target}</span>
                </div>
                <div className="goal-bar-track" style={{ marginTop: 6 }}>
                  <div className="goal-bar-fill" style={{ width: pct + "%", background: over ? "var(--danger)" : pct === 100 ? "var(--success)" : "var(--accent)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Wardrobe ──────────────────────────────────────────────────────────────────
function WardrobeTab({ items, allItems, filterCat, setFilterCat, openAdd, openEdit, deleteItem, adjustWorn, openFromImage }) {
  const [search,   setSearch]   = useState("");
  const [imgModal, setImgModal] = useState(false);

  const displayed = items.filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      (i.brand || "").toLowerCase().includes(q) ||
      (i.color || "").toLowerCase().includes(q) ||
      (i.notes || "").toLowerCase().includes(q)
    );
  });

  const totalCount = allItems.filter((i) => filterCat === "all" || i.category === filterCat).length;

  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Wardrobe</span></p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div className="section-title">My Wardrobe</div>
          <div className="section-sub">
            {search ? `${displayed.length} of ${totalCount}` : totalCount} {totalCount === 1 ? "piece" : "pieces"}
            {filterCat !== "all" ? " in this category" : " total"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="add-btn" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--ink-muted)" }} onClick={() => setImgModal(true)}>
            Add via Image
          </button>
          <button className="add-btn" onClick={openAdd}>+ Add Item</button>
        </div>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`filter-btn ${filterCat === c.id ? "active" : ""}`} onClick={() => setFilterCat(c.id)}>
            {c.label}
          </button>
        ))}
        <div className="filter-spacer" />
        <div className="search-wrap">
          <span className="search-icon" style={{fontStyle:"normal",fontSize:"11px",color:"var(--ink-faint)"}}>⌕</span>
          <input className="search-input" placeholder="Search name, brand, color…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {displayed.length === 0 && search ? (
        <div className="empty">
          <div className="empty-title">No results for "{search}"</div>
          <div className="empty-text">Try a different name, brand, or color.</div>
        </div>
      ) : allItems.length === 0 ? (
        <div className="empty">
          
          <div className="empty-title">Your wardrobe is empty</div>
          <div className="empty-text">Start building your capsule by adding your first piece.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="add-btn" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--ink-muted)" }} onClick={() => setImgModal(true)}>Add via Image</button>
            <button className="add-btn" onClick={openAdd}>+ Add Manually</button>
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {displayed.map((item) => {
            const v = cpwValue(item);
            return (
              <div key={item.id} className="item-card" onClick={() => openEdit(item)}>
                <button className="delete-btn" onClick={(e) => deleteItem(item.id, e)}>×</button>
                {item.photo
                  ? <img className="item-card-photo" src={item.photo} alt={item.name} />
                  : <div className="item-card-no-photo"><div className="cat-badge">{getCatLabel(item.category)}</div></div>
                }
                <div className="item-card-body">
                  <div className="item-name">{item.name}</div>
                  <div className="item-brand">
                    <span className="color-dot" style={{ background: getColorHex(item.color), borderColor: "rgba(0,0,0,0.15)" }} />
                    {item.brand || item.color}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.08em" }}>{item.season}</div>
                  {((item.occasions && item.occasions.length > 0) || item.attrs) && (
                    <div className="card-tags">
                      {(item.occasions || []).slice(0, 2).map((o) => (
                        <span key={o} className="card-tag occ">{o}</span>
                      ))}
                      {item.attrs && Object.values(item.attrs).filter(Boolean).slice(0, 2).map((v, i) => (
                        <span key={i} className="card-tag">{v}</span>
                      ))}
                    </div>
                  )}
                  <div className="item-meta">
                    <div>
                      <div className={`cpw ${cpwClass(v)}`}>{v !== null ? "$" + v.toFixed(2) : fmt(item.cost)}</div>
                      <div className="cpw-label">{v !== null ? "per wear" : "cost"}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button className="worn-btn" style={{ width: 22, height: 22, fontSize: 13 }} onClick={(e) => { e.stopPropagation(); adjustWorn(item.id, 1); }}>＋</button>
                      <span className="worn-badge">{item.timesWorn}×</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {imgModal && (
        <ImageLookupModal
          onClose={() => setImgModal(false)}
          onDetected={(data) => { setImgModal(false); openFromImage(data); }}
        />
      )}
    </div>
  );
}

// ── Image Lookup Modal ────────────────────────────────────────────────────────
function ImageLookupModal({ onDetected, onClose }) {
  const [url,      setUrl]      = useState("");
  const [base64,   setBase64]   = useState(null);
  const [mType,    setMType]    = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [detected, setDetected] = useState(null);
  const [error,    setError]    = useState(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64(e.target.result.split(",")[1]);
      setMType(file.type);
      setPreview(e.target.result);
      setUrl(""); setDetected(null); setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (v) => {
    setUrl(v); setBase64(null); setPreview(v || null); setDetected(null); setError(null);
  };

  const clearImage = () => { setPreview(null); setBase64(null); setUrl(""); setDetected(null); setError(null); };

  const analyze = async () => {
    setLoading(true); setError(null);
    try {
      const result = await analyzeClothingImage(base64 ? { base64, mediaType: mType } : { url });
      setDetected(result);
    } catch {
      setError("Couldn't identify the item — try a clearer image or a different URL.");
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = url.trim().length > 10 || !!base64;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add via Image</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div
            className={`img-drop-zone${dragging ? " drag-over" : ""}${preview ? " has-image" : ""}`}
            onClick={() => !preview && document.getElementById("img-lookup-input").click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          >
            {preview ? (
              <div style={{ position: "relative" }}>
                <img src={preview} alt="preview" onError={() => setError("Image URL couldn't load. Try uploading instead.")} />
                <button
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", fontSize: 14 }}
                >×</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>Drop a photo here or click to upload</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>JPG · PNG · WEBP</div>
              </>
            )}
          </div>
          <input id="img-lookup-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />

          <div className="img-or">or paste image URL</div>

          <input
            className="form-input"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
          />

          {error && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: "#FFF0F0", border: "1px solid var(--danger)", borderRadius: 2, fontSize: 12, color: "var(--danger)" }}>
              {error}
            </div>
          )}

          {detected && (
            <div className="detected-card">
              <div className="det-label">✓ Item Detected</div>
              <div className="detected-rows">
                <span className="dk">Name</span>     <span className="dv">{detected.name}</span>
                <span className="dk">Category</span> <span className="dv">{detected.category}</span>
                <span className="dk">Color</span>
                <span className="dv">
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: getColorHex(detected.color), border: "1px solid rgba(0,0,0,0.1)", marginRight: 5, verticalAlign: "middle" }} />
                  {detected.color}
                </span>
                {detected.brand && <><span className="dk">Brand</span><span className="dv">{detected.brand}</span></>}
                <span className="dk">Season</span> <span className="dv">{detected.season}</span>
                {detected.notes && <span style={{ gridColumn: "1/-1", marginTop: 4, color: "var(--ink-faint)", fontStyle: "italic", fontSize: 11 }}>{detected.notes}</span>}
              </div>
            </div>
          )}

          <button className="analyze-btn" disabled={!canAnalyze || loading} onClick={detected ? () => onDetected(detected) : analyze}>
            {loading ? <><span className="spinner" />Analyzing…</> : detected ? "Use This — Fill Form" : "Identify Item"}
          </button>
        </div>
      </div>
    </div>
  );
}



// ── Style AI Tab ──────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Job interview",
  "Weekend brunch",
  "First date",
  "Casual Friday",
  "Black tie event",
  "Summer vacation",
  "Rainy day errands",
  "Night out",
];

function StyleTab({ items, openEdit }) {
  const [prompt,    setPrompt]    = useState("");
  const [results,   setResults]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const submit = async (text) => {
    const q = (text || prompt).trim();
    if (!q || loading) return;
    setLoading(true); setError(null); setResults(null); setLastQuery(q);
    try {
      const data = await getOutfitSuggestions(items, q);
      setResults(data.outfits || []);
    } catch {
      setError("Couldn't generate outfits — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } };

  if (items.length < 3) {
    return (
      <div>
        <p className="breadcrumb">The Capsule / <span>Style</span></p>
        <div className="no-wardrobe-msg">
          <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink-muted)", marginBottom: 8 }}>Add more pieces first</div>
          <div>Add at least 3 items to your wardrobe to unlock AI outfit suggestions.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Style</span></p>

      <div className="style-hero">
        <div>
          <div className="style-hero-title">Your Personal Stylist</div>
          <div className="style-hero-sub">Describe your occasion and get outfit ideas from your own wardrobe</div>
        </div>
        <div className="style-input-row">
          <textarea
            className="style-textarea"
            placeholder="e.g. I have a job interview at a creative agency, smart but not too formal…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button className="style-submit" onClick={() => submit()} disabled={!prompt.trim() || loading}>
            {loading ? "Styling…" : "Style Me →"}
          </button>
        </div>
        <div className="quick-chips">
          {QUICK_PROMPTS.map((q) => (
            <button key={q} className="quick-chip" onClick={() => { setPrompt(q); submit(q); }}>{q}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="outfit-loading">
          <div className="big-spinner" />
          Curating outfits from your wardrobe…
        </div>
      )}

      {error && <div className="outfit-error">{error}</div>}

      {results && !loading && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div className="section-title">Outfit Ideas</div>
            <div className="section-sub">Based on: "{lastQuery}" — from your {items.length} piece wardrobe</div>
          </div>
          {results.length === 0 ? (
            <div className="empty">
              
              <div className="empty-title">No matching outfits found</div>
              <div className="empty-text">Try a different occasion or add more items to your wardrobe.</div>
            </div>
          ) : (
            <div className="outfit-grid">
              {results.map((outfit, idx) => {
                const pieces = (outfit.itemIds || [])
                  .map((id) => items.find((i) => i.id === id))
                  .filter(Boolean);
                return (
                  <div key={idx} className="outfit-card">
                    <div className="outfit-card-header">
                      <div className="outfit-card-title">{outfit.title}</div>
                      {outfit.occasion && (
                        <span className="outfit-occasion-badge">{outfit.occasion}</span>
                      )}
                    </div>
                    <div className="outfit-pieces">
                      {pieces.map((item) => (
                        <div key={item.id} className="outfit-piece" onClick={() => openEdit(item)} title="Click to edit">
                          {item.photo
                            ? <img className="outfit-piece-img" src={item.photo} alt={item.name} />
                            : <div className="outfit-piece-no-img"><div className="cat-badge">{getCatLabel(item.category)}</div></div>
                          }
                          <div className="outfit-piece-info">
                            <div className="outfit-piece-name">{item.name}</div>
                            <div className="outfit-piece-cat">{item.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {outfit.rationale && (
                      <div className="outfit-rationale">"{outfit.rationale}"</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── ChipSelect ────────────────────────────────────────────────────────────────
function ChipSelect({ options, value, onChange, multi = false }) {
  const toggle = (opt) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt]);
    } else {
      onChange(value === opt ? "" : opt);
    }
  };
  const isOn = (opt) => multi ? (Array.isArray(value) && value.includes(opt)) : value === opt;
  return (
    <div className="chip-row">
      {options.map((opt) => (
        <button key={opt} className={`chip ${isOn(opt) ? (multi ? "on-accent" : "on") : ""}`} onClick={() => toggle(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Goals ─────────────────────────────────────────────────────────────────────
function GoalsTab({ items, goals, setGoals }) {
  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Goals</span></p>
      <div className="section-title">Capsule Goals</div>
      <p className="section-sub">Set target item counts to keep your wardrobe intentional. A classic capsule wardrobe is ~33–37 pieces.</p>

      <div style={{ background: "#fff", border: "1px solid var(--border)", padding: "16px 24px", marginBottom: 28, display: "flex", gap: 32 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>Total Target</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 28 }}>{Object.values(goals).reduce((a, b) => a + Number(b), 0)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>Current Total</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 28 }}>{items.length}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>Remaining</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--accent)" }}>{Math.max(0, Object.values(goals).reduce((a, b) => a + Number(b), 0) - items.length)}</div>
        </div>
      </div>

      <div className="goals-grid">
        {CATEGORIES.map((cat) => {
          const count  = items.filter((i) => i.category === cat.id).length;
          const target = Number(goals[cat.id]) || cat.target;
          const pct    = Math.min(100, (count / target) * 100);
          const over   = count > target;
          return (
            <div key={cat.id} className="goal-card">
              <div className="goal-header">
                <span className="cat-badge-sm" style={{ width:28, height:28, fontSize:"9px" }}>{cat.abbr}</span>
                <span className="goal-count">{count}/{target}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 10 }}>{cat.label}</div>
              <div className="goal-bar-track">
                <div className="goal-bar-fill" style={{ width: pct + "%", background: over ? "var(--danger)" : pct >= 100 ? "var(--success)" : "var(--accent)" }} />
              </div>
              <div className="goal-label">
                <span>{over ? "Over limit" : pct >= 100 ? "Complete" : count + " owned"}</span>
                <span>{target - count > 0 ? `${target - count} to go` : ""}</span>
              </div>
              <div className="goal-input-row">
                <span className="goal-input-label">Target:</span>
                <input type="number" min={1} max={50} className="goal-input" value={target} onChange={(e) => setGoals((prev) => ({ ...prev, [cat.id]: Math.max(1, Number(e.target.value)) }))} />
                <span className="goal-input-label">pieces</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Budget ────────────────────────────────────────────────────────────────────
function BudgetTab({ items, budget, setBudget, totalSpent }) {
  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    spent: items.filter((i) => i.category === cat.id).reduce((s, i) => s + (Number(i.cost) || 0), 0),
    count: items.filter((i) => i.category === cat.id).length,
  })).filter((c) => c.spent > 0);

  const pct  = budget.annual > 0 ? Math.min(120, (totalSpent / budget.annual) * 100) : 0;
  const over = totalSpent > budget.annual;

  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Budget</span></p>
      <div className="section-title">Budget Overview</div>
      <p className="section-sub">Track your wardrobe investment and stay within your spending goals.</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>Your Budget Goals</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 400 }}>
          <div className="form-group">
            <label className="form-label">Annual Budget</label>
            <input type="number" className="form-input" value={budget.annual} onChange={(e) => setBudget((b) => ({ ...b, annual: Number(e.target.value) }))} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Budget</label>
            <input type="number" className="form-input" value={budget.monthly} onChange={(e) => setBudget((b) => ({ ...b, monthly: Number(e.target.value) }))} min={0} />
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="label">Total Spent</div>
          <div className="value" style={{ color: over ? "var(--danger)" : "var(--ink)" }}>${totalSpent.toFixed(0)}</div>
          <div className="sub">of ${budget.annual} annual goal</div>
        </div>
        <div className="stat-card">
          <div className="label">Remaining</div>
          <div className="value" style={{ color: over ? "var(--danger)" : "var(--success)" }}>
            {over ? "-$" + (totalSpent - budget.annual).toFixed(0) : "$" + (budget.annual - totalSpent).toFixed(0)}
          </div>
          <div className="sub">{over ? "over annual budget" : "left in annual budget"}</div>
        </div>
        <div className="stat-card">
          <div className="label">Avg Item Cost</div>
          <div className="value">{items.length > 0 ? "$" + (totalSpent / items.length).toFixed(0) : "—"}</div>
          <div className="sub">per piece</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Annual Budget Used</span>
          <span style={{ fontFamily: "var(--serif)", color: over ? "var(--danger)" : "var(--ink)" }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ height: 8, background: "var(--canvas)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: over ? "var(--danger)" : pct > 75 ? "var(--warning)" : "var(--success)", borderRadius: 4, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--ink-faint)" }}>
          <span>$0</span><span>${budget.annual}</span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>Spending by Category</div>
        {byCategory.length === 0
          ? <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Add items with costs to see breakdown.</p>
          : byCategory.sort((a, b) => b.spent - a.spent).map((cat) => {
              const share = totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0;
              return (
                <div key={cat.id}>
                  <div className="budget-row">
                    <div className="budget-cat">
                      <span className="cat-badge-sm" style={{ width:28, height:28, fontSize:"9px" }}>{cat.abbr}</span>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{cat.label}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{cat.count} piece{cat.count !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="budget-amt">${cat.spent.toFixed(0)}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{share.toFixed(0)}% of total</div>
                    </div>
                  </div>
                  <div className="budget-bar-row">
                    <div className="budget-bar"><div className="budget-fill" style={{ width: share + "%" }} /></div>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

// ── Item Modal ────────────────────────────────────────────────────────────────
function ItemModal({ form, setForm, editItem, onSave, onClose }) {
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePhotoUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => set("photo", e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editItem ? "Edit Piece" : "Add New Piece"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">

            {/* Photo */}
            <div className="form-group full">
              <label className="form-label">Photo</label>
              <div
                className={`photo-zone${form.photo ? " has-photo" : ""}`}
                onClick={() => !form.photo && document.getElementById("item-photo-input").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handlePhotoUpload(e.dataTransfer.files[0]); }}
              >
                {form.photo
                  ? <img src={form.photo} alt="item" />
                  : <div className="photo-placeholder"><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--ink-faint)",marginBottom:4}}>Photo</div>Drop or click to upload</div>
                }
              </div>
              {form.photo && (
                <div className="photo-actions">
                  <button className="photo-action-btn" onClick={() => document.getElementById("item-photo-input").click()}>Replace</button>
                  <button className="photo-action-btn danger" onClick={() => set("photo", null)}>Remove</button>
                </div>
              )}
              <input id="item-photo-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhotoUpload(e.target.files[0])} />
            </div>

            <div className="form-group full">
              <label className="form-label">Item Name *</label>
              <input className="form-input" placeholder="e.g. White Linen Shirt" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Season</label>
              <select className="form-select" value={form.season} onChange={(e) => set("season", e.target.value)}>
                {SEASONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input className="form-input" placeholder="e.g. Everlane" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Cost ($)</label>
              <input className="form-input" type="number" min={0} placeholder="0.00" value={form.cost} onChange={(e) => set("cost", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input className="form-input" type="date" value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Times Worn</label>
              <div className="worn-ctrl">
                <button className="worn-btn" onClick={() => set("timesWorn", Math.max(0, (form.timesWorn || 0) - 1))}>−</button>
                <span className="worn-count">{form.timesWorn || 0}</span>
                <button className="worn-btn" onClick={() => set("timesWorn", (form.timesWorn || 0) + 1)}>＋</button>
              </div>
            </div>

            {/* Grouped color picker */}
            <div className="form-group full">
              <label className="form-label">
                Color — <span style={{ fontWeight: 600, color: "var(--ink)", textTransform: "none", letterSpacing: 0 }}>{form.color}</span>
              </label>
              {COLOR_GROUPS.map((group) => (
                <div key={group}>
                  <div className="color-group-label">{group}</div>
                  <div className="color-grid">
                    {COLORS.filter((c) => c.group === group).map((c) => (
                      <button
                        key={c.name}
                        className={`color-swatch ${form.color === c.name ? "selected" : ""}`}
                        style={{ background: c.hex }}
                        title={c.name}
                        onClick={() => set("color", c.name)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Occasions */}
            <div className="form-group full">
              <label className="form-label">Occasions</label>
              <ChipSelect
                options={OCCASIONS}
                value={form.occasions || []}
                onChange={(v) => set("occasions", v)}
                multi={true}
              />
            </div>

            {/* Category-specific attributes */}
            {CATEGORY_ATTRS[form.category] && (
              <div className="form-group full">
                <label className="form-label">Details</label>
                <div className="attr-groups">
                  {CATEGORY_ATTRS[form.category].map(({ key, label, options }) => (
                    <div key={key}>
                      <div className="attr-group-label">{label}</div>
                      <ChipSelect
                        options={options}
                        value={(form.attrs || {})[key] || ""}
                        onChange={(v) => set("attrs", { ...(form.attrs || {}), [key]: v })}
                        multi={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group full">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" placeholder="Fabric, fit notes, styling ideas…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={!form.name.trim()}>
            {editItem ? "Save Changes" : "Add to Wardrobe"}
          </button>
        </div>
      </div>
    </div>
  );
}