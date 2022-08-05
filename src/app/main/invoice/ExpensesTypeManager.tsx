import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, Theme, ThemeProvider, useTheme, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import { useHistory } from 'react-router-dom';
import {
    Grid, Button, Icon, IconButton, TablePagination, TableSortLabel, Toolbar, Tooltip,
    Typography, TableContainer, TextField, Menu, MenuList, MenuItem, ListItemIcon, ListItemText
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {func, number, object, oneOf, string} from 'prop-types';
import {ExpensesType} from "../../types/UserModel";
import api from "../../services/BackendApi"
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import FuseAnimate from '@fuse/core/FuseAnimate';
import Paper from '@material-ui/core/Paper';
import {exportSettingsScheme} from "../validations/ValidationSchemes";
import { withSnackbar } from 'notistack';
import {Div} from "../../components/Grid";
import Input from "@material-ui/core/Input";
import {selectMainTheme} from "../../store/fuse/settingsSlice";
import {useSelector} from 'react-redux';
import {marginTop} from "html2canvas/dist/types/css/property-descriptors/margin";
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

const headCells = [
    {id: 'type', numeric: false, disablePadding: true, label: 'Expenses Type'},
    {id: 'edit', numeric: true, disablePadding: false, label: 'Edit'},
    {id: 'delete', numeric: true, disablePadding: false, label: 'Delete'},

];

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                { headCells.map(headCell =>  (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: object.isRequired,
    numSelected: number.isRequired,
    onRequestSort: func.isRequired,
    onSelectAllClick: func.isRequired,
    order: oneOf(['asc', 'desc']).isRequired,
    orderBy: string.isRequired,
    rowCount: number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    title: {
        flex: '1 1 100%'
    }
}));

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const {numSelected} = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Support List
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        // maxHeight: 280
    },
    table: {
        minWidth: 750
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}));

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

function ProductsTableHead(props) {

    const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
    const {t} = useTranslation('task');

    const rows = [

        {
            id: 'topic',
            align: 'left',
            disablePadding: false,
            label:t("TOPİC"),
            sort: true
        },
        {
            id: 'email',
            align: 'left',
            disablePadding: false,
            label:t("RESPONSIBLEEMAIL"),
            sort: true
        },
        {
            id: 'duration',
            align: 'Left',
            disablePadding: false,
            label:t("CLOSEDURATION"),
            sort: true
        },
        {
            id: 'action',
            align: 'left',
            disablePadding: false,
            label:t("ACTION"),
            sort: true
        },

    ];

    function openSelectedProductsMenu(event) {
        setSelectedProductsMenu(event.currentTarget);
    }

    function closeSelectedProductsMenu() {
        setSelectedProductsMenu(null);
    }

    return (
        <TableHead>
            <TableRow className="h-64">
                <TableCell padding="none" className="w-40 md:w-64 text-center z-99">
                    {props.numSelected > 0 && (
                        <div
                            className={clsx(
                                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',
                            )}
                        >
                            <IconButton
                                aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                                aria-haspopup="true"
                                onClick={openSelectedProductsMenu}
                            >
                                <Icon>more_horiz</Icon>
                            </IconButton>
                            <Menu
                                id="selectedProductsMenu"
                                anchorEl={selectedProductsMenu}
                                open={Boolean(selectedProductsMenu)}
                                onClose={closeSelectedProductsMenu}
                            >
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            closeSelectedProductsMenu();
                                        }}
                                    >
                                        <ListItemIcon className="min-w-40">
                                            <Icon>delete</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary="Remove"/>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    )}
                </TableCell>
                {rows.map(row => {
                    return (
                        <TableCell
                            className="p-12 md:p-16"
                            key={row.id}
                            //@ts-ignore
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={props.order.id === row.id ? props.order.direction : false}
                        >
                            {  row.sort &&row.label }
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

function ExpensesTypeManager(props: any) {

    const classes = useStyles();
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [buyer, setBuyer] = useState<ExpensesType>();
    const [expensesList, setExpensesList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDetail, setOpenDetail] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedType, setSelectedType] = useState();
    const [expense, setExpense] = useState<ExpensesType>({} as ExpensesType);
    const [id, setId] = useState();
    const mainTheme = useSelector(selectMainTheme);
    const [search, setSearch] = useState<string>("");
    const formik = useFormik({
        initialValues: {
            expensesType: ''
        },
        validationSchema: exportSettingsScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSave(values)
        },

    });

    const [filtered,setFiltered]=useState([]);

    function getExpensesType() {
        api.getExpensesType().then(res => {
            setExpensesList(res)
            setFiltered(res)
        })
    }

    useEffect(() => {
        getExpensesType()
    }, [])

    useEffect(() => {

        expensesTypeSearch(search)
    }, [search])

    const expensesTypeSearch =(searched)=>
    {
        console.log(expensesList);
        let filteredData = expensesList.filter(expenses =>expenses.expensesType.toLowerCase().includes(searched.toLowerCase())).map((expenses)=>{
            return expenses;
        })
        setFiltered(filteredData);

    }
    const handleClear = ()=>{
            setSearch("");
    }

    const handleSave = (values) => {

        let expensesType: ExpensesType;
        expensesType = {
            id: null,
            expensesType: formik.values.expensesType
        }

        api.saveExpensesType(expensesType).then(res => {
            getExpensesType()
        })

        setOpen(false);
        return expensesType;
    };

    const handleSaveDetail = (values) => {
        //@ts-ignore
        api.controlExpenseForDelete(selectedType?.id).then(
            (res) => {
                if (res < 1) {
                    // @ts-ignore
                    api.updateExpensesType(expense).then(res => {
                        handleClose();
                        getExpensesType()
                    })
                } else {
                    props.enqueueSnackbar(<h4>{t("CANTDELETE")}</h4>, {
                        variant: 'error',
                    })
                    setOpenDetail(false);
                }
            }
        )
    };

    const handleClickDetail = (event, row) => {
        setSelectedType(row);
        setOpenDetail(true);
    };
    const handleClickDelete = (event, row) => {
        setSelectedType(row);
        setOpenDelete(true);
    };

    const handleClickPost = () => {
        formik.values.expensesType = '';
        setOpen(true);
    };


    const handleClickOpen = (selectedBuyer) => {
        setBuyer(selectedBuyer);
        setOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenDetail(false);
        setOpenDelete(false);
    };
    const handleDelete = (event) => {
        //@ts-ignore
        api.controlExpenseForDelete(selectedType?.id).then(
            (res)=>{
                if(res<1){
                    // @ts-ignore
                    api.deleteExpenseTypeById(selectedType?.id).then(res=>{setExpensesList(expensesList?.filter(i => i.id !== selectedType?.id))});
                    setOpenDelete(false)
                    getExpensesType()
                }else{
                    props.enqueueSnackbar(<h4>{t("CANTDELETE")}</h4>, {
                        variant: 'error',
                    })
                    setOpenDelete(false);
                }
            }
        )
    };

    const [orderBy, setOrderBy] = React.useState('calories');
    const {t} = useTranslation('task');
    // @ts-ignore
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <Grid container spacing={3} direction="column"
                      justify="space-between"
                      alignItems="stretch">
                    <Grid item xs={12} sm={4}>
                    <div className="flex flex-center">
                        <div className="flex-none mt-16 mb-12">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Icon className="insert_drive_file">monetization_on</Icon>
                            </FuseAnimate>
                        </div>
                        <div className="flex-none mt-12 mb-12">
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography variant="h6">
                                    {t("EXPENSESTYPESETTINGS")}
                                </Typography>
                            </FuseAnimate>
                        </div>
                    </div>
                    </Grid>
                    <Grid xs={12} sm={6}>
                    <div className="flex flex-1 items-center justify-center px-12" style={{marginTop : "25px"}}>
                        <ThemeProvider theme={mainTheme}>
                            <FuseAnimate animation="transition.slideDownIn" delay={300}>
                                <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
                                    <Icon color="action">{t("SEARCH")}</Icon>

                                    <Input
                                        placeholder={t("SEARCHFORANYTHING")}
                                        className="flex flex-1 mx-8"
                                        disableUnderline
                                        fullWidth
                                        value={search}
                                        inputProps={{
                                            'aria-label': 'Search'
                                        }}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </Paper>
                            </FuseAnimate>
                        </ThemeProvider>
                        <Button
                            className="ml-5 rounded-8 bg-white"
                            variant="contained"
                            onClick={handleClear}
                        >
                            {t('CLEAR')}
                        </Button>
                    </div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    <div className="flex-1 mt-12 mb-12 my-16 flex-end">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Button className={"w-full"} variant="contained" color="default"
                                    onClick={() => handleClickPost()}
                            >   {t("NEWEXPENSES")}
                            </Button>
                        </FuseAnimate>
                    </div>
                    </Grid>
                </Grid>
            }
            content={
                <div className={classes.root}>
                    <TableContainer className={classes.paper}>
                        <Table
                            stickyHeader={true}
                            aria-label="sticky table"
                            className={classes.table}
                            size={"medium"}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align={"center"}>
                                        {t("EXPENSESTYPELIST")}
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        {t("EDIT")}
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        {t("DELETE")}
                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(filtered, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (

                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell
                                                    onClick={() => handleClickOpen(row)}
                                                >
                                                    {row?.expensesType}
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    <IconButton
                                                        onClick={event => {
                                                            handleClickDetail(event, row)
                                                            setExpense(row)
                                                        }}
                                                    >
                                                        <Icon color="secondary">create</Icon>
                                                    </IconButton>

                                                </TableCell>

                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <IconButton
                                                        onClick={event => {
                                                            handleClickDelete(event, row)
                                                            setId(row.id)
                                                        }}
                                                    >
                                                        <Icon color="secondary">delete</Icon>
                                                    </IconButton>
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={3}
                        component="div"
                        count={expensesList?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />

                    <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                        <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                            <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                                <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                        aria-labelledby="customized-dialog-title" open={open}>
                                    <form onSubmit={formik.handleSubmit}>
                                        <DialogTitle id="customized-dialog-title">
                                            {t("NEWEXPENSESTYPE")}
                                        </DialogTitle>
                                        <DialogContent dividers>
                                            <div className={"w-full p-32"}>
                                                <div className={"w-full"}>

                                                    <Grid
                                                        container
                                                        direction="row"
                                                        justify="space-evenly"
                                                        alignItems="center"
                                                        spacing={3}
                                                    >
                                                        <Grid item xs>
                                                            <TextField
                                                                name={"expensesType"}
                                                                id="helpTypeShowName"
                                                                label={t("")}
                                                                variant="outlined"
                                                                value={formik.values.expensesType}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.expensesType && Boolean(formik.errors.expensesType)}
                                                                helperText={formik.touched.expensesType && formik.errors.expensesType}
                                                                fullWidth={true}
                                                                className={"object-center"}
                                                            />
                                                        </Grid>
                                                    </Grid>


                                                </div>
                                            </div>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus type={"submit"} color="primary"> {t("SAVECHANGES")}</Button>
                                            <Button onClick={handleClose} color="primary"> {t("CLOSE")}</Button>
                                        </DialogActions>
                                    </form>
                                </Dialog>
                            </Paper>
                        </FuseAnimate>
                    </div>
                    <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                        <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                            <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                                <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                        aria-labelledby="customized-dialog-title" open={openDetail}>
                                    {/*<form onSubmit={formik.handleSubmit}>*/}
                                    <DialogTitle id="customized-dialog-title">
                                        {t("DETAILPAGE")}

                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <div className={"w-full p-32"}>
                                            <div className={"w-full"}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="space-evenly"
                                                    alignItems="center"
                                                    spacing={3}
                                                >
                                                    <Grid item xs>
                                                        <TextField
                                                            name={"expensesType"}
                                                            id="helpTypeShowName"
                                                            label={t("TOPICOFREQUEST")}
                                                            variant="outlined"
                                                            value={expense.expensesType}
                                                            onChange={(e)=>{setExpense({...expense,expensesType:e.target.value})}}
                                                            fullWidth={true}
                                                            className={"object-center"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus type={"submit"} color="primary" onClick={handleSaveDetail}> {t("SAVECHANGES")}</Button>
                                        <Button  color="primary" onClick={handleClose}> {t("CLOSE")}</Button>
                                    </DialogActions>
                                </Dialog>
                            </Paper>
                        </FuseAnimate>
                    </div>
                    <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                        <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                            <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                                <Dialog
                                    open={openDelete}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{t("EXPENSEDELETE")}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            {t("AREYOUSURETODELETE")}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            {t('NO')}
                                        </Button>
                                        <Button onClick={(e)=>{handleDelete(e)}} color="primary" autoFocus>
                                            {t('YES')}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Paper>
                        </FuseAnimate>
                    </div>
                </div>
            }
            innerScroll
        ></FusePageCarded>
    );
}
export default withSnackbar(ExpensesTypeManager);