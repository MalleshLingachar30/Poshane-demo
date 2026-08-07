# Poshane — Command & Control Center (demonstration build)

A five-screen demonstration prototype for presentation to KSLSA and IAFT.
Next.js App Router, no database, no external services. All data is seeded in
`lib/data.ts` and is illustrative only.

## Run

```
npm install
npm run dev
```

Deploy to Vercel with no configuration — there are no environment variables.

## The five screens, in demo order

| Order | Route | What it proves |
|---|---|---|
| 1 | `/` then `/p/[id]` | Tag scan opens the public record. No login, no app. |
| 2 | `/console` | Scope. Switch between RFO, DFO and state command and watch parcels appear and disappear. |
| 3 | `/console/submit` | The approval gate. Overlap is blocked; adjacency is tolerated. |
| 4 | `/console/p/KA-CTD-HSD-0431` | A failing parcel with an overdue rectification, escalated. |
| 5 | `/console/state` | Aggregate view, drill to any parcel. |

`/tags` prints an A4 sheet of QR codes, one per parcel, three to a row. Each
resolves to that parcel's public record at the current origin, so the sheet
works locally and on Vercel without configuration. Print it, cut the cards, and
place one on a potted sapling for the room to scan.

## QR versus NFC

Both media resolve to the same URL, so the public disclosure path is identical
either way. They are not equivalent for field capture. An NFC 424 DNA tap
produces a fresh cryptographic signature per tap, which proves the device was
physically at the tag. A printed QR can be photographed and scanned from
anywhere, so it proves nothing about presence. Where the specification gates
capture on a tag tap — the audit application in particular — QR alone weakens
that guarantee and needs compensating controls (GPS fix, server timestamp,
in-app camera only).

## Language

The English / ಕನ್ನಡ toggle sits in the header and is live on every screen.
Flip it mid-review rather than choosing before you begin.

**The Kannada strings need native proofreading before this is shown.** They are
drafted, not verified, and government terminology in particular should be
checked against departmental usage. All strings are in `lib/i18n.ts`, plus the
`*Kn` fields in `lib/data.ts`.

## What is deliberately not real

- No PostGIS. The overlap percentages on `/console/submit` are fixed values
  chosen to match the worked example, not computed.
- No satellite imagery. The map panel is a schematic polygon.
- Scope filtering runs client-side. In production it is enforced at the data
  layer, as stated in §9 of the architecture specification.

## Integration notes

- Path alias `@/*` maps to the project root.
- Language and role live in one client context, `components/DemoContext.tsx`.
  Replace it with the real session and the pages need no other change.
- `lib/data.ts` is the single seam. Swap `scopedParcels()` and `getParcel()`
  for scoped queries and the screens work unchanged.
