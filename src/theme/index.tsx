const breakpoints = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920,
}

const colors = {
  primary: '#333',
}

export const theme = {
  colors,
  breakpoints,
}

export type Theme = typeof theme

export type ThemeProps = { theme?: Theme }
