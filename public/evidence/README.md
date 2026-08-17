# Real photographs go here

The before-and-after comparison falls back to a schematic until a real
photograph exists. Drop files here named by Location ID and it uses them
instead — no code change:

    KA-CTD-HSD-0512-before.jpg
    KA-CTD-HSD-0512-after.jpg

Landscape, roughly 3:2, 1200px on the long edge is ample.

## What makes a pair worth showing

**The same camera position.** A before-and-after only proves anything if the
frame did not move. Photograph from a fixed station — a survey peg, a gate post,
a corner of the compound wall — and face the same bearing every time. Record
which station and which bearing; the caption states them.

**A landmark in shot.** A ridge line, a building, a tank bund. It is what lets
a reviewer see the two frames are the same ground rather than take it on trust.

**Ordinary light.** Midday if possible, and the same time of day for both.
A golden-hour "after" against a flat-light "before" flatters the result and a
sceptical reviewer will notice.

**And the honest interval.** A first-year photograph will show small saplings in
bare ground, because that is what year one looks like. The comparison that
convinces is year one against year three or four, when the canopy has closed.


## Switching a pair on

Dropping the two files here is not enough on its own. Set `photographed: true`
on that parcel's `sitePair` as well.

This is declared rather than detected on purpose. Asking the browser whether an
image loaded is a race — the request fails during server render, before React
has attached an error handler, and the frame is left showing a broken glyph
instead of the drawn one. And the caption is not the same either way: with
photographs it states that both frames came from one station, and without them
it must not, because that would be a claim about pictures nobody has taken.
