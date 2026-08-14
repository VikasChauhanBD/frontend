import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UgSeatMatrix2025Page.css";
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
  GraduationCap,
} from "lucide-react";

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
// HELPER: Parse Fee
// Handles: "1350", "₹24,000*", "1770000", "Info not available", "-", ""
// ─────────────────────────────────────────────
function parseFee(raw) {
  const trimmed = raw?.trim() ?? "";
  if (
    !trimmed ||
    trimmed === "-" ||
    trimmed.toLowerCase().includes("info not available") ||
    trimmed.toLowerCase() === "n/a"
  ) {
    return { num: -1, display: "N/A" };
  }

  // Remove ₹, commas, spaces, * and any non-digit characters
  const cleaned = trimmed.replace(/[₹,\s*]/g, "");
  const num = parseInt(cleaned);
  if (isNaN(num)) return { num: -1, display: trimmed };

  // Format in Indian numbering system
  return { num, display: `₹${num.toLocaleString("en-IN")}` };
}

// ─────────────────────────────────────────────
// HELPER: Degree Type
// ─────────────────────────────────────────────
function getDegreeType(course) {
  const cu = course.toUpperCase().trim();
  if (cu === "MBBS") return "MBBS";
  if (cu === "BDS") return "BDS";
  return cu || "Other";
}

// ─────────────────────────────────────────────
// HELPER: Classify Management (derived since CSV has no such column)
// Uses institute name keywords + fee threshold as fallback
// ─────────────────────────────────────────────
function classifyManagement(institute, fee) {
  const name = institute.toLowerCase();

  const govtKeywords = [
    "aiims",
    "jipmer",
    "esic",
    "ruhs",
    "govt",
    "government",
    "gmc,",
    "gmc ",
    "mamc",
    "vmmc",
    "ucms",
    "abvims",
    "ndmc",
    "igmc",
    "igims",
    "scb,",
    "mkcg",
    "vimsar",
    "bhu",
    "amu",
    "kgmu",
    "rml",
    "neigrihms",
    "rims,",
    "sgpgi",
    "dr rml",
    "patna med",
    "madras med",
    "medical college",
    "med coll,",
    "seth gs",
    "bjmc,",
    "grant med",
    "topiwala",
    "coimbatore med",
    "stanley med",
    "kilkauk",
    "thanjavur",
    "tirunelveli",
    "pt.",
    "pts.",
    "lalbahshastri",
    "rpg,",
    "doon med",
    "soban singh",
    "vcsg",
    "hbt & rn",
    "lokkmanya",
    "s.n. med",
    "mln med",
    "mlb med",
    "llrm",
    "brd med",
    "gsv med",
    "gsVM",
    "jnm (amu)",
    "faculty of dental",
    "dr za dental",
    "shaik-ul-hind",
    "rajendra ims",
    "manipal tata",
    "ann magadh",
    "darbhanga,",
    "sri krishna,",
    "nalanda med",
    "vardhman ims",
    "jawaharlal nehru,",
    "jannayak karpoori",
  ];

  for (const kw of govtKeywords) {
    if (name.includes(kw)) return "Government";
  }

  // Fee-based fallback
  if (fee > 0 && fee < 200000) return "Government";
  return "Private";
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const UgSeatMatrix2025Page = () => {
  const navigate = useNavigate();
  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selState, setSelState] = useState("all");
  const [selCourse, setSelCourse] = useState("all"); // MBBS / BDS
  const [selManagement, setSelManagement] = useState("all");
  const [selInstitute, setSelInstitute] = useState("all");
  const [minSeats, setMinSeats] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [showAdv, setShowAdv] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [page, setPage] = useState(1);
  const [feeCategory, setFeeCategory] = useState("all"); // quick filter

  const [colVis, setColVis] = useState({
    sNo: false,
    State: true,
    Institute: true,
    Course: true,
    Seats: true,
    Fee: true,
    Management: true,
  });

  const colDefs = [
    { key: "sNo", label: "S.No" },
    { key: "State", label: "State" },
    { key: "Management", label: "Type" },
    { key: "Institute", label: "Institute Name" },
    { key: "Course", label: "Course" },
    { key: "Seats", label: "Seats" },
    { key: "Fee", label: "Fee (Annual)" },
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

      if (v.length < 3) continue;

      const state = (v[0] || "").trim();
      const institute = (v[1] || "").trim();
      const course = (v[2] || "").trim();
      const seatsRaw = (v[3] || "").trim();
      const feeRaw = (v[4] || "").trim();

      // Skip repeated header rows, empty rows, and TOTAL rows
      if (
        state.toLowerCase() === "state" &&
        institute.toLowerCase() === "institute"
      )
        continue;
      if (!institute || institute.toUpperCase() === "TOTAL") continue;
      if (!course) continue;

      const seats = parseSeats(seatsRaw);
      const fee = parseFee(feeRaw);
      const degreeType = getDegreeType(course);
      const mgmt = classifyManagement(institute, fee.num);

      rows.push({
        sNo: sNoCounter++,
        State: state,
        Institute: institute,
        Course: course,
        Seats: seats.num,
        SeatsRaw: seats.display,
        Fee: fee.num,
        FeeRaw: fee.display,
        DegreeType: degreeType,
        ManagementGroup: mgmt,
      });
    }
    return rows;
  };

  // ─────────────────────────────────────────
  // FETCH CSV
  // ─────────────────────────────────────────
  useEffect(() => {
    fetch("/data/neetug/ug_seat_matrix_2025.csv")
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
  const courses = [
    ...new Set(seatData.map((d) => d.DegreeType).filter(Boolean)),
  ].sort();
  const managements = ["Government", "Private"];
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
    if (selCourse !== "all" && item.DegreeType !== selCourse) return false;
    if (selManagement !== "all" && item.ManagementGroup !== selManagement)
      return false;
    if (selInstitute !== "all" && item.Institute !== selInstitute) return false;

    // Fee category quick filter
    if (feeCategory === "govt" && item.ManagementGroup !== "Government")
      return false;
    if (feeCategory === "private" && item.ManagementGroup === "Government")
      return false;
    if (feeCategory === "highfee" && (item.Fee < 0 || item.Fee < 1000000))
      return false;

    // Seats range
    if (minSeats && (item.Seats < 0 || item.Seats < parseInt(minSeats)))
      return false;
    if (maxSeats && item.Seats >= 0 && item.Seats > parseInt(maxSeats))
      return false;

    // Fee range
    if (minFee && (item.Fee < 0 || item.Fee < parseInt(minFee))) return false;
    if (maxFee && item.Fee >= 0 && item.Fee > parseInt(maxFee)) return false;

    return true;
  });

  const PER_PAGE = 70;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setSearchTerm("");
    setSelState("all");
    setSelCourse("all");
    setSelManagement("all");
    setSelInstitute("all");
    setMinSeats("");
    setMaxSeats("");
    setMinFee("");
    setMaxFee("");
    setFeeCategory("all");
    setPage(1);
  };

  // ─────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────
  const totalSeats = filtered.reduce(
    (s, r) => s + (r.Seats > 0 ? r.Seats : 0),
    0,
  );
  const mbbsCount = filtered.filter((r) => r.DegreeType === "MBBS").length;
  const bdsCount = filtered.filter((r) => r.DegreeType === "BDS").length;
  const govtCount = filtered.filter(
    (r) => r.ManagementGroup === "Government",
  ).length;
  const pvtCount = filtered.filter(
    (r) => r.ManagementGroup === "Private",
  ).length;

  // ─────────────────────────────────────────
  // BADGE COLORS
  // ─────────────────────────────────────────
  const mgmtColor = (m) => {
    if (m === "Government") return "ug25-sm-badge-mgmt-govt";
    return "ug25-sm-badge-mgmt-private";
  };

  const degreeColor = (d) => {
    if (d === "MBBS") return "ug25-sm-badge-degree-mbbs";
    if (d === "BDS") return "ug25-sm-badge-degree-bds";
    return "ug25-sm-badge-degree-other";
  };

  const feeColor = (fee) => {
    if (fee < 0) return "ug25-sm-fee-neg";
    if (fee < 100000) return "ug25-sm-fee-low";
    if (fee < 500000) return "ug25-sm-fee-mid";
    return "ug25-sm-fee-high";
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
      <div className="ug25-sm-cs-wrapper">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ug25-sm-cs-trigger"
        >
          {icon && <span className="ug25-sm-cs-icon-inline">{icon}</span>}
          <span className="ug25-sm-cs-value">
            {value === "all" ? allLabel : value}
          </span>
          <ChevronDown
            className={`ug25-sm-cs-chevron-static ${isOpen ? "ug25-sm-rotate-open" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="ug25-sm-select-overlay"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
            />
            <div className="ug25-sm-select-dropdown">
              <div className="ug25-sm-select-search-wrap">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ug25-sm-select-search-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="ug25-sm-select-options">
                <div
                  onClick={() => {
                    onChange("all");
                    setPage(1);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`ug25-sm-select-option ${
                    value === "all" ? "ug25-sm-select-option-selected" : ""
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
                    className={`ug25-sm-select-option ${
                      value === o ? "ug25-sm-select-option-selected" : ""
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
      <div className="ug25-sm-loading-screen">
        <div className="ug25-sm-loading-content">
          <div className="ug25-sm-loading-spinner" />
          <p className="ug25-sm-loading-text">Loading NEET UG Seat Matrix...</p>
        </div>
      </div>
    );

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="ug25-sm-page-root">
      {/* Column Visibility Modal */}
      {showColModal && (
        <div className="ug25-sm-modal-overlay">
          <div className="ug25-sm-modal-box">
            <div className="ug25-sm-modal-header">
              <h3 className="ug25-sm-modal-title">Show / Hide Columns</h3>
              <button
                onClick={() => setShowColModal(false)}
                className="ug25-sm-modal-close-btn"
              >
                <X className="ug25-sm-modal-close-icon" />
              </button>
            </div>
            <div className="ug25-sm-modal-body">
              <div className="ug25-sm-modal-actions">
                <button onClick={showAll} className="ug25-sm-btn-show-all">
                  Show All
                </button>
                <button onClick={hideAll} className="ug25-sm-btn-hide-all">
                  Hide All
                </button>
              </div>
              <div className="ug25-sm-col-grid">
                {colDefs.map(({ key, label }) => (
                  <div key={key} className="ug25-sm-col-row">
                    <label className="ug25-sm-col-row-label">
                      <input
                        type="checkbox"
                        checked={colVis[key]}
                        onChange={() => toggleCol(key)}
                        className="ug25-sm-col-checkbox"
                      />
                      <span className="ug25-sm-col-row-text">{label}</span>
                    </label>
                    {colVis[key] ? (
                      <Eye className="ug25-sm-col-eye-icon" />
                    ) : (
                      <EyeOff className="ug25-sm-col-eyeoff-icon" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="ug25-sm-modal-footer">
              <button
                onClick={() => setShowColModal(false)}
                className="ug25-sm-btn-apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ug25-sm-content-wrapper">
        {/* Header */}
        <div className="ug25-sm-header">
          <div className="ug25-sm-header-row">
            <div className="ug25-sm-header-left">
              <button
                onClick={() => navigate("/dashboard/neet-ug")}
                className="ug25-sm-back-btn"
              >
                <ArrowLeft className="ug25-sm-icon-sm" />
              </button>
              <div>
                <h1 className="ug25-sm-header-title">Seat Matrix</h1>
                <p className="ug25-sm-header-subtitle">NEET UG 2025</p>
              </div>
            </div>
            <span className="ug25-sm-records-count">
              {filtered.length.toLocaleString()} Records
            </span>
          </div>
        </div>

        {dataError && (
          <div className="ug25-sm-error-banner">
            ⚠️ Data file not found. Add{" "}
            <code>/data/neetug/ug_seat_matrix_2025.csv</code> to enable this
            page.
          </div>
        )}

        {/* Course-type quick filters + Fee category */}
        <div className="ug25-sm-quickfilters-section">
          <div className="ug25-sm-quickfilters-row">
            {/* Course filter */}
            {["MBBS", "BDS", "all"].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelCourse(d);
                  setPage(1);
                }}
                className={`ug25-sm-pill-btn ${selCourse === d ? "ug25-sm-pill-blue-active" : "ug25-sm-pill-gray-inactive"}`}
              >
                {d === "all" ? "All Courses" : d}
              </button>
            ))}

            <div className="ug25-sm-quickfilters-actions">
              <button
                onClick={() => setShowColModal(true)}
                className="ug25-sm-columns-btn"
              >
                <Eye className="ug25-sm-icon-sm" /> Columns
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="ug25-sm-filters-section">
          <div className="ug25-sm-filters-row">
            <div className="ug25-sm-search-wrapper">
              <Search className="ug25-sm-search-icon" />
              <input
                type="text"
                placeholder="Search institute, course or state…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="ug25-sm-search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPage(1);
                  }}
                  className="ug25-sm-search-clear-btn"
                >
                  <X className="ug25-sm-search-clear-icon" />
                </button>
              )}
            </div>
            <div className="ug25-sm-selects-wrapper">
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
                allLabel="All Institutes"
                icon={<GraduationCap className="ug25-sm-icon-xs" />}
              />
              <button
                onClick={() => setShowAdv(!showAdv)}
                className={`ug25-sm-morefilters-btn ${showAdv ? "ug25-sm-morefilters-active" : "ug25-sm-morefilters-inactive"}`}
              >
                <Filter className="ug25-sm-icon-sm" /> More Filters
                <ChevronDown
                  className={`ug25-sm-morefilters-chevron ${showAdv ? "ug25-sm-rotate-open" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdv && (
            <div className="ug25-sm-advfilters">
              <p className="ug25-sm-advfilters-heading">Advanced Filters</p>
              <div className="ug25-sm-advfilters-grid">
                {/* Min Seats */}
                <div>
                  <label className="ug25-sm-field-label">Min Seats</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={minSeats}
                    onChange={(e) => {
                      setMinSeats(e.target.value);
                      setPage(1);
                    }}
                    className="ug25-sm-field-input"
                  />
                </div>
                {/* Max Seats */}
                <div>
                  <label className="ug25-sm-field-label">Max Seats</label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={maxSeats}
                    onChange={(e) => {
                      setMaxSeats(e.target.value);
                      setPage(1);
                    }}
                    className="ug25-sm-field-input"
                  />
                </div>
                {/* Min Fee */}
                <div>
                  <label className="ug25-sm-field-label">Min Fee (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={minFee}
                    onChange={(e) => {
                      setMinFee(e.target.value);
                      setPage(1);
                    }}
                    className="ug25-sm-field-input"
                  />
                </div>
                {/* Max Fee */}
                <div>
                  <label className="ug25-sm-field-label">Max Fee (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={maxFee}
                    onChange={(e) => {
                      setMaxFee(e.target.value);
                      setPage(1);
                    }}
                    className="ug25-sm-field-input"
                  />
                </div>
              </div>
              <div className="ug25-sm-advfilters-footer">
                <div className="ug25-sm-advfilters-stats">
                  <span className="ug25-sm-stats-num-blue">
                    {filtered.length.toLocaleString()}
                  </span>
                  <span className="ug25-sm-stats-label">results</span>
                </div>
                <button onClick={clearAll} className="ug25-sm-clearall-btn">
                  <X className="ug25-sm-icon-xs" /> Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="ug25-sm-table-wrapper">
          <table className="ug25-sm-table">
            <thead className="ug25-sm-table-head">
              <tr>
                {colVis.sNo && <th className="ug25-sm-th">#</th>}
                {colVis.State && <th className="ug25-sm-th">State</th>}
                {colVis.Management && <th className="ug25-sm-th">Type</th>}
                {colVis.Institute && (
                  <th className="ug25-sm-th">Institute Name</th>
                )}
                {colVis.Course && <th className="ug25-sm-th">Course</th>}
                {colVis.Seats && <th className="ug25-sm-th-seats">Seats</th>}
                {colVis.Fee && <th className="ug25-sm-th">Fee (Annual)</th>}
              </tr>
            </thead>
            <tbody className="ug25-sm-table-body">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={Object.values(colVis).filter(Boolean).length}
                    className="ug25-sm-table-empty"
                  >
                    <div className="ug25-sm-table-empty-content">
                      <BarChart2 className="ug25-sm-table-empty-icon" />
                      <p className="ug25-sm-table-empty-title">
                        No results found
                      </p>
                      <p className="ug25-sm-table-empty-subtitle">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((item, i) => {
                  return (
                    <tr key={i} className="ug25-sm-table-row">
                      {colVis.sNo && (
                        <td className="ug25-sm-td-sno">
                          {(page - 1) * PER_PAGE + i + 1}
                        </td>
                      )}
                      {colVis.State && (
                        <td className="ug25-sm-td-state">
                          {item.State || "N/A"}
                        </td>
                      )}
                      {colVis.Management && (
                        <td className="ug25-sm-td-mgmt">
                          <span
                            className={`ug25-sm-badge-mgmt-base ${mgmtColor(item.ManagementGroup)}`}
                          >
                            {item.ManagementGroup}
                          </span>
                        </td>
                      )}
                      {colVis.Institute && (
                        <td className="ug25-sm-td-institute">
                          <span className="ug25-sm-institute-clamp">
                            {item.Institute}
                          </span>
                        </td>
                      )}
                      {colVis.Course && (
                        <td className="ug25-sm-td-course">
                          <span
                            className={`ug25-sm-badge-degree-base ${degreeColor(item.DegreeType)}`}
                          >
                            {item.DegreeType}
                          </span>
                        </td>
                      )}
                      {colVis.Seats && (
                        <td className="ug25-sm-td-seats">
                          {item.Seats < 0 ? (
                            <span className="ug25-sm-value-na">N/A</span>
                          ) : item.Seats === 0 ? (
                            <span className="ug25-sm-seats-zero">0</span>
                          ) : (
                            <span
                              className={`ug25-sm-seats-value ${item.Seats >= 50 ? "ug25-sm-seats-blue" : item.Seats >= 10 ? "ug25-sm-seats-blue" : "ug25-sm-seats-orange"}`}
                            >
                              {item.SeatsRaw}
                            </span>
                          )}
                        </td>
                      )}
                      {colVis.Fee && (
                        <td className="ug25-sm-td-fee">
                          {item.Fee < 0 ? (
                            <span className="ug25-sm-value-na">N/A</span>
                          ) : (
                            <span className={feeColor(item.Fee)}>
                              {item.FeeRaw}
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
        <div className="ug25-sm-pagination">
          <div className="ug25-sm-pagination-row">
            <div className="ug25-sm-pagination-info">
              Showing{" "}
              <span className="ug25-sm-pagination-info-bold">
                {filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
                {Math.min(page * PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="ug25-sm-pagination-info-bold">
                {filtered.length.toLocaleString()}
              </span>
            </div>
            <div className="ug25-sm-pagination-controls">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="ug25-sm-pagination-nav-btn"
              >
                <ChevronLeft className="ug25-sm-icon-xs" />
              </button>
              <div className="ug25-sm-pagination-numbers">
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
                      className={`ug25-sm-pagenum-btn ${page === n ? "ug25-sm-pagenum-active" : "ug25-sm-pagenum-inactive"}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="ug25-sm-pagination-nav-btn"
              >
                <ChevronRight className="ug25-sm-icon-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UgSeatMatrix2025Page;
