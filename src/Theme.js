import { createMuiTheme } from '@material-ui/core/styles';

function getTheme(lang) {
  const fontFamily =
    lang === 'en' ? "'Rajdhani', sans-serif" : "'Amiri', serif";
  const root = {
    color: 'white',
    fontFamily,
  };
  return createMuiTheme({
    direction: lang === 'en' ? 'ltr' : 'rtl',
    palette: {
      primary: {
        main: '#B9994E',
      },
    },
    overrides: {
      MuiInputBase: { root },
      MuiFormLabel: { root },
      MuiOutlinedInput: {
        notchedOutline: {
          borderColor: 'white',
        },
      },
      MuiFormHelperText: { root },
      MuiButton: {
        root: {
          fontFamily,
          fontSize: '0.95rem',
          textTransform: 'initial',
        },
        containedPrimary: {
          color: 'white',
        },
      },
    },
  });
}

export { getTheme };
