import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import {useTranslation} from "react-i18next";
import {
    Button, Checkbox, Dialog, DialogContent, DialogTitle, Grid,
    IconButton, ListItemText, MenuItem, Paper, Select, Table, TableBody, TableCell,
    TableContainer, TableFooter, TableHead,
    TablePagination, TableRow, TableSortLabel, TextField, Tooltip, Typography
} from "@material-ui/core";
import api from "../../services/BackendApi";
import CloseIcon from "@material-ui/icons/Close";
import {Client,} from "../../types/UserModel";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import Icon from "@material-ui/core/Icon";
import MyIncomeExpense from "./MyIncomeExpense";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
    layoutRoot: {},
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    table: {
        minWidth: 900,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container:{
        maxHeight:500
    }
}));

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles();
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

function ClientsIncomeExpense(props){
    const classes = useStyles(props);
    const [open, setOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [totalElements, setTotalElements] = React.useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState<string>("");
    const [clientType, setClientType] = React.useState([]);
    const [agrementType, setAgrementType] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState([]);
    const {t} = useTranslation('incomeExpense');

    // const { aggrementType, setAggrementType } = props;
    const [clientTypeSelected, setclientTypeSelected] = React.useState([]);
    const [aggrementTypeSelected, setaggrementTypeSelected] = React.useState([]);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleChangePage = (event,newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    function handleChangeCheckbox(value: string, checked: boolean, type: string) {
        if (type == 'clientTypeEnum'){
            if(checked && !clientType.includes(value))
                setClientType(oldArray => [...oldArray,value])
            else if(!checked && clientType.includes(value))
                setClientType(clientType.filter(item => item != value))
            return
        }
        else if (type == 'aggrementType'){
            if(checked && !agrementType.includes(value))
                setAgrementType(oldArray => [...oldArray, value])
            else if(!checked && agrementType.includes(value))
                setAgrementType(agrementType.filter(item => item != value))
            return
        }
        console.log(clientType)
        console.log(agrementType)
    }
    function getCompaniesByFilter(agrementType, clientType, search, page, rowsPerPage){
        api.getCompaniesByFilter(agrementType, clientType, search, page, rowsPerPage).then(response => {
            console.log(response, "res")
            setClients(response.content);
            setTotalElements(response.totalElements);
        });
    }
    useEffect(()=>{
        api.getCompanies(page, rowsPerPage).then(response => {
            setClients(response.content);
            setTotalElements(response.totalElements);
        })
    },[])

    useEffect(() => {
        getCompaniesByFilter(agrementType, clientType, search, page, rowsPerPage);
    }, [agrementType, clientType,search, page, rowsPerPage]);
    // useEffect(() => {
    //     getCompaniesByFilter(agrementType, clientType, search, page, rowsPerPage);
    // }, [page]);
    // useEffect(() => {
    //     getCompaniesByFilter(agrementType, clientType, search, page, rowsPerPage);
    // }, [rowsPerPage]);


    function handleDetails(client: any) {
        setSelectedClient(client);
        setOpen(true);
    }
    const isSelected = name => selected.indexOf(name) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage,clients.length - 0 * rowsPerPage);

    interface Column {
        id: 'companyName' | 'nameandsurname' | 'clientTypeEnum' | 'aggrementType' | 'show';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
        sortable:boolean;
    }

    const columns: Column[] = [
        {id: 'companyName', label: t("BUSINESSNAME"),sortable:true},
        {id: 'nameandsurname', label: t("NAMEANDSURNAME"),sortable:true},
        {id: 'clientTypeEnum', label: t("CLIENTTYPE"),sortable:false},
        {id: 'aggrementType', label: t("AGREEMENTTYPE"),sortable:false},
        {id: 'show',label: t("SHOWINCOMEEXPENSE"),sortable:false},
    ];
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

    // function handleChangeHeader(e, type){
      //  if(type == "clientTypeEnum")
     //       return setClientType(e.target.value)
       // else if (type == "agreementType")
         //   return setAgrementType(e.target.value)
    //}

    const HtmlTooltip = withStyles((theme: Theme) => ({
        tooltip: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(16),
            border: '1px solid #dadde9',
        },
    }))(Tooltip);
    const createSortHandler = property => event => {
        handleRequestSort(event, property);
    };
    function handleClear(){
        api.getCompanies(page, rowsPerPage).then(response => {
            // setClientList(response.content);
            setClients(response.content);
            setTotalElements(response.totalElements);
        })
        setSearch("")
        setAgrementType([])
        setClientType([])

    }
    function handleClick(){
        api.getCompanies(page, rowsPerPage).then(response => {
            // setClientList(response.content);
            setClients(response.content);
            setTotalElements(response.totalElements);
        })
        // getInvoicesByFilter(forFilter)
    }
    function handleChange(e, type) {
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array?.map((el, index) => [el, index]);
        console.log(stabilizedThis)
        stabilizedThis?.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis?.map(el => el[0]);
    }
    
    
    function descendingComparator(a, b, orderBy) {
          
             
        if(orderBy==="companyName")
            {
              //  {row?.company && row.company.name}
               // {row?.founderOwner?.tradeAsName !== null ?  row?.founderOwner?.tradeAsName :row?.founderOwner.name+" "+row?.founderOwner.surname }
            const sa = String(a["company"]?.name !==undefined ? a["company"]?.name : a["founderOwner"]?.tradeAsName !==null ?a["founderOwner"]?.tradeAsName:a["founderOwner"]?.name+a["founderOwner"]?.surname).toLowerCase().replace(/\s+/g, '');
            const sb = String(b["company"]?.name !==undefined ? b["company"]?.name : b["founderOwner"]?.tradeAsName !==null ?b["founderOwner"]?.tradeAsName:b["founderOwner"]?.name+b["founderOwner"]?.surname).toLowerCase().replace(/\s+/g, '');
            console.log(sa+"  \n  "+sb);
            return sb.localeCompare(sa);

        }

        else if(orderBy ==="nameandsurname")
        {
            const sa = String(a["customerClients"][0]?.customerInfo?.user?.name+" "+a["customerClients"][0]?.customerInfo?.user?.surName).toLowerCase();
            const sb = String(b["customerClients"][0]?.customerInfo?.user?.name+" "+b["customerClients"][0]?.customerInfo?.user?.surName).toLowerCase();
           return sb.localeCompare(sa);
        }
       
    }
    
    function getComparator(order, orderBy) {
        console.log(order,orderBy);
        
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    return (
        <div>
            <FusePageSimple
    classes={{
        root: classes.layoutRoot
    }}
    header={
        <Grid container className="p-24" style={{textAlign: 'left'}}>
            <Grid item xs={12} sm={3}>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                        {t("INCOMEEXPENSE")}
                    </Typography>
                </FuseAnimate>
            </Grid>
            <Grid item xs={6} sm={9}>
                <Grid container>
                    <FuseAnimate animation="transition.slideDownIn" delay={300}>
                        <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
                            <Icon color="action">search</Icon>
                            <Input
                                placeholder={t('SEARCH')}
                                className="flex flex-1 mx-8"
                                disableUnderline
                                fullWidth
                                value={search}
                                inputProps={{
                                    'aria-label': 'Search'
                                }}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    //     setForFilter({...forFilter, search:e.target.value})
                                }}
                            />
                        </Paper>
                    </FuseAnimate>

                    <Button
                        className="ml-5 rounded-8"
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            handleClear()
                        }}
                    >
                        {t("CLEAR")}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    }
    content={
        <Grid container className="p-24">
            <Grid xs={12} sm={12}>
                <TableContainer className={classes.container} component={Paper}>
                    <Table className={classes.table}
                           stickyHeader={true}
                           aria-label="simple table"
                           size={"small"}>
                        <TableHead>
                            <TableRow>

                                {columns.map((head) => {
                                    return (
                                        head.id == "clientTypeEnum" || head.id == "aggrementType" ?
                                            <TableCell
                                                key={head.id}

                                            >
                                                {head.id == "clientTypeEnum" ? t("CLIENTTYPE") : t("AGREEMENTTYPE")}
                                                <Select
                                                    labelId="demo-mutiple-checkbox-label"
                                                    id="demo-mutiple-checkbox"
                                                    multiple
                                                    value={head.id == 'clientTypeEnum' ? clientTypeSelected : aggrementTypeSelected}
                                                    style={{maxWidth: "100px"}}
                                                    onChange={e => handleChange(e, head.id)}
                                                    input={<Input/>}
                                                    renderValue={(selected) => (selected as string[]).join(',')}
                                                    MenuProps={MenuProps}
                                                >
                                                    <MenuItem value={head.id == 'clientTypeEnum' ? null : null}>
                                                        <ListItemText
                                                            primary={head.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")}/>
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={head.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"}>
                                                        <Checkbox onChange={(e, checked) => {
                                                            handleChangeCheckbox(head.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER", checked, head.id)
                                                        }}
                                                                  checked={head.id == 'clientTypeEnum' ? clientType.indexOf("SOLETRADE") > -1 : agrementType?.indexOf("OTHER") > -1}/>
                                                        <ListItemText
                                                            primary={head.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"}/>
                                                    </MenuItem>
                                                    <MenuItem value={head.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"}>
                                                        <Checkbox onChange={(e, checked) => {
                                                            handleChangeCheckbox(head.id == 'clientTypeEnum' ? "LIMITED" : "ECAA", checked, head.id)
                                                        }}
                                                                  checked={head.id == 'clientTypeEnum' ? clientType.indexOf("LIMITED") > -1 : agrementType?.indexOf("ECAA") > -1}/>
                                                        <ListItemText
                                                            primary={head.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"}/>
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={head.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"}>
                                                        <Checkbox onChange={(e, checked) => {
                                                            handleChangeCheckbox(head.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING", checked, head.id)
                                                        }}
                                                                  checked={head.id == 'clientTypeEnum' ? clientType.indexOf("SELFASSESMENT") > -1 : agrementType?.indexOf("TRADING") > -1}/>
                                                        <ListItemText
                                                            primary={head.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"}/>
                                                    </MenuItem>
                                                </Select>
                                            </TableCell>
                                            :
                                            (
                                                <TableCell
                                                    key={head.id}
                                                >
                                                    {head.sortable ?
                                                        (
                                                            <TableSortLabel
                                                                active={orderBy === head.id}
                                                                onClick={createSortHandler(head.id)}
                                                            >
                                                                {head.label}
                                                                {orderBy === head.id ? (
                                                                    <span>
                                                                        {order === 'desc' ? '' : ''}
                                                                    </span>
                                                                ) : null}
                                                            </TableSortLabel>
                                                        ) :
                                                        head.label
                                                    }
                                                </TableCell>
                                            )
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stableSort(clients, getComparator(order, orderBy))?.slice(0 * rowsPerPage, 1 * rowsPerPage + rowsPerPage)
                                ?.map((row) => {
                                    const isItemSelected = isSelected(row.id);
                                    return (
                                        <TableRow hover role="checkbox"
                                                  tabIndex={-1} key={row.id} selected={isItemSelected}>

                                            <TableCell>
                                                {row?.company && row.company.name}
                                                {row?.founderOwner?.tradeAsName !== null ? row?.founderOwner?.tradeAsName : row?.founderOwner.name + " " + row?.founderOwner.surname}
                                            </TableCell>

                                            <TableCell>
                                                {row.customerClients?.length === 1 ? (
                                                        <Typography>{row.customerClients[0]?.customerInfo.user.name} {row.customerClients[0]?.customerInfo.user.surname}</Typography>) :
                                                    <HtmlTooltip
                                                        title={
                                                            <React.Fragment>
                                                                {row.customerClients?.map(user => (
                                                                    <Typography
                                                                        color="inherit">{user.customerInfo?.user.name} {user.customerInfo.user.surname}</Typography>
                                                                ))}
                                                            </React.Fragment>
                                                        }
                                                    >
                                                        <Button>{row.customerClients?.length} Shareholder...</Button>
                                                    </HtmlTooltip>
                                                }                                                        </TableCell>

                                            <TableCell align={"center"}>
                                                {row.clientTypeEnum}                                                        </TableCell>

                                            <TableCell align={"center"}>
                                                {row.agreementType}
                                            </TableCell>

                                            <TableCell>
                                                <Button variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleDetails(row)}>
                                                    <Icon style={{color: "secondary", fontSize: 30}}>search</Icon>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={totalElements}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {'aria-label': t('ROWSPERPAGE')},
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    }
    />

            <Dialog
                open={open}
                fullScreen={true}
                onClose={()=>{setOpen(false)}}
            >
                <DialogTitle>
                    <Grid container spacing={1}
                          direction="row-reverse"
                          justify="flex-start"
                          alignItems="center"
                    >
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained"
                                    color="primary"
                                    aria-label="close"
                                    onClick={()=>{setOpen(false)}}>
                                <CloseIcon/>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <h4> {//@ts-ignore
                                selectedClient?.clientName} {t("INCOMEEXPENSEREPORT")}</h4>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                   <MyIncomeExpense
                       clientProps={
                           //@ts-ignore
                       selectedClient}>
                   </MyIncomeExpense>
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default ClientsIncomeExpense;