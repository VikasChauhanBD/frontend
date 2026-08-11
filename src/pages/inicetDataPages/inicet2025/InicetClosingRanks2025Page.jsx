import React, { useState, useEffect, useMemo } from "react";
import "./InicetClosingRanks2025Page.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  X,
  Filter,
  ChevronDown,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from "lucide-react";

const COL_DEFS = [
  { key: "Quota", label: "Quota" },
  { key: "Category", label: "Category" },
  { key: "State", label: "State" },
  { key: "Institute", label: "Institute" },
  { key: "Course", label: "Course" },
  { key: "Fee", label: "Fee" },
  { key: "Stipend Year 1", label: "Stipend Y1" },
  { key: "Bond Years", label: "Bond Yrs" },
  { key: "Bond Penalty", label: "Bond Penalty" },
  { key: "Beds", label: "Beds" },
  { key: "CR JAN 2025 0", label: "JAN R0" },
  { key: "CR JAN 2025 1", label: "JAN R1" },
  { key: "CR JAN 2025 2", label: "JAN R2" },
  { key: "CR JAN 2025 3", label: "JAN R3" },
  { key: "CR JUL 2025 0", label: "JUL R0" },
  { key: "CR JUL 2025 1", label: "JUL R1" },
  { key: "CR JUL 2025 2", label: "JUL R2" },
  { key: "CR JUL 2025 3", label: "JUL R3" },
];

const DEFAULT_VIS = {
  Quota: true,
  Category: true,
  State: true,
  Institute: true,
  Course: true,
  Fee: false,
  "Stipend Year 1": false,
  "Bond Years": false,
  "Bond Penalty": false,
  Beds: false,
  "CR JAN 2025 0": true,
  "CR JAN 2025 1": true,
  "CR JAN 2025 2": true,
  "CR JAN 2025 3": true,
  "CR JUL 2025 0": true,
  "CR JUL 2025 1": true,
  "CR JUL 2025 2": true,
  "CR JUL 2025 3": true,
};

const JAN_RANK_COLS = [
  "CR JAN 2025 0",
  "CR JAN 2025 1",
  "CR JAN 2025 2",
  "CR JAN 2025 3",
];
const JUL_RANK_COLS = [
  "CR JUL 2025 0",
  "CR JUL 2025 1",
  "CR JUL 2025 2",
  "CR JUL 2025 3",
];
const ALL_RANK_COLS = [...JAN_RANK_COLS, ...JUL_RANK_COLS];

// ── Custom searchable select ───────────────────────────────────────────────
const CustomSelect = ({ value, onChange, options, allLabel }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="inicet-cr25-cs-wrapper">
      <button onClick={() => setOpen(!open)} className="inicet-cr25-cs-button">
        <span className="inicet-cr25-cs-button-label">
          {value === "all" ? allLabel : value}
        </span>
        <ChevronDown
          className={`inicet-cr25-cs-chevron ${open ? "inicet-cr25-cs-chevron-open" : ""}`}
        />
      </button>
      {open && (
        <>
          <div
            className="inicet-cr25-cs-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="inicet-cr25-cs-dropdown">
            <div className="inicet-cr25-cs-search-wrapper">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="inicet-cr25-cs-search-input"
              />
            </div>
            <div className="inicet-cr25-cs-options-list">
              {filtered.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`inicet-cr25-cs-option ${
                    value === opt
                      ? "inicet-cr25-cs-option-selected"
                      : "inicet-cr25-cs-option-default"
                  }`}
                >
                  {opt === "all" ? allLabel : opt}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ── Rank cell styling ──────────────────────────────────────────────────────
const RankCell = ({ val }) => {
  if (!val || val === "-" || val === "")
    return <span className="inicet-cr25-rank-empty">—</span>;
  const rank = parseInt(val.replace(/[^0-9]/g, ""));
  if (isNaN(rank)) return <span className="inicet-cr25-rank-empty">—</span>;
  const tier =
    rank <= 100
      ? "inicet-cr25-rank-tier-1"
      : rank <= 500
        ? "inicet-cr25-rank-tier-2"
        : rank <= 2000
          ? "inicet-cr25-rank-tier-3"
          : rank <= 5000
            ? "inicet-cr25-rank-tier-4"
            : "inicet-cr25-rank-tier-5";
  return <span className={`inicet-cr25-rank-value ${tier}`}>{val}</span>;
};

// ── Main component ─────────────────────────────────────────────────────────
const InicetClosingRanks2025Page = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selState, setSelState] = useState("all");
  const [selQuota, setSelQuota] = useState("all");
  const [selCategory, setSelCategory] = useState("all");
  const [selCourse, setSelCourse] = useState("all");
  const [minRank, setMinRank] = useState("");
  const [maxRank, setMaxRank] = useState("");

  // Session & round filter
  const [selSession, setSelSession] = useState("all");
  const [selRound, setSelRound] = useState("all");

  // UI state
  const [page, setPage] = useState(1);
  const [showAdv, setShowAdv] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [colVis, setColVis] = useState(DEFAULT_VIS);

  const PER_PAGE = 50;

  const toggleCol = (k) => setColVis((p) => ({ ...p, [k]: !p[k] }));
  const showAll = () =>
    setColVis(COL_DEFS.reduce((a, { key }) => ({ ...a, [key]: true }), {}));
  const hideAll = () =>
    setColVis(
      COL_DEFS.reduce(
        (a, { key }) => ({
          ...a,
          [key]: key === "Institute" || key === "Course",
        }),
        {},
      ),
    );

  // Apply session + round → update column visibility
  const applySessionRound = (session, round) => {
    setSelSession(session);
    setSelRound(round);
    const nv = { ...colVis };

    // Reset all rank cols
    ALL_RANK_COLS.forEach((k) => {
      nv[k] = false;
    });

    const sessCols =
      session === "JAN"
        ? JAN_RANK_COLS
        : session === "JUL"
          ? JUL_RANK_COLS
          : ALL_RANK_COLS;

    if (round === "all") {
      sessCols.forEach((k) => {
        nv[k] = true;
      });
    } else {
      sessCols.forEach((k) => {
        if (k.endsWith(` ${round}`)) nv[k] = true;
      });
    }
    setColVis(nv);
  };

  // ── CSV parser ─────────────────────────────────────────────────────────
  const parseCSV = (text) => {
    // Strip BOM if present
    const clean = text.replace(/^\uFEFF/, "");
    if (clean.includes("<html") || clean.includes("<!DOCTYPE"))
      throw new Error("HTML");
    const lines = clean
      .trim()
      .split(/\r?\n/)
      .filter((l) => l.trim());
    if (lines.length < 2) throw new Error("No data");

    const parseRow = (line) => {
      const vals = [];
      let cur = "";
      let inQ = false;
      for (const ch of line) {
        if (ch === '"') inQ = !inQ;
        else if (ch === "," && !inQ) {
          vals.push(
            cur
              .trim()
              .replace(/^"(.*)"$/, "$1")
              .trim(),
          );
          cur = "";
        } else cur += ch;
      }
      vals.push(
        cur
          .trim()
          .replace(/^"(.*)"$/, "$1")
          .trim(),
      );
      return vals;
    };

    return lines.slice(1).map((line) => {
      const v = parseRow(line);
      const g = (i) =>
        v[i] !== undefined && v[i] !== "" && v[i] !== "-" ? v[i] : "";

      return {
        Quota: v[0] || "",
        Category: v[1] || "",
        State: v[2] || "",
        Institute: v[3] || "",
        Course: v[4] || "",
        Fee: g(5),
        "Stipend Year 1": g(6),
        "Bond Years": g(7),
        "Bond Penalty": g(8),
        Beds: g(9),
        "CR JAN 2025 0": g(10),
        "CR JAN 2025 1": g(11),
        "CR JAN 2025 2": g(12),
        "CR JAN 2025 3": g(13),
        "CR JUL 2025 0": g(14),
        "CR JUL 2025 1": g(15),
        "CR JUL 2025 2": g(16),
        "CR JUL 2025 3": g(17),
      };
    });
  };

  useEffect(() => {
    fetch("/data/inicet/inicet_closing_ranks_2025.csv")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((t) => {
        setData(parseCSV(t));
        setDataError(false);
      })
      .catch(() => {
        setDataError(true);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Derived filter options ─────────────────────────────────────────────
  const states = useMemo(
    () => [
      "all",
      ...Array.from(new Set(data.map((d) => d.State).filter(Boolean))).sort(),
    ],
    [data],
  );
  const quotas = useMemo(
    () => [
      "all",
      ...Array.from(new Set(data.map((d) => d.Quota).filter(Boolean))).sort(),
    ],
    [data],
  );
  const categories = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(data.map((d) => d.Category).filter(Boolean)),
      ).sort(),
    ],
    [data],
  );
  const courses = useMemo(
    () => [
      "all",
      ...Array.from(new Set(data.map((d) => d.Course).filter(Boolean))).sort(),
    ],
    [data],
  );

  // ── Rank filter helper: get best rank across visible rank cols ─────────
  const getRelevantRanks = (item) => {
    const activeCols = ALL_RANK_COLS.filter((k) => colVis[k]);
    return activeCols
      .map((k) => {
        const m = item[k].match(/\d+/);
        return m ? parseInt(m[0]) : null;
      })
      .filter((r) => r !== null && r > 0);
  };

  // ── Filtering ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return data.filter((item) => {
      if (selQuota !== "all" && item.Quota !== selQuota) return false;
      if (selCategory !== "all" && item.Category !== selCategory) return false;
      if (selState !== "all" && item.State !== selState) return false;
      if (selCourse !== "all" && item.Course !== selCourse) return false;

      if (minRank || maxRank) {
        const ranks = getRelevantRanks(item);
        if (ranks.length === 0) return false;
        const minR = Math.min(...ranks);
        const maxR = Math.max(...ranks);
        if (minRank && maxR < parseFloat(minRank)) return false;
        if (maxRank && minR > parseFloat(maxRank)) return false;
      }

      if (s) {
        const hay =
          `${item.Institute} ${item.Course} ${item.State} ${item.Quota} ${item.Category}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [
    data,
    selQuota,
    selCategory,
    selState,
    selCourse,
    minRank,
    maxRank,
    searchTerm,
    colVis,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    selQuota,
    selCategory,
    selState,
    selCourse,
    minRank,
    maxRank,
    searchTerm,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setSearchTerm("");
    setSelState("all");
    setSelQuota("all");
    setSelCategory("all");
    setSelCourse("all");
    setMinRank("");
    setMaxRank("");
    setSelSession("all");
    setSelRound("all");
    setPage(1);
    setColVis(DEFAULT_VIS);
  };

  const visibleCols = COL_DEFS.filter(({ key }) => colVis[key]);

  if (loading)
    return (
      <div className="inicet-cr25-loading-screen">
        <div className="inicet-cr25-loading-content">
          <div className="inicet-cr25-loading-spinner" />
          <p className="inicet-cr25-loading-text">
            Loading INICET Closing Ranks...
          </p>
        </div>
      </div>
    );

  return (
    <div className="inicet-cr25-page-root">
      {/* ── Column visibility modal ── */}
      {showColModal && (
        <div className="inicet-cr25-modal-overlay">
          <div className="inicet-cr25-modal-box">
            <div className="inicet-cr25-modal-header">
              <h3 className="inicet-cr25-modal-title">Show / Hide Columns</h3>
              <button
                onClick={() => setShowColModal(false)}
                className="inicet-cr25-modal-close-btn"
              >
                <X className="inicet-cr25-modal-close-icon" />
              </button>
            </div>
            <div className="inicet-cr25-modal-body">
              <div className="inicet-cr25-modal-actions">
                <button onClick={showAll} className="inicet-cr25-btn-show-all">
                  Show All
                </button>
                <button onClick={hideAll} className="inicet-cr25-btn-hide-all">
                  Hide All
                </button>
              </div>
              {[
                {
                  label: "Basic Info",
                  keys: ["Quota", "Category", "State", "Institute", "Course"],
                },
                {
                  label: "Financial / Institution Details",
                  keys: [
                    "Fee",
                    "Stipend Year 1",
                    "Bond Years",
                    "Bond Penalty",
                    "Beds",
                  ],
                },
                {
                  label: "JAN 2025 Closing Ranks",
                  keys: [
                    "CR JAN 2025 0",
                    "CR JAN 2025 1",
                    "CR JAN 2025 2",
                    "CR JAN 2025 3",
                  ],
                },
                {
                  label: "JUL 2025 Closing Ranks",
                  keys: [
                    "CR JUL 2025 0",
                    "CR JUL 2025 1",
                    "CR JUL 2025 2",
                    "CR JUL 2025 3",
                  ],
                },
              ].map((group) => (
                <div key={group.label} className="inicet-cr25-col-group">
                  <p className="inicet-cr25-col-group-label">{group.label}</p>
                  {group.keys.map((key) => {
                    const def = COL_DEFS.find((d) => d.key === key);
                    return (
                      <div key={key} className="inicet-cr25-col-row">
                        <label className="inicet-cr25-col-row-label">
                          <input
                            type="checkbox"
                            checked={colVis[key]}
                            onChange={() => toggleCol(key)}
                            className="inicet-cr25-col-checkbox"
                          />
                          <span className="inicet-cr25-col-row-text">
                            {def.label}
                          </span>
                        </label>
                        {colVis[key] ? (
                          <Eye className="inicet-cr25-col-eye-icon" />
                        ) : (
                          <EyeOff className="inicet-cr25-col-eyeoff-icon" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="inicet-cr25-modal-footer">
              <button
                onClick={() => setShowColModal(false)}
                className="inicet-cr25-btn-apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="inicet-cr25-content-wrapper">
        {/* ── Header ── */}
        <div className="inicet-cr25-app-header">
          <div className="inicet-cr25-app-header-row">
            <div className="inicet-cr25-app-header-left">
              <button
                onClick={() => navigate("/dashboard/inicet")}
                className="inicet-cr25-back-btn"
              >
                <ArrowLeft className="inicet-cr25-icon-sm" />
              </button>
              <div>
                <h1 className="inicet-cr25-app-title">INICET Closing Ranks</h1>
                <p className="inicet-cr25-app-subtitle">
                  JAN & JUL 2025 Sessions
                </p>
              </div>
            </div>
            <span className="inicet-cr25-records-count">
              {filtered.length.toLocaleString()} Records
            </span>
          </div>
        </div>

        {dataError && (
          <div className="inicet-cr25-error-banner">
            ⚠️ Data not found. Add{" "}
            <code>/data/inicetData/inicet_closing_ranks_2025.csv</code> to
            enable this page.
          </div>
        )}

        {/* ── Session + Round pills & Category pills ── */}
        <div className="inicet-cr25-pills-section">
          <div className="inicet-cr25-pills-row">
            {/* Session pills */}
            <div className="inicet-cr25-pill-group">
              <span className="inicet-cr25-pill-group-label">Session:</span>
              {["JAN", "JUL"].map((sess) => (
                <button
                  key={sess}
                  onClick={() => applySessionRound(sess, selRound)}
                  className={`inicet-cr25-pill-btn ${
                    selSession === sess
                      ? "inicet-cr25-pill-btn-purple-active"
                      : "inicet-cr25-pill-btn-purple-inactive"
                  }`}
                >
                  {sess}
                </button>
              ))}
              <button
                onClick={() => applySessionRound("all", selRound)}
                className={`inicet-cr25-pill-btn ${
                  selSession === "all"
                    ? "inicet-cr25-pill-btn-gray-active"
                    : "inicet-cr25-pill-btn-gray-inactive"
                }`}
              >
                Both
              </button>
            </div>

            {/* Round pills */}
            <div className="inicet-cr25-pill-group">
              <span className="inicet-cr25-pill-group-label">Round:</span>
              {["0", "1", "2", "3"].map((r) => (
                <button
                  key={r}
                  onClick={() => applySessionRound(selSession, r)}
                  className={`inicet-cr25-pill-btn ${
                    selRound === r
                      ? "inicet-cr25-pill-btn-blue-active"
                      : "inicet-cr25-pill-btn-blue-inactive"
                  }`}
                >
                  R{r}
                </button>
              ))}
              <button
                onClick={() => applySessionRound(selSession, "all")}
                className={`inicet-cr25-pill-btn ${
                  selRound === "all"
                    ? "inicet-cr25-pill-btn-gray-active"
                    : "inicet-cr25-pill-btn-gray-inactive"
                }`}
              >
                All
              </button>
            </div>

            <button
              onClick={() => setShowColModal(true)}
              className="inicet-cr25-columns-btn"
            >
              <Eye className="inicet-cr25-icon-sm" /> Columns
            </button>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="inicet-cr25-filters-section">
          <div className="inicet-cr25-filters-row">
            <div className="inicet-cr25-search-wrapper">
              <Search className="inicet-cr25-search-icon" />
              <input
                type="text"
                placeholder="Search institutes, courses, states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="inicet-cr25-search-input"
              />
            </div>
            <div className="inicet-cr25-selects-wrapper">
              <CustomSelect
                value={selState}
                onChange={(v) => {
                  setSelState(v);
                  setPage(1);
                }}
                options={states}
                allLabel="All States"
              />
              <CustomSelect
                value={selCategory}
                onChange={(v) => {
                  setSelCategory(v);
                  setPage(1);
                }}
                options={categories}
                allLabel="All Categories"
              />
              <CustomSelect
                value={selQuota}
                onChange={(v) => {
                  setSelQuota(v);
                  setPage(1);
                }}
                options={quotas}
                allLabel="All Quotas"
              />
              <button
                onClick={() => setShowAdv(!showAdv)}
                className="inicet-cr25-filter-toggle-btn"
              >
                <Filter className="inicet-cr25-icon-fl" />{" "}
                {showAdv ? "Hide" : "More"} Filters
                <ChevronDown
                  className={`inicet-cr25-filter-toggle-icon ${showAdv ? "inicet-cr25-rotate-open" : ""}`}
                />
              </button>
            </div>
          </div>

          {showAdv && (
            <div className="inicet-cr25-adv-filters">
              <div className="inicet-cr25-adv-filters-grid">
                <CustomSelect
                  value={selCourse}
                  onChange={(v) => {
                    setSelCourse(v);
                    setPage(1);
                  }}
                  options={courses}
                  allLabel="All Courses"
                />
                <div className="inicet-cr25-rank-inputs">
                  <input
                    type="number"
                    placeholder="Min Rank"
                    value={minRank}
                    onChange={(e) => {
                      setMinRank(e.target.value);
                      setPage(1);
                    }}
                    className="inicet-cr25-rank-input"
                  />
                  <input
                    type="number"
                    placeholder="Max Rank"
                    value={maxRank}
                    onChange={(e) => {
                      setMaxRank(e.target.value);
                      setPage(1);
                    }}
                    className="inicet-cr25-rank-input"
                  />
                </div>
                <button onClick={clearAll} className="inicet-cr25-clear-btn">
                  Clear All Filters
                </button>
              </div>
              <div className="inicet-cr25-filtered-count-row">
                <span className="inicet-cr25-filtered-count-num">
                  {filtered.length.toLocaleString()}
                </span>
                <span className="inicet-cr25-filtered-count-label">
                  filtered results
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="inicet-cr25-table-wrapper">
          <table className="inicet-cr25-data-table">
            <thead className="inicet-cr25-table-head">
              <tr>
                {visibleCols.map(({ key, label }) => {
                  const isJan = key.startsWith("CR JAN");
                  const isJul = key.startsWith("CR JUL");
                  return (
                    <th
                      key={key}
                      className={`inicet-cr25-table-th ${
                        isJan
                          ? "inicet-cr25-table-th-jan"
                          : isJul
                            ? "inicet-cr25-table-th-jul"
                            : "inicet-cr25-table-th-default"
                      }`}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="inicet-cr25-table-body">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="inicet-cr25-table-empty"
                  >
                    {dataError
                      ? "CSV not found — add /data/inicetData/inicet_closing_ranks_2025.csv to enable."
                      : "No data found. Try adjusting your filters."}
                  </td>
                </tr>
              ) : (
                paged.map((item, i) => (
                  <tr key={i} className="inicet-cr25-table-row">
                    {colVis.Quota && (
                      <td className="inicet-cr25-td-center">
                        <span className="inicet-cr25-badge-quota">
                          {item.Quota}
                        </span>
                      </td>
                    )}
                    {colVis.Category && (
                      <td className="inicet-cr25-td-center">
                        <span
                          className={`inicet-cr25-badge-category-base ${
                            item.Category === "UR" ||
                            item.Category === "GEN" ||
                            item.Category === "Open"
                              ? "inicet-cr25-badge-cat-gray"
                              : item.Category === "OBC"
                                ? "inicet-cr25-badge-cat-yellow"
                                : item.Category === "SC"
                                  ? "inicet-cr25-badge-cat-red"
                                  : item.Category === "ST"
                                    ? "inicet-cr25-badge-cat-blue"
                                    : item.Category === "EWS"
                                      ? "inicet-cr25-badge-cat-green"
                                      : "inicet-cr25-badge-cat-purple"
                          }`}
                        >
                          {item.Category}
                        </span>
                      </td>
                    )}
                    {colVis.State && (
                      <td className="inicet-cr25-td-state">{item.State}</td>
                    )}
                    {colVis.Institute && (
                      <td className="inicet-cr25-td-institute">
                        {item.Institute}
                      </td>
                    )}
                    {colVis.Course && (
                      <td className="inicet-cr25-td-course">{item.Course}</td>
                    )}
                    {colVis.Fee && (
                      <td className="inicet-cr25-td-fee">{item.Fee || "—"}</td>
                    )}
                    {colVis["Stipend Year 1"] && (
                      <td className="inicet-cr25-td-muted">
                        {item["Stipend Year 1"] || "—"}
                      </td>
                    )}
                    {colVis["Bond Years"] && (
                      <td className="inicet-cr25-td-muted">
                        {item["Bond Years"] || "—"}
                      </td>
                    )}
                    {colVis["Bond Penalty"] && (
                      <td className="inicet-cr25-td-muted">
                        {item["Bond Penalty"] || "—"}
                      </td>
                    )}
                    {colVis.Beds && (
                      <td className="inicet-cr25-td-muted">
                        {item.Beds || "—"}
                      </td>
                    )}
                    {colVis["CR JAN 2025 0"] && (
                      <td className="inicet-cr25-td-rank-jan">
                        <RankCell val={item["CR JAN 2025 0"]} />
                      </td>
                    )}
                    {colVis["CR JAN 2025 1"] && (
                      <td className="inicet-cr25-td-rank-jan">
                        <RankCell val={item["CR JAN 2025 1"]} />
                      </td>
                    )}
                    {colVis["CR JAN 2025 2"] && (
                      <td className="inicet-cr25-td-rank-jan">
                        <RankCell val={item["CR JAN 2025 2"]} />
                      </td>
                    )}
                    {colVis["CR JAN 2025 3"] && (
                      <td className="inicet-cr25-td-rank-jan">
                        <RankCell val={item["CR JAN 2025 3"]} />
                      </td>
                    )}
                    {colVis["CR JUL 2025 0"] && (
                      <td className="inicet-cr25-td-rank-jul">
                        <RankCell val={item["CR JUL 2025 0"]} />
                      </td>
                    )}
                    {colVis["CR JUL 2025 1"] && (
                      <td className="inicet-cr25-td-rank-jul">
                        <RankCell val={item["CR JUL 2025 1"]} />
                      </td>
                    )}
                    {colVis["CR JUL 2025 2"] && (
                      <td className="inicet-cr25-td-rank-jul">
                        <RankCell val={item["CR JUL 2025 2"]} />
                      </td>
                    )}
                    {colVis["CR JUL 2025 3"] && (
                      <td className="inicet-cr25-td-rank-jul">
                        <RankCell val={item["CR JUL 2025 3"]} />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="inicet-cr25-pagination">
          <div className="inicet-cr25-pagination-row">
            <div className="inicet-cr25-pagination-info">
              Showing {filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
              {Math.min(page * PER_PAGE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </div>
            <div className="inicet-cr25-pagination-controls">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inicet-cr25-pagination-nav-btn"
              >
                <PrevIcon className="inicet-cr25-pagination-nav-icon" />
              </button>
              <div className="inicet-cr25-pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const n = start + i;
                  if (n > totalPages) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`inicet-cr25-page-num-btn ${
                        page === n
                          ? "inicet-cr25-page-num-active"
                          : "inicet-cr25-page-num-inactive"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="inicet-cr25-pagination-nav-btn"
              >
                <NextIcon className="inicet-cr25-pagination-nav-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicetClosingRanks2025Page;
