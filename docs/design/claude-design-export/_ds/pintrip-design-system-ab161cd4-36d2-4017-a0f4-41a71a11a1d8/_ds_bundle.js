/* @ds-bundle: {"format":4,"namespace":"PinTripDesignSystem_ab161c","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"FabButton","sourcePath":"components/buttons/FabButton.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"BatchAddPanel","sourcePath":"components/cards/BatchAddPanel.jsx"},{"name":"NoteCard","sourcePath":"components/cards/NoteCard.jsx"},{"name":"PlaceResultCard","sourcePath":"components/cards/PlaceResultCard.jsx"},{"name":"StartTripCard","sourcePath":"components/cards/StartTripCard.jsx"},{"name":"TripCard","sourcePath":"components/cards/TripCard.jsx"},{"name":"AnalyzeStatus","sourcePath":"components/display/AnalyzeStatus.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"CategoryBadge","sourcePath":"components/display/CategoryBadge.jsx"},{"name":"CategoryIcon","sourcePath":"components/display/CategoryIcon.jsx"},{"name":"LocationLine","sourcePath":"components/display/LocationLine.jsx"},{"name":"ScreenTitle","sourcePath":"components/display/ScreenTitle.jsx"},{"name":"SectionHeader","sourcePath":"components/display/SectionHeader.jsx"},{"name":"Sticker","sourcePath":"components/display/Sticker.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Wordmark","sourcePath":"components/display/Wordmark.jsx"},{"name":"LinkInput","sourcePath":"components/forms/LinkInput.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"877b785445a5","components/buttons/FabButton.jsx":"48b15945c84c","components/buttons/IconButton.jsx":"b6c3a311f7be","components/cards/BatchAddPanel.jsx":"ad6af18cb5b0","components/cards/NoteCard.jsx":"6583e1637639","components/cards/PlaceResultCard.jsx":"3887ace09e8b","components/cards/StartTripCard.jsx":"b1f66104ce08","components/cards/TripCard.jsx":"1c7f69c63ef8","components/display/AnalyzeStatus.jsx":"c405c9d21869","components/display/Avatar.jsx":"72edbd5a57d6","components/display/CategoryBadge.jsx":"d8cd273e42ba","components/display/CategoryIcon.jsx":"020699fb7960","components/display/LocationLine.jsx":"cfa10a6220f0","components/display/ScreenTitle.jsx":"4dd8abdf5e02","components/display/SectionHeader.jsx":"aa1eda762835","components/display/Sticker.jsx":"11a8480eadae","components/display/Tag.jsx":"d4f9ee62b6e0","components/display/Wordmark.jsx":"70c3d802e80b","components/forms/LinkInput.jsx":"aa68263f0533","components/navigation/AppHeader.jsx":"7749c44fd3ed","components/navigation/BottomNav.jsx":"564dd47a632b","ui_kits/pintrip-app/HomeScreen.jsx":"df73e9554b8c","ui_kits/pintrip-app/ImportScreen.jsx":"83cdb9eab14c","ui_kits/pintrip-app/ImportsScreen.jsx":"e55c44f4c0cf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PinTripDesignSystem_ab161c = window.PinTripDesignSystem_ab161c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 44,
    fs: 13,
    px: 10,
    r: 'var(--r-sm)',
    gap: 5
  },
  md: {
    h: 48,
    fs: 15,
    px: 20,
    r: 'var(--r-md)',
    gap: 8
  },
  lg: {
    h: 54,
    fs: 17,
    px: 24,
    r: 'var(--r-md)',
    gap: 10
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--blue-500)',
    color: '#fff',
    border: '1.5px solid var(--blue-500)',
    boxShadow: '0 4px 12px rgba(60,95,160,0.20)'
  },
  action: {
    background: 'var(--coral-500)',
    color: '#fff',
    border: '1.5px solid var(--coral-500)',
    boxShadow: 'var(--shadow-cta)'
  },
  solid: {
    background: 'var(--blue-600)',
    color: '#fff',
    border: '1.5px solid var(--blue-600)',
    boxShadow: '0 2px 6px rgba(60,95,160,0.16)'
  },
  outline: {
    background: 'var(--paper)',
    color: 'var(--blue-600)',
    border: '1.5px solid var(--blue-400)',
    boxShadow: 'none'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--blue-600)',
    border: '1.5px solid transparent',
    boxShadow: 'none'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconSrc,
  icon,
  disabled = false,
  onClick,
  ariaLabel,
  ariaDescribedby,
  children,
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      width: fullWidth ? '100%' : 'auto',
      minHeight: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: s.r,
      fontFamily: 'var(--font-ui)',
      fontWeight: 'var(--w-bold)',
      fontSize: s.fs,
      letterSpacing: 'var(--ls-normal)',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'transform var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
      transform: pressed ? 'scale(var(--press-scale))' : 'none',
      filter: pressed ? 'brightness(0.96)' : 'none',
      opacity: disabled ? 0.45 : 1,
      ...v,
      ...style
    }
  }, iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: "",
    style: {
      height: s.fs + 4,
      width: 'auto',
      display: 'block'
    }
  }) : icon, /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/FabButton.jsx
try { (() => {
function FabButton({
  onClick,
  size = 60,
  label = 'Add',
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--r-pill)',
      background: 'var(--blue-500)',
      border: '5px solid var(--paper-nav)',
      boxShadow: 'var(--shadow-fab)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      transition: 'transform var(--dur-base) var(--ease-spring)',
      transform: pressed ? 'scale(0.94)' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: size * 0.4,
      height: 2.5,
      background: '#fff',
      borderRadius: 2,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 2.5,
      height: size * 0.4,
      marginLeft: -1.25,
      marginTop: -(size * 0.2),
      background: '#fff',
      borderRadius: 2
    }
  })));
}
Object.assign(__ds_scope, { FabButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/FabButton.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function IconButton({
  iconSrc,
  glyph,
  size = 40,
  variant = 'paper',
  onClick,
  label,
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  const skins = {
    paper: {
      background: 'var(--paper)',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid rgba(122,96,58,0.06)'
    },
    flat: {
      background: 'transparent',
      boxShadow: 'none',
      border: '1.5px solid transparent'
    },
    tint: {
      background: 'var(--blue-100)',
      boxShadow: 'none',
      border: '1.5px solid transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--r-pill)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--ink-500)',
      fontFamily: 'var(--font-ui)',
      fontSize: size * 0.45,
      lineHeight: 1,
      transition: 'transform var(--dur-fast) var(--ease-soft)',
      transform: pressed ? 'scale(var(--press-scale))' : 'none',
      ...skins[variant],
      ...style
    }
  }, iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: "",
    style: {
      width: size * 0.45,
      height: 'auto',
      display: 'block'
    }
  }) : glyph);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/cards/BatchAddPanel.jsx
try { (() => {
function BatchAddPanel({
  title,
  subtitle,
  luggageSrc,
  sparkleSrc,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 14px',
      background: 'var(--cream-50)',
      border: '1.5px dashed var(--cream-300)',
      borderRadius: 'var(--r-lg)',
      ...style
    }
  }, luggageSrc && /*#__PURE__*/React.createElement("img", {
    src: luggageSrc,
    alt: "",
    style: {
      width: 52,
      height: 'auto',
      flexShrink: 0,
      transform: 'rotate(-4deg)',
      filter: 'drop-shadow(0 2px 4px rgba(122,96,58,0.16))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-kr)',
      fontSize: 'var(--type-body)',
      fontWeight: 'var(--w-bold)',
      color: 'var(--blue-700)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0',
      fontFamily: 'var(--font-kr)',
      fontSize: 11.5,
      color: 'var(--ink-400)'
    }
  }, subtitle)), sparkleSrc && /*#__PURE__*/React.createElement("img", {
    src: sparkleSrc,
    alt: "",
    style: {
      width: 34,
      height: 'auto',
      flexShrink: 0,
      mixBlendMode: 'multiply'
    }
  }));
}
Object.assign(__ds_scope, { BatchAddPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/BatchAddPanel.jsx", error: String((e && e.message) || e) }); }

// components/cards/NoteCard.jsx
try { (() => {
function NoteCard({
  children,
  rotate = -2,
  tapeColor = 'var(--tape-blush)',
  width = 118,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      padding: '14px 12px',
      background: 'var(--cream-50)',
      transform: 'rotate(' + rotate + 'deg)',
      boxShadow: '0 2px 6px rgba(122,96,58,0.13)',
      maskImage: 'radial-gradient(circle at 4px 4px, transparent 0 3px, #000 3.2px) 0 0/8px 8px',
      WebkitMaskImage: 'radial-gradient(circle at 4px 4px, transparent 0 3px, #000 3.2px) 0 0/8px 8px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: -8,
      top: -9,
      width: 44,
      height: 17,
      background: tapeColor,
      opacity: 0.9,
      transform: 'rotate(-18deg)',
      boxShadow: '0 1px 2px rgba(122,96,58,0.12)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 12.5,
      color: 'var(--blue-700)',
      lineHeight: 1.5,
      textAlign: 'center'
    }
  }, children));
}
Object.assign(__ds_scope, { NoteCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/NoteCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StartTripCard.jsx
try { (() => {
function StartTripCard({
  title = 'Start New Trip',
  description,
  mapSrc,
  onClick,
  tape,
  style
}) {
  const [pressed, setPressed] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      position: 'relative',
      padding: '20px 15px',
      background: 'var(--surface-panel)',
      border: 'var(--border-dash)',
      borderRadius: 'var(--r-lg)',
      cursor: 'pointer',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingLeft: 120,
      transition: 'transform var(--dur-fast) var(--ease-soft)',
      transform: pressed ? 'scale(0.99)' : 'none',
      ...style
    }
  }, mapSrc && /*#__PURE__*/React.createElement("img", {
    src: mapSrc,
    alt: "",
    style: {
      position: 'absolute',
      left: 6,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 126,
      opacity: 0.9,
      mixBlendMode: 'multiply',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      textAlign: 'left',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 'var(--w-bold)',
      color: 'var(--blue-700)',
      lineHeight: 1.15
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '7px 0 0',
      fontFamily: 'var(--font-ui)',
      fontSize: 12.5,
      fontWeight: 'var(--w-medium)',
      color: 'var(--ink-500)',
      lineHeight: 1.45
    }
  }, description)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 42,
      height: 42,
      flexShrink: 0,
      borderRadius: 'var(--r-pill)',
      background: 'var(--blue-500)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
      boxShadow: '0 4px 10px rgba(60,95,160,0.26)'
    }
  }, "\u2192"), tape);
}
Object.assign(__ds_scope, { StartTripCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StartTripCard.jsx", error: String((e && e.message) || e) }); }

// components/display/AnalyzeStatus.jsx
try { (() => {
function AnalyzeStatus({
  iconSrc,
  text,
  emphasis,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: "",
    style: {
      width: 20,
      height: 20,
      display: 'block',
      flexShrink: 0
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--r-pill)',
      background: 'var(--blue-500)',
      color: '#fff',
      fontSize: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-kr)',
      fontSize: 'var(--type-body)',
      color: 'var(--ink-500)'
    }
  }, text, emphasis && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      fontWeight: 'var(--w-bold)',
      color: 'var(--ink-700)',
      borderBottom: '2px solid var(--blue-200)',
      paddingBottom: 1
    }
  }, emphasis)));
}
Object.assign(__ds_scope, { AnalyzeStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/AnalyzeStatus.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function Avatar({
  src,
  size = 52,
  alt = '',
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: 'var(--r-pill)',
      overflow: 'hidden',
      background: 'var(--cream-200)',
      border: '2.5px solid var(--paper)',
      boxShadow: 'var(--shadow-card)',
      cursor: onClick ? 'pointer' : 'default',
      flexShrink: 0,
      ...style
    }
  }, src && /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/CategoryBadge.jsx
try { (() => {
const KINDS = {
  cafe: {
    bg: 'var(--coral-400)',
    fg: '#fff'
  },
  food: {
    bg: 'var(--butter-400)',
    fg: '#fff'
  },
  attraction: {
    bg: 'var(--lavender-400)',
    fg: '#fff'
  },
  stay: {
    bg: 'var(--blue-400)',
    fg: '#fff'
  },
  shop: {
    bg: 'var(--lavender-500)',
    fg: '#fff'
  }
};
function CategoryBadge({
  kind = 'cafe',
  label,
  tail = true,
  style
}) {
  const k = KINDS[kind] || KINDS.cafe;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 26,
      padding: '0 13px',
      borderRadius: 'var(--r-pill)',
      background: k.bg,
      color: k.fg,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--type-ui-xs)',
      fontWeight: 'var(--w-bold)',
      boxShadow: '0 2px 5px rgba(122,96,58,0.14)',
      ...style
    }
  }, label || kind, tail && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      bottom: -3,
      width: 9,
      height: 9,
      background: k.bg,
      borderRadius: '2px 0 3px 0',
      transform: 'rotate(30deg) skewX(-8deg)'
    }
  }));
}
Object.assign(__ds_scope, { CategoryBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/CategoryBadge.jsx", error: String((e && e.message) || e) }); }

// components/display/CategoryIcon.jsx
try { (() => {
function CategoryIcon({
  src,
  alt = '',
  size = 30,
  style
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    title: alt,
    style: {
      width: size,
      height: size,
      objectFit: 'contain',
      display: 'block',
      filter: 'drop-shadow(0 1px 2px rgba(122,96,58,0.18))',
      ...style
    }
  });
}
Object.assign(__ds_scope, { CategoryIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/CategoryIcon.jsx", error: String((e && e.message) || e) }); }

// components/display/LocationLine.jsx
try { (() => {
function LocationLine({
  text,
  iconSrc,
  tone = 'coral',
  size = 14,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      ...style
    }
  }, iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: "",
    style: {
      height: size + 3,
      width: 'auto',
      display: 'block',
      flexShrink: 0
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 'var(--r-pill)',
      flexShrink: 0,
      background: tone === 'blue' ? 'var(--blue-500)' : 'var(--coral-400)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-kr)',
      fontSize: size,
      color: 'var(--ink-500)',
      lineHeight: 1.4
    }
  }, text));
}
Object.assign(__ds_scope, { LocationLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/LocationLine.jsx", error: String((e && e.message) || e) }); }

// components/cards/TripCard.jsx
try { (() => {
function TripCard({
  title,
  location,
  note,
  placeCount,
  countLabel = 'places',
  photoSrc,
  pinSrc,
  icons = [],
  onMenu,
  onClick,
  sticker,
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    style: {
      position: 'relative',
      display: 'flex',
      gap: 8,
      padding: '11px 7px 11px 15px',
      background: 'var(--surface-card)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-card)',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 'var(--w-medium)',
      color: 'var(--ink-900)',
      lineHeight: 1.05,
      letterSpacing: 'var(--ls-tight)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Trip options",
    onClick: e => {
      e.stopPropagation();
      onMenu && onMenu();
    },
    style: {
      border: 'none',
      background: 'none',
      padding: '2px 0 0',
      cursor: 'pointer',
      color: 'var(--ink-300)',
      fontSize: 16,
      letterSpacing: '0.1em',
      lineHeight: 1
    }
  }, "\u2022\u2022\u2022")), location && /*#__PURE__*/React.createElement(__ds_scope.LocationLine, {
    text: location,
    iconSrc: pinSrc,
    tone: "coral",
    style: {
      marginTop: 5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--divider-dash)',
      margin: '9px 0 8px'
    }
  }), note && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-kr)',
      fontSize: 13,
      fontWeight: 'var(--w-regular)',
      color: 'var(--ink-400)',
      lineHeight: 'var(--lh-kr)'
    }
  }, note), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12.5,
      color: 'var(--ink-500)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 'var(--w-bold)',
      color: 'var(--blue-600)'
    }
  }, placeCount), " ", countLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, icons.map((ic, i) => /*#__PURE__*/React.createElement(__ds_scope.CategoryIcon, {
    key: i,
    src: ic.src,
    alt: ic.alt,
    size: 27
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 172,
      flexShrink: 0,
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photoSrc,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      minHeight: 161,
      objectFit: 'cover',
      borderRadius: 'var(--r-md)',
      display: 'block'
    }
  }), sticker));
}
Object.assign(__ds_scope, { TripCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TripCard.jsx", error: String((e && e.message) || e) }); }

// components/display/ScreenTitle.jsx
try { (() => {
function ScreenTitle({
  title,
  subtitle,
  highlight = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      position: 'relative',
      display: 'inline-block',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--type-screen-title)',
      fontWeight: 'var(--w-bold)',
      color: 'var(--ink-700)',
      lineHeight: 'var(--lh-tight)'
    }
  }, highlight && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: -4,
      right: -4,
      bottom: 1,
      height: '0.4em',
      background: 'rgba(244,206,109,0.8)',
      borderRadius: 'var(--r-pill)',
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, title)), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontFamily: 'var(--font-kr)',
      fontSize: 'var(--type-body)',
      fontWeight: 'var(--w-regular)',
      color: 'var(--ink-400)',
      lineHeight: 'var(--lh-kr)'
    }
  }, subtitle));
}
Object.assign(__ds_scope, { ScreenTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ScreenTitle.jsx", error: String((e && e.message) || e) }); }

// components/display/SectionHeader.jsx
try { (() => {
function SectionHeader({
  title,
  action,
  onAction,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-display-sm)',
      fontWeight: 'var(--w-medium)',
      color: 'var(--ink-900)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      border: 'none',
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--type-ui-sm)',
      fontWeight: 'var(--w-semibold)',
      color: 'var(--blue-600)'
    }
  }, action, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1
    }
  }, "\u203A")));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/display/Sticker.jsx
try { (() => {
const PATTERNS = {
  solid: c => ({
    background: c
  }),
  gingham: c => ({
    background: 'repeating-linear-gradient(0deg,' + c + ' 0 5px,transparent 5px 10px),repeating-linear-gradient(90deg,' + c + ' 0 5px,transparent 5px 10px),rgba(255,255,255,0.55)'
  }),
  dots: c => ({
    background: 'radial-gradient(circle at 4px 4px, rgba(255,255,255,0.75) 1.4px, transparent 1.6px) 0 0/8px 8px,' + c
  })
};
function Sticker({
  type = 'tape',
  pattern = 'solid',
  color = 'var(--tape-butter)',
  src,
  alt = '',
  rotate = -4,
  width,
  height,
  position,
  style,
  children
}) {
  const pos = position ? {
    position: 'absolute',
    ...position
  } : {};
  if (type === 'image') {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: alt,
      style: {
        width: width || 'auto',
        height: height || 'auto',
        display: 'block',
        transform: 'rotate(' + rotate + 'deg)',
        filter: 'drop-shadow(0 2px 4px rgba(122,96,58,0.16))',
        ...pos,
        ...style
      }
    });
  }
  const skin = (PATTERNS[pattern] || PATTERNS.solid)(color);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: width || 64,
      height: height || 20,
      opacity: 0.92,
      transform: 'rotate(' + rotate + 'deg)',
      boxShadow: '0 1px 3px rgba(122,96,58,0.12)',
      maskImage: 'linear-gradient(90deg,transparent 0,#000 3px,#000 calc(100% - 3px),transparent 100%)',
      ...skin,
      ...pos,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Sticker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Sticker.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
const TONES = {
  blue: {
    bg: 'var(--blue-100)',
    fg: '#6785C1'
  },
  butter: {
    bg: 'var(--butter-100)',
    fg: 'var(--butter-ink)'
  },
  lavender: {
    bg: 'var(--lavender-100)',
    fg: 'var(--lavender-ink)'
  }
};
function Tag({
  tone = 'blue',
  children,
  style
}) {
  const t = TONES[tone] || TONES.blue;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 23,
      padding: '0 7px',
      borderRadius: 'var(--r-pill)',
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-kr)',
      fontSize: 11.5,
      fontWeight: 'var(--w-medium)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/cards/PlaceResultCard.jsx
try { (() => {
const TAG_TONE = {
  cafe: 'blue',
  food: 'butter',
  attraction: 'lavender',
  stay: 'blue',
  shop: 'lavender'
};
function PlaceResultCard({
  photoSrc,
  category = 'cafe',
  categoryLabel,
  name,
  description,
  address,
  tags = [],
  pinSrc,
  editIconSrc,
  markSrc,
  onEdit,
  onAdd,
  added = false,
  editLabel = 'Edit',
  addLabel = 'Add to Trip',
  addedLabel = 'Added',
  showReject = false,
  rejected = false,
  onReject,
  rejectLabel = 'Reject',
  rejectedLabel = 'Rejected',
  matchState = 'matched',
  candidates = [],
  candidatesExpanded = false,
  onToggleCandidates,
  onPickCandidate,
  onResearch,
  chooseLabel,
  unmatchedLabel,
  researchLabel = '重新搜尋',
  confirming = false,
  onConfirmReject,
  onCancelReject,
  confirmLine1,
  confirmLine2,
  confirmCancelLabel = '取消',
  confirmRejectLabel = '拒絕',
  readOnly = false,
  dispositionLabel,
  failed = false,
  failureText,
  failureId,
  failureLabel = '加入失敗',
  adding = false,
  editAriaLabel,
  rejectAriaLabel,
  addAriaLabel,
  onRetry,
  editIconOnly = false,
  tape,
  stamp,
  style
}) {
  const confirmRow = /*#__PURE__*/React.createElement("div", {
    role: "group",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '13px/1.55 var(--font-kr)',
      color: 'var(--ink-400)'
    }
  }, confirmLine1), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '12px/1.55 var(--font-kr)',
      color: 'var(--ink-400)',
      marginTop: 2
    }
  }, confirmLine2), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "solid",
    size: "sm",
    onClick: onCancelReject,
    style: {
      flex: 1.35
    }
  }, confirmCancelLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    onClick: onConfirmReject,
    style: {
      flex: 1
    }
  }, confirmRejectLabel)));
  const dispositionRow = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      minHeight: 44,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1,
      color: added ? 'var(--blue-500)' : 'var(--ink-400)'
    }
  }, added ? '\u2713' : '\u2715'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13.5,
      fontWeight: 'var(--w-bold)',
      color: added ? 'var(--blue-500)' : 'var(--ink-400)'
    }
  }, dispositionLabel));
  const failureBlock = failed ? /*#__PURE__*/React.createElement("div", {
    id: failureId,
    role: "status",
    "aria-live": "polite",
    style: {
      marginTop: 12,
      padding: '10px 12px',
      borderRadius: 12,
      background: 'var(--coral-100)',
      font: '12.5px/1.55 var(--font-kr)',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontWeight: 'var(--w-bold)',
      color: 'var(--coral-600)'
    }
  }, failureLabel), '\u3000', failureText) : null;
  const matchText = matchState === 'matched' ? address : matchState === 'choosing' ? chooseLabel : unmatchedLabel;
  const matchSlot = /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: candidates.length ? 'button' : undefined,
    tabIndex: candidates.length ? 0 : undefined,
    "aria-expanded": candidates.length ? !!candidatesExpanded : undefined,
    onClick: candidates.length ? onToggleCandidates : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
      minHeight: candidates.length ? 44 : 0,
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LocationLine, {
    text: matchText,
    iconSrc: pinSrc,
    tone: "blue",
    size: 12.5,
    style: {
      flex: 1,
      minWidth: 0
    }
  }), candidates.length ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      color: 'var(--ink-400)',
      flexShrink: 0,
      transform: candidatesExpanded ? 'rotate(90deg)' : 'none'
    }
  }, '\u203a') : null));
  const matchExpansion = candidatesExpanded ? /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, candidates.slice(0, 3).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    role: "radio",
    "aria-checked": !!c.selected,
    tabIndex: 0,
    onClick: onPickCandidate ? () => onPickCandidate(c, i) : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 44,
      padding: '6px 10px',
      borderRadius: 12,
      cursor: 'pointer',
      background: c.selected ? 'var(--blue-050)' : 'transparent',
      border: c.selected ? '1.5px solid var(--blue-400)' : '1.5px solid var(--cream-300)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      flexShrink: 0,
      boxSizing: 'border-box',
      border: c.selected ? '4px solid var(--blue-500)' : '1.5px solid var(--cream-300)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 'var(--w-bold)',
      color: 'var(--ink-700)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: '12px/1.5 var(--font-kr)',
      color: 'var(--ink-400)'
    }
  }, c.address)))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    onClick: onResearch,
    style: {
      width: '100%'
    }
  }, researchLabel)) : matchState === 'unmatched' ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    onClick: onResearch,
    style: {
      width: '100%',
      marginTop: 10
    }
  }, researchLabel) : null;
  return /*#__PURE__*/React.createElement("article", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      background: 'var(--surface-card)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 120,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photoSrc,
    alt: name,
    style: {
      width: '100%',
      height: 136,
      objectFit: 'cover',
      display: 'block',
      border: '5px solid #fff',
      borderRadius: 6,
      boxShadow: 'var(--shadow-sticker)'
    }
  }), tape, stamp), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-ui)',
      fontSize: 18.5,
      fontWeight: 'var(--w-bold)',
      color: 'var(--ink-700)',
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.CategoryBadge, {
    kind: category,
    label: categoryLabel,
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  })), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '7px 0 0',
      fontFamily: 'var(--font-kr)',
      fontSize: 'var(--type-body-sm)',
      color: 'var(--ink-500)',
      lineHeight: 'var(--lh-kr)',
      paddingRight: 16
    }
  }, description), matchSlot, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--divider-dash)',
      margin: '11px 0 10px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5
    }
  }, tags.map((t, i) => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: i,
    tone: TAG_TONE[category] || 'blue'
  }, t))))), matchExpansion, failureBlock, confirming ? confirmRow : readOnly ? dispositionRow : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    iconSrc: editIconSrc,
    onClick: onEdit,
    ariaLabel: editAriaLabel,
    disabled: added || rejected,
    style: {
      flex: 1
    }
  }, editLabel), showReject && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    onClick: onReject,
    ariaLabel: rejectAriaLabel,
    disabled: added || rejected,
    style: rejected ? {
      flex: 1,
      background: 'var(--cream-200)',
      color: 'var(--ink-400)',
      border: '1.5px solid var(--cream-300)'
    } : {
      flex: 1
    }
  }, rejected ? rejectedLabel : rejectLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "solid",
    size: "sm",
    onClick: failed && onRetry ? onRetry : onAdd,
    ariaLabel: addAriaLabel,
    ariaDescribedby: failed ? failureId : undefined,
    disabled: added || rejected || adding || matchState !== 'matched',
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 600,
        lineHeight: 1
      }
    }, added ? '✓' : '+'),
    style: adding ? {
      flex: 1.35,
      opacity: 0.4
    } : {
      flex: 1.35
    }
  }, added ? addedLabel : addLabel)), markSrc && /*#__PURE__*/React.createElement("img", {
    src: markSrc,
    alt: "",
    style: {
      position: 'absolute',
      right: 10,
      top: 46,
      width: 20,
      height: 'auto'
    }
  }));
}
Object.assign(__ds_scope, { PlaceResultCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PlaceResultCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Wordmark.jsx
try { (() => {
function Wordmark({
  variant = 'serif',
  src,
  size = 44,
  style
}) {
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "PinTrip",
    style: {
      height: size,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
  const serif = variant === 'serif';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      fontFamily: serif ? 'var(--font-display)' : 'var(--font-script)',
      fontWeight: serif ? 'var(--w-medium)' : 'var(--w-bold)',
      fontSize: size,
      lineHeight: 1,
      color: 'var(--blue-600)',
      letterSpacing: serif ? '-0.01em' : '0',
      ...style
    }
  }, "PinTrip", /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -size * 0.06,
      right: -size * 0.1,
      width: size * 0.16,
      height: size * 0.16,
      borderRadius: 'var(--r-pill) var(--r-pill) 2px var(--r-pill)',
      background: 'var(--coral-400)',
      transform: 'rotate(45deg)'
    }
  }));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/forms/LinkInput.jsx
try { (() => {
function LinkInput({
  value = '',
  placeholder = 'https://www.instagram.com/p/...',
  iconSrc,
  onChange,
  onClear,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 52,
      padding: '0 12px 0 14px',
      background: 'var(--paper)',
      border: '1px solid var(--border-field)',
      borderRadius: 'var(--r-md)',
      boxShadow: 'var(--shadow-inset-field)',
      ...style
    }
  }, iconSrc && /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: "",
    style: {
      width: 24,
      height: 24,
      display: 'block',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      fontWeight: 'var(--w-medium)',
      color: 'var(--ink-700)'
    }
  }), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Clear",
    onClick: onClear,
    style: {
      width: 24,
      height: 24,
      flexShrink: 0,
      borderRadius: 'var(--r-pill)',
      background: '#CFCCC6',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { LinkInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/LinkInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
function AppHeader({
  onBack,
  backIconSrc,
  wordmarkSrc,
  wordmarkVariant = 'script',
  wordmarkSize = 38,
  sticker,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 52,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      display: 'flex',
      justifyContent: 'flex-start'
    }
  }, onBack && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    iconSrc: backIconSrc,
    glyph: "\u2190",
    label: "Back",
    onClick: onBack,
    size: 40
  })), /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    src: wordmarkSrc,
    variant: wordmarkVariant,
    size: wordmarkSize
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, sticker));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
function BottomNav({
  items = [],
  activeId,
  onSelect,
  onAdd,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
      height: 'var(--nav-height)',
      paddingTop: 12,
      background: 'var(--surface-nav)',
      borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
      boxShadow: 'var(--shadow-nav)',
      ...style
    }
  }, items.map(it => {
    const active = it.id === activeId;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      onClick: () => onSelect && onSelect(it.id),
      style: {
        flex: 1,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: 0,
        minHeight: 'var(--tap-min)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: it.iconSrc,
      alt: "",
      style: {
        height: 26,
        width: 'auto',
        display: 'block',
        opacity: active ? 1 : 0.55,
        filter: active ? 'none' : 'grayscale(1)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--type-ui-sm)',
        fontWeight: 'var(--w-bold)',
        color: active ? 'var(--blue-600)' : 'var(--ink-500)'
      }
    }, it.label));
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: -26,
      transform: 'translateX(-50%)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FabButton, {
    onClick: onAdd
  })));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pintrip-app/HomeScreen.jsx
try { (() => {
const A = {
  s: '../../assets/stickers/',
  i: '../../assets/icons/',
  p: '../../assets/photos/'
};
function PhoneFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      background: 'var(--bg-app)',
      borderRadius: 44,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 18px 50px rgba(60,45,25,0.18)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A.i + 'status-bar.png',
    alt: "",
    style: {
      width: '100%',
      height: 28,
      objectFit: 'cover',
      flexShrink: 0,
      marginTop: 8
    }
  }), children);
}
function HomeScreen({
  onOpenImport,
  onTab,
  tab
}) {
  const {
    TripCard,
    StartTripCard,
    NoteCard,
    SectionHeader,
    Avatar,
    Wordmark,
    Sticker,
    BottomNav
  } = window.PinTripDesignSystem_ab161c;
  const trips = [{
    title: 'Tokyo',
    location: 'Japan',
    note: '도쿄의 오래된 감성과 새로운 일상 사이에서.',
    placeCount: 28,
    photo: A.p + 'trip-tokyo.png',
    icons: [{
      src: A.s + 'icon-torii.png',
      alt: 'Shrines'
    }, {
      src: A.s + 'icon-food.png',
      alt: 'Food'
    }, {
      src: A.s + 'icon-train.png',
      alt: 'Rail'
    }]
  }, {
    title: 'Kyoto',
    location: 'Japan',
    note: '천천히 걷고, 깊이 느낀 교토의 사계절.',
    placeCount: 36,
    photo: A.p + 'trip-kyoto.png',
    icons: [{
      src: A.s + 'icon-pagoda.png',
      alt: 'Temples'
    }, {
      src: A.s + 'icon-maple.png',
      alt: 'Autumn'
    }, {
      src: A.s + 'icon-matcha.png',
      alt: 'Tea'
    }]
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      padding: '12px 20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wordmark, {
    src: A.s + 'wordmark-serif.png',
    size: 58
  }), /*#__PURE__*/React.createElement("img", {
    src: A.s + 'tagline-script.png',
    alt: "Pin your best trips. Cherish every place.",
    style: {
      marginTop: 10,
      width: 152,
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 12,
      paddingTop: 6
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: A.p + 'avatar-user.png',
    size: 52
  }), /*#__PURE__*/React.createElement(NoteCard, {
    rotate: -3,
    width: 104,
    style: {
      marginRight: 4
    }
  }, "Collect moments,", /*#__PURE__*/React.createElement("br", null), "not things."))), /*#__PURE__*/React.createElement(SectionHeader, {
    title: "My Trip Collections",
    action: "View all",
    style: {
      marginTop: 26
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 12
    }
  }, trips.map((t, n) => /*#__PURE__*/React.createElement(TripCard, {
    key: t.title,
    title: t.title,
    location: t.location,
    note: t.note,
    placeCount: t.placeCount,
    photoSrc: t.photo,
    pinSrc: A.i + 'pin-coral.png',
    icons: t.icons,
    sticker: n === 0 ? /*#__PURE__*/React.createElement(Sticker, {
      type: "tape",
      pattern: "solid",
      color: "var(--tape-blush)",
      width: 44,
      height: 15,
      rotate: -14,
      position: {
        top: -6,
        left: 14,
        zIndex: 2
      }
    }) : /*#__PURE__*/React.createElement(Sticker, {
      type: "tape",
      pattern: "dots",
      color: "var(--tape-lavender)",
      width: 52,
      height: 16,
      rotate: 7,
      position: {
        bottom: -6,
        right: 16,
        zIndex: 2
      }
    })
  })), /*#__PURE__*/React.createElement(StartTripCard, {
    description: "Pin places, collect memories, and create your own story.",
    mapSrc: A.s + 'worldmap.png',
    onClick: onOpenImport,
    tape: /*#__PURE__*/React.createElement(Sticker, {
      type: "tape",
      pattern: "solid",
      color: "var(--tape-butter)",
      width: 62,
      height: 18,
      rotate: -2,
      position: {
        top: -9,
        left: '50%',
        marginLeft: -31,
        zIndex: 2
      }
    })
  }))), /*#__PURE__*/React.createElement(BottomNav, {
    activeId: tab,
    onSelect: onTab,
    onAdd: onOpenImport,
    items: [{
      id: 'trips',
      label: 'Trips',
      iconSrc: A.i + 'nav-trips.png'
    }, {
      id: 'imports',
      label: 'Imports',
      iconSrc: A.i + 'nav-imports.png'
    }]
  }));
}
Object.assign(window, {
  PhoneFrame,
  HomeScreen,
  PT_ASSETS: A
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pintrip-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pintrip-app/ImportScreen.jsx
try { (() => {
const PLACES = [{
  id: 'p1',
  name: 'Bomnal Cafe',
  category: 'cafe',
  categoryLabel: 'Cafe',
  photo: 'place-cafe-jeju.png',
  description: '푸른 바다를 바라보며 즐기는 제주 감성 카페. 시그니처 당근 케이크가 유명해요.',
  address: '제주 제주시 애월읍 애월로 1길 24',
  tags: ['#오션뷰', '#감성카페', '#애월카페'],
  mark: 'heart-outline.png',
  tape: {
    pattern: 'gingham',
    color: 'var(--tape-blue)'
  }
}, {
  id: 'p2',
  name: '온고을 연어',
  category: 'food',
  categoryLabel: 'Food',
  photo: 'place-food-jeju.png',
  description: '신선한 연어 덮밥과 사시미가 인기인 맛집! 웨이팅이 있지만 꼭 가볼만 해요.',
  address: '제주 제주시 연동 261-27',
  tags: ['#연어맛집', '#제주맛집', '#연동맛집'],
  mark: 'star-outline.png',
  tape: {
    pattern: 'solid',
    color: 'var(--tape-butter)'
  }
}, {
  id: 'p3',
  name: '성산 일출봉',
  category: 'attraction',
  categoryLabel: 'Attraction',
  photo: 'place-nature-jeju.png',
  description: '제주를 대표하는 자연 명소! 일출 시간에 맞춰 가면 감동이 두 배예요.',
  address: '제주 서귀포시 성산읍 성산리 1',
  tags: ['#일출명소', '#제주필수코스', '#자연경관'],
  mark: 'flower.png',
  tape: {
    pattern: 'dots',
    color: 'var(--tape-lavender)'
  }
}];
function ImportScreen({
  onBack,
  onTab,
  tab
}) {
  const {
    AppHeader,
    ScreenTitle,
    LinkInput,
    Button,
    AnalyzeStatus,
    PlaceResultCard,
    BatchAddPanel,
    Sticker,
    BottomNav
  } = window.PinTripDesignSystem_ab161c;
  const A = window.PT_ASSETS;
  const [url, setUrl] = React.useState('https://www.instagram.com/p/Cu123abcDEF/');
  const [analyzed, setAnalyzed] = React.useState(true);
  const [added, setAdded] = React.useState([]);
  const [saved, setSaved] = React.useState(false);
  const toggle = id => setAdded(a => a.includes(id) ? a.filter(x => x !== id) : a.concat(id));
  const count = PLACES.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      padding: '6px 20px 22px'
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    onBack: onBack,
    backIconSrc: A.i + 'arrow-back.png',
    wordmarkSrc: A.s + 'wordmark-script.png',
    wordmarkSize: 40,
    sticker: /*#__PURE__*/React.createElement(Sticker, {
      type: "image",
      src: A.s + 'sticker-envelope.png',
      width: 52,
      rotate: 4,
      style: {
        marginRight: -4
      }
    })
  }), /*#__PURE__*/React.createElement(ScreenTitle, {
    title: "Import Link",
    subtitle: "\uB9C1\uD06C\uB97C \uBD99\uC5EC\uB123\uC73C\uBA74 \uC5EC\uD589\uC9C0\uB97C \uC790\uB3D9\uC73C\uB85C \uC815\uB9AC\uD574\uB4DC\uB824\uC694 \u2728",
    style: {
      marginTop: 14
    }
  }), /*#__PURE__*/React.createElement(LinkInput, {
    value: url,
    iconSrc: A.s + 'icon-instagram.png',
    onChange: setUrl,
    onClear: () => {
      setUrl('');
      setAnalyzed(false);
      setSaved(false);
    },
    style: {
      marginTop: 18
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    iconSrc: A.i + 'sparkle.png',
    onClick: () => setAnalyzed(!!url),
    style: {
      marginTop: 12
    }
  }, "Analyze Link"), analyzed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(AnalyzeStatus, {
    iconSrc: A.i + 'check-circle.png',
    text: "\uB9C1\uD06C \uBD84\uC11D \uC644\uB8CC!",
    emphasis: count + '개의 장소를 찾았어요.',
    style: {
      marginTop: 18
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: A.s + 'arrow-curve.png',
    alt: "",
    style: {
      position: 'absolute',
      right: 2,
      top: -4,
      width: 36,
      opacity: 0.9
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 18
    }
  }, PLACES.map(p => /*#__PURE__*/React.createElement(PlaceResultCard, {
    key: p.id,
    photoSrc: A.p + p.photo,
    category: p.category,
    categoryLabel: p.categoryLabel,
    name: p.name,
    description: p.description,
    address: p.address,
    tags: p.tags,
    pinSrc: A.i + 'pin-blue.png',
    editIconSrc: A.i + 'pencil.png',
    markSrc: A.i + p.mark,
    added: added.includes(p.id),
    onAdd: () => toggle(p.id),
    tape: /*#__PURE__*/React.createElement(Sticker, {
      type: "tape",
      pattern: p.tape.pattern,
      color: p.tape.color,
      width: 64,
      height: 17,
      rotate: -8,
      position: {
        top: -7,
        left: 26,
        zIndex: 2
      }
    })
  }))), /*#__PURE__*/React.createElement(BatchAddPanel, {
    style: {
      marginTop: 20
    },
    luggageSrc: A.s + 'sticker-luggage.png',
    sparkleSrc: A.s + 'sticker-sparkles.png',
    title: saved ? count + '개의 장소를 추가했어요!' : count + '개의 장소를 추가할까요?',
    subtitle: "\uB0B4 \uC5EC\uD589 \uCEEC\uB809\uC158\uC5D0 \uC800\uC7A5\uD558\uACE0 \uC77C\uC815\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "action",
    size: "lg",
    fullWidth: true,
    onClick: () => {
      setSaved(true);
      setAdded(PLACES.map(p => p.id));
    },
    icon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        lineHeight: 1
      }
    }, "\u2713"),
    style: {
      marginTop: 12
    }
  }, saved ? '컬렉션에서 보기' : count + '개 장소 추가하기')) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '26px 0 0',
      fontFamily: 'var(--font-kr)',
      fontSize: 13,
      color: 'var(--ink-400)',
      textAlign: 'center'
    }
  }, "\uC778\uC2A4\uD0C0\uADF8\uB7A8 \uAC8C\uC2DC\uBB3C \uB9C1\uD06C\uB97C \uBD99\uC5EC\uB123\uACE0 \uBD84\uC11D\uC744 \uC2DC\uC791\uD574\uBCF4\uC138\uC694.")), /*#__PURE__*/React.createElement(BottomNav, {
    activeId: tab,
    onSelect: onTab,
    onAdd: () => {},
    items: [{
      id: 'trips',
      label: 'Trips',
      iconSrc: A.i + 'nav-trips.png'
    }, {
      id: 'imports',
      label: 'Imports',
      iconSrc: A.i + 'nav-imports.png'
    }]
  }));
}
Object.assign(window, {
  ImportScreen,
  PT_PLACES: PLACES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pintrip-app/ImportScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pintrip-app/ImportsScreen.jsx
try { (() => {
/* Imports tab. The uploaded masters do not include this screen, so it is assembled
   only from components those masters define — no new patterns are introduced. */
function ImportsScreen({
  onTab,
  tab
}) {
  const {
    AppHeader,
    ScreenTitle,
    PlaceResultCard,
    Sticker,
    BottomNav
  } = window.PinTripDesignSystem_ab161c;
  const A = window.PT_ASSETS;
  const P = window.PT_PLACES;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      padding: '6px 20px 22px'
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    wordmarkSrc: A.s + 'wordmark-script.png',
    wordmarkSize: 40,
    sticker: /*#__PURE__*/React.createElement(Sticker, {
      type: "image",
      src: A.s + 'sticker-envelope.png',
      width: 52,
      rotate: 4,
      style: {
        marginRight: -4
      }
    })
  }), /*#__PURE__*/React.createElement(ScreenTitle, {
    title: "Imports",
    subtitle: "\uC9C0\uAE08\uAE4C\uC9C0 \uC815\uB9AC\uD55C \uB9C1\uD06C\uC640 \uC7A5\uC18C\uB97C \uBAA8\uC544\uB480\uC5B4\uC694.",
    style: {
      marginTop: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A.i + 'icon-instagram.png',
    alt: "",
    style: {
      width: 20,
      height: 20,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12.5,
      fontWeight: 'var(--w-semibold)',
      color: 'var(--ink-500)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "instagram.com/p/Cu123abcDEF"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-kr)',
      fontSize: 11.5,
      color: 'var(--ink-300)',
      marginLeft: 'auto',
      flexShrink: 0
    }
  }, "\uC624\uB298")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 12
    }
  }, P.map(p => /*#__PURE__*/React.createElement(PlaceResultCard, {
    key: p.id,
    photoSrc: A.p + p.photo,
    category: p.category,
    categoryLabel: p.categoryLabel,
    name: p.name,
    description: p.description,
    address: p.address,
    tags: p.tags,
    pinSrc: A.i + 'pin-blue.png',
    editIconSrc: A.i + 'pencil.png',
    markSrc: A.i + p.mark,
    added: true
  })))), /*#__PURE__*/React.createElement(BottomNav, {
    activeId: tab,
    onSelect: onTab,
    onAdd: () => onTab('import'),
    items: [{
      id: 'trips',
      label: 'Trips',
      iconSrc: A.i + 'nav-trips.png'
    }, {
      id: 'imports',
      label: 'Imports',
      iconSrc: A.i + 'nav-imports.png'
    }]
  }));
}
Object.assign(window, {
  ImportsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pintrip-app/ImportsScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FabButton = __ds_scope.FabButton;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.BatchAddPanel = __ds_scope.BatchAddPanel;

__ds_ns.NoteCard = __ds_scope.NoteCard;

__ds_ns.PlaceResultCard = __ds_scope.PlaceResultCard;

__ds_ns.StartTripCard = __ds_scope.StartTripCard;

__ds_ns.TripCard = __ds_scope.TripCard;

__ds_ns.AnalyzeStatus = __ds_scope.AnalyzeStatus;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.CategoryBadge = __ds_scope.CategoryBadge;

__ds_ns.CategoryIcon = __ds_scope.CategoryIcon;

__ds_ns.LocationLine = __ds_scope.LocationLine;

__ds_ns.ScreenTitle = __ds_scope.ScreenTitle;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.Sticker = __ds_scope.Sticker;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.LinkInput = __ds_scope.LinkInput;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.BottomNav = __ds_scope.BottomNav;

})();
