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
    IconButton, MenuItem,
    TablePagination,
    TableSortLabel, TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import clsx from 'clsx';
import {func, number, object, oneOf, string} from 'prop-types';
import history from "../../../../@history/@history";

import {
    AddressInfo,
    Client,
    Company,
    CustomerClientDTO,
    DirectorDetail, DocumentInfo,
    FounderOwner,
    UserDTO
} from "../../../types/UserModel";
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

function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const {t} = useTranslation('companyApplications');
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };



    const headCells = [
        {id: 'companyName', numeric: false, disablePadding: false, label: t("BUSINESSNAME"),sortable:false},
        {id: 'nameandsurname', numeric: false, disablePadding: false, label: t("NAMEANDSURNAME"),sortable:false},
        {id: 'clientType', numeric: false, disablePadding: false, label: t("CLIENTTYPE"),sortable:false},
        {id: 'agreementType', numeric: false, disablePadding: false, label: t("AGREEMENTTYPE"),sortable:false},
        {id: 'vatNumber', numeric: false, disablePadding: false, label: t("VATNUMBER"),sortable:false},
        {id: 'director', numeric: false, disablePadding: false, label: t("DIRECTORNAME"),sortable:false},
        {id: 'businessEmail', numeric: false, disablePadding: false, label: t("BUSINESSEMAIL"),sortable:false},
        {id: 'msisdn', numeric: false, disablePadding: false, label: t("PHONE"),sortable:false},
        {id: 'eoriNumber', numeric: false, disablePadding: false, label: t("EORINUMBER"),sortable:false},
        {id: 'payeNumber', numeric: false, disablePadding: false, label: t("PAYENUMBER"),sortable:false},
        {id: 'adress', numeric: false, disablePadding: false, label: t("ADDRESS"),sortable:false},




    ];

    return (
        <TableHead>
            <TableRow>

                {headCells.map(headCell => (
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
            {/*{numSelected > 0 ? (*/}
            {/*	<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">*/}
            {/*		{numSelected} selected*/}
            {/*	</Typography>*/}
            {/*) : (*/}
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {t("COMPANYINFORMATION")}
            </Typography>
            {/*)}*/}


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
const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #dadde9',
    },
}))(Tooltip);



export default function MyClientsCompanyList(props: any) {
    const [client, setClient] = useState<Client>({} as Client);
    const [addressList, setAddressList] = useState<AddressInfo[]>([]);
    const [customerClients, setCustomerClients] = useState<CustomerClientDTO[]>([]);
    const [isEditable, setIsEditable] = useState(false);
    const [directorList, setDirectorList] = useState<DirectorDetail[]>([]);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [company, setCompany] = useState<Company>(null);
    const [documentsList, setDocumentsList] = useState<DocumentInfo[]>([]);
    const [formState, setFormState] = useState<DirectorDetail>({} as DirectorDetail);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [founderOwner, setFounderOwner] = useState<FounderOwner>(null);
    const {t} = useTranslation('companyApplications');
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const {clients}=props;

    function handledetails(client: any) {
        // @ts-ignore
        history.push({
            pathname: '/clientapp/detail',
            displayRouteData: {
                clientId: client?.id
            }
        });
    }
    function handleAddress(key: number, e) {
        const address = addressList.find(d => d.id === key);
        console.log(address)
        addressList.splice(addressList.indexOf(address), 1);
        setAddressList([...addressList, {...address, [e.target.name]: e.target.value}]);
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
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, clients.length - page * rowsPerPage);


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} />
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
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={clients.length}
                        />
                        <TableBody>
                            {stableSort(clients, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((client, index) => {
                                    const isItemSelected = isSelected(client.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => handleClick(event, task.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={client.id}
                                            selected={isItemSelected}
                                            // onClick={event => handledetails(company)}
                                        >
                                            {/*<TableCell padding="checkbox">*/}
                                            {/*	<Checkbox*/}
                                            {/*		checked={isItemSelected}*/}
                                            {/*		inputProps={{ 'aria-labelledby': labelId }}*/}
                                            {/*	/>*/}
                                            {/*</TableCell>*/}
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
                                                {client?.company?.vatNumber===null? ("...") : (client?.company?.vatNumber)}  {company?.vatNumber===null? ("...") : (company?.vatNumber)}
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
                                            <TableCell  padding="default">
                                                {client?.company?.email}  {client?.founderOwner?.email}
                                            </TableCell>

                                            <TableCell  padding="default">
                                                {client?.company?.phoneNumber}{client?.founderOwner?.phoneNumber}
                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client?.founderOwner?.eoriNumber}{client?.company?.eoriNumber}
                                            </TableCell>
                                            <TableCell  padding="default">
                                                {client?.founderOwner?.payeNumber}{client?.company?.payeNumber}
                                            </TableCell>
                                            <TableCell  padding="default">
                                                <table className="simple">
                                                    <thead>
                                                    <tr>
                                                         <th>{("")}</th>
                                                         <th>{t("TYPE")}</th>
                                                        <th>{t("BUILDINGNUMBER")}</th>
                                                        <th>{t("STREETNAME")}</th>
                                                        <th>{t("COUNTY")}</th>
                                                        <th>{t("TOWNCITY")}</th>
                                                        <th>{t("POSTCODE")}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    <TableCell padding="default">
                                                        <Icon color="action">home</Icon>
                                                        <Icon color="action">business</Icon>
                                                    </TableCell>
                                                    <TableCell padding="default">
                                                        {client?.addressList.map((x)=>(<MenuItem>{x.addressType}</MenuItem>))}
                                                    </TableCell>

                                                    <TableCell padding="default">
                                                        {client?.addressList.map((x)=>(<MenuItem>{x.number}</MenuItem>))}
                                                    </TableCell>
                                                    <TableCell  padding="default">
                                                        {client?.addressList.map((x)=>(<MenuItem>{x.street}</MenuItem>))}
                                                    </TableCell>
                                                    <TableCell  padding="default">
                                                        {client?.addressList.map((x)=>(<MenuItem>{x.county}</MenuItem>))}
                                                    </TableCell>
                                                    <TableCell  padding="default">
                                                        {client?.addressList.map((x)=>(<MenuItem>{x.city}</MenuItem>))}
                                                    </TableCell>
                                                    <TableCell  padding="default">
                                                        {client?.addressList.map((x)=>(<MenuItem>{x.postcode}</MenuItem>))}
                                                    </TableCell>
                                                    </tbody>
                                                </table>
                                            </TableCell>
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
            {/*<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />*/}
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
