import React, { useState, useEffect, useMemo } from "react";
import "./InicetAllotmentsJuly2026Page.css";
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
    <div className="inicet-jul26-cs-wrapper">
      <button onClick={() => setOpen(!open)} className="inicet-jul26-cs-button">
        <span className="inicet-jul26-cs-button-label">
          {value === "all" ? allLabel : value}
        </span>
        <ChevronDown
          className={`inicet-jul26-cs-chevron ${open ? "inicet-jul26-cs-chevron-open" : ""}`}
        />
      </button>
      {open && (
        <>
          <div
            className="inicet-jul26-cs-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="inicet-jul26-cs-dropdown">
            <div className="inicet-jul26-cs-search-wrapper">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="inicet-jul26-cs-search-input"
              />
            </div>
            <div className="inicet-jul26-cs-options-list">
              {filtered.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`inicet-jul26-cs-option ${
                    value === opt
                      ? "inicet-jul26-cs-option-selected"
                      : "inicet-jul26-cs-option-default"
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
    return <span className="inicet-jul26-rank-empty">—</span>;
  const rank = parseInt(val.replace(/[^0-9]/g, ""));
  if (isNaN(rank)) return <span className="inicet-jul26-rank-empty">—</span>;
  const tier =
    rank <= 100
      ? "inicet-jul26-rank-tier-1"
      : rank <= 500
        ? "inicet-jul26-rank-tier-2"
        : rank <= 2000
          ? "inicet-jul26-rank-tier-3"
          : rank <= 5000
            ? "inicet-jul26-rank-tier-4"
            : "inicet-jul26-rank-tier-5";
  return <span className={`inicet-jul26-rank-value ${tier}`}>{val}</span>;
};

// ── Main component ─────────────────────────────────────────────────────────
const InicetAllotmentsJuly2026Page = () => {
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
    fetch("/data/inicet/inicet_july_2026_session.csv")
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

      if (s) {
        const hay =
          `${item.Round} ${item["AI Rank"]} ${item.State} ${item.Institute} ${item.Course} ${item.Quota} ${item.Category}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [data, selRound, selState, selCourse, selQuota, selCategory, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [selRound, selState, selCourse, selQuota, selCategory, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setSearchTerm("");
    setSelState("all");
    setSelRound("all");
    setSelCourse("all");
    setSelQuota("all");
    setSelCategory("all");
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
      <div className="inicet-jul26-loading-screen">
        <div className="inicet-jul26-loading-content">
          <div className="inicet-jul26-loading-spinner" />
          <p className="inicet-jul26-loading-text">
            Loading INICET Allotment Data...
          </p>
        </div>
      </div>
    );

  return (
    <div className="inicet-jul26-page-root">
      {/* ── Column visibility modal ── */}
      {showColModal && (
        <div className="inicet-jul26-modal-overlay">
          <div className="inicet-jul26-modal-box">
            <div className="inicet-jul26-modal-header">
              <h3 className="inicet-jul26-modal-title">Show / Hide Columns</h3>
              <button
                onClick={() => setShowColModal(false)}
                className="inicet-jul26-modal-close-btn"
              >
                <X className="inicet-jul26-modal-close-icon" />
              </button>
            </div>
            <div className="inicet-jul26-modal-body">
              <div className="inicet-jul26-modal-actions">
                <button onClick={showAll} className="inicet-jul26-btn-show-all">
                  Show All
                </button>
                <button onClick={hideAll} className="inicet-jul26-btn-hide-all">
                  Hide All
                </button>
              </div>
              <div className="inicet-jul26-col-group">
                <p className="inicet-jul26-col-group-label">
                  Allotment Details
                </p>
                {COL_DEFS.map(({ key, label }) => (
                  <div key={key} className="inicet-jul26-col-row">
                    <label className="inicet-jul26-col-row-label">
                      <input
                        type="checkbox"
                        checked={colVis[key]}
                        onChange={() => toggleCol(key)}
                        className="inicet-jul26-col-checkbox"
                      />
                      <span className="inicet-jul26-col-row-text">{label}</span>
                    </label>
                    {colVis[key] ? (
                      <Eye className="inicet-jul26-col-eye-icon" />
                    ) : (
                      <EyeOff className="inicet-jul26-col-eyeoff-icon" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="inicet-jul26-modal-footer">
              <button
                onClick={() => setShowColModal(false)}
                className="inicet-jul26-btn-apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="inicet-jul26-content-wrapper">
        {/* ── Header ── */}
        <div className="inicet-jul26-app-header">
          <div className="inicet-jul26-app-header-row">
            <div className="inicet-jul26-app-header-left">
              <button
                onClick={() => navigate("/dashboard/inicet")}
                className="inicet-jul26-back-btn"
              >
                <ArrowLeft className="inicet-jul26-icon-sm" />
              </button>
              <div>
                <h1 className="inicet-jul26-app-title">
                  INICET Allotments Data
                </h1>
                <p className="inicet-jul26-app-subtitle">July 2026</p>
              </div>
            </div>
            <span className="inicet-jul26-records-count">
              {filtered.length.toLocaleString()} Allotments
            </span>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="inicet-jul26-stats-section">
          <div className="inicet-jul26-stats-grid">
            <div className="inicet-jul26-stat-card inicet-jul26-stat-card-blue">
              <div className="inicet-jul26-stat-icon-wrap inicet-jul26-stat-icon-blue">
                <Users className="inicet-jul26-icon-sm" />
              </div>
              <div className="inicet-jul26-stat-value">{data.length}</div>
              <div className="inicet-jul26-stat-label">Total Allotments</div>
            </div>

            <div className="inicet-jul26-stat-card inicet-jul26-stat-card-blue">
              <div className="inicet-jul26-stat-icon-wrap inicet-jul26-stat-icon-blue">
                <GraduationCap className="inicet-jul26-icon-sm" />
              </div>
              <div className="inicet-jul26-stat-value">
                {courses.length - 1}
              </div>
              <div className="inicet-jul26-stat-label">Courses</div>
            </div>

            <div className="inicet-jul26-stat-card inicet-jul26-stat-card-purple">
              <div className="inicet-jul26-stat-icon-wrap inicet-jul26-stat-icon-purple">
                <Building2 className="inicet-jul26-icon-sm" />
              </div>
              <div className="inicet-jul26-stat-value">{totalInstitutes}</div>
              <div className="inicet-jul26-stat-label">Institutes</div>
            </div>

            <div className="inicet-jul26-stat-card inicet-jul26-stat-card-amber">
              <div className="inicet-jul26-stat-icon-wrap inicet-jul26-stat-icon-amber">
                <Award className="inicet-jul26-icon-sm" />
              </div>
              <div className="inicet-jul26-stat-value">{states.length - 1}</div>
              <div className="inicet-jul26-stat-label">States</div>
            </div>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="inicet-jul26-filters-section">
          <div className="inicet-jul26-filters-row">
            <div className="inicet-jul26-search-wrapper">
              <Search className="inicet-jul26-search-icon" />
              <input
                type="text"
                placeholder="Search allotments, institutes, courses, states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="inicet-jul26-search-input"
              />
            </div>
            <div className="inicet-jul26-selects-wrapper">
              <CustomSelect
                value={selState}
                onChange={(v) => {
                  setSelState(v);
                  setPage(1);
                }}
                options={states}
                allLabel="All States"
              />
              <button
                onClick={() => setShowColModal(true)}
                className="inicet-jul26-columns-btn"
              >
                <Eye className="inicet-jul26-icon-sm" /> Columns
              </button>
              <button
                onClick={() => setShowAdv(!showAdv)}
                className="inicet-jul26-filter-toggle-btn"
              >
                <Filter className="inicet-jul26-icon-sm" />{" "}
                {showAdv ? "Hide" : "More"} Filters
                <ChevronDown
                  className={`inicet-jul26-filter-toggle-icon ${showAdv ? "inicet-jul26-rotate-open" : ""}`}
                />
              </button>
            </div>
          </div>

          {showAdv && (
            <div className="inicet-jul26-adv-filters">
              <div className="inicet-jul26-adv-filters-grid">
                <CustomSelect
                  value={selRound}
                  onChange={(v) => {
                    setSelRound(v);
                    setPage(1);
                  }}
                  options={rounds}
                  allLabel="All Rounds"
                />
                <CustomSelect
                  value={selCourse}
                  onChange={(v) => {
                    setSelCourse(v);
                    setPage(1);
                  }}
                  options={courses}
                  allLabel="All Courses"
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
              </div>
              <div className="inicet-jul26-filtered-count-row">
                <button onClick={clearAll} className="inicet-jul26-clear-btn">
                  Clear All Filters
                </button>
                <span>
                  <span className="inicet-jul26-filtered-count-num">
                    {filtered.length.toLocaleString()}
                  </span>
                  <span className="inicet-jul26-filtered-count-label">
                    allotments found
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="inicet-jul26-table-wrapper">
          <table className="inicet-jul26-data-table">
            <thead className="inicet-jul26-table-head">
              <tr>
                {visibleCols.map(({ key, label }) => (
                  <th key={key} className="inicet-jul26-table-th">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="inicet-jul26-table-body">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="inicet-jul26-table-empty"
                  >
                    No data found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                paged.map((item, i) => (
                  <tr key={i} className="inicet-jul26-table-row">
                    {colVis.Round && (
                      <td className="inicet-jul26-td-center">{item.Round}</td>
                    )}
                    {colVis["AI Rank"] && (
                      <td className="inicet-jul26-td-center">
                        <RankCell val={item["AI Rank"]} />
                      </td>
                    )}
                    {colVis.State && (
                      <td className="inicet-jul26-td-state">{item.State}</td>
                    )}
                    {colVis.Institute && (
                      <td className="inicet-jul26-td-institute">
                        {item.Institute}
                      </td>
                    )}
                    {colVis.Course && (
                      <td className="inicet-jul26-td-course">{item.Course}</td>
                    )}
                    {colVis.Quota && (
                      <td className="inicet-jul26-td-center">
                        <span className="inicet-jul26-badge-quota">
                          {item.Quota}
                        </span>
                      </td>
                    )}
                    {colVis.Category && (
                      <td className="inicet-jul26-td-center">
                        <span
                          className={`inicet-jul26-badge-category-base ${
                            item.Category.toLowerCase() === "general"
                              ? "inicet-jul26-badge-cat-gray"
                              : item.Category.toLowerCase() === "obc"
                                ? "inicet-jul26-badge-cat-yellow"
                                : item.Category.toLowerCase() === "sc"
                                  ? "inicet-jul26-badge-cat-red"
                                  : item.Category.toLowerCase() === "st"
                                    ? "inicet-jul26-badge-cat-blue"
                                    : item.Category.toLowerCase() === "ews"
                                      ? "inicet-jul26-badge-cat-green"
                                      : "inicet-jul26-badge-cat-purple"
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
        <div className="inicet-jul26-pagination">
          <div className="inicet-jul26-pagination-row">
            <div className="inicet-jul26-pagination-info">
              Showing {filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
              {Math.min(page * PER_PAGE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </div>
            <div className="inicet-jul26-pagination-controls">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inicet-jul26-pagination-nav-btn"
              >
                <PrevIcon className="inicet-jul26-pagination-nav-icon" />
              </button>
              <div className="inicet-jul26-pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const n = start + i;
                  if (n > totalPages) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`inicet-jul26-page-num-btn ${
                        page === n
                          ? "inicet-jul26-page-num-active"
                          : "inicet-jul26-page-num-inactive"
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
                className="inicet-jul26-pagination-nav-btn"
              >
                <NextIcon className="inicet-jul26-pagination-nav-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicetAllotmentsJuly2026Page;
