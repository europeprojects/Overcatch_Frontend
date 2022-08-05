import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles,Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import api from "../../services/BackendApi";
import {useTranslation} from "react-i18next";
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import {BankMasterDTO} from "../../types/UserModel";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import {
    Grid,
    Button,
    Icon,
    IconButton,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
    TableContainer,
    TextField
} from '@material-ui/core';
//import {Theme, useTheme} from "@emotion/react";
import FuseAnimate from '@fuse/core/FuseAnimate';
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import {useFormik} from "formik";
import {bankMasterScheme, exportSettingsScheme} from "../validations/ValidationSchemes";
import {withSnackbar} from "notistack";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {Div} from "../../components/Grid";
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
    return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const {t} = useTranslation('task');
    const headCells = [
        {id: 'bankMaster', numeric: true, disablePadding: false, label: t("BANKNAME")},
        {id: 'edit', numeric: true, disablePadding: false, label: t("EDIT")},
    ];

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
  };


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        //maxHeight: 280
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
    },
    container:{
        maxHeight: 400
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

function BankMasterManager(props: any) {
    const classes = useStyles();
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [buyer, setBuyer] = useState<BankMasterDTO>();
    const [bankList, setbankList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDetail, setOpenDetail] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedType, setSelectedType] = useState<BankMasterDTO>({} as BankMasterDTO);
    const [bank, setbank] = useState<BankMasterDTO>({} as BankMasterDTO);
    const [id, setId] = useState();
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: bankMasterScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSave(values)
            // alert(JSON.stringify(values))
        },

    });

    function getBankMaster () {
        api.getAllBankMaster().then(res => {

            setbankList(res)

        })
    }

    useEffect(() => {
        getBankMaster()
    }, [])

    // useEffect(() => {

    // }, [expensesList])

    const handleSave = (values) => {

        let bankMaster: BankMasterDTO;
        bankMaster = {
            id: null,
            name: formik.values.name
        }
        let control = bankList?.filter(bank =>bank.name==bankMaster?.name).length
        if(control>0){
            props.enqueueSnackbar(<h4>{t('BANKWITHNAME')}</h4>,{
                variant: 'error',
            })
        }else{
            api.saveBankMaster(bankMaster).then(res => {
                //window.location.reload(false)
                getBankMaster()

            })
        }
        setOpen(false);
        return bankMaster;
    };

    const handleClickDetail = (event, row) => {
        setSelectedType(row);
        setOpenDetail(true);
    };
    const handleUpdate = (values) => {

        api.controlBankMasterForDelete(selectedType.name).then ((res)=>{
                if (res>1){
                    props.enqueueSnackbar(<h4>{t("BANKINUSE")}</h4>,{
                        variant: 'error',
                    })
                }else{
                    api.updateBankMaster(bank).then(res => {
                        //window.location.reload(false)
                        getBankMaster()

                    })
                }
                setOpenDetail(false);

            }
        )


    };

    const handleClickDelete = (row) => {
        setbank(row);
        setOpenDelete(true);
    };

    const handleClickPost = () => {
        formik.values.name = '';
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
    const [orderBy, setOrderBy] = React.useState('calories');
    const {t}=useTranslation('document');
    // @ts-ignore

    const handleDelete = (event) => {
        api.controlBankMasterForDelete(bank?.name).then ((res)=>{

                if (res>1){
                    props.enqueueSnackbar(<h4>{t("BANKINUSE")}</h4>,{
                        variant: 'error',
                    })
                }else{
                    api.deleteBankMaster(id).then(res => {
                            getBankMaster()

                            // window.location.reload(false)
                            // });

                        }
                    )
                }
                setOpenDelete(false);
            }
        )
    };

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={

                <Div columns={6} className={'my-auto'}>
                    <div className="flex flex-center">
                        <div className="flex-none mt-16 mb-12">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Icon className="insert_drive_file">monetization_on</Icon>
                            </FuseAnimate>
                        </div>
                        <div className="flex-none mt-12 mb-12">
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography variant="h6">
                                    {t("ADDBANKNAME")}
                                </Typography>
                            </FuseAnimate>
                        </div>
                    </div>

                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>

                    <div className="flex-1 mt-12 mb-12 my-16 flex-end">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Button className={"w-full"} variant="contained" color="default"
                                    onClick={() => handleClickPost()}
                            >   {t("NEWBANKNAME")}
                            </Button>
                        </FuseAnimate>
                    </div>
                </Div>
            }
            content={
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                    <TableContainer
                        //component={Paper}
                        className={classes.container}>
                        <Table
                            stickyHeader={true}
                            aria-label="sticky table"
                            className={classes.table}
                            size={"medium"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align={"center"}>
                                        {t("BANKNAME")}
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
                                {stableSort(bankList, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell
                                                    onClick={() => handleClickOpen(row)}
                                                >
                                                    {row.name}
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    <IconButton
                                                        onClick={event => {
                                                            handleClickDetail(event, row)
                                                            setbank(row)
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
                                                            handleClickDelete(row)
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
                    </Paper>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={3}
                        component="div"
                        count={bankList?.length}
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
                                            {t("NEWBANKNAME")}
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
                                                                name={"name"}                                                                id="name"
                                                                label={t("BANKNAME")}
                                                                variant="outlined"
                                                                value={formik.values.name}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                                helperText={formik.touched.name && formik.errors.name}
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
                                        {t("EDIT")}

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
                                                            name={"name"}
                                                            id="name"
                                                            label={t("BANKNAME")}
                                                            variant="outlined"
                                                            // value={formik.values.expensesType}
                                                            // onChange={formik.handleChange}
                                                            // error={formik.touched.expensesType && Boolean(formik.errors.expensesType)}
                                                            // helperText={formik.touched.expensesType && formik.errors.expensesType}
                                                            value={bank.name}
                                                            onChange={(e)=>{setbank({...bank,name:e.target.value})}}
                                                            fullWidth={true}
                                                            className={"object-center"}
                                                        />
                                                    </Grid>
                                                </Grid>


                                            </div>
                                        </div>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus color="primary" onClick={handleUpdate}> {t("SAVECHANGES")}</Button>
                                    </DialogActions>
                                    {/*</form>*/}
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
                                    <DialogTitle id="alert-dialog-title">{t("DELETEBANKNAME")}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            {t("DELETESURE")}
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

export default withSnackbar(BankMasterManager);