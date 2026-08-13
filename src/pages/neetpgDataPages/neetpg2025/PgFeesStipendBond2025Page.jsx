import React, { useState, useEffect } from "react";
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
import "./PgFeesStipendBond2025Page.css";

const CustomSelect = ({ value, onChange, options, placeholder, allLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pg25-fsb-select-wrapper">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pg25-fsb-select-trigger"
      >
        <span className="pg25-fsb-select-value">
          {value === "all" ? allLabel : value}
        </span>
        <ChevronDown
          className={`pg25-fsb-select-chevron ${isOpen ? "pg25-fsb-select-chevron-open" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="pg25-fsb-select-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="pg25-fsb-select-dropdown">
            <div className="pg25-fsb-select-search-wrap">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pg25-fsb-select-search-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="pg25-fsb-select-options">
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`pg25-fsb-select-option ${
                    value === option ? "pg25-fsb-select-option-selected" : ""
                  }`}
                >
                  {option === "all" ? allLabel : option}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PgFeesStipendBond2025Page = () => {
  const navigate = useNavigate();
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedQuota, setSelectedQuota] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBondYears, setSelectedBondYears] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);

  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");

  const [columnVisibility, setColumnVisibility] = useState({
    State: true,
    Institute: true,
    Course: true,
    Quota: true,
    Fee: true,
    Beds: true,
    "Bond Years": true,
    "Bond Penalty": true,
    "Stipend Year 1": true,
  });

  const columnDefinitions = [
    { key: "State", label: "State" },
    { key: "Institute", label: "Institute" },
    { key: "Course", label: "Course" },
    { key: "Quota", label: "Quota" },
    { key: "Fee", label: "Fee" },
    { key: "Beds", label: "Hospital Beds" },
    { key: "Bond Years", label: "Bond Years" },
    { key: "Bond Penalty", label: "Bond Penalty" },
    { key: "Stipend Year 1", label: "Stipend Year 1" },
  ];

  const toggleColumn = (columnKey) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const showAllColumns = () => {
    const allVisible = Object.keys(columnVisibility).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setColumnVisibility(allVisible);
  };

  const hideAllColumns = () => {
    const allHidden = Object.keys(columnVisibility).reduce((acc, key) => {
      acc[key] = key === "Institute";
      return acc;
    }, {});
    setColumnVisibility(allHidden);
  };

  const parseCSV = (csvText) => {
    if (csvText.includes("<html") || csvText.includes("<!DOCTYPE")) {
      throw new Error("Invalid CSV data - received HTML");
    }

    const lines = csvText.trim().split(/\r?\n/);
    const dataLines = lines.filter((line) => line.trim().length > 0);

    if (dataLines.length < 2) {
      throw new Error("Invalid CSV data - insufficient rows");
    }

    // Expected header order:
    // STATE, INSTITUTE, COURSE, QUOTA, FEE, BEDS, BOND YEARS, BOND PENALTY, STIPEND YEAR 1
    return dataLines.slice(1).map((line) => {
      const values = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const cleanedValues = values.map((val) =>
        val.replace(/^"(.*)"$/, "$1").trim(),
      );

      const parseNumber = (val) => {
        const num = parseFloat(val.replace(/[^0-9.-]/g, "")) || 0;
        return isNaN(num) ? 0 : num;
      };

      return {
        State: cleanedValues[0] || "",
        Institute: cleanedValues[1] || "",
        Course: cleanedValues[2] || "",
        Quota: cleanedValues[3] || "",
        Fee: parseNumber(cleanedValues[4]),
        Beds: parseNumber(cleanedValues[5]),
        "Bond Years": cleanedValues[6] || "NA",
        "Bond Penalty": parseNumber(cleanedValues[7]),
        "Stipend Year 1": parseNumber(cleanedValues[8]),
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/data/neetpg/pg_fee_stipend_bond_2025.csv",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();

        if (!csvText || csvText.trim().length === 0) {
          throw new Error("Empty CSV file");
        }

        const parsedData = parseCSV(csvText);

        if (parsedData.length === 0) {
          throw new Error("No valid data parsed from CSV");
        }

        setFeesData(parsedData);
      } catch (error) {
        console.error("Error fetching fees data:", error);

        const fallbackData = [
          {
            State: "Gujarat",
            Institute: "BJMC, Ahmedabad",
            Course: "ANAESTHESIOLOGY",
            Quota: "AIQ",
            Fee: 30000,
            Beds: 1557,
            "Bond Years": "1",
            "Bond Penalty": 4000000,
            "Stipend Year 1": 100800,
          },
          {
            State: "Tamil Nadu",
            Institute: "Arunai Medical College",
            Course: "GENERAL MEDICINE",
            Quota: "MNG",
            Fee: 2500000,
            Beds: 513,
            "Bond Years": "0",
            "Bond Penalty": 0,
            "Stipend Year 1": 50000,
          },
        ];

        setFeesData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = feesData.filter((item) => {
    const matchesSearch =
      item.Institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.State.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Quota.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      selectedState === "all" || item.State === selectedState;
    const matchesQuota =
      selectedQuota === "all" || item.Quota === selectedQuota;
    const matchesCourse =
      selectedCourse === "all" || item.Course === selectedCourse;
    const matchesBondYears =
      selectedBondYears === "all" || item["Bond Years"] === selectedBondYears;

    const matchesFeeRange =
      (!minFee || item.Fee >= parseFloat(minFee)) &&
      (!maxFee || item.Fee <= parseFloat(maxFee));

    const matchesBedsRange =
      (!minBeds || item.Beds >= parseFloat(minBeds)) &&
      (!maxBeds || item.Beds <= parseFloat(maxBeds));

    return (
      matchesSearch &&
      matchesState &&
      matchesQuota &&
      matchesCourse &&
      matchesBondYears &&
      matchesFeeRange &&
      matchesBedsRange
    );
  });

  const itemsPerPage = 50;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const states = [
    "all",
    ...Array.from(new Set(feesData.map((item) => item.State))).sort(),
  ];
  const quotas = [
    "all",
    ...Array.from(new Set(feesData.map((item) => item.Quota))).sort(),
  ];
  const courses = [
    "all",
    ...Array.from(new Set(feesData.map((item) => item.Course))).sort(),
  ];
  const bondYearsOptions = [
    "all",
    ...Array.from(new Set(feesData.map((item) => item["Bond Years"]))).sort(),
  ];

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedState("all");
    setSelectedQuota("all");
    setSelectedCourse("all");
    setSelectedBondYears("all");
    setMinFee("");
    setMaxFee("");
    setMinBeds("");
    setMaxBeds("");
    setCurrentPage(1);
  };

  const formatCurrency = (num) => {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    if (num >= 1000) return "₹" + (num / 1000).toFixed(2) + " K";
    return "₹" + num.toLocaleString();
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const isBondFree = (bondYears) =>
    bondYears === "0" || bondYears.toUpperCase() === "NA";

  if (loading) {
    return (
      <div className="pg25-fsb-loading">
        <div className="pg25-fsb-loading-inner">
          <div className="pg25-fsb-spinner"></div>
          <p className="pg25-fsb-loading-text">
            Loading Fees & Stipend Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pg25-fsb-root">
      {showColumnVisibility && (
        <div className="pg25-fsb-modal-overlay">
          <div className="pg25-fsb-modal">
            <div className="pg25-fsb-modal-header">
              <h3 className="pg25-fsb-modal-title">Show/Hide Columns</h3>
              <button
                onClick={() => setShowColumnVisibility(false)}
                className="pg25-fsb-modal-close"
              >
                <X className="pg25-fsb-icon-md" />
              </button>
            </div>

            <div className="pg25-fsb-modal-body">
              <div className="pg25-fsb-modal-actions">
                <button
                  onClick={showAllColumns}
                  className="pg25-fsb-btn-show-all"
                >
                  Show All
                </button>
                <button
                  onClick={hideAllColumns}
                  className="pg25-fsb-btn-hide-all"
                >
                  Hide All
                </button>
              </div>

              <div className="pg25-fsb-column-list">
                {columnDefinitions.map(({ key, label }) => (
                  <div key={key} className="pg25-fsb-column-item">
                    <label className="pg25-fsb-column-label">
                      <input
                        type="checkbox"
                        checked={columnVisibility[key]}
                        onChange={() => toggleColumn(key)}
                        className="pg25-fsb-checkbox"
                      />
                      <span className="pg25-fsb-column-label-text">
                        {label}
                      </span>
                    </label>
                    <div className="pg25-fsb-column-icon-wrap">
                      {columnVisibility[key] ? (
                        <Eye className="pg25-fsb-icon-visible" />
                      ) : (
                        <EyeOff className="pg25-fsb-icon-hidden" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pg25-fsb-modal-footer">
              <button
                onClick={() => setShowColumnVisibility(false)}
                className="pg25-fsb-btn-primary"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pg25-fsb-main">
        <div className="pg25-fsb-header">
          <div className="pg25-fsb-header-row">
            <div className="pg25-fsb-header-left">
              <button
                onClick={() => navigate("/dashboard/neet-pg")}
                className="pg25-fsb-back-btn"
              >
                <ArrowLeft className="pg25-fsb-icon-sm" />
              </button>
              <div>
                <h1 className="pg25-fsb-title">Fees, Stipend & Bond</h1>
                <p className="pg25-fsb-subtitle">NEET PG 2025</p>
              </div>
            </div>

            <div className="pg25-fsb-records-wrap">
              <span className="pg25-fsb-records-text">
                {filteredData.length} Records
              </span>
            </div>
          </div>
        </div>

        <div className="pg25-fsb-quota-bar">
          <div className="pg25-fsb-quota-row">
            {bondYearsOptions
              .filter((y) => y !== "all")
              .map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedBondYears(year);
                    setCurrentPage(1);
                  }}
                  className={`pg25-fsb-quota-btn ${
                    selectedBondYears === year
                      ? "pg25-fsb-quota-btn-active"
                      : "pg25-fsb-quota-btn-inactive"
                  }`}
                >
                  {year}
                </button>
              ))}

            <button
              onClick={() => {
                setSelectedBondYears("all");
                setCurrentPage(1);
              }}
              className={`pg25-fsb-quota-btn ${
                selectedBondYears === "all"
                  ? "pg25-fsb-quota-btn-all-active"
                  : "pg25-fsb-quota-btn-inactive"
              }`}
            >
              All Years Bond
            </button>

            <button
              onClick={() => setShowColumnVisibility(true)}
              className="pg25-fsb-showhide-btn"
            >
              <Eye className="pg25-fsb-icon-sm" />
              Columns
            </button>
          </div>
        </div>

        <div className="pg25-fsb-filters">
          <div className="pg25-fsb-filters-inner">
            <div className="pg25-fsb-filters-row">
              <div className="pg25-fsb-search-wrap">
                <Search className="pg25-fsb-search-icon" />
                <input
                  type="text"
                  placeholder="Search institutes, states, courses, quota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pg25-fsb-search-input"
                />
              </div>

              <div className="pg25-fsb-select-group">
                <CustomSelect
                  value={selectedState}
                  onChange={(value) => {
                    setSelectedState(value);
                    setCurrentPage(1);
                  }}
                  options={states}
                  placeholder="Select State"
                  allLabel="All States"
                />

                <CustomSelect
                  value={selectedQuota}
                  onChange={(value) => {
                    setSelectedQuota(value);
                    setCurrentPage(1);
                  }}
                  options={quotas}
                  placeholder="Select Quota"
                  allLabel="All Quotas"
                />

                <CustomSelect
                  value={selectedCourse}
                  onChange={(value) => {
                    setSelectedCourse(value);
                    setCurrentPage(1);
                  }}
                  options={courses}
                  placeholder="Select Course"
                  allLabel="All Courses"
                />

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="pg25-fsb-filter-toggle-btn"
                >
                  <Filter className="pg25-fsb-icon-fl" />
                  {showAdvancedFilters ? "Hide" : "Show"} Filters
                  <ChevronDown
                    className={`pg25-fsb-chevron ${showAdvancedFilters ? "pg25-fsb-chevron-open" : ""}`}
                  />
                </button>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="pg25-fsb-advanced-filters">
                <div className="pg25-fsb-advanced-grid">
                  <div className="pg25-fsb-range-group">
                    <input
                      type="number"
                      placeholder="Min Fee"
                      value={minFee}
                      onChange={(e) => {
                        setMinFee(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pg25-fsb-number-input"
                    />
                    <input
                      type="number"
                      placeholder="Max Fee"
                      value={maxFee}
                      onChange={(e) => {
                        setMaxFee(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pg25-fsb-number-input"
                    />
                  </div>

                  <div className="pg25-fsb-range-group">
                    <input
                      type="number"
                      placeholder="Min Beds"
                      value={minBeds}
                      onChange={(e) => {
                        setMinBeds(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pg25-fsb-number-input"
                    />
                    <input
                      type="number"
                      placeholder="Max Beds"
                      value={maxBeds}
                      onChange={(e) => {
                        setMaxBeds(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pg25-fsb-number-input"
                    />
                  </div>

                  <button
                    onClick={clearAllFilters}
                    className="pg25-fsb-clear-btn"
                  >
                    Clear All Filters
                  </button>
                </div>

                <div className="pg25-fsb-results-count">
                  <span className="pg25-fsb-results-count-num">
                    {filteredData.length}
                  </span>
                  <span className="pg25-fsb-results-count-label">
                    filtered results
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pg25-fsb-table-wrap">
          <table className="pg25-fsb-table">
            <thead className="pg25-fsb-thead">
              <tr>
                {columnVisibility.State && (
                  <th className="pg25-fsb-th">State</th>
                )}
                {columnVisibility.Institute && (
                  <th className="pg25-fsb-th">Institute</th>
                )}
                {columnVisibility.Course && (
                  <th className="pg25-fsb-th">Course</th>
                )}
                {columnVisibility.Quota && (
                  <th className="pg25-fsb-th">Quota</th>
                )}
                {columnVisibility.Beds && <th className="pg25-fsb-th">Beds</th>}
                {columnVisibility.Fee && <th className="pg25-fsb-th">Fee</th>}
                {columnVisibility["Stipend Year 1"] && (
                  <th className="pg25-fsb-th">Stipend Y1</th>
                )}
                {columnVisibility["Bond Years"] && (
                  <th className="pg25-fsb-th">Bond Years</th>
                )}
                {columnVisibility["Bond Penalty"] && (
                  <th className="pg25-fsb-th">Bond Penalty</th>
                )}
              </tr>
            </thead>
            <tbody className="pg25-fsb-tbody">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(columnVisibility).filter(Boolean).length
                    }
                    className="pg25-fsb-empty-td"
                  >
                    No data found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="pg25-fsb-tr">
                    {columnVisibility.State && (
                      <td className="pg25-fsb-td">{item.State}</td>
                    )}
                    {columnVisibility.Institute && (
                      <td className="pg25-fsb-td-institute">
                        {item.Institute}
                      </td>
                    )}
                    {columnVisibility.Course && (
                      <td className="pg25-fsb-td">{item.Course}</td>
                    )}
                    {columnVisibility.Quota && (
                      <td className="pg25-fsb-td-center">
                        <span className="pg25-fsb-badge-quota">
                          {item.Quota}
                        </span>
                      </td>
                    )}
                    {columnVisibility.Beds && (
                      <td className="pg25-fsb-td-beds">
                        {formatNumber(item.Beds)}
                      </td>
                    )}
                    {columnVisibility.Fee && (
                      <td className="pg25-fsb-td-fee">
                        {formatCurrency(item.Fee)}
                      </td>
                    )}
                    {columnVisibility["Stipend Year 1"] && (
                      <td className="pg25-fsb-td-stipend">
                        {formatCurrency(item["Stipend Year 1"])}
                      </td>
                    )}
                    {columnVisibility["Bond Years"] && (
                      <td className="pg25-fsb-td-center">
                        <span
                          className={`pg25-fsb-badge-bond ${
                            isBondFree(item["Bond Years"])
                              ? "pg25-fsb-badge-bond-free"
                              : "pg25-fsb-badge-bond-active"
                          }`}
                        >
                          {item["Bond Years"] === "NA"
                            ? "N/A"
                            : `${item["Bond Years"]} Yr`}
                        </span>
                      </td>
                    )}
                    {columnVisibility["Bond Penalty"] && (
                      <td className="pg25-fsb-td-penalty">
                        {item["Bond Penalty"] > 0
                          ? formatCurrency(item["Bond Penalty"])
                          : "N/A"}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pg25-fsb-footer">
          <div className="pg25-fsb-footer-row">
            <div className="pg25-fsb-footer-info">
              Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} results
            </div>

            <div className="pg25-fsb-pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pg25-fsb-page-nav-btn"
              >
                <PrevIcon className="pg25-fsb-icon-xs" />
              </button>

              <div className="pg25-fsb-page-list">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, currentPage - 2);
                    pageNum = start + i;
                    if (pageNum > totalPages) return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`pg25-fsb-page-btn ${
                        currentPage === pageNum
                          ? "pg25-fsb-page-btn-active"
                          : "pg25-fsb-page-btn-inactive"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="pg25-fsb-page-nav-btn"
              >
                <NextIcon className="pg25-fsb-icon-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgFeesStipendBond2025Page;
