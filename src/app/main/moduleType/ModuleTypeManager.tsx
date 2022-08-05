import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import api from "../../services/BackendApi";
import {useTranslation} from "react-i18next";
import {Button, Chip, Grid, Icon, TextField} from "@material-ui/core";
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import {HelpType, ModuleTypeDTO} from "../../types/UserModel";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {useFormik} from "formik";
import {moduleTypeManager} from "../validations/ValidationSchemes";
import FuseAnimate from '@fuse/core/FuseAnimate';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {closeEditContactDialog, closeNewContactDialog} from "../user/store/contactsSlice";
import IconButton from "@material-ui/core/IconButton";
import {Div} from "../../components/Grid";
import {Autocomplete} from "@material-ui/lab";

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
        {id: 'moduleType', numeric: true, disablePadding: false, label: t("MODULETYPE"),sortable:false},
        {id: 'email', numeric: true, disablePadding: false, label: t("EMAIL"),sortable:false},
        {id: 'edit', numeric: true, disablePadding: false, label: t("EDIT"),sortable:false},
    ];

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={"center"}
                        padding={'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable ?

                            (
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
                            ):headCell.label
                        }


                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
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
        width: 1,
    },
    container: {
        maxHeight: 550
    },
    dialog:{
        backgroundColor: 'transparent',
        opacity: 0.1,
        boxShadow: "1px 3px 1px #9E9E9E"
    }

}));

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [moduleList, setModuleList] = React.useState([]);
    const [moduleType, setModuleType] = React.useState<ModuleTypeDTO>({} as ModuleTypeDTO);
    const [value, setValue] = useState<ModuleTypeDTO>({} as ModuleTypeDTO);

    const [open, setOpen] = React.useState(false);

    function getModuleTypes() {
        api.getAllModuleTypes().then(res => {
            setModuleList(res)
        })
    }
    useEffect(() => {
        getModuleTypes()
    }, [])

    let idOfModuleType = 0;

    useEffect(() => {
        if(moduleType.id){
        api.getModuleTypeId(moduleType?.id).then((res)=>{
            idOfModuleType = res;
        })}
    }, [moduleType.id])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = moduleList.map((n) => n.moduleTypeEnum);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };


    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, moduleList.length - page * rowsPerPage);
    const {t} = useTranslation('task');

    const formik = useFormik({
        initialValues: {
            responsibleEmail:'',
            moduleTypeEnum:''
        },
        validationSchema: moduleTypeManager,
        onSubmit: (values) => {
            handleSaveDetail(values);
        },
    });

    const handleSaveDetail = (values) => {

        value.id = moduleType?.id;
        value.moduleTypeId = moduleType?.moduleTypeId;
        value.name = moduleType?.name;
        value.moduleTypeEnum = moduleType?.moduleTypeEnum;
        value.responsibleEmail = formik.values.responsibleEmail;

        api.updateModuleType(value).then(res => {
            getModuleTypes()
            handleClose();
            // window.location.reload(false)
        })
    }

    const handleClickRow = (event, moduleType) => {
        formik.values.responsibleEmail = moduleType?.responsibleEmail
        formik.values.moduleTypeEnum = moduleType?.moduleTypeEnum

        setModuleType(moduleType);
        setOpen(true);
    };

    // @ts-ignore
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex flex-1 flex-col items-center sm:items-start">
                        {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                        <h1>{t("MODULETYPESETTINGS")}</h1>
                    </div>
                </div>
            }
            content={
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <TableContainer className={classes.container}>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                                aria-label="enhanced table"
                                stickyHeader={true}
                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={moduleList.length}
                                />
                                <TableBody>
                                    {stableSort(moduleList, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.moduleTypeEnum);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.moduleTypeEnum)}
                                                    role="checkbox"
                                                    //aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.moduleTypeEnum}
                                                    //selected={isItemSelected}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row" padding="normal">
                                                        {row.moduleTypeEnum}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.responsibleEmail}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            onClick={event => {handleClickRow(event, row)}}
                                                            color={"secondary"}
                                                        >
                                                            <Icon>edit</Icon>
                                                        </Button>
                                                    </TableCell>
                                                    <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                                                        <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                                                    <Paper className=" rounded-0">
                                                    <Dialog fullWidth={true} maxWidth={"md"} open={open}
                                                            //onClose={handleClose}
                                                            aria-labelledby="customized-dialog-title"
                                                            className={classes.dialog}>
                                                        <form onSubmit={formik.handleSubmit}>
                                                            <DialogTitle id="customized-dialog-title">
                                                                {t("MODULETYPESETTINGS")}
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
                                                                                    fullWidth={true}
                                                                                    label={t("MODULETYPE")}
                                                                                    className={"object-center"}
                                                                                    name="moduleTypeEnum"
                                                                                    disabled={true}
                                                                                    value={formik.values.moduleTypeEnum}
                                                                                    error={formik.touched.moduleTypeEnum && Boolean(formik.errors.moduleTypeEnum)}
                                                                                    helperText={formik.touched.moduleTypeEnum && formik.errors.moduleTypeEnum}
                                                                                    onChange={formik.handleChange}
                                                                                    variant="outlined"/>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid
                                                                            container
                                                                            direction="row"
                                                                            justify="space-evenly"
                                                                            alignItems="center"
                                                                            spacing={3}>
                                                                            <Grid item xs>
                                                                                <TextField
                                                                                    fullWidth={true}
                                                                                    className={"object-center"}
                                                                                    name="responsibleEmail"
                                                                                    type="email"
                                                                                    value={formik.values.responsibleEmail}
                                                                                    error={formik.touched.responsibleEmail && Boolean(formik.errors.responsibleEmail)}
                                                                                    helperText={formik.touched.responsibleEmail && formik.errors.responsibleEmail}
                                                                                    onChange={formik.handleChange}
                                                                                    label={t("EMAIL")}
                                                                                    variant="outlined"/>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button autoFocus
                                                                        type="submit"
                                                                        color="primary"
                                                                >
                                                                    {t("SAVECHANGES")}
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    onClick={handleClose}>
                                                                    {t("CLOSE")}
                                                                </Button>
                                                            </DialogActions>
                                                        </form>
                                                    </Dialog>
                                                    </Paper>
                                                    </FuseAnimate>
                                                    </div>

                                                    {/*<Dialog*/}
                                                    {/*        fullWidth={true}*/}
                                                    {/*        maxWidth={"md"}*/}
                                                    {/*        onClose={handleClose}*/}
                                                    {/*        aria-labelledby="customized-dialog-title"*/}
                                                    {/*        open={open}>*/}
                                                    {/*    <DialogTitle id="customized-dialog-title"></DialogTitle>*/}
                                                    {/*    <DialogContent >*/}
                                                    {/*        <div className={"w-full p-32"}>*/}
                                                    {/*            <div className={"w-full"}>*/}
                                                    {/*                <Grid*/}
                                                    {/*                    container*/}
                                                    {/*                    direction="row"*/}
                                                    {/*                    justify="space-evenly"*/}
                                                    {/*                    alignItems="center"*/}
                                                    {/*                    spacing={3}*/}
                                                    {/*                >*/}
                                                    {/*                    <Grid item xs>*/}
                                                    {/*                        <TextField*/}
                                                    {/*                            name={"moduleType"}*/}
                                                    {/*                            id="moduleTypeName"*/}
                                                    {/*                            type={"mail"}*/}
                                                    {/*                            label={t("MODULETYPE")}*/}
                                                    {/*                            disabled={true}*/}
                                                    {/*                            value={moduleType?.moduleTypeEnum}*/}
                                                    {/*                            variant="outlined"*/}
                                                    {/*                            fullWidth={true}*/}
                                                    {/*                            className={"object-center"}*/}
                                                    {/*                        />*/}
                                                    {/*                    </Grid>*/}
                                                    {/*                </Grid>*/}
                                                    {/*                <Grid*/}
                                                    {/*                    container*/}
                                                    {/*                    direction="row"*/}
                                                    {/*                    justify="space-evenly"*/}
                                                    {/*                    alignItems="center"*/}
                                                    {/*                    spacing={3}*/}
                                                    {/*                >*/}
                                                    {/*                    <Grid item xs>*/}
                                                    {/*                        <TextField*/}
                                                    {/*                            name={"moduleType"}*/}
                                                    {/*                            id="moduleTypeEmail"*/}
                                                    {/*                            label={t("EMAIL")}*/}
                                                    {/*                            type="email"*/}
                                                    {/*                            value={moduleType?.responsibleEmail}*/}
                                                    {/*                            onChange={(e)=>{*/}
                                                    {/*                                setModuleType({...moduleType,responsibleEmail:e.target.value});*/}
                                                    {/*                            }}*/}
                                                    {/*                            variant="outlined"*/}
                                                    {/*                            fullWidth={true}*/}
                                                    {/*                            className={"object-center"}*/}
                                                    {/*                        />*/}
                                                    {/*                    </Grid>*/}
                                                    {/*                </Grid>*/}
                                                    {/*            </div>*/}
                                                    {/*        </div>*/}

                                                    {/*    </DialogContent>*/}
                                                    {/*    <DialogActions>*/}
                                                    {/*        <Button autoFocus*/}
                                                    {/*                type="submit"*/}
                                                    {/*                onClick={(e)=>{handleSaveDetail(e)}} color="primary"*/}
                                                    {/*                >*/}
                                                    {/*            {t("SAVECHANGES")}*/}
                                                    {/*        </Button>*/}
                                                    {/*        <Button autoFocus*/}
                                                    {/*                color="primary"*/}
                                                    {/*                onClick={handleClose}>*/}
                                                    {/*            {t("CLOSE")}*/}
                                                    {/*        </Button>*/}
                                                    {/*    </DialogActions>*/}
                                                    {/*</Dialog>*/}
                                                </TableRow>
                                            );
                                        })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={moduleList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            }
            innerScroll
        ></FusePageCarded>
    );
}