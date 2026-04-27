# html2canvas clip-path and tile provider gotchas

**Date**: 2026-04-27
**Source**: EcoStove dashboard map export debugging
**Tags**: html2canvas, css, svg, leaflet, map-tiles, cors, export

## Pattern

When building UIs that will be exported to image via html2canvas:

1. **CSS clip-path is NOT supported** by html2canvas. Shapes using clip-path (like triangles) silently degrade to rectangles in the exported image. Use **SVG polygon** instead.

2. **OSM tiles work with html2canvas** when using useCORS: true. No need for alternative tile providers like CARTO Voyager for CORS safety.

3. **Test assumptions about compatibility**. Choosing a safe alternative without testing the original is still introducing a bug.

## Applied Fix

- Triangle markers: clip-path polygon changed to SVG polygon
- Legend triangles: same SVG approach
- Map tiles: CARTO Voyager changed back to OSM

## General Rule

For any canvas-based export, verify every CSS property against the library known limitations. SVG is the safest fallback for custom shapes.
