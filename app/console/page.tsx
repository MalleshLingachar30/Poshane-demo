"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { scopedParcels, byAttention, type Status } from "@/lib/data";

const LIMIT = 20;

export default function Console() {
  const { lang, role } = useDemo();
  const en = lang === "en";

  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [status, setStatus] = useState("");

  const scope = useMemo(() => scopedParcels(role), [role]);

  const districts = useMemo(() => {
    const m = new Map<string, string>();
    scope.forEach((p) => m.set(p.district, p.districtKn));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [scope]);

  const taluks = useMemo(() => {
    const m = new Map<string, string>();
    scope
      .filter((p) => !district || p.district === district)
      .forEach((p) => m.set(p.taluk, p.talukKn));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [scope, district]);

  const filtered = useMemo(
    () =>
      byAttention(
        scope.filter(
          (p) =>
            (!district || p.district === district) &&
            (!taluk || p.taluk === taluk) &&
            (!status || p.status === (status as Status)),
        ),
      ),
    [scope, district, taluk, status],
  );

  const list = filtered.slice(0, LIMIT);
  const dirty = district || taluk || status;

  return (
    <main>
      <h1 className="page">{tr("console", lang)}</h1>
      <p className="lede">
        {tr(
          role.level === "taluk"
            ? "scopeNoteTaluk"
            : role.level === "district"
              ? "scopeNoteDistrict"
              : "scopeNoteState",
          lang,
        )}
      </p>

      <div className="scope-box">
        <div className="who">{en ? role.titleEn : role.titleKn}</div>
        <div style={{ marginTop: 4 }}>
          {tr("visibleScope", lang)}: <strong>{en ? role.scopeEn : role.scopeKn}</strong>{" "}
          — {scope.length} {tr("parcelsVisible", lang)}
        </div>
      </div>

      <div className="filters">
        {role.level === "state" && (
          <label>
            <span>{tr("filterDistrict", lang)}</span>
            <select
              className="role"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setTaluk("");
              }}
            >
              <option value="">{tr("allDistricts", lang)}</option>
              {districts.map(([name, kn]) => (
                <option key={name} value={name}>
                  {en ? name : kn}
                </option>
              ))}
            </select>
          </label>
        )}

        {role.level !== "taluk" && (
          <label>
            <span>{tr("filterTaluk", lang)}</span>
            <select className="role" value={taluk} onChange={(e) => setTaluk(e.target.value)}>
              <option value="">{tr("allTaluks", lang)}</option>
              {taluks.map(([name, kn]) => (
                <option key={name} value={name}>
                  {en ? name : kn}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          <span>{tr("filterStatus", lang)}</span>
          <select className="role" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{tr("allStatuses", lang)}</option>
            <option value="rectification">{tr("statusRectification", lang)}</option>
            <option value="flagged">{tr("statusFlagged", lang)}</option>
            <option value="active">{tr("statusActive", lang)}</option>
          </select>
        </label>

        {dirty && (
          <button
            className="ev-toggle"
            onClick={() => {
              setDistrict("");
              setTaluk("");
              setStatus("");
            }}
          >
            {tr("clearFilters", lang)}
          </button>
        )}

        {dirty && (
          <span className="filter-count">
            {filtered.length} {tr("matching", lang)}
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <p className="note" style={{ borderTop: 0 }}>
          {tr("noMatches", lang)}
        </p>
      ) : (
        <div className="rows">
          {list.map((p) => (
            <Link key={p.id} href={`/console/p/${p.id}`} className="row">
              <div className="grow">
                <div className="mono">{p.id}</div>
                <div className="t">
                  {en
                    ? `${p.taluk} ${tr("taluk", lang)}, ${p.district}`
                    : `${p.talukKn} ${tr("taluk", lang)}, ${p.districtKn}`}
                </div>
                <div className="s">
                  {p.areaHa.toFixed(2)} {tr("ha", lang)} · {tr("countedOn", lang)}{" "}
                  {p.survivalCountedOn}
                </div>
              </div>
              <div className={`num ${p.survival < 75 ? "low" : ""}`}>{p.survival}%</div>
              <span className={`pill ${p.status}`}>
                {p.status === "active"
                  ? tr("statusActive", lang)
                  : p.status === "flagged"
                    ? tr("statusFlagged", lang)
                    : tr("statusRectification", lang)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {filtered.length > list.length && (
        <p className="note">
          {tr("showingTop", lang)} {list.length} / {filtered.length} ·{" "}
          {tr("sortedByAttention", lang)}
        </p>
      )}
    </main>
  );
}
