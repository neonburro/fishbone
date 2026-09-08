// src/theme/index.js
//
// "Ink & Paper". The Chakra theme for the Fishbone Graphics storefront.
//
// ── THREE COLORS ────────────────────────────────────────────────────────────
// Vintage black, off white and one red. That is the whole palette. The black
// is not pure, it is #161618 with a hair of navy in it because the fish on the
// real logo is drawn in #00001C. The off white is bone on ink and paper on
// its own. The red started as #EC1D3B, sampled from the disc behind the oval logo on
// the shop's Instagram avatar. Nothing else on the site carries a hue.
//
// ── INK AND PAPER ───────────────────────────────────────────────────────────
// Dark and light are not a toggle, they are what you are doing. Looking at
// work happens on ink. Building an order happens on paper, because what you
// are building is a job ticket and a job ticket is a piece of paper on the
// press. Components that render the ordering surfaces reach for the paper
// tokens. Everything else sits on ink.
//
// ── TWO MODES, INK AND PAPER ────────────────────────────────────────────────
// The site has a light mode and it is not an inversion, it is the paper the
// ordering surfaces already use, promoted to the whole page. Every `ink.*`
// and `bone.*` token below is a SEMANTIC token with a dark value and a light
// value, so the eighty files that say bg="ink.500" or color="bone.100" flip
// on their own when the mode changes. In light mode ink becomes paper and
// bone becomes the near black type. Red stays red in both. The toggle lives
// in the footer (components/common/InkPaperToggle.jsx) and Chakra remembers
// the choice in localStorage. `paper.*` does not flip, it is always paper,
// so a paper card on a paper page still reads as a card through its shadow.
//
// Raw hex for alpha() and SVG comes from `palette` (dark) and `paletteLight`.
// Components that paint with alpha() pick between the two with
// useColorModeValue. There are only a handful, the nav tile and the pill.
//
// ── TOKEN NAMES ─────────────────────────────────────────────────────────────
// `ember` is the accent's historical name and eighty files read it, so the
// key stays and its values are the red. `red` is the same scale under the
// name it deserves, use it in new work. `river` and `hivis` were a teal and
// a fluorescent green in the first pass. They are repainted to neutrals so
// any component still reading them goes quiet instead of loud, and they can
// be deleted once nothing reads them.
//
// ── STORED, NOT USED ────────────────────────────────────────────────────────
// VINTAGE is a set of faded blanks colors kept for the day the site wants a
// second hue. Nothing imports it. They are sampled toward the shirts on the
// wall, not toward pastels.
//
// ── TYPE ────────────────────────────────────────────────────────────────────
// Barlow Condensed for headings and buttons, Barlow for reading, JetBrains
// Mono for the small precise work: order numbers, SKUs, prices in tables and
// the kickers. The shop's own site and Pulse already speak Barlow.
//
// No oxford commas, no em dashes.

import { extendTheme } from '@chakra-ui/react'
import { accentVars, DEFAULT_ACCENT } from './accents'

// Read through CSS variables so the accent can change without rebuilding the
// theme. Defaults are set in styles.global below and by theme/accents.js.
const red = Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((k) => [k, `var(--fb-red-${k})`]))

// Dark values. The `colors` block below carries only what does not flip.
const inkDark = {
  50: '#4B4F58', 100: '#3F434B', 200: '#34373E', 300: '#2C2F35', 400: '#26262A',
  500: '#1D1D20', 600: '#1A1A1D', 700: '#181819', 800: '#171718', 900: '#161618',
}
const boneDark = {
  50: '#FBF8F2', 100: '#EFEAE0', 200: '#E2DCD0', 300: '#CFC9BE', 400: '#B5B0A6',
  500: '#9AA1AA', 600: '#6B727C', 700: '#4F545C', 800: '#3B4048', 900: '#2A2D33',
}
// Light values. ink becomes paper, bone becomes the type. Contrast is kept
// deliberately hard: near black on paper, not grey on cream.
const inkLight = {
  50: '#B9B2A4', 100: '#C6BFB1', 200: '#D3CCBE', 300: '#DDD6C8', 400: '#E6DFD2',
  500: '#EFE9DE', 600: '#F1ECE2', 700: '#F3EEE5', 800: '#F5F0E8', 900: '#F6F2EA',
}
const boneLight = {
  50: '#0E0E10', 100: '#161618', 200: '#232326', 300: '#3A3A3E', 400: '#4F4F54',
  500: '#5F6168', 600: '#7D7F86', 700: '#A2A49F', 800: '#C4BFB3', 900: '#D9D2C4',
}
const flip = (dark, light) => Object.fromEntries(Object.keys(dark).map((k) => [k, { default: dark[k], _light: light[k] }]))

const colors = {
  paper: {
    50: '#F6F2EA', // the sheet
    100: '#ECE6DA', // second surface
    200: '#D9D2C4', // rules on paper
    300: '#B9B2A4',
    500: '#6B6760', // muted type on paper
    900: '#1B1B1E', // type on paper
  },
  red,
  ember: red,
  // Repainted to neutrals. See the header.
}

// Raw values for SVG fills, canvas, rgba() and anything Chakra tokens cannot
// reach. Same numbers as above, named the way the brief names them.
export const palette = {
  ink: inkDark[900],
  inkSurface: inkDark[500],
  inkRaised: inkDark[400],
  inkBorder: inkDark[300],
  bone: boneDark[100],
  boneMuted: boneDark[300],
  boneSubtle: boneDark[500],
  slate: boneDark[800],
  red: red[500],
  redHover: red[400],
  redPressed: red[600],
  ember: red[500],
  emberHover: red[400],
  emberPressed: red[600],
  river: boneDark[500],
  riverHover: boneDark[300],
  hivis: boneDark[100],
  paper: colors.paper[50],
  paperInk: colors.paper[900],
}

// The same names in light mode, for the few places that paint with alpha().
export const paletteLight = {
  ...palette,
  ink: inkLight[900],
  inkSurface: inkLight[500],
  inkRaised: inkLight[400],
  inkBorder: inkLight[300],
  bone: boneLight[100],
  boneMuted: boneLight[300],
  boneSubtle: boneLight[500],
  slate: boneLight[800],
}

// Faded blanks colors. Stored, not wired. See the header.
export const VINTAGE = {
  brick: '#A0463D',
  mustard: '#C39A3B',
  denim: '#4E6479',
  moss: '#66735A',
  sage: '#8C9C8E',
  mauve: '#8A5A66',
  rust: '#9C5A3C',
  pepper: '#4E4C4A',
}

// alpha('#E0293F', 0.2) -> 'rgba(224,41,63,0.2)'. Not for the accent, that is a
// CSS variable now, use color-mix() for that.
export function alpha(hex, a = 1) {
  const h = String(hex).replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// One easing everywhere. Heavy ease out: leaves fast, lands almost still.
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// Body is Archivo. It shares Barlow Condensed's American sign-shop bones but
// the letterforms have more character at reading size. Karla is loaded as
// the alternate, warmer and a touch more vintage, swap the name to try it.
const fonts = {
  heading: `'Barlow Condensed', 'Arial Narrow', sans-serif`,
  body: `'Karla', 'Helvetica Neue', Arial, sans-serif`,
  mono: `'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace`,
}

// The kicker. Small mono uppercase, wide tracking. Used as a Text variant, as
// the Badge base style and as FormLabel, so one definition drives all three.
const kicker = {
  fontFamily: 'mono',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  fontSize: '11px',
  lineHeight: 1.4,
}

// Type on red is this literal in both modes. A token would flip to near
// black on paper and red with black type is the one pairing the site does
// not do.
export const ON_RED = 'var(--fb-on-red)'

const focusRing = { borderColor: 'red.500', boxShadow: `0 0 0 1px ${red[500]}` }
const invalidRing = { borderColor: 'red.600', boxShadow: `0 0 0 1px ${red[600]}` }

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors,
  fonts,
  radii: {
    none: '0',
    sm: '8px',
    base: '10px',
    md: '12px',
    lg: '18px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    outline: `0 0 0 3px color-mix(in srgb, ${red[500]} 45%, transparent)`,
    raised: `0 1px 0 ${alpha('#FFFFFF', 0.03)} inset, 0 10px 30px ${alpha('#000000', 0.45)}`,
    paper: `0 20px 60px ${alpha('#000000', 0.35)}`,
  },
  semanticTokens: {
    colors: {
      ink: flip(inkDark, inkLight),
      bone: flip(boneDark, boneLight),
      // Repainted to neutrals and flipping with them. See the header.
      river: { 400: { default: boneDark[300], _light: boneLight[300] }, 500: { default: boneDark[500], _light: boneLight[500] }, 600: { default: boneDark[600], _light: boneLight[600] } },
      hivis: { 500: { default: boneDark[100], _light: boneLight[100] } },
      'bg.page': 'ink.900',
      'bg.surface': 'ink.500',
      'bg.raised': 'ink.400',
      'border.default': 'ink.300',
      'text.primary': 'bone.100',
      'text.muted': 'bone.300',
      'text.subtle': 'bone.500',
    },
  },
  styles: {
    global: {
      ':root': { ...accentVars(DEFAULT_ACCENT) },
      html: { scrollBehavior: 'smooth' },
      body: {
        bg: 'ink.900',
        color: 'bone.100',
        fontFamily: 'body',
        lineHeight: 1.5,
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      },
      '::selection': { bg: 'red.500', color: '#FBF8F2' },
      '*:focus-visible': {
        outline: '2px solid',
        outlineColor: 'red.500',
        outlineOffset: '2px',
      },
      'input, textarea, select': { fontFamily: 'body' },
      // Chrome paints autofilled fields yellow or blue. Paint them back to
      // the field's own surface in both modes, type included.
      'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, textarea:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px var(--fb-field-bg, #1D1D20) inset',
        WebkitTextFillColor: 'var(--fb-field-fg, #EFEAE0)',
        caretColor: 'var(--fb-field-fg, #EFEAE0)',
        transition: 'background-color 9999s ease-out 0s',
      },
      '::-webkit-scrollbar': { width: '10px', height: '10px' },
      '::-webkit-scrollbar-thumb': { bg: 'ink.300', borderRadius: '6px' },
      '::-webkit-scrollbar-track': { bg: 'ink.900' },
      '@media (prefers-reduced-motion: reduce)': {
        html: { scrollBehavior: 'auto' },
        '*, *::before, *::after': { animationDuration: '0.01ms !important', animationIterationCount: '1 !important', transitionDuration: '0.01ms !important' },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0',
        lineHeight: 1,
        color: 'bone.100',
      },
      sizes: {
        '4xl': { fontSize: { base: '3.2rem', md: '5rem', lg: '6.4rem' }, fontWeight: 700 },
        '3xl': { fontSize: { base: '2.6rem', md: '3.8rem', lg: '4.6rem' }, fontWeight: 700 },
        '2xl': { fontSize: { base: '2rem', md: '2.9rem' } },
        xl: { fontSize: { base: '1.7rem', md: '2.2rem' } },
        lg: { fontSize: { base: '1.45rem', md: '1.7rem' } },
        md: { fontSize: '1.3rem' },
        sm: { fontSize: '1.1rem' },
        xs: { fontSize: '0.95rem', letterSpacing: '0.04em' },
      },
    },
    Text: {
      variants: {
        kicker: { ...kicker, color: 'bone.500' },
        eyebrow: { ...kicker, color: 'bone.500' },
        mono: { fontFamily: 'mono', fontSize: 'sm', color: 'bone.300' },
        muted: { color: 'bone.300' },
        subtle: { color: 'bone.500', fontSize: 'sm' },
      },
    },
    Button: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderRadius: 'base',
        transitionTimingFunction: EASE,
        _focusVisible: { boxShadow: 'outline' },
      },
      sizes: {
        lg: { h: '52px', px: 7, fontSize: 'xl' },
        md: { h: '46px', px: 5, fontSize: 'lg' },
        sm: { h: '38px', px: 4, fontSize: 'md' },
        xs: { h: '30px', px: 3, fontSize: 'sm' },
      },
      variants: {
        ember: {
          bg: 'red.500',
          color: ON_RED,
          _hover: { bg: 'red.400', _disabled: { bg: 'red.500' } },
          _active: { bg: 'red.600' },
        },
        red: {
          bg: 'red.500',
          color: ON_RED,
          _hover: { bg: 'red.400', _disabled: { bg: 'red.500' } },
          _active: { bg: 'red.600' },
        },
        river: {
          bg: 'bone.100',
          color: 'ink.900',
          _hover: { bg: 'bone.50' },
          _active: { bg: 'bone.300' },
        },
        bone: {
          bg: 'bone.100',
          color: 'ink.900',
          _hover: { bg: 'bone.50' },
          _active: { bg: 'bone.300' },
        },
        outline: {
          border: '1px solid',
          borderColor: 'ink.100',
          color: 'bone.100',
          bg: 'transparent',
          _hover: { borderColor: 'bone.500' },
          _active: { bg: 'ink.400' },
        },
        ghost: {
          color: 'bone.300',
          _hover: { bg: 'ink.400', color: 'bone.100' },
          _active: { bg: 'ink.300' },
        },
        link: {
          color: 'bone.100',
          textTransform: 'none',
          fontFamily: 'body',
          fontWeight: 600,
          letterSpacing: 0,
          _hover: { color: 'red.500', textDecoration: 'underline' },
        },
      },
      defaultProps: { variant: 'red' },
    },
    Link: {
      baseStyle: {
        color: 'bone.100',
        _hover: { color: 'red.500', textDecoration: 'underline' },
        _focusVisible: { boxShadow: 'outline' },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'ink.500',
            borderColor: 'ink.300',
            color: 'bone.100',
            borderRadius: 'sm',
            _placeholder: { color: 'bone.600' },
            _hover: { borderColor: 'ink.100' },
            _focusVisible: focusRing,
            _invalid: invalidRing,
          },
        },
      },
      defaultProps: { variant: 'outline', focusBorderColor: 'red.500' },
    },
    NumberInput: {
      variants: {
        outline: {
          field: {
            bg: 'ink.500',
            borderColor: 'ink.300',
            color: 'bone.100',
            fontFamily: 'mono',
            borderRadius: 'sm',
            _hover: { borderColor: 'ink.100' },
            _focusVisible: focusRing,
          },
          stepper: { borderColor: 'ink.300', color: 'bone.300', _active: { bg: 'ink.300' } },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          bg: 'ink.500',
          borderColor: 'ink.300',
          color: 'bone.100',
          borderRadius: 'sm',
          _placeholder: { color: 'bone.600' },
          _hover: { borderColor: 'ink.100' },
          _focusVisible: focusRing,
          _invalid: invalidRing,
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'ink.500',
            borderColor: 'ink.300',
            color: 'bone.100',
            borderRadius: 'sm',
            _hover: { borderColor: 'ink.100' },
            _focusVisible: focusRing,
            '> option': { bg: 'ink.500', color: 'bone.100' },
          },
          icon: { color: 'bone.300' },
        },
      },
    },
    FormLabel: {
      baseStyle: { ...kicker, color: 'bone.500', mb: 2 },
    },
    FormError: {
      baseStyle: { text: { color: 'red.400', fontSize: 'sm' } },
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderColor: 'bone.600',
          borderRadius: '4px',
          _checked: { bg: 'red.500', borderColor: 'red.500', color: ON_RED, _hover: { bg: 'red.400', borderColor: 'red.400' } },
          _focusVisible: { boxShadow: 'outline' },
        },
        label: { color: 'bone.100' },
      },
    },
    Radio: {
      baseStyle: {
        control: {
          borderColor: 'bone.600',
          _checked: { bg: 'red.500', borderColor: 'red.500', color: ON_RED, _hover: { bg: 'red.400', borderColor: 'red.400' } },
          _focusVisible: { boxShadow: 'outline' },
        },
        label: { color: 'bone.100' },
      },
    },
    // Badges are kickers. No filled pills anywhere on the site.
    Badge: {
      baseStyle: { ...kicker, fontSize: '10px', borderRadius: 0, px: 0, py: 0, bg: 'transparent' },
      variants: {
        hivis: { color: 'bone.100' },
        ember: { color: 'red.500' },
        red: { color: 'red.500' },
        river: { color: 'bone.300' },
        outline: { color: 'bone.300', borderBottom: '1px solid', borderColor: 'ink.200', pb: '1px' },
        ink: { color: 'bone.500' },
      },
      defaultProps: { variant: 'ink' },
    },
    Table: {
      variants: {
        ticket: {
          table: { fontFamily: 'mono', fontSize: 'sm' },
          th: { ...kicker, fontSize: '10px', color: 'bone.500', borderBottom: '1px solid', borderColor: 'ink.300', px: 3, py: 2 },
          td: { borderBottom: '1px solid', borderColor: 'ink.300', px: 3, py: 2, color: 'bone.100' },
        },
      },
    },
    Divider: { baseStyle: { borderColor: 'ink.300', opacity: 1 } },
    Drawer: {
      baseStyle: {
        dialog: { bg: 'ink.500', color: 'bone.100' },
        overlay: { bg: alpha('#0E0E10', 0.78) },
        closeButton: { color: 'bone.300' },
      },
    },
    Modal: {
      baseStyle: {
        dialog: { bg: 'ink.500', color: 'bone.100', borderRadius: 'lg', border: '1px solid', borderColor: 'ink.300' },
        overlay: { bg: alpha('#0E0E10', 0.78) },
      },
    },
    Skeleton: {
      baseStyle: { borderRadius: 'md', '--skeleton-start-color': 'colors.ink.400', '--skeleton-end-color': 'colors.ink.300' },
    },
    Tooltip: {
      baseStyle: { bg: 'bone.100', color: 'ink.900', fontFamily: 'body', borderRadius: 'sm', px: 3, py: 1.5 },
    },
    Alert: {
      variants: {
        ink: (props) => {
          const c = props.colorScheme || 'red'
          return {
            container: { bg: 'ink.400', border: '1px solid', borderColor: `${c}.500`, borderRadius: 'md', color: 'bone.100' },
            icon: { color: `${c}.500` },
            title: { fontFamily: 'heading', textTransform: 'uppercase', letterSpacing: '0.06em' },
          }
        },
      },
      defaultProps: { variant: 'ink' },
    },
    Progress: {
      baseStyle: { track: { bg: 'ink.300' }, filledTrack: { bg: 'red.500' } },
    },
    // The sheet. Full width, 97 percent on a desktop. See theme/layout.js.
    Container: {
      baseStyle: { px: { base: '16px', md: '1.5vw' }, mx: 0, w: '100%', maxW: 'none' },
      sizes: { page: { maxW: 'none' }, narrow: { maxW: '960px' } },
    },
  },
})

export default theme
