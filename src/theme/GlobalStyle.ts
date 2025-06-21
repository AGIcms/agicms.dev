import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;

    &:focus {
      outline: none;
    }
  }

  html, body{
    height: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: Roboto, sans-serif, Tahoma, Helvetica;
    font-size: 14px;
  }

  #__next {
    height: 100%;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  pre, code {
    white-space: pre-line !important;
  }

  button{
    &:enabled {
      cursor: pointer;
    }
  }

`
