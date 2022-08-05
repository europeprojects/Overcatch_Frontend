import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {AddressInfo, Client, ClientDTO, Company, CustomerClientDTO, DirectorDetail} from "../../types/UserModel";
import {selectMainTheme} from "../../store/fuse/settingsSlice";
import {useSelector} from "react-redux";
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Div} from "../../components/Grid";
import TimerTwoToneIcon from "@material-ui/icons/TimerTwoTone";
import api from "../../services/BackendApi";

function createData(code, name, email, ) {
    return { code, name, email,  };
}

const rows = [

];

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

const headCells = [
    { id: 'code', numeric: false, disablePadding: true, label: 'Company Number' },
    { id: 'name', numeric: true, disablePadding: false, label: 'Company Name' },
    { id: 'email', numeric: true, disablePadding: false, label: 'Company E-mail' },
    { id: 'Details', numeric: true, disablePadding: false, label: 'Details' },

];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [selectedMail, setSelectedMail] = useState<ClientDTO[]>([]);
    const [selected, setSelected] = useState<ClientDTO[]>([]);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);

    const mainTheme = useSelector(selectMainTheme);
    const [search, setSearch] = useState<string>("");  // Başlangıç değerleri ""
    const [disabled, setDisabled] = useState<boolean>(true);
    const [checkedButton, setCheckedButton] = useState<boolean>(false);

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
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
}));

export default function EnhancedTable(props: any) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [limitedReminderList, setLimitedReminderList] = useState<ClientDTO[]>([]);
    const [selectedReminder, setSelectedReminder] = useState<ClientDTO>();
   // const [limitedReminderList, setLimitedReminderList] = useState<Company[]>([]);



    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const [firstDate,setFirstDate]=useState<string>("");
    const [secondDate,setSecondDate]=useState<string>("");
    const [thirdDate,setThirdDate]=useState<string>("");
    const [fourthDate,setFourthDate]=useState<string>("");
    const [resetDate,setResetDate]=useState<string>("");




    useEffect(() => {
        // Reminder - Limited Company Number ve içerik bilgilerini getiren API
        api.getReminderCompanyList().then( limitedCompany =>{
            // @ts-ignore
            setLimitedReminderList(limitedCompany);
            console.log("LIMITED COMPANY :",limitedCompany);
        })
    }, [])






    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={limitedReminderList.length}
                        />
                        <TableBody>
                            {stableSort(limitedReminderList, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((limitedReminderList, index) => {
                                    const isItemSelected = isSelected(limitedReminderList?.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            // onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={limitedReminderList?.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {limitedReminderList?.company?.companyNumber}
                                            </TableCell>
                                            <TableCell align="right">{limitedReminderList?.company?.name}</TableCell>
                                            <TableCell align="right">{limitedReminderList?.company?.email}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="text"
                                                    color="secondary"
                                                    //onClick={() => handleClickOpen(template)}
                                                >
                                                    <Icon
                                                        style={{
                                                            color: 'secondary',
                                                            fontSize: 35,
                                                            justifyContent: 'center'
                                                        }}
                                                        onClick={()=>{
                                                            setOpen(true);
                                                            //@ts-ignore
                                                            setSelectedReminder(limitedReminderList);
                                                        }}
                                                    >
                                                        find_in_page_qutlined_icon
                                                    </Icon>
                                                </Button>
                                            </TableCell>
                                            <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                                    aria-labelledby="customized-dialog-title" open={open}>
                                                <DialogTitle id="customized-dialog-title">

                                                </DialogTitle>
                                                <DialogContent dividers>
                                                    <div style={{ width: '100%' , textAlign:"center" }}>
                                                        <Card variant="outlined">
                                                            <CardContent>
                                                                <Div columns={4}>
                                                                    <TextField
                                                                        className={"flex w-full my-16"}
                                                                        variant="outlined"
                                                                        name={"helpType"}
                                                                        id="demo-simple-select-outlined"
                                                                        label={('Confirmation Statement Date')}
                                                                        disabled={true}
                                                                        //value={reminder?.reminderType?.reminderTypeName}
                                                                    >
                                                                    </TextField>

                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderFirstDate"
                                                                        //disabled={isEditable === true ? false : true}
                                                                        value={(selectedReminder?.company?.nextStatementDate)}

                                                                        id="date"
                                                                        disabled={true}
                                                                        label={("Next Statement Date ")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:'1000-01-01'
                                                                        }}
                                                                        variant="outlined"/>
                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderSecondDate"
                                                                        disabled={true}
                                                                        //disabled={isEditable === true ? false : true}
                                                                        value={(selectedReminder?.company?.statementDueDate)}

                                                                        id="date"
                                                                        label={("Statement Due Date")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:firstDate
                                                                            //min: reminder?.reminderFirstDate?.toString()
                                                                        }}

                                                                        variant="outlined"/>
                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderThirdDate"
                                                                        disabled={true}
                                                                        value={(selectedReminder?.company?.lastStatementDate)}
                                                                        id="date"
                                                                        label={("Last Statement Date")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:secondDate
                                                                            //min: reminder?.reminderSecondDate?.toString()
                                                                        }}
                                                                        variant="outlined"/>
                                                                    <TextField
                                                                        className={"flex w-full my-16"}
                                                                        variant="outlined"
                                                                        name={"helpType"}
                                                                        id="demo-simple-select-outlined"
                                                                        label={('Account Date')}
                                                                        disabled={true}
                                                                        //value={reminder?.reminderType?.reminderTypeName}
                                                                    >
                                                                    </TextField>

                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderFirstDate"
                                                                        //disabled={isEditable === true ? false : true}

                                                                        value={(selectedReminder?.company?.nextAccountsDate)}
                                                                        id="date"
                                                                        disabled={true}
                                                                        label={("Next Account Date")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:'1000-01-01'
                                                                        }}
                                                                        variant="outlined"/>
                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderSecondDate"
                                                                        //disabled={isEditable === true ? false : true}
                                                                        value={(selectedReminder?.company?.accountsDueDate)}
                                                                        id="date"
                                                                        disabled={true}
                                                                        label={("Account Due Date")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:firstDate
                                                                            //min: reminder?.reminderFirstDate?.toString()
                                                                        }}

                                                                        variant="outlined"/>
                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderThirdDate"
                                                                        //disabled={isEditable === true ? false : true}
                                                                        value={(selectedReminder?.company?.lastAccountsDate)}

                                                                        id="date"
                                                                        disabled={true}
                                                                        label={("Last Account Date")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:secondDate
                                                                            //min: reminder?.reminderSecondDate?.toString()
                                                                        }}
                                                                        variant="outlined"/>

                                                                    <TextField
                                                                        className={"flex w-full my-16"}
                                                                        variant="outlined"
                                                                        disabled={true}
                                                                        name={"helpType"}
                                                                        id="demo-simple-select-outlined"
                                                                        label={('Year-End Date')}

                                                                        //value={reminder?.reminderType?.reminderTypeName}
                                                                    >
                                                                    </TextField>

                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderFirstDate"
                                                                        //disabled={isEditable === true ? false : true}

                                                                        value={(selectedReminder?.company?.yearEndDate)}
                                                                        id="date"
                                                                        label={("Year-End Date")}
                                                                        className="my-16"
                                                                        disabled={true}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:'1000-01-01'
                                                                        }}
                                                                        variant="outlined"/>
                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderSecondDate"
                                                                        //disabled={isEditable === true ? false : true}
                                                                        id="date"

                                                                        value={(selectedReminder?.company?.quarterEndDate)}
                                                                        label={("Quarter End")}
                                                                        className="my-16"
                                                                        disabled={true}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:firstDate
                                                                            //min: reminder?.reminderFirstDate?.toString()
                                                                        }}

                                                                        variant="outlined"/>
                                                                    <TextField

                                                                        type="date"
                                                                        name="reminderThirdDate"
                                                                        //disabled={isEditable === true ? false : true}

                                                                        value={(selectedReminder?.company?.confirmationStatementDate)}
                                                                        id="date"
                                                                        disabled={true}
                                                                        label={("Confirmation Statement")}
                                                                        className="my-16"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            max: '3000-01-01',
                                                                            min:secondDate
                                                                            //min: reminder?.reminderSecondDate?.toString()
                                                                        }}
                                                                        variant="outlined"/>
                                                                </Div>


                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button autoFocus type={"submit"} color="primary" onClick={handleClose}> {("CLOSE")}</Button>
                                                </DialogActions>
                                            </Dialog>

                                        </TableRow>
                                    );
                                })}
                            {/*  {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 1 : 1) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}*/}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={limitedReminderList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}