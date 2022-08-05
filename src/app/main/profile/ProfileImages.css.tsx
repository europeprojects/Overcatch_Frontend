import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutHeader: {
      height: 100,
      minHeight: 130,
      [theme.breakpoints.down('md')]: {
          height: 120,
          minHeight: 130
      }
    },
    cropContainer: {
      position: 'relative',
      width: '100%',
      height: 200,
      background: '#333',
      [theme.breakpoints.up('sm')]: {
        height: 400,
      },
    },
    cropButton: {
      flexShrink: 0,
      marginLeft: 16,
    },
    controls: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    sliderContainer: {
      display: 'flex',
      flex: '1',
      alignItems: 'center',
    },
    sliderLabel: {
      [theme.breakpoints.down('xs')]: {
        minWidth: 65,
      },
    },
    slider: {
      padding: '22px 0px',
      marginLeft: 16,
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: '0 16px',
      },
    },
  }),
);

export default useStyles;
