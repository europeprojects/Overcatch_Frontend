import React, { useEffect, useState } from 'react';
import { createStyles, lighten, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton, Input, ListItemText,
    MenuItem,
    Select,
    Slide,
    TablePagination,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { any, func, number, object, oneOf, string } from 'prop-types';
import { TransitionProps } from '@material-ui/core/transitions';
import Status from './Status';
import { Client, ClientTypeEnum } from '../../../types/UserModel';
import history from '@history';
import Block from '@material-ui/icons/Block';
import api from '../../../services/BackendApi';
import { useTranslation } from 'react-i18next';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';

function compare(a,b)
{
    if (b<a) {
               
        return -1;
        
        }
        if (b>a)
        {
            return 1;
        }
        
        return 0;
}

function descendingComparator(a, b, orderBy) {
        if(orderBy === "clientName")
        {
                   return String(a.customerClients[0].customerInfo.userInfo.name).toLowerCase().localeCompare(String(b.customerClients[0].customerInfo.userInfo.name).toLowerCase());
 
        }
        else if(orderBy ==="payment")

        {
            const na = Number(a[orderBy]);
            const nb = Number(b[orderBy]);
            return compare(na,nb);

        }
        else if(orderBy ==="createdDateTime")
        {
           const da = new Date(a["company"]?.createdDateTime == null ?a["founderOwner"]?.lastUpdatedDateTime:a["company"]?.createdDateTime).getTime();
           const db = new Date(b["company"]?.createdDateTime == null ?b["founderOwner"]?.lastUpdatedDateTime:b["company"]?.createdDateTime).getTime();

           return compare(da,db);
        }

       }


function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    console.log(stabilizedThis)
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
// const headCells = [
//     { id: 'clientName', align: "left", numeric: false, disablePadding: false, label: 'Client Name' },
//     { id: 'clientType', align: "left", numeric: false, disablePadding: false, label: 'Client Type' },
//     { id: 'aggrement', align: "left", numeric: false, disablePadding: false, label: 'Client Aggrement' },
//     { id: 'isExist', align: "left", numeric: false, disablePadding: false, label: 'Existing' },
//     { id: 'payment', align: "left", numeric: false, disablePadding: false, label: 'Payment' },
//     { id: 'state', align: "left", numeric: false, disablePadding: false, label: 'Status' },
//     { id: 'date', align: "left", numeric: false, disablePadding: false, label: 'Apply' },
//     { id: 'decline', align: "left", numeric: false, disablePadding: false, label: 'Decline' },
//
// ];
// const headCells1 = [
//     { id: 'clientType', align: "left", numeric: false, disablePadding: false, label: 'Client Type' },
//     { id: 'aggrement', align: "left", numeric: false, disablePadding: false, label: 'Client Aggrement' },
//     { id: 'isExist', align: "left", numeric: false, disablePadding: false, label: 'Existing' },
//     { id: 'payment', align: "left", numeric: false, disablePadding: false, label: 'Payment' },
//     { id: 'state', align: "left", numeric: false, disablePadding: false, label: 'Status' },
//     { id: 'date', align: "left", numeric: false, disablePadding: false, label: 'Apply' },
//     { id: 'decline', align: "left", numeric: false, disablePadding: false, label: 'Decline' },
// ];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort, role } = props;
    const { t } = useTranslation('companyApplications');
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const { clientType, setClientType } = props;
    const { agreementType, setAgreementType } = props;
    const { existing, setExisting } = props;
    const { state, setState } = props;
    const [clientTypeSelected, setclientTypeSelected] = React.useState([]);
    const [agreementTypeSelected, setagreementTypeSelected] = React.useState([]);

    const headCells1 = [
        { id: 'clientTypeEnum', align: 'left', numeric: false, disablePadding: false, label: t('CLIENTTYPE'),sortable:false},
        { id: 'createdDateTime', align: 'left', numeric: false, disablePadding: false, label: t('DATE'),sortable:true },
        { id: 'agreementType', align: 'left', numeric: false, disablePadding: false, label: t('CLIENTAGREEMENT'),sortable:false },
        { id: 'isExist', align: 'left', numeric: false, disablePadding: false, label: t('EXISTING') ,sortable:false},
        { id: 'payment', align: 'left', numeric: false, disablePadding: false, label: t('PAYMENT') ,sortable:true},
        { id: 'state', align: 'left', numeric: false, disablePadding: false, label: t('STATUS'),sortable:false },
        { id: 'date', align: 'left', numeric: false, disablePadding: false, label: t('SHOW'),sortable:false }
        // { id: 'date', align: "left", numeric: false, disablePadding: false, label: t("APPLY") },
        // { id: 'decline', align: "left", numeric: false, disablePadding: false, label: t("DECLINE") },
    ];

    const headCells = [
        { id: 'clientName', align: 'left', numeric: false, disablePadding: false, label: t('CLIENTNAME'),sortable:true },
        { id: 'clientTypeEnum', align: 'left', numeric: false, disablePadding: false, label: t('CLIENTTYPE'),sortable:false },
        { id: 'createdDateTime', align: 'left', numeric: false, disablePadding: false, label: t('DATE'),sortable:true },
        { id: 'agreementType', align: 'left', numeric: false, disablePadding: false, label: t('CLIENTAGREEMENT'),sortable:false },
        { id: 'isExist', align: 'left', numeric: false, disablePadding: false, label: t('EXISTING'),sortable:false },
        { id: 'payment', align: 'left', numeric: false, disablePadding: false, label: t('PAYMENT'),sortable:true },
        { id: 'state', align: 'left', numeric: false, disablePadding: false, label: t('STATUS') ,sortable:false},
        { id: 'date', align: 'left', numeric: false, disablePadding: false, label: t('SHOW'),sortable:false }
        // { id: 'date', align: "left", numeric: false, disablePadding: false, label: t("APPLY")},
        // { id: 'decline', align: "left", numeric: false, disablePadding: false, label: t("DECLINE") },
    ];

    function handleChange(e, type) {
        if (type == 'isExist') return setExisting(e.target.value);
        else if (type == 'state') return setState(e.target.value);
    }
    function handleChangeCheckbox(value: string, checked: boolean, type: string) {
        if (type == 'clientTypeEnum'){
            if(checked && !clientType.includes(value))
                setClientType(oldArray => [...oldArray,value])
            else if(!checked && clientType.includes(value))
                setClientType(clientType.filter(item => item != value))
            return
        }
        else if (type == 'agreementType'){
            if(checked && !agreementType.includes(value))
                setAgreementType(oldArray => [...oldArray, value])
            else if(!checked && agreementType.includes(value))
                setAgreementType(agreementType.filter(item => item != value))
            return
        }
    }

    return (
        <TableHead>
            <TableRow>
                {role === 'CUSTOMER' &&
                headCells1.map(headCell =>
                    headCell.id == 'clientTypeEnum' ||
                    headCell.id == 'agreementType' ||
                    headCell.id == 'isExist' ||
                    headCell.id == 'state' ? (
                        headCell.id == 'clientTypeEnum' || headCell.id == 'agreementType' ? (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {headCell.id == 'clientTypeEnum' ? t('CLIENTTYPE') : t('AGREEMENTTYPE')}
                                <Select
                                    labelId="demo-mutiple-checkbox-label"
                                    id="demo-mutiple-checkbox"
                                    multiple
                                    value={headCell.id == 'clientTypeEnum' ? clientTypeSelected : agreementTypeSelected}
                                    style={{maxWidth:"100px"}}
                                    onChange={e => handleChange(e, headCell.id)}
                                    input={<Input />}
                                    renderValue={(selected) => (selected as string[]).join(',')}
                                    MenuProps={MenuProps}

                                >
                                    <MenuItem  value={headCell.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")}>
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")} />
                                    </MenuItem>
                                    <MenuItem  value={ headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"}>
                                        <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("SOLETRADE" ) > -1 : agreementType.indexOf("OTHER") > -1} />
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"} />
                                    </MenuItem>
                                    <MenuItem  value={headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"}>
                                        <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("LIMITED" ) > -1 : agreementType.indexOf("ECAA") > -1} />
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"} />
                                    </MenuItem>
                                    <MenuItem  value={headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"}>
                                        <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("SELFASSESMENT" ) > -1 : agreementType.indexOf("TRADING") > -1} />
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"} />
                                    </MenuItem>
                                </Select>
                            </TableCell>
                        ) : headCell.id == 'isExist' ? (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {t('EXISTING')}
                                <TextField
                                    style={{ marginLeft: '8px' }}
                                    select
                                    //className="my-16"
                                    variant="standard"
                                    // name="clientType"
                                    value={existing}
                                    onChange={event => handleChange(event, headCell.id)}
                                    //     formik.handleChange(e)}}
                                    // error={formik.touched.clientType && Boolean(formik.errors.clientType)}
                                >
                                    <MenuItem value="">
                                        {headCell.id == 'isExist' ? t('EXISTING') : t('STATUS')}
                                    </MenuItem>
                                    <MenuItem value={'true'}>{t('EXIST')}</MenuItem>
                                    <MenuItem value={'false'}>{t('NEW')}</MenuItem>

                                </TextField>
                            </TableCell>
                        ) : (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {t('STATUS')}
                                <Select
                                    style={{ marginLeft: '8px' }}
                                    className="my-16"
                                    variant="standard"
                                    // name="clientType"
                                    value={state}
                                    onChange={e => handleChange(e, headCell.id)}
                                    //     formik.handleChange(e)}}
                                    // error={formik.touched.clientType && Boolean(formik.errors.clientType)}
                                >
                                    <MenuItem value="">{t('STATUS')}</MenuItem>
                                    <MenuItem value={'0'}>{t('NOTAPPLIED')}</MenuItem>
                                    <MenuItem value={'1'}>{t('APPLIED')}</MenuItem>
                                    {/*<MenuItem value={"2"}>{t("INVALIDAPPLICATION")}</MenuItem>*/}
                                </Select>
                            </TableCell>
                        )
                    ) : (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'default'}
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
                    )
                )}

                {role !== 'CUSTOMER' &&
                headCells.map(headCell =>
                    headCell.id == 'clientTypeEnum' ||
                    headCell.id == 'agreementType' ||
                    headCell.id == 'isExist' ||
                    headCell.id == 'state' ? (
                        headCell.id == 'clientTypeEnum' || headCell.id == 'agreementType' ? (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >

                                {headCell.id == 'clientTypeEnum' ? t('CLIENTTYPE') : t('AGREEMENTTYPE')}
                                <Select
                                    labelId="demo-mutiple-checkbox-label"
                                    id="demo-mutiple-checkbox"
                                    multiple
                                    value={headCell.id == 'clientTypeEnum' ? clientTypeSelected : agreementTypeSelected}
                                    style={{maxWidth:"100px"}}
                                    onChange={e => handleChange(e, headCell.id)}
                                    input={<Input />}
                                    renderValue={(selected) => (selected as string[]).join(',')}
                                    MenuProps={MenuProps}

                                >
                                    <MenuItem  value={headCell.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")}>
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")} />
                                    </MenuItem>
                                    <MenuItem  value={ headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"}>
                                        <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER", checked, headCell.id)}}
                                                  checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("SOLETRADE" ) > -1 : agreementType.indexOf("OTHER") > -1} />
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"} />
                                    </MenuItem>
                                    <MenuItem  value={headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"}>
                                        <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("LIMITED" ) > -1 : agreementType.indexOf("ECAA") > -1} />
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"} />
                                    </MenuItem>
                                    <MenuItem  value={headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"}>
                                        <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("SELFASSESMENT" ) > -1 : agreementType.indexOf("TRADING") > -1} />
                                        <ListItemText primary={headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"} />
                                    </MenuItem>
                                </Select>

                            </TableCell>
                        ) : headCell.id == 'isExist' ? (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {t('EXISTING')}

                                <Select
                                    style={{ marginLeft: '8px' }}
                                    className="my-16"
                                    variant="standard"
                                    // name="clientType"
                                    value={existing}
                                    onChange={e => handleChange(e, headCell.id)}
                                    //     formik.handleChange(e)}}
                                    // error={formik.touched.clientType && Boolean(formik.errors.clientType)}
                                >
                                    <MenuItem value="">
                                        {headCell.id == 'isExist' ? t('ALL') : t('STATUS')}
                                    </MenuItem>
                                    <MenuItem value={'true'}>{t('EXIST')}</MenuItem>
                                    <MenuItem value={'false'}>{t('NEW')}</MenuItem>
                                </Select>
                            </TableCell>
                        ) : (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {t('STATUS')}
                                <Select
                                    style={{ marginLeft: '8px' }}
                                    className="my-16"
                                    variant="standard"
                                    // name="clientType"
                                    value={state}
                                    onChange={e => handleChange(e, headCell.id)}
                                    //     formik.handleChange(e)}}
                                    // error={formik.touched.clientType && Boolean(formik.errors.clientType)}
                                >
                                    <MenuItem value="">{t("ALL")}</MenuItem>
                                    <MenuItem value={'0'}>{t('NOTAPPLIED')}</MenuItem>
                                    <MenuItem value={'1'}>{t('APPLIED')}</MenuItem>
                                    {/*<MenuItem value={"2"}>{t("INVALIDAPPLICATION")}</MenuItem>*/}
                                </Select>
                            </TableCell>
                        )
                    ) : (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            {headCell.sortable ? (
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
                                    ) : <span className={classes.visuallyHidden}>
											{order === 'asc' ? 'sorted ascending' : 'sorted descending'}
                                </span>
                                    }
                                </TableSortLabel>
                            ):headCell.label}

                        </TableCell>
                    )
                )}
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
    rowCount: number.isRequired,
    role: string.isRequired,
    clientType: any,
    setClientType: any,
    agreementType: any,
    setAgreementType: any,
    existing: any,
    setExisting: any,
    state: any,
    setState: any
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
            marginLeft: theme.spacing(2.5)
        }
    })
);
const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected, userRole } = props;
    const { t } = useTranslation('companyApplications');
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
                    {userRole === 'CUSTOMER' ? t('MYCLIENTSAPPLY') : t('ALLCLIENTSAPPLY')}
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
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
        marginBottom: theme.spacing(2)
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
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
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

export default function CompanyTable(props: any) {
    const classes = useStyles();
    const userRole = useSelector(({ auth }) => auth.user.role);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [open, setOpen] = React.useState(false);
    // const [open1, setOpen1] = React.useState(false); FOR DECLINE
    const [client, setClient] = React.useState<Client>();
    const { clientType, setClientType } = props;
    const { agreementType, setAgreementType } = props;
    const { existing, setExisting } = props;
    const { state, setState } = props;
    const { t } = useTranslation('companyApplications');
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const { clients } = props;

    useEffect(() => {
       setPage(0);
    }, [props.agreementType ,props.clients ,props.existing , props.state , props.search]);


    function handledetails(client: Client) {
        setOpen(false);
        if (client.clientTypeEnum.toString() === 'SELFASSESMENT' || client.clientTypeEnum.toString() === 'SOLETRADE') {
            // @ts-ignore
            history.push({
                pathname: '/client/apply/founder',
                displayRouteData: {
                    clientId: client?.id
                }
            });
        } else {
            // @ts-ignore
            history.push({
                pathname: '/client/apply/limited',
                displayRouteData: {
                    clientId: client?.id
                }
            });
        }
        // @ts-ignore
        // history.push({
        //     pathname: '/clientapp/apply',
        //     displayRouteData: {
        //         clientId: client?.id,
        //         // userFolder: task?.userFolder,
        //         // taskId: task?.id,
        //         // confirmType: task?.confirmType
        //     }
        // });
    }
    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = clients.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
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
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const handleClickOpen = (client: Client) => {
        // setOpen(true);
        setClient(client);
        handledetails(client);
    };
    //FOR DECLINE
    // const handleDecline = () => {
    //
    //     setOpen1(false);
    //     api.getClientApplicationDecline(client.id).then(response => {
    //         history.go(0);
    //     });
    // };
    //FOR DECLINE
    // const handleClickOpen1 = (client:Client) => {
    //     setOpen1(true);
    //     setClient(client);
    // };
    const handleClose = () => {
        setOpen(false);
    };

    //FOR DECLINE
    // const handleClose1 = () => {
    //     setOpen1(false);
    // };
    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, clients.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                {/*@ts-ignore*/}
                <EnhancedTableToolbar userRole={userRole[0]} numSelected={selected.length} />
                <TableContainer>
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
                            role={userRole[0]}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={clients.length}
                            clientType={clientType}
                            setClientType={setClientType}
                            agreementType={agreementType}
                            setAgreementType={setAgreementType}
                            existing={existing}
                            setExisting={setExisting}
                            state={state}
                            setState={setState}
                        />
                        <TableBody>
                            {
                                 stableSort(clients, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((client, index) => {
                                    const isItemSelected = isSelected(clients.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => handleClick(event, company.id)}
                                            role="none"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={client.id}
                                            selected={isItemSelected}
                                            // onClick={event => handledetails(client)}
                                        >
                                            {userRole[0] !== 'CUSTOMER' && (
                                                <TableCell scope="row">
                                                    {client.customerClients[0].customerInfo.userInfo.name +
                                                    ' ' +
                                                    client.customerClients[0].customerInfo.userInfo.surname}
                                                </TableCell>
                                            )}

                                            <TableCell scope="row">{client.clientTypeEnum}</TableCell>

                                            <TableCell scope="row">
                                                {client.company?.createdDateTime == null ?
                                                    client?.founderOwner?.lastUpdatedDateTime : client?.company?.createdDateTime}
                                            </TableCell>

                                            <TableCell>
                                                {client.agreementType == null ? '...' : client.agreementType}
                                            </TableCell>
                                        
                                            <TableCell>{client.isExisting === true ? t('EXIST') : t('NEW')}</TableCell>

                                            <TableCell>
                                                <i>
                                                    <b>{client.payment} £(Pound)</b>
                                                </i>
                                            </TableCell>
                                            <TableCell>
                                                {client.state == 0 && <Status id={'0'} />}
                                                {client.state == 1 && <Status id={'1'} />}
                                                {client.state == 2 && <Status id={'2'} />}
                                                {client.state == 3 && <Status id={'3'} />}
                                            </TableCell>
                                            <TableCell>
                                                {/*<Button*/}

                                                {/*    disabled={client.state == 0? false:true} onClick={()=>handleClickOpen(client)}*/}
                                                {/*    className="bg-green-500 hover:bg-green-700 text-white font-bold py-10 px-10 rounded-full"*/}
                                                {/*>*/}
                                                {/*    {t("APPLY")}*/}
                                                {/*</Button>*/}

                                                <Button
                                                    variant="outlined"
                                                    disabled={client.state == 0 ? false : true}
                                                    color="secondary"
                                                    onClick={() => handleClickOpen(client)}
                                                >
                                                    <Icon style={{ color: 'secondary', fontSize: 30 }}>search</Icon>
                                                </Button>
                                            </TableCell>
                                            {/*<TableCell >*/}
                                            {/*    <Button*/}
                                            {/*        disabled={client.state == 0? false:true} onClick={()=>handleClickOpen1(client)}*/}
                                            {/*        className="bg-red-500 hover:bg-red-700 text-white font-bold py-10 px-10 rounded-full">*/}
                                            {/*        {t("DECLINE")}*/}
                                            {/*    </Button>*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell align="right">{documents.documentName}</TableCell>*/}
                                            {/*<TableCell align="right">{documents.fileName}</TableCell>*/}
                                            {/*<TableCell align="right">{documents.fileDescription}</TableCell>*/}
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={clients.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
            </Paper>
            {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
            {/*APPLY DIALOG*/}
            {/*<Dialog*/}
            {/*    open={open}*/}
            {/*    TransitionComponent={Transition}*/}
            {/*    keepMounted*/}
            {/*    onClose={handleClose}*/}
            {/*    aria-labelledby="alert-dialog-slide-title"*/}
            {/*    aria-describedby="alert-dialog-slide-description"*/}
            {/*>*/}
            {/*    <DialogTitle id="alert-dialog-slide-title">{t("AREYOUSUREYOUWANTTOAPPLY")}</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText id="alert-dialog-slide-description">*/}
            {/*            {t("IFYOUCONTINUEYOUCANTGOBACK")}*/}
            {/*        </DialogContentText>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleClose} color="secondary">*/}
            {/*            {t("CANCEL")}*/}
            {/*        </Button>*/}
            {/*        <Button onClick={handledetails} color="primary">*/}
            {/*            {t("CONTINUE")}*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}

            {/*FOR DECLINE*/}
            {/*<Dialog*/}
            {/*    open={open1}*/}
            {/*    TransitionComponent={Transition}*/}
            {/*    keepMounted*/}
            {/*    onClose={handleClose1}*/}
            {/*    aria-labelledby="alert-dialog-slide-title"*/}
            {/*    aria-describedby="alert-dialog-slide-description"*/}
            {/*>*/}
            {/*    <DialogTitle id="alert-dialog-slide-title">{t("AREYOUSUREYOUWANTTODECLINE")}</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText id="alert-dialog-slide-description">*/}

            {/*            <Block fontSize={"large"}></Block>  {t("IFYOUDECLINEYOUCANTGOBACK")}*/}
            {/*        </DialogContentText>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleClose1} color="secondary">*/}
            {/*            {t("CANCEL")}*/}
            {/*        </Button>*/}
            {/*        <Button onClick={handleDecline} color="primary">*/}
            {/*            {t("CONTINUE")}*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </div>
    );
}
