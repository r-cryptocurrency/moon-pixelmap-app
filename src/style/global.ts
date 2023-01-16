import { createGlobalStyle } from "styled-components";

const globalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    background-color: #0f1932 !important;
    overflow-x: hidden;
  }
  * {
    box-sizing: border-box;
    font-family: 'Quicksand', sans-serif;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #4c5364;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #9ca1ad;
  }
  
  ::-webkit-scrollbar-corner{
    background-color: #4c5364;
  }

  a {
    text-decoration: none;
    color: #97afd5;
  }

  p {
    color: #97afd5;
  }

  .SnackbarContainer-root {
    z-index: 200000 !important;
  }
`;

export default globalStyle;
