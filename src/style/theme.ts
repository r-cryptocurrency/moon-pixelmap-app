import {createTheme} from '@mui/material'

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: 'rgba(0, 0, 0, .8)',
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, .8)',
          padding: '10px 30px',
          maxWidth: 'fit-content'
        },
      }
    }
  }
});

export default theme