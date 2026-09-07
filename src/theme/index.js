import { extendTheme } from '@chakra-ui/react'

// "Ink & Bone" — dark, tactile print-shop system for Fishbone Graphics.

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

const fonts = {
  heading: `'Barlow Condensed', 'Arial Narrow', Impact, sans-serif`,
  body: `'Barlow', 'Helvetica Neue', Arial, sans-serif`,
  mono: `'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace`,
}

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
    outline: '0 0 0 3px rgba(255, 106, 19, 0.55)',
    raised: '0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 30px rgba(0,0,0,0.45)',
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
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
        lineHeight: 0.95,
        color: 'bone.100',
      },
      sizes: {
        '4xl': { fontSize: { base: '3.25rem', md: '5rem', lg: '6.5rem' } },
        '3xl': { fontSize: { base: '2.75rem', md: '4rem', lg: '5rem' } },
        '2xl': { fontSize: { base: '2.25rem', md: '3.25rem' } },
        xl: { fontSize: { base: '1.9rem', md: '2.5rem' } },
        lg: { fontSize: { base: '1.5rem', md: '1.9rem' } },
        md: { fontSize: '1.25rem' },
        sm: { fontSize: '1.05rem' },
        xs: { fontSize: '0.9rem' },
      },
    },
    Text: {
      variants: {
        eyebrow: {
          fontFamily: 'heading',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: 'sm',
          color: 'ember.500',
        },
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
        _focusVisible: { boxShadow: 'outline' },
      },
      sizes: {
        lg: { h: '52px', px: 7, fontSize: 'lg' },
        md: { h: '44px', px: 5, fontSize: 'md' },
        sm: { h: '36px', px: 4, fontSize: 'sm' },
        xs: { h: '28px', px: 3, fontSize: 'xs' },
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
            _focusVisible: { borderColor: 'ember.500', boxShadow: '0 0 0 1px #FF6A13' },
            _invalid: { borderColor: 'ember.600', boxShadow: '0 0 0 1px #E55A0C' },
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
            _focusVisible: { borderColor: 'ember.500', boxShadow: '0 0 0 1px #FF6A13' },
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
          _focusVisible: { borderColor: 'ember.500', boxShadow: '0 0 0 1px #FF6A13' },
          _invalid: { borderColor: 'ember.600', boxShadow: '0 0 0 1px #E55A0C' },
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
            _focusVisible: { borderColor: 'ember.500', boxShadow: '0 0 0 1px #FF6A13' },
            '> option': { bg: 'ink.500', color: 'bone.100' },
          },
          icon: { color: 'bone.300' },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: 'sm',
        color: 'bone.300',
        mb: 1.5,
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
    Badge: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        borderRadius: 'sm',
        px: 2,
        py: 0.5,
        fontSize: '0.7rem',
      },
      variants: {
        hivis: { bg: 'hivis.500', color: 'ink.900' },
        ember: { bg: 'ember.500', color: 'ink.900' },
        river: { bg: 'river.500', color: 'ink.900' },
        outline: { border: '1px solid', borderColor: 'bone.500', color: 'bone.300' },
        ink: { bg: 'ink.300', color: 'bone.300' },
      },
      defaultProps: { variant: 'ink' },
    },
    Table: {
      variants: {
        ticket: {
          table: { fontFamily: 'mono', fontSize: 'sm' },
          th: {
            fontFamily: 'heading',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: 'xs',
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
        overlay: { bg: 'rgba(11,11,12,0.8)' },
        closeButton: { color: 'bone.300' },
      },
    },
    Modal: {
      baseStyle: {
        dialog: { bg: 'ink.500', color: 'bone.100', borderRadius: 'base', border: '1px solid', borderColor: 'ink.300' },
        overlay: { bg: 'rgba(11,11,12,0.8)' },
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
    Container: {
      baseStyle: { px: { base: 5, md: 8 } },
      sizes: { page: { maxW: '1280px' }, narrow: { maxW: '820px' } },
    },
  },
})

export default theme
