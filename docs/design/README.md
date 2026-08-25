# PinTrip Design Documentation

This folder contains the design handoff generated from Claude Design.

## Structure

### claude-design-export

Original export from Claude Design.

Contains:
- Screen mockups
- Component tree
- Layout specifications
- React / Next.js implementation notes
- Asset usage instructions

Use these files as visual and implementation reference.

---

### design-system

Source of truth for UI styling.

Contains:
- Color tokens
- Typography
- Spacing
- Effects
- CSS variables

Implementation should follow these tokens instead of hardcoded values.

---

## Development Flow

1. Read design-system first.
2. Check corresponding screen specification.
3. Use assets from public folder.
4. Implement components following React notes.