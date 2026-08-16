import type { Pass } from "./satellite";
import data from "./passes-data.json";

/**
 * Sentinel-2 passes over the plot, from the Copernicus catalogue.
 *
 * The list is read from lib/passes-data.json, which is written by
 * scripts/fetch-passes.mjs — a real query against the European Space Agency's
 * catalogue, run on demand and committed.
 *
 * It is worth being exact about why, because the distinction matters when
 * someone asks. The catalogue takes fifteen to thirty seconds to answer a
 * geographic query over a two-year window. That is tolerable at a terminal and
 * intolerable inside a page render, and attempts to make it fit inside one hit
 * timeouts. So the query is real and the data is theirs; only the moment of
 * asking moved. The file records when it was asked, and that date is shown on
 * the page rather than implied.
 *
 * Do not describe this to anyone as a live connection. It is an exported
 * result, refreshed by running the script.
 */

export type PassResult =
  | { ok: true; passes: Pass[]; queriedAt: string }
  | { ok: false; error: string };

export function getPasses(): PassResult {
  const passes = (data.passes ?? []) as Pass[];
  if (!passes.length) {
    return { ok: false, error: "no passes in the exported catalogue data" };
  }
  return { ok: true, passes, queriedAt: data.queriedAt };
}
