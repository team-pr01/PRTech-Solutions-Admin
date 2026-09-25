import { useState, useMemo, useEffect, useRef } from "react";
import {
  LuPlus,
  LuChevronRight,
  LuChevronDown,
  LuTrash2,
  LuSearch,
  LuX,
  LuCheck,
  LuCircle,
  LuCircleDot,
  LuCircleCheck,
  LuCircleSlash,
  LuFolder,
  LuBox,
  LuCornerDownRight,
  LuArrowUpRight,
} from "react-icons/lu";

/* ---------------------------------- Types --------------------------------- */
type Status = "todo" | "active" | "done" | "blocked";

interface SubFeature {
  id: string;
  name: string;
  status: Status;
}
interface Feature {
  id: string;
  name: string;
  status: Status;
  subFeatures: SubFeature[];
}
interface Area {
  id: string;
  name: string;
  status: Status;
  features: Feature[];
}
interface Project {
  id: string;
  name: string;
}

/* --------------------------------- Utils ---------------------------------- */
const uid = () => Math.random().toString(36).slice(2, 9);

const STATUS: Record<
  Status,
  { label: string; icon: React.ReactNode; color: string; dot: string }
> = {
  todo: {
    label: "Todo",
    icon: <LuCircle size={13} />,
    color: "text-neutral-40",
    dot: "bg-neutral-55",
  },
  active: {
    label: "Active",
    icon: <LuCircleDot size={13} />,
    color: "text-primary-10",
    dot: "bg-primary-10",
  },
  done: {
    label: "Done",
    icon: <LuCircleCheck size={13} />,
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  blocked: {
    label: "Blocked",
    icon: <LuCircleSlash size={13} />,
    color: "text-accent-20",
    dot: "bg-accent-20",
  },
};

/* ------------------------------ Status Menu ------------------------------- */
const StatusMenu = ({
  value,
  onChange,
}: {
  value: Status;
  onChange: (s: Status) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [open]);

  const meta = STATUS[value];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${meta.color} hover:bg-neutral-50`}
      >
        {meta.icon}
        <span>{meta.label}</span>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full z-30 mt-1 w-36 rounded-lg border border-neutral-50 bg-white py-1 shadow-lg"
        >
          {(Object.keys(STATUS) as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[12px] text-neutral-10 hover:bg-neutral-50"
            >
              <span className={STATUS[s].color}>{STATUS[s].icon}</span>
              <span className="flex-1">{STATUS[s].label}</span>
              {s === value && <LuCheck size={12} className="text-primary-10" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ------------------------------ Mock Data --------------------------------- */
const PROJECTS: Project[] = [
  { id: "p1", name: "Acme Website Revamp" },
  { id: "p2", name: "Mobile App v2" },
  { id: "p3", name: "Internal CRM" },
];

const INITIAL: Record<string, Area[]> = {
  p1: [
    {
      id: uid(),
      name: "UI Design",
      status: "active",
      features: [
        {
          id: uid(),
          name: "Design System",
          status: "done",
          subFeatures: [
            { id: uid(), name: "Color Tokens", status: "done" },
            { id: uid(), name: "Typography", status: "done" },
          ],
        },
        {
          id: uid(),
          name: "Component Library",
          status: "active",
          subFeatures: [
            { id: uid(), name: "Buttons", status: "done" },
            { id: uid(), name: "Form Inputs", status: "active" },
          ],
        },
      ],
    },
    {
      id: uid(),
      name: "Frontend",
      status: "active",
      features: [
        {
          id: uid(),
          name: "Homepage Development",
          status: "active",
          subFeatures: [
            { id: uid(), name: "Hero Section", status: "done" },
            { id: uid(), name: "Navbar", status: "active" },
            { id: uid(), name: "Footer", status: "todo" },
          ],
        },
        { id: uid(), name: "Auth Flow", status: "todo", subFeatures: [] },
        { id: uid(), name: "Dashboard Shell", status: "blocked", subFeatures: [] },
      ],
    },
    {
      id: uid(),
      name: "Backend",
      status: "todo",
      features: [
        { id: uid(), name: "API Gateway", status: "todo", subFeatures: [] },
      ],
    },
  ],
  p2: [],
  p3: [],
};

/* ================================== PAGE ================================== */
const TaskManagement = () => {
  const [projectId, setProjectId] = useState<string>("p1");
  const [data, setData] = useState<Record<string, Area[]>>(INITIAL);
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<
    | { type: "area" }
    | { type: "feature" }
    | { type: "sub"; featureId: string }
    | null
  >(null);
  const [draft, setDraft] = useState("");

  const areas = data[projectId] ?? [];

  // Auto-select first area
  useEffect(() => {
    if (!activeAreaId && areas.length > 0) setActiveAreaId(areas[0].id);
    if (activeAreaId && !areas.find((a) => a.id === activeAreaId)) {
      setActiveAreaId(areas[0]?.id ?? null);
    }
  }, [areas, activeAreaId]);

  const activeArea = areas.find((a) => a.id === activeAreaId) ?? null;

  /* ------------------------------ Mutations ------------------------------ */
  const patchAreas = (fn: (a: Area[]) => Area[]) =>
    setData((prev) => ({ ...prev, [projectId]: fn(prev[projectId] ?? []) }));

  const setAreaStatus = (id: string, s: Status) =>
    patchAreas((list) => list.map((a) => (a.id === id ? { ...a, status: s } : a)));

  const setFeatureStatus = (areaId: string, fid: string, s: Status) =>
    patchAreas((list) =>
      list.map((a) =>
        a.id === areaId
          ? {
              ...a,
              features: a.features.map((f) =>
                f.id === fid ? { ...f, status: s } : f
              ),
            }
          : a
      )
    );

  const setSubStatus = (
    areaId: string,
    fid: string,
    sid: string,
    s: Status
  ) =>
    patchAreas((list) =>
      list.map((a) =>
        a.id === areaId
          ? {
              ...a,
              features: a.features.map((f) =>
                f.id === fid
                  ? {
                      ...f,
                      subFeatures: f.subFeatures.map((x) =>
                        x.id === sid ? { ...x, status: s } : x
                      ),
                    }
                  : f
              ),
            }
          : a
      )
    );

  const removeArea = (id: string) => patchAreas((l) => l.filter((a) => a.id !== id));
  const removeFeature = (areaId: string, fid: string) =>
    patchAreas((l) =>
      l.map((a) =>
        a.id === areaId ? { ...a, features: a.features.filter((f) => f.id !== fid) } : a
      )
    );
  const removeSub = (areaId: string, fid: string, sid: string) =>
    patchAreas((l) =>
      l.map((a) =>
        a.id === areaId
          ? {
              ...a,
              features: a.features.map((f) =>
                f.id === fid
                  ? { ...f, subFeatures: f.subFeatures.filter((x) => x.id !== sid) }
                  : f
              ),
            }
          : a
      )
    );

  /* ------------------------------- Add flow ------------------------------ */
  const commitAdd = () => {
    const name = draft.trim();
    if (!name || !adding) return;
    if (adding.type === "area") {
      const a: Area = { id: uid(), name, status: "todo", features: [] };
      patchAreas((l) => [...l, a]);
      setActiveAreaId(a.id);
    } else if (adding.type === "feature" && activeAreaId) {
      patchAreas((l) =>
        l.map((a) =>
          a.id === activeAreaId
            ? {
                ...a,
                features: [
                  ...a.features,
                  { id: uid(), name, status: "todo", subFeatures: [] },
                ],
              }
            : a
        )
      );
    } else if (adding.type === "sub") {
      patchAreas((l) =>
        l.map((a) =>
          a.id === activeAreaId
            ? {
                ...a,
                features: a.features.map((f) =>
                  f.id === adding.featureId
                    ? {
                        ...f,
                        subFeatures: [
                          ...f.subFeatures,
                          { id: uid(), name, status: "todo" },
                        ],
                      }
                    : f
                ),
              }
            : a
        )
      );
    }
    setDraft("");
    setAdding(null);
  };

  /* -------------------------------- Stats -------------------------------- */
  const stats = useMemo(() => {
    let feat = 0,
      sub = 0,
      done = 0,
      active = 0,
      blocked = 0,
      total = 0;
    areas.forEach((a) => {
      total++;
      if (a.status === "done") done++;
      if (a.status === "active") active++;
      if (a.status === "blocked") blocked++;
      a.features.forEach((f) => {
        feat++;
        total++;
        if (f.status === "done") done++;
        if (f.status === "active") active++;
        if (f.status === "blocked") blocked++;
        f.subFeatures.forEach((s) => {
          sub++;
          total++;
          if (s.status === "done") done++;
          if (s.status === "active") active++;
          if (s.status === "blocked") blocked++;
        });
      });
    });
    return {
      feat,
      sub,
      done,
      active,
      blocked,
      total,
      pct: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [areas]);

  const toggle = (id: string) =>
    setExpanded((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const filtered = useMemo(() => {
    if (!search.trim()) return areas;
    const q = search.toLowerCase();
    return areas.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.features.some(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.subFeatures.some((s) => s.name.toLowerCase().includes(q))
        )
    );
  }, [areas, search]);

  /* ================================== UI ================================== */
  return (
    <div className="flex h-screen bg-white text-secondary-10">
      {/* ============ SIDEBAR ============ */}
      <aside className="flex w-72 flex-col border-r border-neutral-50 bg-[#fafbfc]">
        {/* Project switcher */}
        <div className="border-b border-neutral-50 p-3">
          <div className="relative">
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setActiveAreaId(null);
                setExpanded(new Set());
              }}
              className="w-full appearance-none rounded-md bg-white py-1.5 pl-2 pr-7 text-[13px] font-medium text-secondary-10 outline-none ring-1 ring-neutral-50 focus:ring-primary-10"
            >
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <LuChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-30"
            />
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-neutral-50 p-3">
          <div className="relative">
            <LuSearch
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-30"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-md bg-white py-1.5 pl-7 pr-2 text-[12px] outline-none ring-1 ring-neutral-50 placeholder:text-neutral-30 focus:ring-primary-10"
            />
          </div>
        </div>

        {/* Areas header */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-30">
            Areas
          </span>
          <button
            onClick={() => setAdding({ type: "area" })}
            className="flex h-5 w-5 items-center justify-center rounded text-neutral-30 hover:bg-neutral-50 hover:text-secondary-10"
            title="Add area"
          >
            <LuPlus size={13} />
          </button>
        </div>

        {/* Area tree */}
        <nav className="flex-1 overflow-y-auto px-1.5 pb-3">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-[12px] text-neutral-30">
              {search ? "No matches" : "No areas yet"}
            </p>
          )}

          {filtered.map((area) => {
            const isActive = area.id === activeAreaId;
            const isOpen = expanded.has(area.id);
            const areaDone = area.features.filter((f) => f.status === "done").length;
            const areaTotal = area.features.length;

            return (
              <div key={area.id} className="mb-0.5">
                <div
                  onClick={() => {
                    setActiveAreaId(area.id);
                    if (!isOpen) toggle(area.id);
                  }}
                  className={`group flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] transition ${
                    isActive
                      ? "bg-white shadow-sm ring-1 ring-neutral-50"
                      : "hover:bg-white/60"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(area.id);
                    }}
                    className="flex h-4 w-4 items-center justify-center text-neutral-30"
                  >
                    {isOpen ? (
                      <LuChevronDown size={12} />
                    ) : (
                      <LuChevronRight size={12} />
                    )}
                  </button>

                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS[area.status].dot}`} />

                  <span
                    className={`flex-1 truncate ${
                      isActive ? "font-medium text-secondary-10" : "text-neutral-20"
                    }`}
                  >
                    {area.name}
                  </span>

                  <span className="text-[10px] tabular-nums text-neutral-30">
                    {areaDone}/{areaTotal}
                  </span>
                </div>

                {/* Features in sidebar */}
                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-neutral-50 pl-2">
                    {area.features.map((f) => {
                      const fOpen = expanded.has(f.id);
                      return (
                        <div key={f.id}>
                          <div
                            onClick={() => toggle(f.id)}
                            className="group flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-[12px] text-neutral-20 hover:bg-white/60"
                          >
                            <span
                              className={`h-1 w-1 shrink-0 rounded-full ${STATUS[f.status].dot}`}
                            />
                            <span className="flex-1 truncate">{f.name}</span>
                            {f.subFeatures.length > 0 && (
                              <LuChevronRight
                                size={11}
                                className={`text-neutral-30 transition ${
                                  fOpen ? "rotate-90" : ""
                                }`}
                              />
                            )}
                          </div>

                          {fOpen && f.subFeatures.length > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-neutral-50 pl-2">
                              {f.subFeatures.map((s) => (
                                <div
                                  key={s.id}
                                  className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] text-neutral-30 hover:bg-white/60"
                                >
                                  <span
                                    className={`h-1 w-1 shrink-0 rounded-full ${STATUS[s.status].dot}`}
                                  />
                                  <span className="truncate">{s.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <button
                      onClick={() => {
                        setActiveAreaId(area.id);
                        setAdding({ type: "feature" });
                      }}
                      className="flex w-full items-center gap-1 rounded px-1.5 py-1 text-[11px] text-neutral-30 hover:bg-white/60 hover:text-primary-10"
                    >
                      <LuPlus size={10} /> Feature
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer stats */}
        <div className="border-t border-neutral-50 p-3">
          <div className="flex items-center justify-between text-[11px] text-neutral-30">
            <span>{stats.total} items</span>
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <LuArrowUpRight size={11} />
              {stats.pct}% done
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-50">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main className="flex-1 overflow-y-auto">
        {!activeArea ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <LuFolder size={28} className="mx-auto mb-3 text-neutral-30" />
              <p className="text-[13px] text-neutral-30">
                Select an area from the sidebar
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl px-10 py-8">
            {/* Area header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[12px] text-neutral-30">
                <LuFolder size={12} />
                <span>
                  {PROJECTS.find((p) => p.id === projectId)?.name}
                </span>
                <LuChevronRight size={11} />
                <span className="text-secondary-10">{activeArea.name}</span>
              </div>

              <div className="mt-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-[22px] font-semibold tracking-tight text-secondary-10">
                    {activeArea.name}
                  </h1>
                  <p className="mt-0.5 text-[13px] text-neutral-30">
                    {activeArea.features.length} feature
                    {activeArea.features.length !== 1 && "s"} ·{" "}
                    {activeArea.features.reduce(
                      (n, f) => n + f.subFeatures.length,
                      0
                    )}{" "}
                    sub-features
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusMenu
                    value={activeArea.status}
                    onChange={(s) => setAreaStatus(activeArea.id, s)}
                  />
                  <button
                    onClick={() => {
                      if (confirm(`Delete area "${activeArea.name}"?`))
                        removeArea(activeArea.id);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-30 hover:bg-accent-25/30 hover:text-accent-20"
                  >
                    <LuTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {activeArea.features.length === 0 && (
                <div className="rounded-lg border border-dashed border-neutral-50 py-10 text-center">
                  <p className="text-[13px] text-neutral-30">
                    No features yet
                  </p>
                  <button
                    onClick={() => setAdding({ type: "feature" })}
                    className="mt-3 inline-flex items-center gap-1 rounded-md bg-secondary-10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-secondary-10/90"
                  >
                    <LuPlus size={12} /> Add feature
                  </button>
                </div>
              )}

              {activeArea.features.map((feature) => {
                const fOpen = expanded.has(feature.id);
                const done = feature.subFeatures.filter(
                  (s) => s.status === "done"
                ).length;
                const total = feature.subFeatures.length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);

                return (
                  <div
                    key={feature.id}
                    className="rounded-lg border border-neutral-50 bg-white transition hover:border-neutral-55/40"
                  >
                    {/* Feature row */}
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <button
                        onClick={() => toggle(feature.id)}
                        className="flex h-5 w-5 items-center justify-center rounded text-neutral-30 hover:bg-neutral-50"
                      >
                        {fOpen ? (
                          <LuChevronDown size={14} />
                        ) : (
                          <LuChevronRight size={14} />
                        )}
                      </button>

                      <LuBox size={14} className="shrink-0 text-neutral-30" />

                      <span className="flex-1 truncate text-[13px] font-medium text-secondary-10">
                        {feature.name}
                      </span>

                      {total > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-16 overflow-hidden rounded-full bg-neutral-50">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-[10px] tabular-nums text-neutral-30">
                            {done}/{total}
                          </span>
                        </div>
                      )}

                      <StatusMenu
                        value={feature.status}
                        onChange={(s) =>
                          setFeatureStatus(activeArea.id, feature.id, s)
                        }
                      />

                      <button
                        onClick={() =>
                          setAdding({ type: "sub", featureId: feature.id })
                        }
                        className="flex h-6 w-6 items-center justify-center rounded text-neutral-30 hover:bg-neutral-50 hover:text-primary-10"
                        title="Add sub-feature"
                      >
                        <LuPlus size={13} />
                      </button>

                      <button
                        onClick={() => removeFeature(activeArea.id, feature.id)}
                        className="flex h-6 w-6 items-center justify-center rounded text-neutral-30 hover:bg-accent-25/30 hover:text-accent-20"
                      >
                        <LuTrash2 size={12} />
                      </button>
                    </div>

                    {/* Sub-features */}
                    {fOpen && (
                      <div className="border-t border-neutral-50 bg-[#fafbfc]">
                        {feature.subFeatures.length === 0 ? (
                          <p className="px-12 py-3 text-[12px] text-neutral-30">
                            No sub-features. Staff can add them here.
                          </p>
                        ) : (
                          <div className="divide-y divide-neutral-50">
                            {feature.subFeatures.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-3 px-3 py-2 pl-11"
                              >
                                <LuCornerDownRight
                                  size={12}
                                  className="shrink-0 text-neutral-30"
                                />
                                <span className="flex-1 truncate text-[12.5px] text-neutral-20">
                                  {sub.name}
                                </span>
                                <StatusMenu
                                  value={sub.status}
                                  onChange={(s) =>
                                    setSubStatus(
                                      activeArea.id,
                                      feature.id,
                                      sub.id,
                                      s
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    removeSub(activeArea.id, feature.id, sub.id)
                                  }
                                  className="flex h-6 w-6 items-center justify-center rounded text-neutral-30 hover:bg-accent-25/30 hover:text-accent-20"
                                >
                                  <LuTrash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add feature button */}
            {activeArea.features.length > 0 && (
              <button
                onClick={() => setAdding({ type: "feature" })}
                className="mt-3 flex w-full items-center gap-2 rounded-lg border border-dashed border-neutral-50 px-3 py-2 text-[12px] text-neutral-30 transition hover:border-primary-10 hover:text-primary-10"
              >
                <LuPlus size={13} /> Add feature
              </button>
            )}
          </div>
        )}
      </main>

      {/* ============ INLINE MODAL ============ */}
      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-secondary-10/20 pt-32 backdrop-blur-[2px]"
          onClick={() => {
            setAdding(null);
            setDraft("");
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-xl border border-neutral-50 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-neutral-50 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-30">
                {adding.type === "area"
                  ? "New area"
                  : adding.type === "feature"
                  ? "New feature"
                  : "New sub-feature"}
              </span>
              <button
                onClick={() => {
                  setAdding(null);
                  setDraft("");
                }}
                className="ml-auto flex h-6 w-6 items-center justify-center rounded text-neutral-30 hover:bg-neutral-50"
              >
                <LuX size={14} />
              </button>
            </div>

            <div className="p-4">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitAdd();
                  if (e.key === "Escape") {
                    setAdding(null);
                    setDraft("");
                  }
                }}
                placeholder={
                  adding.type === "area"
                    ? "e.g., Frontend"
                    : adding.type === "feature"
                    ? "e.g., Homepage Development"
                    : "e.g., Hero Section"
                }
                className="w-full rounded-md border border-neutral-50 bg-white px-3 py-2 text-[13px] outline-none focus:border-primary-10"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-30">
                <span>
                  Press <kbd className="rounded border border-neutral-50 bg-neutral-50/40 px-1 font-sans">Enter</kbd> to add
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAdding(null);
                      setDraft("");
                    }}
                    className="rounded px-2 py-1 text-neutral-20 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={commitAdd}
                    disabled={!draft.trim()}
                    className="rounded bg-secondary-10 px-3 py-1 text-white hover:bg-secondary-10/90 disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;