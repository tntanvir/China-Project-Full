"use client";

import * as React from "react";
import { countries, getEmojiFlag, TCountryCode } from "countries-list";
import * as Flags from "country-flag-icons/react/3x2";
import { ChevronDown, Search, X, Check } from "lucide-react";

export interface CountryItem {
  code: string; // e.g. "+880"
  country: string; // e.g. "BD"
  name: string; // e.g. "Bangladesh"
  flag: string; // emoji fallback
}

// Full alphabetical list of 250+ countries with phone codes
export const allCountryCodes: CountryItem[] = Object.entries(countries)
  .map(([code, data]) => ({
    code: `+${data.phone[0]}`,
    country: code,
    name: data.name,
    flag: getEmojiFlag(code as TCountryCode),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface CountryPhoneSelectProps {
  value: string; // e.g. "BD"
  onChange: (countryCode: string) => void;
  className?: string;
  disabled?: boolean;
}

export function CountryPhoneSelect({
  value,
  onChange,
  className = "",
  disabled = false,
}: CountryPhoneSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedCountry =
    allCountryCodes.find((c) => c.country === value) || allCountryCodes[0];

  const SelectedFlagComponent = (
    Flags as Record<string, React.ComponentType<{ className?: string }>>
  )[selectedCountry?.country];

  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!search.trim()) return allCountryCodes;
    const q = search.trim().toLowerCase();
    const cleanQ = q.startsWith("+") ? q.slice(1) : q;
    return allCountryCodes.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchIso = c.country.toLowerCase().includes(q);
      const matchCode = c.code.includes(cleanQ);
      return matchName || matchIso || matchCode;
    });
  }, [search]);

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto-focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearch("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 h-11 px-3 rounded-xl border border-slate-800 bg-[#070b14] text-white hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition cursor-pointer select-none ${
          isOpen ? "ring-1 ring-emerald-500 border-emerald-500/60" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Real SVG Country Flag */}
        {SelectedFlagComponent ? (
          <SelectedFlagComponent className="w-5 h-3.5 rounded-[2px] object-cover shrink-0 shadow-sm" />
        ) : (
          <span className="text-base mr-1">{selectedCountry?.flag}</span>
        )}

        {/* Dial Code */}
        <span className="text-xs font-bold font-mono tracking-tight text-slate-100">
          {selectedCountry?.code || "+880"}
        </span>

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`size-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 rounded-2xl border border-slate-800 bg-[#0b1220] shadow-2xl shadow-black/95 z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code (+880, BD)..."
              className="w-full h-9 pl-9 pr-8 rounded-xl border border-slate-800 bg-[#070b14] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Scrollable Countries List with Real SVG Flags */}
          <div
            className="max-h-60 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800"
            role="listbox"
          >
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No countries found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredCountries.map((c) => {
                const FlagItem = (
                  Flags as Record<
                    string,
                    React.ComponentType<{ className?: string }>
                  >
                )[c.country];
                const isSelected = c.country === value;

                return (
                  <button
                    key={c.country}
                    type="button"
                    onClick={() => handleSelect(c.country)}
                    className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl text-xs transition cursor-pointer text-left ${
                      isSelected
                        ? "bg-emerald-950/60 text-emerald-200 border border-emerald-500/30"
                        : "text-slate-300 hover:bg-slate-850 hover:bg-slate-800/80 hover:text-white"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Real Vector SVG Flag */}
                      {FlagItem ? (
                        <FlagItem className="w-5 h-3.5 rounded-[2px] object-cover shrink-0 shadow-sm" />
                      ) : (
                        <span className="text-sm shrink-0">{c.flag}</span>
                      )}
                      <span className="truncate font-medium">{c.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`font-mono font-bold text-[11px] ${
                          isSelected ? "text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        {c.code}
                      </span>
                      {isSelected && (
                        <Check className="size-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
