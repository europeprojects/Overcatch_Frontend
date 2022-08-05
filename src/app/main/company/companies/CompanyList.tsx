import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    Button,
    Checkbox,
    IconButton, Input, ListItemText, MenuItem, Select,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import clsx from 'clsx';
import {any, func, number, object, oneOf, string} from 'prop-types';
import history from "../../../../@history/@history";
import {FounderOwner} from "../../../types/UserModel";
import {useTranslation} from "react-i18next";
import Icon from "@material-ui/core/Icon";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

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

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const {t} = useTranslation('companyApplications');
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const { clientType, setClientType } = props;
    const { aggrementType, setAggrementType } = props;
    const [clientTypeSelected, setclientTypeSelected] = React.useState([]);
    const [agreementTypeSelected, setagreementTypeSelected] = React.useState([]);

    const headCells = [
        {id: 'code', numeric: false, disablePadding: false, label: t("CODE") ,sortable:true},
        {id: 'companyName', numeric: false, disablePadding: false, label: t("BUSINESSNAME"),sortable:false},
        {id: 'nameandsurname', numeric: false, disablePadding: false, label: t("NAMEANDSURNAME"),sortable:false},
        {id: 'clientTypeEnum', numeric: false, disablePadding: false, label: t("CLIENTTYPE"),sortable:false},
        {id: 'agreementType', numeric: false, disablePadding: false, label: t("AGREEMENTTYPE"),sortable:false},
        {id: 'visaType', numeric: false, disablePadding: false, label: t("VISATYPE"),sortable:false},
        {id: 'director', numeric: false, disablePadding: false, label: t("DIRECTORNAME"),sortable:false},
        {id: 'show', numeric: false, disablePadding: false, label: t("SHOW"),sortable:false},
    ];
    function handleChangeCheckbox(value: string, checked: boolean, type: string) {
        if (type == 'clientTypeEnum'){
            if(checked && !clientType.includes(value))
                setClientType(oldArray => [...oldArray,value])
            else if(!checked && clientType.includes(value))
                setClientType(clientType.filter(item => item != value))
            return
        }
        else if (type == 'agreementType'){
            if(checked && !aggrementType.includes(value))
                setAggrementType(oldArray => [...oldArray, value])
            else if(!checked && aggrementType.includes(value))
                setAggrementType(aggrementType.filter(item => item != value))
            return
        }
        console.log(clientType)
        console.log(aggrementType)
    }
    function handleChange(e, type) {

    }

    return (
        <TableHead>
            <TableRow>
                {headCells?.map(headCell => headCell.id=="clientTypeEnum" || headCell.id=="agreementType"?
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        { headCell.id=="clientTypeEnum" ? t("CLIENTTYPE") : t("AGREEMENTTYPE")}
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
                            <MenuItem  value={headCell.id == 'clientTypeEnum' ? null : null}>
                                <ListItemText primary={headCell.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")} />
                            </MenuItem>
                            <MenuItem  value={ headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("SOLETRADE" ) > -1 : aggrementType?.indexOf("OTHER") > -1} />
                                <ListItemText primary={headCell.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"} />
                            </MenuItem>
                            <MenuItem  value={headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("LIMITED" ) > -1 : aggrementType?.indexOf("ECAA") > -1} />
                                <ListItemText primary={headCell.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"} />
                            </MenuItem>
                            <MenuItem  value={headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING", checked, headCell.id)}} checked={headCell.id == 'clientTypeEnum' ? clientType.indexOf("SELFASSESMENT" ) > -1 : aggrementType?.indexOf("TRADING") > -1} />
                                <ListItemText primary={headCell.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"} />
                            </MenuItem>
                        </Select>
                    </TableCell>
                    :
                    (
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
                                    ) : null}
                                </TableSortLabel>
                            ):headCell.label}

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
    rowCount: number.isRequired,
    aggrementType: any,
    setAggrementType: any,
    clientType: any,
    setClientType: any

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
    const {t} = useTranslation('companyApplications');
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {t("CLIENTSLIST")}
            </Typography>
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
    container: {
        // maxHeight: 600
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

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

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

export default function CompanyList(props: any) {


    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [founderOwner, setFounderOwner] = React.useState<FounderOwner>();
    const {t} = useTranslation('companyApplications');
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const {clients}=props;
    const {aggrementType, setAggrementType, clientType, setClientType} = props;

    function handledetails(client: any) {
        // @ts-ignore
        history.push({
            pathname: '/clientapp/detail',
            displayRouteData: {
                clientId: client?.id
            }
        });
    }

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = clients.map(n => n.id);
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
        props.handleChangePage(newPage, rowsPerPage);
    };

    useEffect(()=>{
        setPage(0);
    },[props.clientType, props.aggrementType, props.search])

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        props.handleChangePage(0, parseInt(event.target.value, 10));

    };
    const isSelected = name => selected.indexOf(name) !== -1;

   // const emptyRows = rowsPerPage - Math.min(rowsPerPage,clients?.length - 0 * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                {/*<EnhancedTableToolbar numSelected={selected.length} />*/}
                <TableContainer  className={classes.container}>
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
                            rowCount={clients.length}
                            aggrementType={aggrementType} setAggrementType={setAggrementType}
                            clientType={clientType} setClientType={setClientType}
                        />
                        <TableBody>
                            {stableSort(clients, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((client) => {
                                    const isItemSelected = isSelected(client.id);
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={client.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell  padding="default">
                                                {client?.code}
                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client?.company && client.company.name}
                                                {client?.founderOwner?.tradeAsName !== null ?  client?.founderOwner?.tradeAsName :client?.founderOwner.name+" "+client?.founderOwner.surname }

                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client.customerClients?.length === 1 ? (<Typography>{client.customerClients[0]?.customerInfo.userInfo.name} {client.customerClients[0]?.customerInfo.userInfo.surname}</Typography>):
                                                    <HtmlTooltip
                                                        title={
                                                            <React.Fragment>
                                                                {client.customerClients?.map(user =>(
                                                                    <Typography color="inherit">{user.customerInfo.userInfo.name} {user.customerInfo.userInfo.surname} %{user.customerInfo.sharePercent}</Typography>
                                                                ))}
                                                            </React.Fragment>
                                                        }
                                                    >
                                                        <Button>{client.customerClients?.length} Shareholder...</Button>
                                                    </HtmlTooltip>
                                                }
                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client.clientTypeEnum}
                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client.agreementType}
                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client.visaType!==null ?client.visaType:("...")}
                                            </TableCell>
                                            {client?.company ? (
                                                <TableCell  padding="default">
                                                    {client?.company?.directorDetails.length === 1 ? (<Typography>{client?.company?.directorDetails[0].name} {client?.company?.directorDetails[0].surname}</Typography>):
                                                        <HtmlTooltip
                                                            title={
                                                                <React.Fragment>
                                                                    {client?.company?.directorDetails.map(director =>(
                                                                        <Typography color="inherit">{director.name} {director.surname}</Typography>
                                                                    ))}
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <Button>{client?.company?.directorDetails?.length} Director...</Button>
                                                        </HtmlTooltip>
                                                    }
                                                </TableCell>
                                            ):(
                                                <TableCell  padding="default">
                                                    {client?.founderOwner?.name}  {client?.founderOwner?.surname}
                                                </TableCell>
                                            )
                                            }

                                            <TableCell  >

                                                <Button variant="outlined"
                                                        color="secondary" onClick={()=>handledetails(client)}><Icon style={{ color: "secondary", fontSize: 30 }}>search</Icon></Button>
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
                    count={clients?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
            </Paper>
        </div>
    );
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
