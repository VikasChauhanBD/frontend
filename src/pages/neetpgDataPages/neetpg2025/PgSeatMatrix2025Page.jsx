import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PgSeatMatrix2025Page.css";
import {
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  X,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart2,
} from "lucide-react";

// ─────────────────────────────────────────────
// HELPER: Parse Seats
// Handles: "5", "0+3(VV)", "12+8(VV)", "Info not available", "-", ""
// ─────────────────────────────────────────────
function parseSeats(raw) {
  const trimmed = raw?.trim() ?? "";
  if (
    !trimmed ||
    trimmed === "-" ||
    trimmed.toLowerCase().includes("info not available") ||
    trimmed.toLowerCase() === "n/a"
  ) {
    return { num: -1, display: "N/A" };
  }

  // Handle "0+3(VV)" or "12+8(VV)" format
  const vvMatch = trimmed.match(/^(\d+)\s*\+\s*(\d+)\s*\(VV\)$/i);
  if (vvMatch) {
    const total = parseInt(vvMatch[1]) + parseInt(vvMatch[2]);
    return { num: total, display: trimmed };
  }

  const num = parseInt(trimmed);
  if (isNaN(num)) return { num: -1, display: trimmed };
  return { num, display: trimmed };
}

// ─────────────────────────────────────────────
// HELPER: Normalise a raw course name (strip stray
// newlines that come from multi-line CSV cells)
// ─────────────────────────────────────────────
function cleanCourseName(course) {
  return (course || "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─────────────────────────────────────────────
// HELPER: Degree Type
// Derived from the course name since PG course
// naming is inconsistent ("MD - X", "M.D. X", "M.D.X")
// ─────────────────────────────────────────────
function getDegreeType(course) {
  const cleaned = cleanCourseName(course).replace(/\./g, "").toUpperCase();
  if (cleaned.startsWith("DNB")) return "DNB";
  if (cleaned.startsWith("DM")) return "DM";
  if (cleaned.startsWith("MCH") || cleaned.startsWith("M CH")) return "MCh";
  if (cleaned.startsWith("MD")) return "MD";
  if (cleaned.startsWith("MS")) return "MS";
  if (cleaned.startsWith("PG DIPLOMA") || cleaned.startsWith("DIPLOMA"))
    return "Diploma";
  return "Other";
}

// Preferred display order for degree-type quick filters
const DEGREE_ORDER = ["MD", "MS", "DM", "MCh", "Diploma", "DNB", "Other"];

// ─────────────────────────────────────────────
// HELPER: Management Group
// CSV already supplies the management type directly,
// this just normalises it into a small badge group.
// ─────────────────────────────────────────────
function classifyManagement(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "Other";
  const low = trimmed.toLowerCase();
  if (
    low.includes("govt") ||
    low.includes("government") ||
    low.includes("central")
  )
    return "Government";
  if (low.includes("trust")) return "Trust";
  if (low.includes("deemed")) return "Deemed";
  if (low.includes("private")) return "Private";
  return trimmed;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const PgSeatMatrix2025Page = () => {
  const navigate = useNavigate();
  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selState, setSelState] = useState("all");
  const [selDegree, setSelDegree] = useState("all"); // MD / MS / DM / MCh / Diploma / DNB
  const [selManagement, setSelManagement] = useState("all");
  const [selInstitute, setSelInstitute] = useState("all");
  const [minSeats, setMinSeats] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [showAdv, setShowAdv] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [page, setPage] = useState(1);

  const [colVis, setColVis] = useState({
    sNo: false,
    State: true,
    Management: true,
    Institute: true,
    Course: true,
    Seats: true,
  });

  const colDefs = [
    { key: "sNo", label: "S.No" },
    { key: "State", label: "State" },
    { key: "Management", label: "Type" },
    { key: "Institute", label: "College Name" },
    { key: "Course", label: "Course Name" },
    { key: "Seats", label: "Seats" },
  ];

  const toggleCol = (k) => setColVis((p) => ({ ...p, [k]: !p[k] }));
  const showAll = () =>
    setColVis(Object.keys(colVis).reduce((a, k) => ({ ...a, [k]: true }), {}));
  const hideAll = () =>
    setColVis(
      Object.keys(colVis).reduce(
        (a, k) => ({ ...a, [k]: k === "Institute" }),
        {},
      ),
    );

  // ─────────────────────────────────────────
  // CSV PARSER (RFC 4180 compliant)
  // Header: S. No.,State,Management of college,College Name,Course Name,Seats
  // ─────────────────────────────────────────
  const parseCSV = (text) => {
    if (text.includes("<html") || text.includes("<!DOCTYPE"))
      throw new Error("HTML");

    const parseRow = (src, pos) => {
      const fields = [];
      let i = pos;
      while (i <= src.length) {
        if (src[i] === '"') {
          let field = "";
          i++;
          while (i < src.length) {
            if (src[i] === '"') {
              if (src[i + 1] === '"') {
                field += '"';
                i += 2;
              } else {
                i++;
                break;
              }
            } else {
              field += src[i++];
            }
          }
          fields.push(field.trim());
          if (src[i] === ",") i++;
        } else {
          let field = "";
          while (
            i < src.length &&
            src[i] !== "," &&
            src[i] !== "\r" &&
            src[i] !== "\n"
          ) {
            field += src[i++];
          }
          fields.push(field.trim());
          if (src[i] === ",") i++;
        }
        if (src[i] === "\r" && src[i + 1] === "\n") {
          i += 2;
          break;
        }
        if (src[i] === "\n") {
          i++;
          break;
        }
        if (i >= src.length) break;
      }
      return { fields, next: i };
    };

    const rows = [];
    let pos = 0;
    let sNoCounter = 1;

    // Skip header row
    const header = parseRow(text, pos);
    pos = header.next;

    while (pos < text.length) {
      const { fields: v, next } = parseRow(text, pos);
      pos = next;

      if (v.length < 5) continue;

      const state = (v[1] || "").trim();
      const managementRaw = (v[2] || "").trim();
      const institute = (v[3] || "").trim();
      const courseRaw = (v[4] || "").trim();
      const seatsRaw = (v[5] || "").trim();

      // Skip repeated header rows, empty rows, and TOTAL rows
      if (
        state.toLowerCase() === "state" &&
        institute.toLowerCase() === "college name"
      )
        continue;
      if (!institute || institute.toUpperCase() === "TOTAL") continue;
      if (!courseRaw) continue;

      const course = cleanCourseName(courseRaw);
      const seats = parseSeats(seatsRaw);
      const degreeType = getDegreeType(course);
      const mgmt = classifyManagement(managementRaw);

      rows.push({
        sNo: sNoCounter++,
        State: state,
        Institute: institute,
        Course: course,
        Seats: seats.num,
        SeatsRaw: seats.display,
        ManagementRaw: managementRaw,
        ManagementGroup: mgmt,
        DegreeType: degreeType,
      });
    }
    return rows;
  };

  // ─────────────────────────────────────────
  // FETCH CSV
  // ─────────────────────────────────────────
  useEffect(() => {
    fetch("/data/neetpg/pg_seat_matrix_2025.csv")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((t) => {
        setSeatData(parseCSV(t));
        setDataError(false);
      })
      .catch(() => {
        setDataError(true);
        setSeatData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ─────────────────────────────────────────
  // DERIVED FILTER OPTIONS
  // ─────────────────────────────────────────
  const states = [
    ...new Set(seatData.map((d) => d.State).filter(Boolean)),
  ].sort();
  const degreeTypes = DEGREE_ORDER.filter((d) =>
    seatData.some((row) => row.DegreeType === d),
  );
  const managements = [
    ...new Set(seatData.map((d) => d.ManagementGroup).filter(Boolean)),
  ].sort();
  const institutes = [
    ...new Set(seatData.map((d) => d.Institute).filter(Boolean)),
  ].sort();

  // ─────────────────────────────────────────
  // FILTER LOGIC
  // ─────────────────────────────────────────
  const filtered = seatData.filter((item) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !s ||
      item.Institute.toLowerCase().includes(s) ||
      item.Course.toLowerCase().includes(s) ||
      item.State.toLowerCase().includes(s);
    if (!matchesSearch) return false;

    if (selState !== "all" && item.State !== selState) return false;
    if (selDegree !== "all" && item.DegreeType !== selDegree) return false;
    if (selManagement !== "all" && item.ManagementGroup !== selManagement)
      return false;
    if (selInstitute !== "all" && item.Institute !== selInstitute) return false;

    // Seats range
    if (minSeats && (item.Seats < 0 || item.Seats < parseInt(minSeats)))
      return false;
    if (maxSeats && item.Seats >= 0 && item.Seats > parseInt(maxSeats))
      return false;

    return true;
  });

  const PER_PAGE = 70;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setSearchTerm("");
    setSelState("all");
    setSelDegree("all");
    setSelManagement("all");
    setSelInstitute("all");
    setMinSeats("");
    setMaxSeats("");
    setPage(1);
  };

  // ─────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────
  const totalSeats = filtered.reduce(
    (s, r) => s + (r.Seats > 0 ? r.Seats : 0),
    0,
  );
  const collegeCount = new Set(filtered.map((r) => r.Institute)).size;
  const mdCount = filtered.filter((r) => r.DegreeType === "MD").length;
  const msCount = filtered.filter((r) => r.DegreeType === "MS").length;
  const govtCount = filtered.filter(
    (r) => r.ManagementGroup === "Government",
  ).length;

  // ─────────────────────────────────────────
  // BADGE COLORS
  // ─────────────────────────────────────────
  const mgmtColor = (m) => {
    if (m === "Government") return "pg25-sm-badge-mgmt-govt";
    if (m === "Trust") return "pg25-sm-badge-mgmt-trust";
    if (m === "Deemed") return "pg25-sm-badge-mgmt-deemed";
    return "pg25-sm-badge-mgmt-private";
  };

  const degreeColor = (d) => {
    if (d === "MD") return "pg25-sm-badge-degree-md";
    if (d === "MS") return "pg25-sm-badge-degree-ms";
    if (d === "DM") return "pg25-sm-badge-degree-dm";
    if (d === "MCh") return "pg25-sm-badge-degree-mch";
    if (d === "Diploma") return "pg25-sm-badge-degree-diploma";
    if (d === "DNB") return "pg25-sm-badge-degree-dnb";
    return "pg25-sm-badge-degree-other";
  };

  // ─────────────────────────────────────────
  // CUSTOM SELECT COMPONENT
  // ─────────────────────────────────────────
  const CustomSelect = ({ value, onChange, options, allLabel, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter((o) =>
      o.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <div className="pg25-sm-cs-wrapper">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pg25-sm-cs-trigger"
        >
          {icon && <span className="pg25-sm-cs-icon-inline">{icon}</span>}
          <span className="pg25-sm-cs-value">
            {value === "all" ? allLabel : value}
          </span>
          <ChevronDown
            className={`pg25-sm-cs-chevron-static ${isOpen ? "pg25-sm-rotate-open" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="pg25-sm-select-overlay"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
            />
            <div className="pg25-sm-select-dropdown">
              <div className="pg25-sm-select-search-wrap">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pg25-sm-select-search-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="pg25-sm-select-options">
                <div
                  onClick={() => {
                    onChange("all");
                    setPage(1);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`pg25-sm-select-option ${
                    value === "all" ? "pg25-sm-select-option-selected" : ""
                  }`}
                >
                  {allLabel}
                </div>
                {filteredOptions.map((o) => (
                  <div
                    key={o}
                    onClick={() => {
                      onChange(o);
                      setPage(1);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`pg25-sm-select-option ${
                      value === o ? "pg25-sm-select-option-selected" : ""
                    }`}
                  >
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────
  if (loading)
    return (
      <div className="pg25-sm-loading-screen">
        <div className="pg25-sm-loading-content">
          <div className="pg25-sm-loading-spinner" />
          <p className="pg25-sm-loading-text">Loading NEET PG Seat Matrix...</p>
        </div>
      </div>
    );

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="pg25-sm-page-root">
      {/* Column Visibility Modal */}
      {showColModal && (
        <div className="pg25-sm-modal-overlay">
          <div className="pg25-sm-modal-box">
            <div className="pg25-sm-modal-header">
              <h3 className="pg25-sm-modal-title">Show / Hide Columns</h3>
              <button
                onClick={() => setShowColModal(false)}
                className="pg25-sm-modal-close-btn"
              >
                <X className="pg25-sm-modal-close-icon" />
              </button>
            </div>
            <div className="pg25-sm-modal-body">
              <div className="pg25-sm-modal-actions">
                <button onClick={showAll} className="pg25-sm-btn-show-all">
                  Show All
                </button>
                <button onClick={hideAll} className="pg25-sm-btn-hide-all">
                  Hide All
                </button>
              </div>
              <div className="pg25-sm-col-grid">
                {colDefs.map(({ key, label }) => (
                  <div key={key} className="pg25-sm-col-row">
                    <label className="pg25-sm-col-row-label">
                      <input
                        type="checkbox"
                        checked={colVis[key]}
                        onChange={() => toggleCol(key)}
                        className="pg25-sm-col-checkbox"
                      />
                      <span className="pg25-sm-col-row-text">{label}</span>
                    </label>
                    {colVis[key] ? (
                      <Eye className="pg25-sm-col-eye-icon" />
                    ) : (
                      <EyeOff className="pg25-sm-col-eyeoff-icon" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="pg25-sm-modal-footer">
              <button
                onClick={() => setShowColModal(false)}
                className="pg25-sm-btn-apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pg25-sm-content-wrapper">
        {/* Header */}
        <div className="pg25-sm-header">
          <div className="pg25-sm-header-row">
            <div className="pg25-sm-header-left">
              <button
                onClick={() => navigate("/dashboard/neet-pg")}
                className="pg25-sm-back-btn"
              >
                <ArrowLeft className="pg25-sm-icon-sm" />
              </button>
              <div>
                <h1 className="pg25-sm-header-title">Seat Matrix</h1>
                <p className="pg25-sm-header-subtitle">NEET PG 2025</p>
              </div>
            </div>

            <span className="pg25-sm-records-count">
              {filtered.length.toLocaleString()} Records
            </span>
          </div>
        </div>

        {dataError && (
          <div className="pg25-sm-error-banner">
            ⚠️ Data file not found. Add{" "}
            <code>/data/neetpg/pg_seat_matrix_2025.csv</code> to enable this
            page.
          </div>
        )}

        {/* Degree-type quick filters */}
        <div className="pg25-sm-quickfilters-section">
          <div className="pg25-sm-quickfilters-row">
            {degreeTypes.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelDegree(d);
                  setPage(1);
                }}
                className={`pg25-sm-pill-btn ${selDegree === d ? "pg25-sm-pill-blue-active" : "pg25-sm-pill-gray-inactive"}`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => {
                setSelDegree("all");
                setPage(1);
              }}
              className={`pg25-sm-pill-btn ${selDegree === "all" ? "pg25-sm-pill-blue-active" : "pg25-sm-pill-gray-inactive"}`}
            >
              All Courses
            </button>
            <div className="pg25-sm-quickfilters-actions">
              <button
                onClick={() => setShowColModal(true)}
                className="pg25-sm-columns-btn"
              >
                <Eye className="pg25-sm-icon-sm" /> Columns
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="pg25-sm-filters-section">
          <div className="pg25-sm-filters-row">
            <div className="pg25-sm-search-wrapper">
              <Search className="pg25-sm-search-icon" />
              <input
                type="text"
                placeholder="Search college, course or state…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pg25-sm-search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPage(1);
                  }}
                  className="pg25-sm-search-clear-btn"
                >
                  <X className="pg25-sm-search-clear-icon" />
                </button>
              )}
            </div>
            <div className="pg25-sm-selects-wrapper">
              <CustomSelect
                value={selState}
                onChange={setSelState}
                options={states}
                allLabel="All States"
              />
              <CustomSelect
                value={selManagement}
                onChange={setSelManagement}
                options={managements}
                allLabel="All Types"
              />
              <CustomSelect
                value={selInstitute}
                onChange={setSelInstitute}
                options={institutes.slice(0, 100)}
                allLabel="All Colleges"
              />
              <button
                onClick={() => setShowAdv(!showAdv)}
                className={`pg25-sm-morefilters-btn ${showAdv ? "pg25-sm-morefilters-active" : "pg25-sm-morefilters-inactive"}`}
              >
                <Filter className="pg25-sm-icon-sm" /> More Filters
                <ChevronDown
                  className={`pg25-sm-morefilters-chevron ${showAdv ? "pg25-sm-rotate-open" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdv && (
            <div className="pg25-sm-advfilters">
              <p className="pg25-sm-advfilters-heading">Advanced Filters</p>
              <div className="pg25-sm-advfilters-grid">
                {/* Specific Institute */}
                <div>
                  <label className="pg25-sm-field-label">
                    Specific College
                  </label>
                  <CustomSelect
                    value={selInstitute}
                    onChange={setSelInstitute}
                    options={institutes.slice(0, 100)}
                    allLabel="All Colleges"
                  />
                </div>
                {/* Min Seats */}
                <div>
                  <label className="pg25-sm-field-label">Min Seats</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    value={minSeats}
                    onChange={(e) => {
                      setMinSeats(e.target.value);
                      setPage(1);
                    }}
                    className="pg25-sm-field-input"
                  />
                </div>
                {/* Max Seats */}
                <div>
                  <label className="pg25-sm-field-label">Max Seats</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={maxSeats}
                    onChange={(e) => {
                      setMaxSeats(e.target.value);
                      setPage(1);
                    }}
                    className="pg25-sm-field-input"
                  />
                </div>
              </div>
              <div className="pg25-sm-advfilters-footer">
                <div className="pg25-sm-advfilters-stats">
                  <span className="pg25-sm-stats-num-blue">
                    {filtered.length.toLocaleString()}
                  </span>
                  <span className="pg25-sm-stats-label">results</span>
                  <span className="pg25-sm-stats-dot">·</span>
                  <span className="pg25-sm-stats-num-emerald">
                    {totalSeats.toLocaleString()}
                  </span>
                  <span className="pg25-sm-stats-label">total seats</span>
                </div>
                <button onClick={clearAll} className="pg25-sm-clearall-btn">
                  <X className="pg25-sm-icon-xs" /> Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="pg25-sm-table-wrapper">
          <table className="pg25-sm-table">
            <thead className="pg25-sm-table-head">
              <tr>
                {colVis.sNo && <th className="pg25-sm-th">#</th>}
                {colVis.State && <th className="pg25-sm-th">State</th>}
                {colVis.Management && <th className="pg25-sm-th">Type</th>}
                {colVis.Institute && (
                  <th className="pg25-sm-th">College Name</th>
                )}
                {colVis.Course && <th className="pg25-sm-th">Course Name</th>}
                {colVis.Seats && <th className="pg25-sm-th-seats">Seats</th>}
              </tr>
            </thead>
            <tbody className="pg25-sm-table-body">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={Object.values(colVis).filter(Boolean).length}
                    className="pg25-sm-table-empty"
                  >
                    <div className="pg25-sm-table-empty-content">
                      <BarChart2 className="pg25-sm-table-empty-icon" />
                      <p className="pg25-sm-table-empty-title">
                        No results found
                      </p>
                      <p className="pg25-sm-table-empty-subtitle">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((item, i) => {
                  return (
                    <tr key={i} className="pg25-sm-table-row">
                      {colVis.sNo && (
                        <td className="pg25-sm-td-sno">
                          {(page - 1) * PER_PAGE + i + 1}
                        </td>
                      )}
                      {colVis.State && (
                        <td className="pg25-sm-td-state">
                          {item.State || "N/A"}
                        </td>
                      )}
                      {colVis.Management && (
                        <td className="pg25-sm-td-mgmt">
                          <span
                            className={`pg25-sm-badge-mgmt-base ${mgmtColor(item.ManagementGroup)}`}
                          >
                            {item.ManagementGroup}
                          </span>
                        </td>
                      )}
                      {colVis.Institute && (
                        <td className="pg25-sm-td-institute">
                          <span className="pg25-sm-institute-clamp">
                            {item.Institute}
                          </span>
                        </td>
                      )}
                      {colVis.Course && (
                        <td className="pg25-sm-td-course">
                          <span
                            className={`pg25-sm-badge-degree-base ${degreeColor(item.DegreeType)}`}
                          >
                            {item.DegreeType}
                          </span>
                          <span className="pg25-sm-course-clamp">
                            {item.Course}
                          </span>
                        </td>
                      )}
                      {colVis.Seats && (
                        <td className="pg25-sm-td-seats">
                          {item.Seats < 0 ? (
                            <span className="pg25-sm-value-na">N/A</span>
                          ) : item.Seats === 0 ? (
                            <span className="pg25-sm-seats-zero">0</span>
                          ) : (
                            <span
                              className={`pg25-sm-seats-value ${item.Seats >= 10 ? "pg25-sm-seats-blue" : "pg25-sm-seats-orange"}`}
                            >
                              {item.SeatsRaw}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pg25-sm-pagination">
          <div className="pg25-sm-pagination-row">
            <div className="pg25-sm-pagination-info">
              Showing{" "}
              <span className="pg25-sm-pagination-info-bold">
                {filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
                {Math.min(page * PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="pg25-sm-pagination-info-bold">
                {filtered.length.toLocaleString()}
              </span>
            </div>
            <div className="pg25-sm-pagination-controls">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="pg25-sm-pagination-nav-btn"
              >
                <ChevronLeft className="pg25-sm-icon-xs" />
              </button>
              <div className="pg25-sm-pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const n =
                    totalPages <= 5
                      ? i + 1
                      : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  if (n > totalPages) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`pg25-sm-pagenum-btn ${page === n ? "pg25-sm-pagenum-active" : "pg25-sm-pagenum-inactive"}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="pg25-sm-pagination-nav-btn"
              >
                <ChevronRight className="pg25-sm-icon-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgSeatMatrix2025Page;
