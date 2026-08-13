import React, { useState, useEffect, useMemo } from "react";
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
import "./PgClosingRanks2025Page.css";

const COL_DEFS = [
  { key: "Quota", label: "Quota" },
  { key: "Category", label: "Category" },
  { key: "State", label: "State" },
  { key: "Institute", label: "Institute" },
  { key: "Course", label: "Course" },
  { key: "Fee", label: "Fee" },
  { key: "CR 2025 1", label: "Round 1" },
  { key: "CR 2025 2", label: "Round 2" },
  { key: "CR 2025 3", label: "Round 3" },
  { key: "CR 2025 4", label: "Round 4" },
];

const DEFAULT_VIS = {
  Quota: true,
  Category: true,
  State: true,
  Institute: true,
  Course: true,
  Fee: true,
  "CR 2025 1": true,
  "CR 2025 2": true,
  "CR 2025 3": true,
  "CR 2025 4": true,
};

const ALL_RANK_COLS = ["CR 2025 1", "CR 2025 2", "CR 2025 3", "CR 2025 4"];

const CustomSelect = ({ value, onChange, options, allLabel }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pg25-cr-cs-wrapper">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="pg25-cr-cs-button"
      >
        <span className="pg25-cr-cs-button-label">
          {value === "all" ? allLabel : value}
        </span>
        <ChevronDown
          className={`pg25-cr-cs-chevron ${open ? "pg25-cr-cs-chevron-open" : ""}`}
        />
      </button>
      {open && (
        <>
          <div className="pg25-cr-cs-overlay" onClick={() => setOpen(false)} />
          <div className="pg25-cr-cs-dropdown">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="pg25-cr-cs-search-input"
            />
            <div className="pg25-cr-cs-options-list">
              {filtered.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`pg25-cr-cs-option ${value === opt ? "pg25-cr-cs-option-selected" : ""}`}
                >
                  {opt === "all" ? allLabel : opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const RankCell = ({ val }) => {
  if (!val || val === "-" || val === "")
    return <span className="pg25-cr-rank-empty">—</span>;

  const digits = val.match(/\d+/);
  const rank = digits ? parseInt(digits[0], 10) : NaN;
  if (isNaN(rank)) return <span className="pg25-cr-rank-empty">—</span>;

  const tier =
    rank <= 100
      ? "pg25-cr-rank-tier-1"
      : rank <= 500
        ? "pg25-cr-rank-tier-2"
        : rank <= 2000
          ? "pg25-cr-rank-tier-3"
          : rank <= 5000
            ? "pg25-cr-rank-tier-4"
            : "pg25-cr-rank-tier-5";

  return <span className={`pg25-cr-rank-value ${tier}`}>{val}</span>;
};

const formatFee = (fee) => {
  if (!fee || fee === "-" || fee === "") return "—";
  const numeric = Number(String(fee).replace(/[^0-9.]/g, ""));
  if (!numeric || Number.isNaN(numeric)) return fee; // e.g. "Info not available"
  const inThousands = numeric / 1000;
  const formatted =
    inThousands >= 100 ? inThousands.toFixed(0) : inThousands.toFixed(2);
  return `₹${formatted} K`;
};

const categoryBadgeClass = (category) => {
  if (category === "UR" || category === "GEN" || category === "Open")
    return "pg25-cr-badge-cat-gray";
  if (category === "OBC") return "pg25-cr-badge-cat-yellow";
  if (category === "SC") return "pg25-cr-badge-cat-red";
  if (category === "ST") return "pg25-cr-badge-cat-blue";
  if (category === "EWS") return "pg25-cr-badge-cat-green";
  return "pg25-cr-badge-cat-purple";
};

const PgClosingRanks2025Page = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selState, setSelState] = useState("all");
  const [selQuota, setSelQuota] = useState("all");
  const [selCategory, setSelCategory] = useState("all");
  const [selCourse, setSelCourse] = useState("all");
  const [selRound, setSelRound] = useState("all");
  const [minRank, setMinRank] = useState("");
  const [maxRank, setMaxRank] = useState("");
  const [showAdv, setShowAdv] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [colVis, setColVis] = useState(DEFAULT_VIS);
  const [page, setPage] = useState(1);

  const PER_PAGE = 50;

  const toggleCol = (key) =>
    setColVis((prev) => ({ ...prev, [key]: !prev[key] }));
  const showAll = () =>
    setColVis(COL_DEFS.reduce((acc, { key }) => ({ ...acc, [key]: true }), {}));
  const hideAll = () =>
    setColVis(
      COL_DEFS.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]: key === "Institute" || key === "Course",
        }),
        {},
      ),
    );

  const applyRound = (round) => {
    setSelRound(round);
    const newVis = { ...colVis };
    ALL_RANK_COLS.forEach((key) => {
      newVis[key] = round === "all" ? true : key === `CR 2025 ${round}`;
    });
    setColVis(newVis);
  };

  const parseCSV = (text) => {
    const clean = text.replace(/^\uFEFF/, "");
    if (clean.includes("<html") || clean.includes("<!DOCTYPE"))
      throw new Error("Invalid CSV");
    const lines = clean.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) throw new Error("No data");

    const header = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line) => {
      const values = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      values.push(current.trim());

      const row = header.reduce((acc, key, index) => {
        acc[key] = values[index]
          ? values[index].replace(/^"|"$/g, "").trim()
          : "";
        return acc;
      }, {});

      return {
        Quota: row.Quota || "",
        Category: row.Category || "",
        State: row.State || "",
        Institute: row.Institute || "",
        Course: row.Course || "",
        Fee: row.Fee || "",
        "CR 2025 1": row["CR 2025 1"] || "",
        "CR 2025 2": row["CR 2025 2"] || "",
        "CR 2025 3": row["CR 2025 3"] || "",
        "CR 2025 4": row["CR 2025 4"] || "",
      };
    });
  };

  useEffect(() => {
    fetch("/data/neetpg/pg_closing_ranks_2025.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.text();
      })
      .then((text) => {
        setData(parseCSV(text));
        setDataError(false);
      })
      .catch(() => {
        setDataError(true);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const states = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(data.map((item) => item.State).filter(Boolean)),
      ).sort(),
    ],
    [data],
  );
  const quotas = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(data.map((item) => item.Quota).filter(Boolean)),
      ).sort(),
    ],
    [data],
  );
  const categories = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(data.map((item) => item.Category).filter(Boolean)),
      ).sort(),
    ],
    [data],
  );
  const courses = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(data.map((item) => item.Course).filter(Boolean)),
      ).sort(),
    ],
    [data],
  );

  const getRelevantRanks = (item) => {
    const rankKeys =
      selRound === "all" ? ALL_RANK_COLS : [`CR 2025 ${selRound}`];
    return rankKeys
      .map((key) => {
        const match = item[key]?.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
      })
      .filter((value) => value !== null && value > 0);
  };

  const filtered = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return data.filter((item) => {
      if (selState !== "all" && item.State !== selState) return false;
      if (selQuota !== "all" && item.Quota !== selQuota) return false;
      if (selCategory !== "all" && item.Category !== selCategory) return false;
      if (selCourse !== "all" && item.Course !== selCourse) return false;

      if (minRank || maxRank) {
        const ranks = getRelevantRanks(item);
        if (ranks.length === 0) return false;
        const minValue = Math.min(...ranks);
        const maxValue = Math.max(...ranks);
        if (minRank && maxValue < parseFloat(minRank)) return false;
        if (maxRank && minValue > parseFloat(maxRank)) return false;
      }

      if (search) {
        const haystack =
          `${item.Institute} ${item.Course} ${item.State} ${item.Quota} ${item.Category}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      return true;
    });
  }, [
    data,
    selState,
    selQuota,
    selCategory,
    selCourse,
    minRank,
    maxRank,
    searchTerm,
    selRound,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    selState,
    selQuota,
    selCategory,
    selCourse,
    minRank,
    maxRank,
    selRound,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setSearchTerm("");
    setSelState("all");
    setSelQuota("all");
    setSelCategory("all");
    setSelCourse("all");
    setSelRound("all");
    setMinRank("");
    setMaxRank("");
    setColVis(DEFAULT_VIS);
    setPage(1);
  };

  const visibleCols = COL_DEFS.filter(({ key }) => colVis[key]);

  if (loading)
    return (
      <div className="pg25-cr-loading-screen">
        <div className="pg25-cr-loading-box">
          <div className="pg25-cr-loading-spinner" />
          <p>Loading NEET PG closing ranks...</p>
        </div>
      </div>
    );

  return (
    <div className="pg25-cr-page-root">
      {showColModal && (
        <div className="pg25-cr-modal-overlay">
          <div className="pg25-cr-modal-box">
            <div className="pg25-cr-modal-header">
              <h3>Show / Hide Columns</h3>
              <button
                type="button"
                onClick={() => setShowColModal(false)}
                className="pg25-cr-modal-close-btn"
              >
                <X />
              </button>
            </div>
            <div className="pg25-cr-modal-body">
              <div className="pg25-cr-modal-actions">
                <button
                  type="button"
                  onClick={showAll}
                  className="pg25-cr-btn-secondary"
                >
                  Show All
                </button>
                <button
                  type="button"
                  onClick={hideAll}
                  className="pg25-cr-btn-secondary"
                >
                  Hide All
                </button>
              </div>
              {[
                {
                  label: "Basic Info",
                  keys: ["Quota", "Category", "State", "Institute", "Course"],
                },
                {
                  label: "Rank Columns",
                  keys: ["CR 2025 1", "CR 2025 2", "CR 2025 3", "CR 2025 4"],
                },
                { label: "Other", keys: ["Fee"] },
              ].map((group) => (
                <div key={group.label} className="pg25-cr-col-group">
                  <p className="pg25-cr-col-group-label">{group.label}</p>
                  {group.keys.map((key) => (
                    <label key={key} className="pg25-cr-col-row">
                      <input
                        type="checkbox"
                        checked={colVis[key]}
                        onChange={() => toggleCol(key)}
                      />
                      <span>
                        {COL_DEFS.find((def) => def.key === key)?.label || key}
                      </span>
                      {colVis[key] ? <Eye /> : <EyeOff />}
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <div className="pg25-cr-modal-footer">
              <button
                type="button"
                onClick={() => setShowColModal(false)}
                className="pg25-cr-btn-primary"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pg25-cr-content-wrapper">
        {/* ── Header ── */}
        <div className="pg25-cr-app-header">
          <div className="pg25-cr-header-row">
            <div className="pg25-cr-header-left">
              <button
                type="button"
                onClick={() => navigate("/dashboard/neet-pg")}
                className="pg25-cr-back-btn"
              >
                <ArrowLeft className="pg25-cr-icon-sm" />
              </button>
              <div className="pg25-cr-header-text">
                <h1>Closing Ranks</h1>
                <p>NEET PG 2025</p>
              </div>
            </div>
            <span className="pg25-cr-records-count">
              {filtered.length.toLocaleString()} Records
            </span>
          </div>
        </div>

        {dataError && (
          <div className="pg25-cr-error-banner">
            ⚠️ Data not found. Add{" "}
            <code>/data/neetpg/pg_closing_ranks_2025.csv</code> to enable this
            page.
          </div>
        )}

        {/* ── Round pills ── */}
        <div className="pg25-cr-pills-row">
          <span className="pg25-cr-pill-label">Round:</span>
          {["1", "2", "3", "4", "all"].map((round) => (
            <button
              type="button"
              key={round}
              onClick={() => applyRound(round)}
              className={`pg25-cr-pill ${selRound === round ? "pg25-cr-pill-active" : "pg25-cr-pill-inactive"}`}
            >
              {round === "all" ? "All" : `R${round}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowColModal(true)}
            className="pg25-cr-pill-icon-btn"
          >
            <Eye className="pg25-cr-icon-sm" /> Columns
          </button>
        </div>

        {/* ── Search + Filters ── */}
        <div className="pg25-cr-filters-row">
          <div className="pg25-cr-search-box">
            <Search />
            <input
              type="text"
              placeholder="Search institute, course, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="pg25-cr-filter-selects">
            <CustomSelect
              value={selState}
              onChange={(value) => {
                setSelState(value);
                setPage(1);
              }}
              options={states}
              allLabel="All States"
            />
            <CustomSelect
              value={selQuota}
              onChange={(value) => {
                setSelQuota(value);
                setPage(1);
              }}
              options={quotas}
              allLabel="All Quotas"
            />
            <CustomSelect
              value={selCategory}
              onChange={(value) => {
                setSelCategory(value);
                setPage(1);
              }}
              options={categories}
              allLabel="All Categories"
            />
            <button
              type="button"
              className="pg25-cr-toggle-filter"
              onClick={() => setShowAdv((prev) => !prev)}
            >
              <Filter className="pg25-cr-icon-fl" /> {showAdv ? "Hide" : "More"}{" "}
              Filters
              <ChevronDown
                className={showAdv ? "pg25-cr-cs-chevron-open" : ""}
              />
            </button>
          </div>
        </div>

        {showAdv && (
          <div className="pg25-cr-advanced-filters">
            <CustomSelect
              value={selCourse}
              onChange={(value) => {
                setSelCourse(value);
                setPage(1);
              }}
              options={courses}
              allLabel="All Courses"
            />
            <div className="pg25-cr-rank-inputs">
              <input
                type="number"
                placeholder="Min Rank"
                value={minRank}
                onChange={(e) => {
                  setMinRank(e.target.value);
                  setPage(1);
                }}
              />
              <input
                type="number"
                placeholder="Max Rank"
                value={maxRank}
                onChange={(e) => {
                  setMaxRank(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button
              type="button"
              className="pg25-cr-clear-btn"
              onClick={clearAll}
            >
              Clear Filters
            </button>
            <div className="pg25-cr-filtered-count-row">
              <span className="pg25-cr-filtered-count-num">
                {filtered.length.toLocaleString()}
              </span>
              <span>&nbsp;filtered results</span>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        <div className="pg25-cr-table-wrapper">
          <table className="pg25-cr-table">
            <thead>
              <tr>
                {visibleCols.map(({ key, label }) => (
                  <th
                    key={key}
                    className={
                      key.startsWith("CR 2025") ? "pg25-cr-th-rank" : ""
                    }
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="pg25-cr-table-empty"
                  >
                    {dataError
                      ? "CSV not found — add /data/neetpg/pg_closing_ranks_2025.csv."
                      : "No records found for the selected filters."}
                  </td>
                </tr>
              ) : (
                paged.map((item, index) => (
                  <tr key={`${item.Institute}-${index}`}>
                    {colVis.Quota && (
                      <td>
                        <span className="pg25-cr-badge-quota">
                          {item.Quota || "—"}
                        </span>
                      </td>
                    )}
                    {colVis.Category && (
                      <td>
                        <span
                          className={`pg25-cr-badge-category-base ${categoryBadgeClass(item.Category)}`}
                        >
                          {item.Category || "—"}
                        </span>
                      </td>
                    )}
                    {colVis.State && <td>{item.State || "—"}</td>}
                    {colVis.Institute && (
                      <td className="pg25-cr-td-institute">
                        {item.Institute || "—"}
                      </td>
                    )}
                    {colVis.Course && <td>{item.Course || "—"}</td>}
                    {colVis.Fee && (
                      <td className="pg25-cr-td-fee">{formatFee(item.Fee)}</td>
                    )}
                    {colVis["CR 2025 1"] && (
                      <td className="pg25-cr-td-rank">
                        <RankCell val={item["CR 2025 1"]} />
                      </td>
                    )}
                    {colVis["CR 2025 2"] && (
                      <td className="pg25-cr-td-rank">
                        <RankCell val={item["CR 2025 2"]} />
                      </td>
                    )}
                    {colVis["CR 2025 3"] && (
                      <td className="pg25-cr-td-rank">
                        <RankCell val={item["CR 2025 3"]} />
                      </td>
                    )}
                    {colVis["CR 2025 4"] && (
                      <td className="pg25-cr-td-rank">
                        <RankCell val={item["CR 2025 4"]} />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="pg25-cr-pagination-row">
          <div className="pg25-cr-pagination-info">
            Showing {filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
            {Math.min(page * PER_PAGE, filtered.length)} of{" "}
            {filtered.length.toLocaleString()}
          </div>
          <div className="pg25-cr-pagination-controls">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <PrevIcon />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const pageNum = start + idx;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={
                    pageNum === page
                      ? "pg25-cr-page-active"
                      : "pg25-cr-page-btn"
                  }
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              <NextIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgClosingRanks2025Page;
