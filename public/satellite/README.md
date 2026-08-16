# Satellite pair — how to export the two frames

Two files go here. Until they exist the page shows a labelled placeholder, which
is the correct state — better an empty frame than borrowed imagery.

    plot-2024.jpg     the scene nearest to mid-2024, before planting
    plot-2026.jpg     the scene nearest to August 2026

## Source

Copernicus Browser — https://browser.dataspace.copernicus.eu — free, no key,
and the licence survives a government deployment. Sentinel-2 L2A.

Do **not** screenshot Google Earth. The terms do not permit redistribution in a
public-sector portal, and someone will eventually ask where the imagery came from.

Bhuvan (ISRO/NRSC) is a good alternative if you want an Indian source in the
room. Same rules apply: record the true acquisition date.

## Steps

1. Search the location `13.4966, 76.1361`.
2. Zoom so the visible area is roughly 1 km across. Tighter than that and the
   plot has no context; wider and it disappears.
3. **Use the same season for both frames — March 2024 against March 2026.**
   This is not a preference. The catalogue holds no usable scene over this plot
   in any monsoon month across three years: June to September is 73 passes and
   zero clear images. February and March run near 100% clear. So the before
   frame comes from the dry season preceding planting, and the after frame from
   the same months two years later. Comparing a monsoon scene against a dry one
   shows rainfall, not trees.
4. Layer: True Colour for something a non-specialist can read. NDVI is more
   informative but needs explaining; use True Colour unless you plan to explain it.
5. Download as JPEG or PNG at the highest offered resolution.
6. **Write down two things from the export dialogue: the acquisition date and
   the scene cloud cover.** These are not optional — the acquisition date is
   what makes the frame evidence rather than decoration.

## Then fill in `lib/satellite.ts`

For each frame set:

- `present: true` — **required.** Until this is set the frame stays a
  placeholder, whatever files are in this folder. Deliberate: the panel should
  never depend on the browser noticing a missing file.
- `acquiredEn` / `acquiredKn` — the scene's own acquisition date. **Not the
  ground photograph's date.** They will differ, and that is honest.
- `cloudPct` — the reported cloud cover.
- `bounds` — the north/south/east/west of the exported crop, shown in the
  browser's download panel.

Given `bounds`, the component computes the plot outline from the real capture
coordinates recorded on the ground. Leave `bounds` out and no outline is drawn —
which is the right behaviour, because a box placed by guesswork on imagery
presented as proof is exactly the sort of thing this page argues against.

## A note on what to expect

The plot is about 140 m across. At 10 m per pixel that is fourteen pixels. You
will see a change in colour and texture across the block between the two dates,
not rows of trees. Say so plainly when presenting — the imagery corroborates a
land-use change over years; it does not count trees. Counting is what the tag
tap and the ground photograph are for.
