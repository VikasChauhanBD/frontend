import React, { useState, useEffect, useMemo } from "react";
import "./InicetAllotmentsJuly2025Page.css";
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
  Users,
  GraduationCap,
  Building2,
  Award,
} from "lucide-react";

const COL_DEFS = [
  { key: "Round", label: "Round" },
  { key: "AI Rank", label: "AI Rank" },
  { key: "State", label: "State" },
  { key: "Institute", label: "Institute" },
  { key: "Course", label: "Course" },
  { key: "Quota", label: "Quota" },
  { key: "Category", label: "Category" },
];

const DEFAULT_VIS = {
  Round: true,
  "AI Rank": true,
  State: true,
  Institute: true,
  Course: true,
  Quota: true,
  Category: true,
};

// Fallback data used if the CSV can't be fetched/parsed
const FALLBACK_DATA = [
  {
    Round: "Round 1",
    "AI Rank": "100",
    State: "Delhi",
    Institute: "All India Institute of Medical Sciences, New Delhi",
    Course: "MD General Medicine",
    Quota: "All India Quota",
    Category: "General",
  },
  {
    Round: "Round 1",
    "AI Rank": "250",
    State: "Maharashtra",
    Institute: "Seth G.S. Medical College and KEM Hospital, Mumbai",
    Course: "MS General Surgery",
    Quota: "All India Quota",
    Category: "OBC",
  },
];

// ── Custom searchable select ───────────────────────────────────────────────
const CustomSelect = ({ value, onChange, options, allLabel }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="inicet-jul25-cs-wrapper">
      <button onClick={() => setOpen(!open)} className="inicet-jul25-cs-button">
        <span className="inicet-jul25-cs-button-label">
          {value === "all" ? allLabel : value}
        </span>
        <ChevronDown
          className={`inicet-jul25-cs-chevron ${open ? "inicet-jul25-cs-chevron-open" : ""}`}
        />
      </button>
      {open && (
        <>
          <div
            className="inicet-jul25-cs-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="inicet-jul25-cs-dropdown">
            <div className="inicet-jul25-cs-search-wrapper">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="inicet-jul25-cs-search-input"
              />
            </div>
            <div className="inicet-jul25-cs-options-list">
              {filtered.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`inicet-jul25-cs-option ${
                    value === opt
                      ? "inicet-jul25-cs-option-selected"
                      : "inicet-jul25-cs-option-default"
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

// ── AI Rank cell styling ─────────────────────────────────────────────────
const RankCell = ({ val }) => {
  if (!val || val === "-" || val === "")
    return <span className="inicet-jul25-rank-empty">—</span>;
  const rank = parseInt(val.replace(/[^0-9]/g, ""));
  if (isNaN(rank)) return <span className="inicet-jul25-rank-empty">—</span>;
  const tier =
    rank <= 100
      ? "inicet-jul25-rank-tier-1"
      : rank <= 500
        ? "inicet-jul25-rank-tier-2"
        : rank <= 2000
          ? "inicet-jul25-rank-tier-3"
          : rank <= 5000
            ? "inicet-jul25-rank-tier-4"
            : "inicet-jul25-rank-tier-5";
  return <span className={`inicet-jul25-rank-value ${tier}`}>{val}</span>;
};

// ── Round pill label (Round 1 → R1) ─────────────────────────────────────
const roundLabel = (r) => r.replace(/round\s*/i, "R").trim();

// ── Main component ─────────────────────────────────────────────────────────
const InicetAllotmentsJuly2025Page = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selState, setSelState] = useState("all");
  const [selRound, setSelRound] = useState("all");
  const [selCourse, setSelCourse] = useState("all");
  const [selQuota, setSelQuota] = useState("all");
  const [selCategory, setSelCategory] = useState("all");
  const [minRank, setMinRank] = useState("");
  const [maxRank, setMaxRank] = useState("");

  // UI state
  const [page, setPage] = useState(1);
  const [showAdv, setShowAdv] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [colVis, setColVis] = useState(DEFAULT_VIS);

  const PER_PAGE = 75;

  const toggleCol = (k) => setColVis((p) => ({ ...p, [k]: !p[k] }));
  const showAll = () =>
    setColVis(COL_DEFS.reduce((a, { key }) => ({ ...a, [key]: true }), {}));
  const hideAll = () =>
    setColVis(
      COL_DEFS.reduce(
        (a, { key }) => ({ ...a, [key]: key === "Institute" }),
        {},
      ),
    );

  // ── CSV parser ─────────────────────────────────────────────────────────
  const parseCSV = (text) => {
    if (text.includes("<html") || text.includes("<!DOCTYPE")) {
      throw new Error("Invalid CSV data - received HTML");
    }

    const lines = text.trim().split(/\r?\n/);
    const dataLines = lines.filter((line) => line.trim().length > 0);

    if (dataLines.length < 2) {
      throw new Error("Invalid CSV data - insufficient rows");
    }

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

    return dataLines.slice(1).map((line) => {
      const v = parseRow(line);
      return {
        Round: v[0] || "",
        "AI Rank": v[1] || "",
        State: v[2] || "",
        Institute: v[3] || "",
        Course: v[4] || "",
        Quota: v[5] || "",
        Category: v[6] || "",
      };
    });
  };

  useEffect(() => {
    fetch("/data/inicet/inicet_allotments_july_2025.csv")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (!text || text.trim().length === 0)
          throw new Error("Empty CSV file");
        const parsed = parseCSV(text);
        if (parsed.length === 0) throw new Error("No valid data parsed");
        const cleaned = parsed.filter(
          (item) => item.Round !== "Round" && item.Round !== "ROUND",
        );
        setData(cleaned);
      })
      .catch((error) => {
        console.error("Error fetching INICET allotment data:", error);
        setData(FALLBACK_DATA);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Derived filter options ─────────────────────────────────────────────
  const rounds = useMemo(
    () => [
      "all",
      ...Array.from(new Set(data.map((d) => d.Round).filter(Boolean))).sort(),
    ],
    [data],
  );
  const states = useMemo(
    () => [
      "all",
      ...Array.from(new Set(data.map((d) => d.State).filter(Boolean))).sort(),
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

  // ── Filtering ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return data.filter((item) => {
      if (selRound !== "all" && item.Round !== selRound) return false;
      if (selState !== "all" && item.State !== selState) return false;
      if (selCourse !== "all" && item.Course !== selCourse) return false;
      if (selQuota !== "all" && item.Quota !== selQuota) return false;
      if (selCategory !== "all" && item.Category !== selCategory) return false;

      if (minRank || maxRank) {
        const rankNum = parseInt(
          String(item["AI Rank"]).replace(/[^0-9]/g, ""),
        );
        if (isNaN(rankNum)) return false;
        if (minRank && rankNum < parseInt(minRank)) return false;
        if (maxRank && rankNum > parseInt(maxRank)) return false;
      }

      if (s) {
        const hay =
          `${item.Round} ${item["AI Rank"]} ${item.State} ${item.Institute} ${item.Course} ${item.Quota} ${item.Category}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [
    data,
    selRound,
    selState,
    selCourse,
    selQuota,
    selCategory,
    minRank,
    maxRank,
    searchTerm,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    selRound,
    selState,
    selCourse,
    selQuota,
    selCategory,
    minRank,
    maxRank,
    searchTerm,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setSearchTerm("");
    setSelState("all");
    setSelRound("all");
    setSelCourse("all");
    setSelQuota("all");
    setSelCategory("all");
    setMinRank("");
    setMaxRank("");
    setPage(1);
    setColVis(DEFAULT_VIS);
  };

  const visibleCols = COL_DEFS.filter(({ key }) => colVis[key]);

  const totalInstitutes = useMemo(
    () => new Set(data.map((d) => d.Institute)).size,
    [data],
  );

  if (loading)
    return (
      <div className="inicet-jul25-loading-screen">
        <div className="inicet-jul25-loading-content">
          <div className="inicet-jul25-loading-spinner" />
          <p className="inicet-jul25-loading-text">
            Loading INICET Allotment Data...
          </p>
        </div>
      </div>
    );

  return (
    <div className="inicet-jul25-page-root">
      {/* ── Column visibility modal ── */}
      {showColModal && (
        <div className="inicet-jul25-modal-overlay">
          <div className="inicet-jul25-modal-box">
            <div className="inicet-jul25-modal-header">
              <h3 className="inicet-jul25-modal-title">Show / Hide Columns</h3>
              <button
                onClick={() => setShowColModal(false)}
                className="inicet-jul25-modal-close-btn"
              >
                <X className="inicet-jul25-modal-close-icon" />
              </button>
            </div>
            <div className="inicet-jul25-modal-body">
              <div className="inicet-jul25-modal-actions">
                <button onClick={showAll} className="inicet-jul25-btn-show-all">
                  Show All
                </button>
                <button onClick={hideAll} className="inicet-jul25-btn-hide-all">
                  Hide All
                </button>
              </div>
              <div className="inicet-jul25-col-group">
                <p className="inicet-jul25-col-group-label">
                  Allotment Details
                </p>
                {COL_DEFS.map(({ key, label }) => (
                  <div key={key} className="inicet-jul25-col-row">
                    <label className="inicet-jul25-col-row-label">
                      <input
                        type="checkbox"
                        checked={colVis[key]}
                        onChange={() => toggleCol(key)}
                        className="inicet-jul25-col-checkbox"
                      />
                      <span className="inicet-jul25-col-row-text">{label}</span>
                    </label>
                    {colVis[key] ? (
                      <Eye className="inicet-jul25-col-eye-icon" />
                    ) : (
                      <EyeOff className="inicet-jul25-col-eyeoff-icon" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="inicet-jul25-modal-footer">
              <button
                onClick={() => setShowColModal(false)}
                className="inicet-jul25-btn-apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="inicet-jul25-content-wrapper">
        {/* ── Header ── */}
        <div className="inicet-jul25-app-header">
          <div className="inicet-jul25-app-header-row">
            <div className="inicet-jul25-app-header-left">
              <button
                onClick={() => navigate("/dashboard/inicet")}
                className="inicet-jul25-back-btn"
              >
                <ArrowLeft className="inicet-jul25-icon-sm" />
              </button>
              <div>
                <h1 className="inicet-jul25-app-title">
                  INICET Allotments Data
                </h1>
                <p className="inicet-jul25-app-subtitle">July 2025</p>
              </div>
            </div>
            <span className="inicet-jul25-records-count">
              {filtered.length.toLocaleString()} Allotments
            </span>
          </div>
        </div>

        {/* ── Round pills + Columns ── */}
        <div className="inicet-jul25-round-bar">
          <div className="inicet-jul25-round-row">
            {rounds
              .filter((r) => r !== "all")
              .map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelRound(r);
                    setPage(1);
                  }}
                  className={`inicet-jul25-round-btn ${
                    selRound === r
                      ? "inicet-jul25-round-btn-active"
                      : "inicet-jul25-round-btn-inactive"
                  }`}
                >
                  {roundLabel(r)}
                </button>
              ))}

            <button
              onClick={() => {
                setSelRound("all");
                setPage(1);
              }}
              className={`inicet-jul25-round-btn ${
                selRound === "all"
                  ? "inicet-jul25-round-btn-active"
                  : "inicet-jul25-round-btn-inactive"
              }`}
            >
              All Rounds
            </button>

            <div className="inicet-jul25-round-actions">
              <button
                onClick={() => setShowColModal(true)}
                className="inicet-jul25-columns-btn"
              >
                <Eye className="inicet-jul25-icon-sm" /> Columns
              </button>
            </div>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="inicet-jul25-filters-section">
          <div className="inicet-jul25-filters-row">
            <div className="inicet-jul25-search-wrapper">
              <Search className="inicet-jul25-search-icon" />
              <input
                type="text"
                placeholder="Search institute, course, state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="inicet-jul25-search-input"
              />
            </div>
            <div className="inicet-jul25-selects-wrapper">
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
                value={selQuota}
                onChange={(v) => {
                  setSelQuota(v);
                  setPage(1);
                }}
                options={quotas}
                allLabel="All Quotas"
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
              <button
                onClick={() => setShowAdv(!showAdv)}
                className="inicet-jul25-filter-toggle-btn"
              >
                <Filter className="inicet-jul25-icon-fl" />{" "}
                {showAdv ? "Hide" : "More"} Filters
                <ChevronDown
                  className={`inicet-jul25-filter-toggle-icon ${showAdv ? "inicet-jul25-rotate-open" : ""}`}
                />
              </button>
            </div>
          </div>

          {showAdv && (
            <div className="inicet-jul25-adv-filters">
              <div className="inicet-jul25-adv-filters-row">
                <CustomSelect
                  value={selCourse}
                  onChange={(v) => {
                    setSelCourse(v);
                    setPage(1);
                  }}
                  options={courses}
                  allLabel="All Courses"
                />
                <input
                  type="number"
                  placeholder="Min Rank"
                  value={minRank}
                  onChange={(e) => setMinRank(e.target.value)}
                  className="inicet-jul25-range-input"
                />
                <input
                  type="number"
                  placeholder="Max Rank"
                  value={maxRank}
                  onChange={(e) => setMaxRank(e.target.value)}
                  className="inicet-jul25-range-input"
                />
                <button onClick={clearAll} className="inicet-jul25-clear-btn">
                  Clear Filters
                </button>
                <span className="inicet-jul25-filtered-count-inline">
                  <span className="inicet-jul25-filtered-count-num">
                    {filtered.length.toLocaleString()}
                  </span>
                  <span className="inicet-jul25-filtered-count-label">
                    filtered results
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="inicet-jul25-table-wrapper">
          <table className="inicet-jul25-data-table">
            <thead className="inicet-jul25-table-head">
              <tr>
                {visibleCols.map(({ key, label }) => (
                  <th key={key} className="inicet-jul25-table-th">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="inicet-jul25-table-body">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="inicet-jul25-table-empty"
                  >
                    No data found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                paged.map((item, i) => (
                  <tr key={i} className="inicet-jul25-table-row">
                    {colVis.Round && (
                      <td className="inicet-jul25-td-center">{item.Round}</td>
                    )}
                    {colVis["AI Rank"] && (
                      <td className="inicet-jul25-td-center">
                        <RankCell val={item["AI Rank"]} />
                      </td>
                    )}
                    {colVis.State && (
                      <td className="inicet-jul25-td-state">{item.State}</td>
                    )}
                    {colVis.Institute && (
                      <td className="inicet-jul25-td-institute">
                        {item.Institute}
                      </td>
                    )}
                    {colVis.Course && (
                      <td className="inicet-jul25-td-course">{item.Course}</td>
                    )}
                    {colVis.Quota && (
                      <td className="inicet-jul25-td-center">
                        <span className="inicet-jul25-badge-quota">
                          {item.Quota}
                        </span>
                      </td>
                    )}
                    {colVis.Category && (
                      <td className="inicet-jul25-td-center">
                        <span
                          className={`inicet-jul25-badge-category-base ${
                            item.Category.toLowerCase() === "general"
                              ? "inicet-jul25-badge-cat-gray"
                              : item.Category.toLowerCase() === "obc"
                                ? "inicet-jul25-badge-cat-yellow"
                                : item.Category.toLowerCase() === "sc"
                                  ? "inicet-jul25-badge-cat-red"
                                  : item.Category.toLowerCase() === "st"
                                    ? "inicet-jul25-badge-cat-blue"
                                    : item.Category.toLowerCase() === "ews"
                                      ? "inicet-jul25-badge-cat-green"
                                      : "inicet-jul25-badge-cat-purple"
                          }`}
                        >
                          {item.Category}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="inicet-jul25-pagination">
          <div className="inicet-jul25-pagination-row">
            <div className="inicet-jul25-pagination-info">
              Showing {filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
              {Math.min(page * PER_PAGE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </div>
            <div className="inicet-jul25-pagination-controls">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inicet-jul25-pagination-nav-btn"
              >
                <PrevIcon className="inicet-jul25-pagination-nav-icon" />
              </button>
              <div className="inicet-jul25-pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const n = start + i;
                  if (n > totalPages) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`inicet-jul25-page-num-btn ${
                        page === n
                          ? "inicet-jul25-page-num-active"
                          : "inicet-jul25-page-num-inactive"
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
                className="inicet-jul25-pagination-nav-btn"
              >
                <NextIcon className="inicet-jul25-pagination-nav-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicetAllotmentsJuly2025Page;
