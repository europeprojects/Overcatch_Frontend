import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import api from "../../../services/BackendApi";
import FusePageSimple from "../../../../@fuse/core/FusePageSimple";
import {
    Button, ButtonGroup, Checkbox,
    Grid, ListItemText, MenuItem,
    Paper,
    Select,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField
} from "@material-ui/core";
import {withSnackbar} from "notistack";
import Input from "@material-ui/core/Input";
import {string} from "prop-types";
import {Link} from "react-router-dom";
import {Alert} from "@material-ui/lab";
import {useTranslation} from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    layoutRoot: {

    },
    paper: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: '#172a3a',
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"},
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        // fontWeight: theme.typography.fontWeightRegular,
    },
    rootProgress:{
        flexGrow: 15,
        padding: 11,
        marginTop: 1,
    },
    table: {
        minWidth: 650,
    },
}));
const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

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
interface Column {
    id: 'invoiceCode' | 'invoiceType' | 'invoiceDate' | 'buyerName' | 'total' | 'currencyOfPayment';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'invoiceCode', label: 'Invoice Code'},
    {id: 'invoiceType', label: 'Invoice Type',},
    {id: 'buyerName', label: 'Bill Recipient'},
    {id: 'total', label: 'Total', align: 'right'},
    {id: 'currencyOfPayment', label: 'Currency', align: 'right'},
    {id:'invoiceDate', label:'Date'}
];
function CompletedTasks(props:any) {
    const classes = useStyles();
    const {t} = useTranslation("task");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [done,setDone] = useState([]);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - done?.length) : 0;

    function handleClear() {
        //setSearch('');
        setPage(0)
        setRowsPerPage(25)
       // getLetters()
    }
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function getDone() {
        api.getCompletedTasks().then((resp)=>{
            console.log(resp,"resp");
            setDone(resp);
        });

    }
    useEffect(()=>{
        getDone()
    },[]);

    useEffect(()=>{
        console.log(done,"Done")
    },[done])
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <Grid
                    container
                    direction="row"
                    // justify="space-between"
                    alignItems="center"
                    style={{paddingLeft:'10px',paddingRight:'10px'}}
                >
                    <Grid item xs={6} sm={1}>
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            <h2>{t("TASKREPORTS")}</h2>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={11}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center">
                            <Grid item xs={6} sm={3}
                                  style={{textAlign:'right'}}>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="invoiceDate"
                                    color={'secondary'}
                                    className={"object-center"}
                                    id="date"
                                    label={t('FIRSTDATE')}
                                    // value={forFilter?.invoiceDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:'1000-01-01'
                                    }}
                                    variant="outlined"
                                    // onChange={handleChangeForFilter}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="invoiceEndDate"
                                    className={"object-center"}
                                    id="date"
                                    label={t('LASTDATE')}
                                    // value={forFilter?.invoiceEndDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:'1000-01-01'
                                    }}
                                    variant="outlined"
                                    // onChange={handleChangeForFilter}
                                />
                            </Grid>
                            <Grid xs={6} sm={3}>
                                <Button
                                    className="ml-5 rounded-8"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {handleClear()}}
                                >
                                    {("CLEAR")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            content={
                <div>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                    >
                        <Grid xs={6} sm={4}>
                            {/*<h1 style={{color:'red',textAlign:'center'}}>Total Income : <label>{totalIncome}</label></h1>*/}
                            <TextField
                                variant="outlined"
                                name="totalIncome"
                                disabled={true}
                                fullWidth={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                // value={totalIncome?.toFixed(2)}
                                label={t("NUMBEROFTASKS")}
                            />
                        </Grid>
                        <Grid xs={6} sm={4}>
                            {/*<h1 style={{color:'red',textAlign:'center'}}>Total Expense :  <label>{totalExpense}</label></h1>*/}
                            <TextField
                                //onChange={}
                                variant="outlined"
                                name="totalExpense"
                                disabled={true}
                                fullWidth={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                // value={totalExpense?.toFixed(2)}
                                label={t("COMPLETED")}
                            />
                        </Grid>
                        <Grid xs={12} sm={4}>
                            {/*<h1 style={{color:'red',textAlign:'center'}}>Total :  <label>{totalIncome-totalExpense}</label></h1>*/}
                            <TextField
                                //onChange={}
                                variant="outlined"
                                name="total"
                                disabled={true}
                                fullWidth={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                // value={(totalIncome-totalExpense)?.toFixed(2)}
                                label={t("BACKLOG")}
                            />
                        </Grid>
                        <TableContainer component={Paper} className={classes.paper}>
                            <Table className={classes.table} aria-label="simple table" size={"small"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align={"center"}>
                                            {t('TASKMODULE')}
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            {t('DATECREATED')}
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            {t('DATECOMPLETED')}
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            {t('APPROVEDBY')}
                                        </TableCell>
                                        <TableCell>
                                            {t('DURATION')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {done?.map((row)=>{
                                        return(
                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                {/*{columns?.map((column)=>{*/}
                                                {/*    const value = row[column.id];*/}
                                                {/*    return (*/}
                                                {/*        <TableCell*/}
                                                {/*            // onClick={() => handleClickOpen(row)}*/}
                                                {/*            key={column.id} align={column.align}>*/}
                                                {/*            {value}*/}
                                                {/*        </TableCell>*/}
                                                {/*    );*/}
                                                {/*})}*/}
                                                <TableCell>
                                                    {row.tasks?.moduleType?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.createdDateTime}
                                                </TableCell>

                                                <TableCell>
                                                    {row.processDate?.year + " " + row.processDate?.month + " " + row.processDate?.monthValue}
                                                </TableCell>
                                                <TableCell>
                                                    {row.personel?.user?.name + " "  + row.personel?.user?.surname}
                                                </TableCell>
                                                <TableCell>
                                                    {row.personel?.user?.name + " "  + row.personel?.user?.surname}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            colSpan={3}
                            count={done?.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {'aria-label': 'rows per page'},
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </Grid>
                </div>
            }
        />
    );
}
export default withSnackbar(CompletedTasks);