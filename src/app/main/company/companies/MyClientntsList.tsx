import React, {useEffect, useState} from 'react'
import {lighten, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
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
    FormControlLabel,
    IconButton, MenuItem,
    TablePagination,
    TableSortLabel, TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {func, number, object, oneOf, string} from 'prop-types';
import {Alert} from "@material-ui/lab";
import history from "../../../../@history/@history";
import {Switch} from "react-router";
import api from "../../../services/BackendApi";
import {
    AddressInfo,
    Client,
    Company,
    CustomerClientDTO,
    DirectorDetail, DocumentInfo,
    FounderOwner,
    UserDTO
} from "../../../types/UserModel";
import TasksStatus from "../../task/task/TaskStatus";
import {useTranslation} from "react-i18next";
import Icon from "@material-ui/core/Icon";
import { useDispatch, useSelector } from 'react-redux';
import {authRoles} from "../../../auth";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded";

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
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const {t} = useTranslation('companyApplications');
    const [company, setCompany] = useState<Company>(null);
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
       // {id: 'eoriNumber', numeric: false, disablePadding: false, label: t("EORINUMBER")},
       // {id: 'payeNumber', numeric: false, disablePadding: false, label: t("PAYENUMBER")},
        {id: 'adress', numeric: false, disablePadding: false, label: t("ADDRESS"),sortable:false},
        {id:'detail',numeric: false, disablePadding: false, label:t("DETAILS"),sortable:false},
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
        minWidth: " %100",
        maxWidth:" %100"
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
        maxHeight: 450,
        Width: '75%'
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
    const [addressList, setAddressList] = useState<AddressInfo[]>();
    const [customerClients, setCustomerClients] = useState<CustomerClientDTO[]>([]);
    const [isEditable, setIsEditable] = useState(false);
    const [directorList, setDirectorList] = useState<DirectorDetail[]>([]);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [company,setCompany]=useState([]);
    const [founder,setFounder]=useState([]);
    const [documentsList, setDocumentsList] = useState<DocumentInfo[]>([]);
    const [formState, setFormState] = useState<DirectorDetail>({} as DirectorDetail);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [clientList, setClientList] = useState<Client[]>([]);
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

    const clientId = useSelector(({company}) => company.currentCompanyId);
    // const {clients}=props;
    useEffect(() => {
        api.getClient(clientId).then(response => {
            clientList.push(response);
            setClientList(clientList);
            console.log(clientList)
            const deneme = response.clientTypeEnum;
            // @ts-ignore
            if(deneme=='LIMITED'){
                setCompany(company=>[...company, response.company])}
            else{
                setFounder(founder=>[...founder,response.founderOwner.tradeAsName])
            }
        });
    }, []);
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
            const newSelecteds = clientList.map(n => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, clientList.length - page * rowsPerPage);

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <label></label>
            }
        content={


        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer className={classes.container}>
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
                            rowCount={clientList.length}
                        />
                        <TableBody>
                            {stableSort(clientList, getComparator(order, orderBy))
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
                                    {company.length>0? company.map((result)=>(
                                        <MenuItem value={result}>{result.name}</MenuItem>)) :(<MenuItem value={founder}>{founder}</MenuItem>)}
                                </TableCell>
                                <TableCell  padding="default">
                            {client.customerClients?.length === 1 ? (<Typography>{client.customerClients[0]?.customerInfo.user.name} {client.customerClients[0]?.customerInfo.user.surname}</Typography>):
                                <HtmlTooltip
                                title={
                                <React.Fragment>
                            {client.customerClients?.map(user =>(
                                <Typography color="inherit">{user.customerInfo.user.name} {user.customerInfo.user.surname} %{user.customerInfo.sharePercent}</Typography>
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
                            {client.vatNumber!==null ? client.vatNumber:("...")}
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
                            {client?.founderOwner?.phoneNumber!==null ?client.founderOwner?.phoneNumber:("...")}{client?.company?.phoneNumber}
                                </TableCell>
                            {/*    <TableCell  padding="default">*/}
                            {/*{client?.founderOwner?.eoriNumber!==null ?client.founderOwner?.eoriNumber:("...")}{client?.company?.eoriNumber}*/}
                            {/*    </TableCell>*/}
                            {/*    <TableCell  padding="default">*/}
                            {/*        {client?.founderOwner?.payeNumber!==null ?client.founderOwner?.payeNumber:("...")}{client?.company?.payeNumber}*/}
                            {/*    </TableCell>*/}
                                <TableCell  padding="default">
                                    {client?.addressList.map((x)=>(<MenuItem>{(x.addressType || "") + " " +( x.number || "") + " " + ( x.street || "") + " " + (x.district || "")}</MenuItem>))}
                                </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={()=>handledetails(client)}>{t("DETAILS")}</Button>
                                    </TableCell>
                            {/*    <table className="simple">
                                                    <thead>
                                                    <tr>
                                                        <th>{t("TYPE")}</th>
                                                        <th>{t("BUILDINGNUMBER")}</th>
                                                        <th>{t("STREETNAME")}</th>
                                                        <th>{t("COUNTY")}</th>
                                                        <th>{t("TOWNCITY")}</th>
                                                        <th>{t("POSTCODE")}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {addressList?.sort((a, b) => a.id - b.id).map((address, key) => (
                                                        <tr key={address.id}>
                                                            <td>
                                                                <TextField
                                                                           variant="outlined" name="number"

                                                                           id="outlined-disabled" value={address?.number}/>
                                                            </td>
                                                            <td>
                                                                <TextField onChange={(e) => handleAddress(address.id, e)}
                                                                           variant="outlined" name="street"
                                                                           id="outlined-disabled" value={address?.street}/>
                                                            </td>

                                                            <td>
                                                                <TextField onChange={(e) => handleAddress(address.id, e)}
                                                                           variant="outlined" name="county"
                                                                           id="outlined-disabled" value={address?.county}/>
                                                            </td>
                                                            <td>
                                                                <TextField onChange={(e) => handleAddress(address.id, e)}
                                                                           variant="outlined" name="city"
                                                                           id="outlined-disabled" value={address?.city}/>
                                                            </td>
                                                            <td>
                                                                <TableCell  padding="default">
                                                                    {address?.postcode}
                                                                </TableCell>

                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <td>
                                                        {addressList.map((x)=>{
                                                            //@ts-ignore
                                                            <TableCell> {x.street}</TableCell>
                                                        })}
                                                        {client?.founderOwner?.payeNumber!==null ?client.founderOwner?.payeNumber:("...")}{client?.company?.payeNumber}
                                                    </td>
                                                    <td>
                                                    <TableCell  padding="default">
                                                        {client?.founderOwner?.payeNumber!==null ?client.founderOwner?.payeNumber:("...")}{client?.company?.payeNumber}
                                                    </TableCell></td><td>
                                                    <TableCell  padding="default">
                                                        {client?.founderOwner?.payeNumber!==null ?client.founderOwner?.payeNumber:("...")}{client?.company?.payeNumber}
                                                    </TableCell></td> <td>
                                                    <TableCell  padding="default">
                                                        {client?.founderOwner?.businessAddress===null ?client.founderOwner?.businessAddress:("...")}{client?.company?.businessAddress}
                                                    </TableCell></td>
                                                    <TableCell  padding="default">
                                                        {client.founderOwner.street}
                                                    </TableCell></td>
                                                    </tbody>
                                                </table>
                                            </TableCell>

                                                </table>*/}

                                </TableRow>

                                );
                                })}
                            {/*{emptyRows > 0 && (*/}
                            {/*    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>*/}
                            {/*    <TableCell colSpan={6} />*/}
                            {/*    </TableRow>*/}
                            {/*    )}*/}
                                </TableBody>
                                </Table>
                                </TableContainer>
                                <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={clientList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                                </Paper>
                            {/*<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />*/}
                                </div>
        }>
        </FusePageCarded>
        );
    }
