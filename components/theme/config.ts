import { createStitches, defaultThemeMap } from '@stitches/react'
import type * as Stitches from '@stitches/react'
import { rgba, cssVar } from 'polished'

const space = {
  '0': '0px',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
  px: '1px',
  '0_5': '0.125rem',
  '1_5': '0.375rem',
  '2_5': '0.625rem',
  '3_5': '0.875rem',
  '4_5': '1.125rem',
  '5_5': '1.375rem',
  '1-2': '50%',
  '1-5': '20%',
  '2-5': '40%',
  '3-5': '60%',
  '4-5': '80%',
} as const

const getTransition = (propertyValues: string[]) => {
  return propertyValues.map((p) => `${p} cubic-bezier(0.4, 0, 0.2, 1) 150ms`).join(',')
}
export const blue = {
  100: ({ opacityValue }: { opacityValue?: number }) => `hsla(212, 35.0%, 9.2%, ${opacityValue})`,
  200: ({ opacityValue }: { opacityValue?: number }) => `hsla(216, 50.0%, 11.8%, ${opacityValue})`,
  300: ({ opacityValue }: { opacityValue?: number }) => `hsla(214, 59.4%, 15.3%, ${opacityValue})`,
  400: ({ opacityValue }: { opacityValue?: number }) => `hsla(214, 65.8%, 17.9%, ${opacityValue})`,
  500: ({ opacityValue }: { opacityValue?: number }) => `hsla(213, 71.2%, 20.2%, ${opacityValue})`,
  600: ({ opacityValue }: { opacityValue?: number }) => `hsla(212, 77.4%, 23.1%, ${opacityValue})`,
  700: ({ opacityValue }: { opacityValue?: number }) => `hsla(211, 85.1%, 27.4%, ${opacityValue})`,
  800: ({ opacityValue }: { opacityValue?: number }) => `hsla(211, 89.7%, 34.1%, ${opacityValue})`,
  900: ({ opacityValue }: { opacityValue?: number }) => `hsla(206, 100%, 50.0%, ${opacityValue})`,
  1000: ({ opacityValue }: { opacityValue?: number }) => `hsla(209, 100%, 60.6%, ${opacityValue})`,
  1100: ({ opacityValue }: { opacityValue?: number }) => `hsla(210, 100%, 66.1%, ${opacityValue})`,
  1200: ({ opacityValue }: { opacityValue?: number }) => `hsla(206, 98.0%, 95.8%, ${opacityValue})`,
}
export const gray = {
  100: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 8.5%, ${opacityValue})`,
  200: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 11.0%, ${opacityValue})`,
  300: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 13.6%, ${opacityValue})`,
  400: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 15.8%, ${opacityValue})`,
  500: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 17.9%, ${opacityValue})`,
  600: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 20.5%, ${opacityValue})`,
  700: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 24.3%, ${opacityValue})`,
  800: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 31.2%, ${opacityValue})`,
  900: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 43.9%, ${opacityValue})`,
  1000: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 49.4%, ${opacityValue})`,
  1100: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 62.8%, ${opacityValue})`,
  1200: ({ opacityValue }: { opacityValue?: number }) => `hsla(0, 0%, 93.0%, ${opacityValue})`,
}

const stitches = createStitches({
  prefix: 'mayumi',
  theme: {
    colors: {
      // refs: https://www.radix-ui.com/docs/colors/palette-composition/the-scales#colors
      // scale refs: https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
      'blue-100': blue[100]({ opacityValue: 1 }),
      'blue-200': blue[200]({ opacityValue: 1 }),
      'blue-300': blue[300]({ opacityValue: 1 }),
      'blue-400': blue[400]({ opacityValue: 1 }),
      'blue-500': blue[500]({ opacityValue: 1 }),
      'blue-600': blue[600]({ opacityValue: 1 }),
      'blue-700': blue[700]({ opacityValue: 1 }),
      'blue-800': blue[800]({ opacityValue: 1 }),
      'blue-900': blue[900]({ opacityValue: 1 }),
      'blue-1000': blue[1000]({ opacityValue: 1 }),
      'blue-1100': blue[1100]({ opacityValue: 1 }),
      'blue-1200': blue[1200]({ opacityValue: 1 }),
      'gray-100': gray[100]({ opacityValue: 1 }),
      'gray-200': gray[200]({ opacityValue: 1 }),
      'gray-300': gray[300]({ opacityValue: 1 }),
      'gray-400': gray[400]({ opacityValue: 1 }),
      'gray-500': gray[500]({ opacityValue: 1 }),
      'gray-600': gray[600]({ opacityValue: 1 }),
      'gray-700': gray[700]({ opacityValue: 1 }),
      'gray-800': gray[800]({ opacityValue: 1 }),
      'gray-900': gray[900]({ opacityValue: 1 }),
      'gray-1000': gray[1000]({ opacityValue: 1 }),
      'gray-1100': gray[1100]({ opacityValue: 1 }),
      'gray-1200': gray[1200]({ opacityValue: 1 }),
      // macos dev color palette - system main color
      // refs: https://developer.apple.com/design/human-interface-guidelines/foundations/color/
      blue: 'hsla(217.15,100%,53%,1)',
      red: '#fc2b2d',
      yellow: '#fecf0f',
      green: '#30d33b',
      gray: 'rgb(152,152,157)',
      cyan: '#4cbcf2',
      // Background --- #0
      base: '$gray-100',
      // Background --- #1
      elevated: '$gray-200',

      white: 'rgb(255 255 255)',
      black: 'rgb(0 0 0)',
      current: 'currentColor',

      // mac dark theme color preset
      // === Main === //
      textColor: '$gray-1200',
      labelColor: '#dddddd',
      secondaryLabelColor: '$gray-1100',
      tertiaryLabelColor: '#555555',
      quaternaryLabelColor: '$gray-600',
      textBackgroundColor: '$gray-200',
      linkColor: '#3586ff',
      // For placeholder text & with $unemphasizedSelectedContentBackgroundColor
      placeholderTextColor: '$tertiaryLabelColor',
      selectedTextColor: '$white',
      selectedTextBackgroundColor: '$blue-500',
      // Ring color
      keyboardFocusIndicatorColor: '$blue-700',
      // Ring color
      separatorColor: '$quaternaryLabelColor',
      // For unactive window
      unemphasizedSelectedTextBackgroundColor: '$gray-600',
      // For hover and selected item background color
      unemphasizedSelectedContentBackgroundColor: '$unemphasizedSelectedTextBackgroundColor',
      // === Tables === //
      // Table grid line colors
      gridColor: '$gray-100',
      // Table header text colors
      headerTextColor: '$white',
      alternateSelectedControlTextColor: '$white',
      // Odd table row background color
      alternatingContentBackgroundColor0: '$textBackgroundColor',
      // Even table row background color
      alternatingContentBackgroundColor1: '$gray-400',
      // Icon color
      controlAccentColor: '#0a60ff',
      controlColor: '$tertiaryLabelColor',
      controlBackgroundColor: '$textBackgroundColor',
      controlTextColor: '#d9d9d9',
      disabledControlTextColor: '#606060',
      selectedControlColor: '$blue-500',
      selectedControlTextColor: '$white',
      // Modal mask
      windowBackgroundColor: '$gray-400',
      underPageBackgroundColor: '$gray-200',
      findHighlightColor: '#ffff0b',
      shadowColor: '$black',

      // rename
      primary: '$blue',
      danger: '$red',
      warning: '$yellow',
      success: '$green',
      default: '$gray',
      info: '$cyan',
    },
    radii: {
      default: '0.25rem',
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    space,
    sizes: {
      ...space,
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      // width only
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      prose: '65ch',
      screenSM: '640px',
      screenMD: '768px',
      screenLG: '1024px',
      screenXL: '1280px',
      screen2XL: '1536px',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    lineHeights: {
      xs: '1rem',
      sm: '1.25rem',
      base: '1.5rem',
      lg: '1.75rem',
      xl: '1.75rem',
      '2xl': '2rem',
      '3xl': '2.25rem',
      '4xl': '2.5rem',
      '5xl': '1',
      '6xl': '1',
      '7xl': '1',
      '8xl': '1',
      '9xl': '1',
      // leading
      '3': '.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    fonts: {
      // TODO: remove default
      default: '"SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif',
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacings: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    zIndices: {
      '0': '0',
      '10': '10',
      '20': '20',
      '30': '30',
      '40': '40',
      '50': '50',
      auto: 'auto',
    },
    shadows: {
      xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': ' 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
      outline: '0px 0px 0px 1px $colors$shadowColor',
      focus: '0px 0px 0px 4px $colors$blue-700',
    },
    transitions: {
      default: getTransition([
        'color',
        'background-color',
        'border-color',
        'text-decoration-color',
        'fill',
        'stroke',
        'opacity',
        'box-shadow',
        'transform',
        'filter',
        'backdrop-filter',
      ]),
      none: 'none',
      all: 'all cubic-bezier(0.4, 0, 0.2, 1) 150ms',
      colors: getTransition([
        'color',
        'background-color',
        'border-color',
        'text-decoration-color',
        'fill',
        'stroke',
      ]),
      opacity: 'opacity cubic-bezier(0.4, 0, 0.2, 1) 150ms',
      shadow: 'box-shadow cubic-bezier(0.4, 0, 0.2, 1) 150ms',
      transform: 'transform cubic-bezier(0.4, 0, 0.2, 1) 150ms',
    },
  },
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 960px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
    // alias of sm
    tablet: '(min-width: 640px)',
    // alias of lg
    laptop: '(min-width: 1024px)',
    // alias of xl
    desktop: '(min-width: 1280px)',
  },
  utils: {
    /**
     * Spacing: Padding & Margin
     */
    p: (value: Stitches.PropertyValue<'padding'>) => ({
      padding: value,
    }),
    pt: (value: Stitches.PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
    }),
    pr: (value: Stitches.PropertyValue<'paddingRight'>) => ({
      paddingRight: value,
    }),
    pb: (value: Stitches.PropertyValue<'paddingBottom'>) => ({
      paddingBottom: value,
    }),
    pl: (value: Stitches.PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
    }),
    px: (value: Stitches.PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: Stitches.PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    m: (value: Stitches.PropertyValue<'margin'>) => ({
      margin: value,
    }),
    mt: (value: Stitches.PropertyValue<'marginTop'>) => ({
      marginTop: value,
    }),
    mr: (value: Stitches.PropertyValue<'marginRight'>) => ({
      marginRight: value,
    }),
    mb: (value: Stitches.PropertyValue<'marginBottom'>) => ({
      marginBottom: value,
    }),
    ml: (value: Stitches.PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
    }),
    mx: (value: Stitches.PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: Stitches.PropertyValue<'marginTop'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    /**
     * Display flex, and set `alignItems` & `justifyContent`
     */
    flexBox: (value: Stitches.PropertyValue<'alignItems'>) => ({
      display: 'flex',
      alignItems: value,
      justifyContent: value,
    }),
    /**
     * Border radius
     */
    rounded: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderRadius: value,
    }),
    roundedT: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopRightRadius: value,
      borderTopLeftRadius: value,
    }),
    roundedR: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopRightRadius: value,
      borderBottomRightRadius: value,
    }),
    roundedB: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderBottomRightRadius: value,
      borderBottomLeftRadius: value,
    }),
    roundedL: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopLeftRadius: value,
      borderBottomLeftRadius: value,
    }),
    roundedTL: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopLeftRadius: value,
    }),
    roundedTR: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderTopRightRadius: value,
    }),
    roundedBL: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderBottomLeftRadius: value,
    }),
    roundedBR: (value: Stitches.PropertyValue<'borderRadius'>) => ({
      borderBottomRightRadius: value,
    }),
    /**
     * Border width
     */
    bw: (value: Stitches.PropertyValue<'borderWidth'>) => ({
      borderWidth: value,
    }),
    /**
     * Typo
     */
    leading: (value: Stitches.PropertyValue<'lineHeight'>) => ({
      lineHeight: value,
    }),
    /**
     * linear gradient
     */
    linearGradient: (value: Stitches.PropertyValue<'backgroundImage'>) => ({
      backgroundImage: `linear-gradient(${value})`,
    }),
    /**
     * W & H
     */
    w: (value: Stitches.PropertyValue<'width'>) => ({ width: value }),
    h: (value: Stitches.PropertyValue<'height'>) => ({ height: value }),
    mw: (value: Stitches.PropertyValue<'maxWidth'>) => ({ maxWidth: value }),
    mh: (value: Stitches.PropertyValue<'maxHeight'>) => ({
      maxHeight: value,
    }),
    container: (value: Stitches.PropertyValue<'maxWidth'>) => ({ maxWidth: value }),
    size: (value: Stitches.PropertyValue<'width'>) => ({
      width: value,
      height: value,
    }),
    /**
     * Transforms
     */
    scale: (value: Stitches.PropertyValue<'scale'>) => ({
      transform: `scale(${value})`,
    }),
    /**
     * Combine fontsize and line-height
     */
    text: (value: Stitches.PropertyValue<'lineHeight'>) => ({
      lineHeight: value,
      fontSize: value,
    }),
    /**
     * macos glass filter
     */
    glass: (value: Stitches.PropertyValue<'width'>) => ({
      backgroundColor: rgba(cssVar('--mayumi-colors-underPageBackgroundColor', '#1e1e1e'), 0.85),
      backdropFilter: `blur(${value})`,
      '-webkit-backdrop-filter': `blur(${value})`,
    }),
    aspect: (value: 'video' | 'square' | string) => {
      let _value = 'auto'
      switch (value) {
        case 'video':
          _value = '16 / 9'
          break
        case 'square':
          _value = '1 / 1'
          break
        default:
          _value = value
          break
      }
      return {
        aspectRatio: _value,
      }
    },
  },
  themeMap: defaultThemeMap,
})

export const styled = stitches.styled
export const globalCss = stitches.globalCss
export const getCssText = stitches.getCssText
export type CSS = Stitches.CSS<typeof stitches['config']>
export type FontWeight = keyof typeof stitches.theme['fontWeights']
export type Space = keyof typeof stitches.theme['space']
export type Shadow = keyof typeof stitches.theme['shadows']
export type TextSize = keyof typeof stitches.theme['fontSizes']
