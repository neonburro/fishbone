// src/theme/index.js
//
// "Ink & Bone". The Chakra theme for the Fishbone Graphics storefront.
//
// ── THE PALETTE IS PROVISIONAL ──────────────────────────────────────────────
// The client's logo has not arrived. Every color the site uses is defined
// HERE and nowhere else: ink (page and surfaces), bone (type), ember (hot ink,
// the primary accent), river (Uncompahgre teal), hivis (fluorescent, tiny
// doses). Components reach for these through Chakra tokens ('ember.500') or
// through the exported `palette` and `alpha()` helpers when they need a raw
// value for an SVG or an rgba. Nobody hardcodes a hex outside this file, so
// when the real palette lands it is retuned in one place and the whole site
// follows.
//
// ── TYPE ────────────────────────────────────────────────────────────────────
// Display is Big Shoulders Display, an industrial condensed face with poster
// energy. H1 and H2 are uppercase with tight tracking. Body is Instrument
// Sans. Mono is JetBrains Mono and it does the small precise work: order
// numbers, SKUs, prices in tables and the kickers, the small uppercase labels
// that replace badges everywhere on the site.
//
// No oxford commas, no em dashes.

import { extendTheme } from '@chakra-ui/react'

const colors = {
  ink: {
    50: '#3A3A41',
    100: '#33333A',
    200: '#2D2D33',
    300: '#26262B', // border
    400: '#1C1C1F', // raised
    500: '#141416', // surface
    600: '#101012',
    700: '#0E0E10',
    800: '#0C0C0D',
    900: '#0B0B0C', // page bg
  },
  bone: {
    50: '#FFFDF9',
    100: '#F2EDE4', // primary text
    200: '#E6DFD3',
    300: '#D9D2C5', // muted
    400: '#C8C0B3',
    500: '#B8B0A2', // subtle
    600: '#948D80',
    700: '#6F695F',
    800: '#4A4741',
    900: '#2B2925',
  },
  ember: {
    50: '#FFF1E8',
    100: '#FFD9C2',
    200: '#FFB48A',
    300: '#FF9A62',
    400: '#FF8140', // hover
    500: '#FF6A13', // primary accent
    600: '#E55A0C', // pressed
    700: '#BF4A08',
    800: '#8F3705',
    900: '#5A2303',
  },
  river: {
    50: '#E6F8F6',
    100: '#BFEDE8',
    200: '#8FDFD6',
    300: '#62D2C6',
    400: '#45C7B8', // hover
    500: '#2BB3A3', // secondary accent
    600: '#23958A',
    700: '#1B756C',
    800: '#13544E',
    900: '#0B332F',
  },
  hivis: {
    50: '#F8FDE1',
    100: '#EEFAB6',
    200: '#E2F786',
    300: '#D5F45D',
    400: '#CDF347',
    500: '#C6F135', // fluorescent highlight
    600: '#A8D023',
    700: '#86A81A',
    800: '#637D12',
    900: '#3F510A',
  },
  paper: {
    50: '#FAF7F2',
    100: '#F1ECE3',
  },
}

// Raw values for SVG fills, canvas, rgba() and anything Chakra tokens cannot
// reach. Same numbers as above, named the way the brief names them.
export const palette = {
  ink: colors.ink[900],
  inkSurface: colors.ink[500],
  inkRaised: colors.ink[400],
  inkBorder: colors.ink[300],
  bone: colors.bone[100],
  boneMuted: colors.bone[300],
  boneSubtle: colors.bone[500],
  ember: colors.ember[500],
  emberHover: colors.ember[400],
  emberPressed: colors.ember[600],
  river: colors.river[500],
  riverHover: colors.river[400],
  hivis: colors.hivis[500],
  paper: colors.paper[50],
}

// alpha('#FF6A13', 0.2) -> 'rgba(255,106,19,0.2)'
export function alpha(hex, a = 1) {
  const h = String(hex).replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// One easing everywhere. Heavy ease out: leaves fast, lands almost still.
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

const fonts = {
  heading: `'Big Shoulders Display', 'Arial Narrow', Impact, sans-serif`,
  body: `'Instrument Sans', 'Helvetica Neue', Arial, sans-serif`,
  mono: `'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace`,
}

// The kicker. Small mono uppercase, wide tracking. Used as a Text variant, as
// the Badge base style and as FormLabel, so one definition drives all three.
const kicker = {
  fontFamily: 'mono',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontSize: '11px',
  lineHeight: 1.4,
}

const focusRing = { borderColor: 'ember.500', boxShadow: `0 0 0 1px ${palette.ember}` }
const invalidRing = { borderColor: 'ember.600', boxShadow: `0 0 0 1px ${palette.emberPressed}` }

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors,
  fonts,
  radii: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    full: '9999px',
  },
  shadows: {
    outline: `0 0 0 3px ${alpha(palette.ember, 0.55)}`,
    raised: `0 1px 0 ${alpha('#FFFFFF', 0.03)} inset, 0 10px 30px ${alpha('#000000', 0.45)}`,
  },
  semanticTokens: {
    colors: {
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
      html: { scrollBehavior: 'smooth' },
      body: {
        bg: 'ink.900',
        color: 'bone.100',
        fontFamily: 'body',
        lineHeight: 1.55,
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      },
      '::selection': { bg: 'ember.500', color: 'ink.900' },
      '*:focus-visible': {
        outline: '2px solid',
        outlineColor: 'ember.500',
        outlineOffset: '2px',
      },
      'input, textarea, select': { fontFamily: 'body' },
      '::-webkit-scrollbar': { width: '10px', height: '10px' },
      '::-webkit-scrollbar-thumb': { bg: 'ink.300', borderRadius: '4px' },
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
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '-0.015em',
        lineHeight: 0.92,
        color: 'bone.100',
      },
      sizes: {
        '4xl': { fontSize: { base: '4rem', md: '7rem', lg: '9.5rem' }, fontWeight: 900, letterSpacing: '-0.02em' },
        '3xl': { fontSize: { base: '3.25rem', md: '5rem', lg: '6.5rem' }, fontWeight: 900 },
        '2xl': { fontSize: { base: '2.6rem', md: '4rem' } },
        xl: { fontSize: { base: '2.1rem', md: '2.8rem' } },
        lg: { fontSize: { base: '1.6rem', md: '2rem' } },
        md: { fontSize: '1.35rem' },
        sm: { fontSize: '1.1rem' },
        xs: { fontSize: '0.95rem' },
      },
    },
    Text: {
      variants: {
        kicker: { ...kicker, color: 'ember.500' },
        // Older name for the same object. Kept so nothing breaks.
        eyebrow: { ...kicker, color: 'ember.500' },
        mono: {
          fontFamily: 'mono',
          fontSize: 'sm',
          color: 'bone.300',
        },
        muted: { color: 'bone.300' },
        subtle: { color: 'bone.500', fontSize: 'sm' },
      },
    },
    Button: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderRadius: 'base',
        transitionTimingFunction: EASE,
        _focusVisible: { boxShadow: 'outline' },
      },
      sizes: {
        lg: { h: '52px', px: 7, fontSize: 'xl' },
        md: { h: '44px', px: 5, fontSize: 'lg' },
        sm: { h: '36px', px: 4, fontSize: 'md' },
        xs: { h: '28px', px: 3, fontSize: 'sm' },
      },
      variants: {
        ember: {
          bg: 'ember.500',
          color: 'ink.900',
          _hover: { bg: 'ember.400', _disabled: { bg: 'ember.500' } },
          _active: { bg: 'ember.600' },
        },
        river: {
          bg: 'river.500',
          color: 'ink.900',
          _hover: { bg: 'river.400', _disabled: { bg: 'river.500' } },
          _active: { bg: 'river.600' },
        },
        bone: {
          bg: 'bone.100',
          color: 'ink.900',
          _hover: { bg: 'bone.50' },
          _active: { bg: 'bone.300' },
        },
        outline: {
          border: '2px solid',
          borderColor: 'bone.100',
          color: 'bone.100',
          bg: 'transparent',
          _hover: { bg: 'bone.100', color: 'ink.900' },
          _active: { bg: 'bone.300', color: 'ink.900' },
        },
        ghost: {
          color: 'bone.300',
          _hover: { bg: 'ink.400', color: 'bone.100' },
          _active: { bg: 'ink.300' },
        },
        link: {
          color: 'ember.500',
          textTransform: 'none',
          fontFamily: 'body',
          fontWeight: 600,
          letterSpacing: 0,
          _hover: { color: 'ember.400', textDecoration: 'underline' },
        },
      },
      defaultProps: { variant: 'ember' },
    },
    Link: {
      baseStyle: {
        color: 'ember.500',
        _hover: { color: 'ember.400', textDecoration: 'underline' },
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
            borderRadius: 'base',
            _placeholder: { color: 'bone.600' },
            _hover: { borderColor: 'ink.100' },
            _focusVisible: focusRing,
            _invalid: invalidRing,
          },
        },
      },
      defaultProps: { variant: 'outline', focusBorderColor: 'ember.500' },
    },
    NumberInput: {
      variants: {
        outline: {
          field: {
            bg: 'ink.500',
            borderColor: 'ink.300',
            color: 'bone.100',
            fontFamily: 'mono',
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
          borderRadius: 'base',
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
            _hover: { borderColor: 'ink.100' },
            _focusVisible: focusRing,
            '> option': { bg: 'ink.500', color: 'bone.100' },
          },
          icon: { color: 'bone.300' },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        ...kicker,
        color: 'bone.300',
        mb: 2,
      },
    },
    FormError: {
      baseStyle: { text: { color: 'ember.400', fontSize: 'sm' } },
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderColor: 'bone.600',
          borderRadius: 'sm',
          _checked: {
            bg: 'ember.500',
            borderColor: 'ember.500',
            color: 'ink.900',
            _hover: { bg: 'ember.400', borderColor: 'ember.400' },
          },
          _focusVisible: { boxShadow: 'outline' },
        },
        label: { color: 'bone.100' },
      },
    },
    Radio: {
      baseStyle: {
        control: {
          borderColor: 'bone.600',
          _checked: {
            bg: 'ember.500',
            borderColor: 'ember.500',
            color: 'ink.900',
            _hover: { bg: 'ember.400', borderColor: 'ember.400' },
          },
          _focusVisible: { boxShadow: 'outline' },
        },
        label: { color: 'bone.100' },
      },
    },
    // Badges are kickers. No filled pills anywhere on the site. The variant
    // only changes the ink color.
    Badge: {
      baseStyle: {
        ...kicker,
        fontSize: '10px',
        borderRadius: 0,
        px: 0,
        py: 0,
        bg: 'transparent',
      },
      variants: {
        hivis: { color: 'hivis.500' },
        ember: { color: 'ember.500' },
        river: { color: 'river.500' },
        outline: { color: 'bone.300', borderBottom: '1px solid', borderColor: 'ink.200', pb: '1px' },
        ink: { color: 'bone.500' },
      },
      defaultProps: { variant: 'ink' },
    },
    Table: {
      variants: {
        ticket: {
          table: { fontFamily: 'mono', fontSize: 'sm' },
          th: {
            ...kicker,
            fontSize: '10px',
            color: 'bone.500',
            borderBottom: '1px solid',
            borderColor: 'ink.300',
            px: 3,
            py: 2,
          },
          td: { borderBottom: '1px solid', borderColor: 'ink.300', px: 3, py: 2, color: 'bone.100' },
        },
      },
    },
    Divider: {
      baseStyle: { borderColor: 'ink.300', opacity: 1 },
    },
    Drawer: {
      baseStyle: {
        dialog: { bg: 'ink.500', color: 'bone.100' },
        overlay: { bg: alpha(palette.ink, 0.8) },
        closeButton: { color: 'bone.300' },
      },
    },
    Modal: {
      baseStyle: {
        dialog: { bg: 'ink.500', color: 'bone.100', borderRadius: 'base', border: '1px solid', borderColor: 'ink.300' },
        overlay: { bg: alpha(palette.ink, 0.8) },
      },
    },
    Skeleton: {
      baseStyle: {
        borderRadius: 'base',
        '--skeleton-start-color': 'colors.ink.400',
        '--skeleton-end-color': 'colors.ink.300',
      },
    },
    Tooltip: {
      baseStyle: { bg: 'bone.100', color: 'ink.900', fontFamily: 'body', borderRadius: 'base', px: 3, py: 1.5 },
    },
    Alert: {
      variants: {
        ink: (props) => {
          const c = props.colorScheme || 'ember'
          return {
            container: { bg: 'ink.400', border: '1px solid', borderColor: `${c}.500`, borderRadius: 'base', color: 'bone.100' },
            icon: { color: `${c}.500` },
            title: { fontFamily: 'heading', textTransform: 'uppercase', letterSpacing: '0.06em' },
          }
        },
      },
      defaultProps: { variant: 'ink' },
    },
    Progress: {
      baseStyle: {
        track: { bg: 'ink.300' },
        filledTrack: { bg: 'river.500' },
      },
    },
    // The sheet. Left aligned, capped at 1680, rail 20 / 40. See theme/layout.js.
    Container: {
      baseStyle: { px: { base: 5, md: 10 }, mx: 0, w: '100%' },
      sizes: { page: { maxW: '1680px' }, narrow: { maxW: '900px' } },
    },
  },
})

export default theme
