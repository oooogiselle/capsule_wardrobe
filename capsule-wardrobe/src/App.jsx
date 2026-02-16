import { useState, useEffect } from "react";

// ── Fonts via inline style injection ──────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "tops", label: "Tops", emoji: "👕", target: 10 },
  { id: "bottoms", label: "Bottoms", emoji: "👖", target: 6 },
  { id: "dresses", label: "Dresses", emoji: "👗", target: 4 },
  { id: "outerwear", label: "Outerwear", emoji: "🧥", target: 3 },
  { id: "shoes", label: "Shoes", emoji: "👟", target: 5 },
  { id: "bags", label: "Bags", emoji: "👜", target: 3 },
  { id: "accessories", label: "Accessories", emoji: "💍", target: 6 },
];

const SEASONS = ["All Season", "Spring/Summer", "Fall/Winter"];
const COLORS = [
  { name: "White", hex: "#F9F6F1" },
  { name: "Cream", hex: "#E8DCCB" },
  { name: "Beige", hex: "#C9B99A" },
  { name: "Tan", hex: "#A68B6C" },
  { name: "Brown", hex: "#6B4C3B" },
  { name: "Black", hex: "#1C1C1C" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Grey", hex: "#8A8A8A" },
  { name: "Olive", hex: "#6B7048" },
  { name: "Forest", hex: "#2D4A36" },
  { name: "Burgundy", hex: "#6B1F2A" },
  { name: "Camel", hex: "#C9956B" },
  { name: "Blush", hex: "#D4A4A4" },
  { name: "Other", hex: "#D1D1D1" },
];

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
};

const TABS = ["Dashboard", "Wardrobe", "Goals", "Budget"];

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

  /* ── Header ── */
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

  /* ── Nav ── */
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
  .nav-tab.active {
    color: var(--ink);
    border-bottom-color: var(--accent);
  }

  /* ── Layout ── */
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

  /* ── Cards ── */
  .card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 24px;
  }

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

  .stat-card {
    background: #fff;
    border: 1px solid var(--border);
    padding: 20px 24px;
    border-radius: 2px;
  }
  .stat-card .label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 8px;
  }
  .stat-card .value {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 300;
    color: var(--ink);
    line-height: 1;
  }
  .stat-card .sub {
    font-size: 11px;
    color: var(--ink-faint);
    margin-top: 4px;
  }
  .stat-card.accent { background: var(--ink); border-color: var(--ink); }
  .stat-card.accent .label { color: var(--accent-light); opacity: 0.7; }
  .stat-card.accent .value { color: var(--accent-light); }
  .stat-card.accent .sub { color: #888; }

  /* ── Item Card ── */
  .item-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .item-card:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transform: translateY(-1px);
  }
  .item-card .color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    border: 1px solid rgba(0,0,0,0.1);
    margin-right: 6px;
    vertical-align: middle;
  }
  .item-card .item-emoji {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .item-card .item-name {
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 4px;
  }
  .item-card .item-brand {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 10px;
  }
  .item-card .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--canvas);
  }
  .item-card .cpw {
    font-family: var(--serif);
    font-size: 20px;
    color: var(--ink);
  }
  .item-card .cpw-label {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }
  .item-card .worn-badge {
    font-size: 11px;
    color: var(--ink-muted);
  }
  .item-card .delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--ink-faint);
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.15s;
  }
  .item-card:hover .delete-btn { opacity: 1; }
  .item-card .delete-btn:hover { background: var(--danger); border-color: var(--danger); color: white; }

  .cpw-good { color: var(--success) !important; }
  .cpw-ok { color: var(--warning) !important; }
  .cpw-bad { color: var(--danger) !important; }

  /* ── Filter bar ── */
  .filter-bar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    align-items: center;
  }
  .filter-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    cursor: pointer;
    color: var(--ink-muted);
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: var(--accent); color: var(--ink); }
  .filter-btn.active {
    background: var(--ink);
    border-color: var(--ink);
    color: white;
  }
  .filter-spacer { flex: 1; }
  .add-btn {
    padding: 8px 20px;
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
  }
  .add-btn:hover { background: var(--ink); }

  /* ── Goals ── */
  .goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .goal-card {
    background: #fff;
    border: 1px solid var(--border);
    padding: 20px 24px;
    border-radius: 2px;
  }
  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .goal-title {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
  }
  .goal-count {
    font-family: var(--serif);
    font-size: 20px;
    color: var(--ink-muted);
  }
  .goal-bar-track {
    height: 3px;
    background: var(--canvas);
    border-radius: 2px;
    overflow: hidden;
    margin: 8px 0 6px;
  }
  .goal-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.5s ease;
  }
  .goal-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    display: flex;
    justify-content: space-between;
  }
  .goal-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }
  .goal-input {
    width: 64px;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 13px;
    color: var(--ink);
    background: var(--parchment);
    text-align: center;
  }
  .goal-input:focus { outline: none; border-color: var(--accent); }
  .goal-input-label { font-size: 11px; color: var(--ink-muted); }

  /* ── Budget ── */
  .budget-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--canvas);
  }
  .budget-row:last-child { border-bottom: none; }
  .budget-cat { display: flex; align-items: center; gap: 10px; font-size: 13px; }
  .budget-amt {
    font-family: var(--serif);
    font-size: 18px;
    color: var(--ink);
  }
  .budget-bar-row { margin: 6px 0; }
  .budget-bar {
    height: 4px;
    background: var(--canvas);
    border-radius: 2px;
    overflow: hidden;
  }
  .budget-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20,18,15,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(2px);
  }
  .modal {
    background: var(--parchment);
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 2px;
    border: 1px solid var(--border);
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .modal-header {
    padding: 24px 28px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .modal-header h2 {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 300;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--ink-faint);
    line-height: 1;
  }
  .modal-body { padding: 24px 28px; }
  .modal-footer {
    padding: 16px 28px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  /* ── Form ── */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .form-group.full { grid-column: 1 / -1; }
  .form-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }
  .form-input, .form-select {
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 13px;
    color: var(--ink);
    background: #fff;
  }
  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: var(--accent);
  }
  .form-textarea {
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 13px;
    color: var(--ink);
    background: #fff;
    resize: vertical;
    min-height: 60px;
  }
  .form-textarea:focus { outline: none; border-color: var(--accent); }

  .color-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .color-swatch {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.1s;
  }
  .color-swatch:hover { transform: scale(1.15); }
  .color-swatch.selected {
    border-color: var(--ink);
    box-shadow: 0 0 0 2px var(--parchment);
  }

  .btn {
    padding: 9px 22px;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
  }
  .btn-primary {
    background: var(--accent);
    color: white;
  }
  .btn-primary:hover { background: var(--ink); }
  .btn-ghost {
    background: transparent;
    color: var(--ink-muted);
    border-color: var(--border);
  }
  .btn-ghost:hover { border-color: var(--ink-muted); color: var(--ink); }

  /* ── Worn tracker ── */
  .worn-ctrl {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  .worn-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: #fff;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink-muted);
  }
  .worn-btn:hover { border-color: var(--accent); color: var(--accent); }
  .worn-count {
    font-family: var(--serif);
    font-size: 22px;
    min-width: 32px;
    text-align: center;
  }

  /* ── Empty state ── */
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--ink-faint);
  }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-family: var(--serif); font-size: 20px; color: var(--ink-muted); margin-bottom: 6px; }
  .empty-text { font-size: 13px; }

  /* ── Breadcrumb bar ── */
  .breadcrumb {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 20px;
  }
  .breadcrumb span { color: var(--accent); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--canvas); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n === undefined || n === null || n === ""
    ? "—"
    : "$" + Number(n).toFixed(2);

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

const getCatEmoji = (catId) =>
  CATEGORIES.find((c) => c.id === catId)?.emoji || "👗";

const getColorHex = (name) =>
  COLORS.find((c) => c.name === name)?.hex || "#D1D1D1";

// ── Storage helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY = "capsule_wardrobe_v2";
const GOALS_KEY = "capsule_goals_v2";
const BUDGET_KEY = "capsule_budget_v2";

async function loadData() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function saveData(items) {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(items)); } catch (e) { console.error(e); }
}

async function loadGoals() {
  try {
    const r = await window.storage.get(GOALS_KEY);
    return r ? JSON.parse(r.value) : Object.fromEntries(CATEGORIES.map((c) => [c.id, c.target]));
  } catch {
    return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.target]));
  }
}

async function saveGoals(goals) {
  try { await window.storage.set(GOALS_KEY, JSON.stringify(goals)); } catch (e) { console.error(e); }
}

async function loadBudget() {
  try {
    const r = await window.storage.get(BUDGET_KEY);
    return r ? JSON.parse(r.value) : { monthly: 200, annual: 1200 };
  } catch { return { monthly: 200, annual: 1200 }; }
}

async function saveBudget(b) {
  try { await window.storage.set(BUDGET_KEY, JSON.stringify(b)); } catch (e) { console.error(e); }
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Dashboard");
  const [items, setItems] = useState([]);
  const [goals, setGoals] = useState({});
  const [budget, setBudget] = useState({ monthly: 200, annual: 1200 });
  const [filterCat, setFilterCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [loading, setLoading] = useState(true);

  // Load persisted data
  useEffect(() => {
    Promise.all([loadData(), loadGoals(), loadBudget()]).then(([d, g, b]) => {
      setItems(d);
      setGoals(g);
      setBudget(b);
      setLoading(false);
    });
  }, []);

  // Persist on change
  useEffect(() => { if (!loading) saveData(items); }, [items, loading]);
  useEffect(() => { if (!loading) saveGoals(goals); }, [goals, loading]);
  useEffect(() => { if (!loading) saveBudget(budget); }, [budget, loading]);

  const openAdd = () => { setForm({ ...EMPTY_ITEM }); setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditItem(item.id); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

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
      prev.map((i) =>
        i.id === id ? { ...i, timesWorn: Math.max(0, i.timesWorn + delta) } : i
      )
    );
  };

  // ── Derived stats ──
  const totalItems = items.length;
  const totalSpent = items.reduce((s, i) => s + (Number(i.cost) || 0), 0);
  const totalWears = items.reduce((s, i) => s + (Number(i.timesWorn) || 0), 0);
  const avgCpw =
    items.filter((i) => i.timesWorn > 0 && i.cost > 0).length > 0
      ? items
          .filter((i) => i.timesWorn > 0 && i.cost > 0)
          .reduce((s, i) => s + i.cost / i.timesWorn, 0) /
        items.filter((i) => i.timesWorn > 0 && i.cost > 0).length
      : null;

  const filtered =
    filterCat === "all" ? items : items.filter((i) => i.category === filterCat);

  if (loading)
    return (
      <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink-faint)" }}>
          Loading your wardrobe…
        </p>
      </div>
    );

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>The Capsule</h1>
        <span>Wardrobe Planner</span>
      </div>

      {/* Nav */}
      <nav className="nav">
        {TABS.map((t) => (
          <button
            key={t}
            className={`nav-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Pages */}
      <div className="page">
        {tab === "Dashboard" && (
          <DashboardTab
            items={items}
            goals={goals}
            totalItems={totalItems}
            totalSpent={totalSpent}
            totalWears={totalWears}
            avgCpw={avgCpw}
            adjustWorn={adjustWorn}
            openEdit={openEdit}
          />
        )}
        {tab === "Wardrobe" && (
          <WardrobeTab
            items={filtered}
            filterCat={filterCat}
            setFilterCat={setFilterCat}
            openAdd={openAdd}
            openEdit={openEdit}
            deleteItem={deleteItem}
            adjustWorn={adjustWorn}
          />
        )}
        {tab === "Goals" && (
          <GoalsTab items={items} goals={goals} setGoals={setGoals} />
        )}
        {tab === "Budget" && (
          <BudgetTab
            items={items}
            budget={budget}
            setBudget={setBudget}
            totalSpent={totalSpent}
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <ItemModal
          form={form}
          setForm={setForm}
          editItem={editItem}
          onSave={saveItem}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardTab({ items, goals, totalItems, totalSpent, totalWears, avgCpw, adjustWorn }) {
  // Best performers by CPW
  const worn = items.filter((i) => i.timesWorn > 0 && i.cost > 0);
  const stars = [...worn].sort((a, b) => a.cost / a.timesWorn - b.cost / b.timesWorn).slice(0, 3);
  // Least worn but expensive
  const sleeping = [...items.filter((i) => i.cost > 0)]
    .sort((a, b) => (a.timesWorn || 0) - (b.timesWorn || 0))
    .slice(0, 3);

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

      {/* Category breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
            ⭐ Best Value Pieces
          </div>
          {stars.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Log some wears to see top performers.</p>
          ) : (
            stars.map((item) => {
              const v = cpwValue(item);
              return (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--canvas)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span>{getCatEmoji(item.category)}</span>
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
          )}
        </div>

        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
            😴 Least Used Items
          </div>
          {sleeping.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Add items with costs to see insights.</p>
          ) : (
            sleeping.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--canvas)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span>{getCatEmoji(item.category)}</span>
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
          )}
        </div>
      </div>

      {/* Goals progress */}
      <div className="card">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
          Capsule Goals Progress
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
          {CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat.id).length;
            const target = goals[cat.id] || cat.target;
            const pct = Math.min(100, (count / target) * 100);
            const over = count > target;
            return (
              <div key={cat.id}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span>{cat.emoji} {cat.label}</span>
                  <span style={{ fontFamily: "var(--serif)", color: over ? "var(--danger)" : "var(--ink-muted)" }}>
                    {count}/{target}
                  </span>
                </div>
                <div className="goal-bar-track" style={{ marginTop: 6 }}>
                  <div
                    className="goal-bar-fill"
                    style={{
                      width: pct + "%",
                      background: over ? "var(--danger)" : pct === 100 ? "var(--success)" : "var(--accent)",
                    }}
                  />
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
function WardrobeTab({ items, filterCat, setFilterCat, openAdd, openEdit, deleteItem, adjustWorn }) {
  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Wardrobe</span></p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div className="section-title">My Wardrobe</div>
          <div className="section-sub">{items.length} {items.length === 1 ? "piece" : "pieces"} {filterCat !== "all" ? "in this category" : "total"}</div>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Add Item</button>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>All</button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`filter-btn ${filterCat === c.id ? "active" : ""}`}
            onClick={() => setFilterCat(c.id)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">👗</div>
          <div className="empty-title">Your wardrobe is empty</div>
          <div className="empty-text">Start building your capsule by adding your first piece.</div>
          <button className="add-btn" style={{ marginTop: 20 }} onClick={openAdd}>+ Add First Item</button>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => {
            const v = cpwValue(item);
            return (
              <div key={item.id} className="item-card" onClick={() => openEdit(item)}>
                <button className="delete-btn" onClick={(e) => deleteItem(item.id, e)}>×</button>
                <div className="item-emoji">{getCatEmoji(item.category)}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-brand">
                  <span className="color-dot" style={{ background: getColorHex(item.color), borderColor: "rgba(0,0,0,0.15)" }} />
                  {item.brand || item.color}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.08em" }}>{item.season}</div>
                <div className="item-meta">
                  <div>
                    <div className={`cpw ${cpwClass(v)}`}>
                      {v !== null ? "$" + v.toFixed(2) : fmt(item.cost)}
                    </div>
                    <div className="cpw-label">{v !== null ? "per wear" : "cost"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        className="worn-btn"
                        style={{ width: 22, height: 22, fontSize: 13 }}
                        onClick={(e) => { e.stopPropagation(); adjustWorn(item.id, 1); }}
                      >
                        ＋
                      </button>
                      <span className="worn-badge">{item.timesWorn}×</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
          <div style={{ fontFamily: "var(--serif)", fontSize: 28 }}>
            {Object.values(goals).reduce((a, b) => a + Number(b), 0)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>Current Total</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 28 }}>{items.length}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 4 }}>Remaining</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--accent)" }}>
            {Math.max(0, Object.values(goals).reduce((a, b) => a + Number(b), 0) - items.length)}
          </div>
        </div>
      </div>

      <div className="goals-grid">
        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat.id).length;
          const target = Number(goals[cat.id]) || cat.target;
          const pct = Math.min(100, (count / target) * 100);
          const over = count > target;
          return (
            <div key={cat.id} className="goal-card">
              <div className="goal-header">
                <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                <span className="goal-count">{count}/{target}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 10 }}>{cat.label}</div>
              <div className="goal-bar-track">
                <div
                  className="goal-bar-fill"
                  style={{
                    width: pct + "%",
                    background: over ? "var(--danger)" : pct >= 100 ? "var(--success)" : "var(--accent)",
                  }}
                />
              </div>
              <div className="goal-label">
                <span>{over ? "Over limit" : pct >= 100 ? "Complete" : count + " owned"}</span>
                <span>{target - count > 0 ? `${target - count} to go` : ""}</span>
              </div>
              <div className="goal-input-row">
                <span className="goal-input-label">Target:</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  className="goal-input"
                  value={target}
                  onChange={(e) =>
                    setGoals((prev) => ({ ...prev, [cat.id]: Math.max(1, Number(e.target.value)) }))
                  }
                />
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

  const pct = budget.annual > 0 ? Math.min(120, (totalSpent / budget.annual) * 100) : 0;
  const over = totalSpent > budget.annual;

  return (
    <div>
      <p className="breadcrumb">The Capsule / <span>Budget</span></p>
      <div className="section-title">Budget Overview</div>
      <p className="section-sub">Track your wardrobe investment and stay within your spending goals.</p>

      {/* Budget settings */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
          Your Budget Goals
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 400 }}>
          <div className="form-group">
            <label className="form-label">Annual Budget</label>
            <input
              type="number"
              className="form-input"
              value={budget.annual}
              onChange={(e) => setBudget((b) => ({ ...b, annual: Number(e.target.value) }))}
              min={0}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Budget</label>
            <input
              type="number"
              className="form-input"
              value={budget.monthly}
              onChange={(e) => setBudget((b) => ({ ...b, monthly: Number(e.target.value) }))}
              min={0}
            />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className={`stat-card ${over ? "" : ""}`}>
          <div className="label">Total Spent</div>
          <div className="value" style={{ color: over ? "var(--danger)" : "var(--ink)" }}>
            ${totalSpent.toFixed(0)}
          </div>
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
          <div className="value">
            {items.length > 0 ? "$" + (totalSpent / items.length).toFixed(0) : "—"}
          </div>
          <div className="sub">per piece</div>
        </div>
      </div>

      {/* Annual bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Annual Budget Used</span>
          <span style={{ fontFamily: "var(--serif)", color: over ? "var(--danger)" : "var(--ink)" }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ height: 8, background: "var(--canvas)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: pct + "%",
            background: over ? "var(--danger)" : pct > 75 ? "var(--warning)" : "var(--success)",
            borderRadius: 4,
            transition: "width 0.5s",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--ink-faint)" }}>
          <span>$0</span>
          <span>${budget.annual}</span>
        </div>
      </div>

      {/* By category */}
      <div className="card">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 16 }}>
          Spending by Category
        </div>
        {byCategory.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Add items with costs to see breakdown.</p>
        ) : (
          byCategory
            .sort((a, b) => b.spent - a.spent)
            .map((cat) => {
              const share = totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0;
              return (
                <div key={cat.id}>
                  <div className="budget-row">
                    <div className="budget-cat">
                      <span style={{ fontSize: 18 }}>{cat.emoji}</span>
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
                    <div className="budget-bar">
                      <div className="budget-fill" style={{ width: share + "%" }} />
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

// ── Item Modal ────────────────────────────────────────────────────────────────
function ItemModal({ form, setForm, editItem, onSave, onClose }) {
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editItem ? "Edit Piece" : "Add New Piece"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Item Name *</label>
              <input
                className="form-input"
                placeholder="e.g. White Linen Shirt"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
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

            {/* Worn counter */}
            <div className="form-group">
              <label className="form-label">Times Worn</label>
              <div className="worn-ctrl">
                <button className="worn-btn" onClick={() => set("timesWorn", Math.max(0, (form.timesWorn || 0) - 1))}>−</button>
                <span className="worn-count">{form.timesWorn || 0}</span>
                <button className="worn-btn" onClick={() => set("timesWorn", (form.timesWorn || 0) + 1)}>＋</button>
              </div>
            </div>

            {/* Color picker */}
            <div className="form-group full">
              <label className="form-label">Color — {form.color}</label>
              <div className="color-grid">
                {COLORS.map((c) => (
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

            <div className="form-group full">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Fabric, fit notes, styling ideas…"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
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