import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    Button,
    IconButton, TableContainer,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography, Select, MenuItem, Input, ListItemText, Checkbox, Grid
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {func, number, object, oneOf, string} from 'prop-types';
import FusePageCarded from "../../../@fuse/core/FusePageCarded/FusePageCarded";
import FuseScrollbars from "../../../@fuse/core/FuseScrollbars";
import {useSelector} from 'react-redux';
import api from "../../services/BackendApi";
import _, {result} from "lodash";
import {Divided, Help} from "../../types/UserModel";
import BackendApi from "../../services/BackendApi";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Formsy from "formsy-react";
import {Div} from "../../components/Grid";
import TextFieldFormsy from "../../../@fuse/core/formsy/TextFieldFormsy";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import history from "../../../@history/@history";
import { withSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {Check, KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import DividedVoucherTemplate from "./DividedVoucherTemplate";
import back from "./image1.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


function ProductsTableHead(props) {
    const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

    const createSortHandler = property => event => {
        props.onRequestSort(event, property);
    };
    const { t } = useTranslation('SupportList');
    const rows = [

        {
            id: 'createdDateTime',
            align: 'right',
            disablePadding: false,
            label: t('CREATEDATETIME'),
            sort: true
        },

        {
            id: 'description',
            align: 'left',
            disablePadding: false,
            label: t('DESCRIPTION'),
            sort: false
        },

        {
            id: 'type',
            align: 'left',
            disablePadding: false,
            label: t('TYPE'),
            sort: false
        },
        {
            id: 'fileName',
            align: 'left',
            disablePadding: false,
            label: t('FILENAME'),
            sort: false
        },


        {
            id: 'status',
            align: 'right',
            disablePadding: false,
            label: t("STATUS"),
            sort: false
        },
    ];
   // const [statusTypeSelected, setStatusTypeSelected] = React.useState([]);
    {/*
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
    }
*/}
    function handleChangeCheckbox(value: string, checked: boolean, type: string) {
        if(checked && !props.statusTypeSelected.includes(value))
        {
                props.setStatusTypeSelected(oldArray=>[...oldArray,value]);
        }
        else if(!checked && props.statusTypeSelected.includes(value))
        props.setStatusTypeSelected(props.statusTypeSelected.filter(item => item != value))
        return
    }
    function handleChange(e, type) {

    }


    
    return (
        <TableHead>
            <TableRow className="h-64">
                {rows.map(row => {
                    return (
                        row.id ==="status"?
                        
                        <TableCell>
                            <span style={{marginRight:"20px"}}>{row.label}</span>
                            
                             <Select
                                multiple
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                value={props.statusTypeSelected}
                                label="Age"
                                style={{maxWidth:"100px"}}
                                onChange={e => handleChange(e, row.id)}
                                input={<Input />}
                                renderValue={(selected) => (selected as string[]).join(',')}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }}
                            >
                                <MenuItem value={'Pending'}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox("Pending", checked, row.id)}}  checked = {props.statusTypeSelected.indexOf("Pending") > -1 }/>
                                 <ListItemText primary={"Pending"} />
                                </MenuItem>
                                <MenuItem value={'Inprogress'}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox("Inprogress", checked, row.id)}}  checked = {props.statusTypeSelected.indexOf("Inprogress") > -1 }/>
                                 <ListItemText primary={"Inprogress"} />
                                </MenuItem>
                                <MenuItem value={'Done'}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox("Done", checked, row.id)}}  checked = {props.statusTypeSelected.indexOf("Done") > -1 }/>
                                 <ListItemText primary={"Done"} />
                                </MenuItem>
                            </Select>

                            {/**<Select
                                        labelId="demo-mutiple-checkbox-label"
                                        id="demo-mutiple-checkbox"
                                         multiple
                                        value={head.id == 'clientTypeEnum' ? clientTypeSelected : aggrementTypeSelected}
                                       style={{maxWidth:"100px"}}
                                                            onChange={e => handleChange(e, head.id)}
                                                            input={<Input />}
                                                            renderValue={(selected) => (selected as string[]).join(',')}
                                                            MenuProps={MenuProps}
                                                        >
                                                            <MenuItem  value={head.id ==  'clientTypeEnum' ? null : null}>
                                                                <ListItemText primary={head.id == 'clientTypeEnum' ? t("CLIENTTYPE") : t("AGGREMENTTYPE")} />
                                                            </MenuItem>
                                                            <MenuItem  value={ head.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"}>
                                                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox(head.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER", checked, head.id)}} checked={head.id == 'clientTypeEnum' ? clientType.indexOf("SOLETRADE" ) > -1 : agrementType?.indexOf("OTHER") > -1} />
                                                                <ListItemText primary={head.id == 'clientTypeEnum' ? "SOLETRADE" : "OTHER"} />
                                                            </MenuItem>
                                                            <MenuItem  value={head.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"}>
                                                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox(head.id == 'clientTypeEnum' ? "LIMITED" : "ECAA", checked, head.id)}} checked={head.id == 'clientTypeEnum' ? clientType.indexOf("LIMITED" ) > -1 : agrementType?.indexOf("ECAA") > -1} />
                                                                <ListItemText primary={head.id == 'clientTypeEnum' ? "LIMITED" : "ECAA"} />
                                                            </MenuItem>
                                                            <MenuItem  value={head.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"}>
                                                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox(head.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING", checked, head.id)}} checked={head.id == 'clientTypeEnum' ? clientType.indexOf("SELFASSESMENT" ) > -1 : agrementType?.indexOf("TRADING") > -1} />
                                                                <ListItemText primary={head.id == 'clientTypeEnum' ? "SELFASSESMENT" : "TRADING"} />
                                                            </MenuItem>
                                                        </Select> */}
                        </TableCell>

                        :
                        <TableCell
                            className="p-4 md:p-16"
                            key={row.id}
                            //@ts-ignore
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={props.order.id === row.id ? props.order.direction : false}
                        >
                            {row.sort ? (
                                <Tooltip
                                    title="Sort"
                                    placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={props.order.id === row.id}
                                        direction={props.order.direction}
                                        onClick={createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            ):row.label}
                        </TableCell>

                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}


const headCells = [
    {id: 'ProcessID', numeric: false, disablePadding: true, label: 'Process ID'},
    {id: 'userID', numeric: true, disablePadding: false, label: 'User'},
    {id: 'fileName', numeric: true, disablePadding: false, label: 'File Name'},
    {id: 'fileDescription', numeric: true, disablePadding: false, label: 'File Description'},
    {id: 'createdDateTime', numeric: true, disablePadding: false, label: 'Create Date'}
];

function EnhancedTableHead(props) {

    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

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
    },
    container :{
        maxHeight: 500
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

function DocumentsList(props: any) {
    const classes=useStyles();
    const { t } = useTranslation('SupportList');
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });
    const [orderBy, setOrderBy] = useState();
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [helpList, setHelpList] = React.useState<Help[]>();
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [open, setOpen] = React.useState(false);
    const [openDivide, setOpenDivide] = React.useState(false);
    const [selectedHelp, setSelectedHelp] = React.useState<Help>();
    const [divided,setDivided] = useState<Divided>({} as Divided);
    const [filteredHelplist,setFilteredHelplist]=React.useState<Help[]>();
    const [temporary,setTemporary]=React.useState<Help[]>();
    const [statusTypeSelected, setStatusTypeSelected] = React.useState([]);
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);

    function handleRequestSort(event, property) {
        const id = property;
        let direction = 'desc';

        if (order.id === property && order.direction === 'desc') {
            direction = 'asc';
        }

        setOrder({
            direction,
            id
        });
    }
    const {documents} = props;

    useEffect(()=>{
        test.forEach(x=>{

            if(x.client.id===clientId){
                if(x.client.state!=="3"){
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>,{
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                }else{
                    api.getHelpByClientID(clientId).then(res =>{
                        setHelpList(res)
                        setFilteredHelplist(res)
                    });
                }

            }
        })
    }, [])
    useEffect(()=>{
     if(helpList !==null &&helpList !== undefined && statusTypeSelected.length>0)
     {
         setFilteredHelplist([])
        
        if(statusTypeSelected.indexOf("Pending") > -1 )
        {
            //setNames(prevNames => [...prevNames, ...newNames])
              const temp =helpList.filter((data) =>data.task?.taskConfirmations?.length === 0);
              setFilteredHelplist(filteredHelplist=>[...filteredHelplist,...temp])

        }
        if(statusTypeSelected.indexOf("Inprogress") > -1 )
        {
            
          //helpList.filter((data) =>data.task?.taskConfirmations?.find(i => i.id === (Math.max(...data.task?.taskConfirmations.map(a => a.id))))?.taskConfirm.toString() === "INPROGRESS");
           const temp = helpList.filter((data) =>data.task?.taskConfirmations?.find(i => i.id === (Math.max(...data.task?.taskConfirmations.map(a => a.id))))?.taskConfirm.toString() === "INPROGRESS");
           setFilteredHelplist(filteredHelplist=>[...filteredHelplist,...temp])
           //n.task?.taskConfirmations?.find(i => i.id === (Math.max(...n.task?.taskConfirmations.map(a => a.id))))?.taskConfirm.toString()
       }
       if(statusTypeSelected.indexOf("Done") > -1 )
       {
          //helpList.filter((data) =>data.task?.taskConfirmations?.find(i => i.id === (Math.max(...data.task?.taskConfirmations.map(a => a.id))))?.taskConfirm.toString() === "DONE");
          
          const temp = helpList.filter((data) =>data.task?.taskConfirmations?.find(i => i.id === (Math.max(...data.task?.taskConfirmations.map(a => a.id))))?.taskConfirm.toString() === "DONE");
          setFilteredHelplist(filteredHelplist=>[...filteredHelplist,...temp])
       }


     }
     else
     {
        setFilteredHelplist(helpList)
     }
        //setFilteredHelplist(helpList.filter((data) =>data.task?.taskConfirmations?.length === 0).map((data)=>data))
       // n.task?.taskConfirmations?.length

    },[statusTypeSelected])

    const getDownload = (fileName: string) => {
        BackendApi.getDownloadDocumentByUser(clientId.toString(), fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }

    

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = documents.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        setSelectedHelp(helpList.find(i => i.id === name));
        setOpen(true);
    };

    const handleDivided = (event, divide) => {
        setSelectedHelp(divide);
        setOpenDivide(true);
    }

    const handleExportPdf = ()=>{
        const input = document.getElementById('divToPrint');
        const pdf = new jsPDF();
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        if (pdf) {
            html2canvas(input, {
                useCORS: true
            })
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 10, 10, width, height);
                    // pdf.addImage(imgData, 'PNG', 10, 10, 0, 0);
                    pdf.save('Dividend.pdf');
                }).catch();
        }
    }

    const getDivided = (n)=>{
        const divid = n?.divided;
        api.getByDirectorIdForDivided(divid).then((res)=>{
            setDivided(res);
            setSelectedHelp(n);
        }).finally(()=>
            setOpenDivide(true))
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function stableSort(array, comparator) {
        const stabilizedThis = array?.map((el, index) => [el, index]);
        stabilizedThis?.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis?.map(el => el[0]);
    }
    
    
    function descendingComparator(a, b, orderBy) {
        if(orderBy ==="createdDateTime")
        {
              const  da = new Date(a[orderBy]).getTime();
              const db = new Date(b[orderBy]).getTime();
            if (db<da) {
                return -1;
            }
             else if (db>da)
             {
                return 1;
            }
            return 0;
        }
        return
    }
    
    function getComparator(order, orderBy) {
        return order.direction === 'desc'
            ? (a, b) => descendingComparator(a, b, order.id)
            : (a, b) => -descendingComparator(a, b, order.id);
    }

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={<div className="md:py-24">
                <h2>{t('SUPPORTPAGE')}</h2>
            </div>}
            content={
                <div className="w-full flex flex-col">

                        <TableContainer className={classes.container}>
                        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                            <ProductsTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy = {orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={helpList?.length}
                                statusTypeSelected ={statusTypeSelected}
                                setStatusTypeSelected ={setStatusTypeSelected}
                            />
                         

                            <TableBody>
                                {stableSort(filteredHelplist, getComparator(order, orderBy))
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((n) => {
                                        
                                        const dt = moment(n.createdDateTime).format("DD-MM-YYYY,h:mm:ss a");
                                        return (
                                            <TableRow
                                                className="h-64 cursor-pointer"
                                                hover
                                                // role="checkbox"
                                                // aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={n.id}
                                            >
                                                <TableCell style={{paddingLeft: "10px"}} scope="row" padding="none" align="right" onClick={event => handleClick(event, n.id)} >
                                                    {dt}
                                                </TableCell>

                                                <TableCell className="p-4 md:p-16" component="th" scope="row" onClick={event => handleClick(event, n.id)}>
                                                    {n.description}
                                                </TableCell>

                                                {n.helpType?.helpTypeShowName=="Dividend Voucher"?
                                                    (n.task?.taskConfirmations?.length === 0 ?
                                                            <TableCell
                                                                onClick = {()=> {
                                                                    // getDivided();
                                                                    setSelectedHelp(n);
                                                                    setDivided({} as Divided);
                                                                    setOpenDivide(true);
                                                                }}
                                                            >
                                                                {n.helpType?.helpTypeShowName}
                                                            </TableCell> :
                                                            <TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={event => {
                                                                getDivided(n);
                                                               // handleDivided(event, n);
                                                            }} >
                                                                {n?.helpType?.helpTypeShowName}
                                                            </TableCell>
                                                    ) :
                                                    <TableCell  className="p-4 md:p-16 truncate" component="th" scope="row" onClick={event => handleClick(event, n.id)} >
                                                        {n?.helpType?.helpTypeShowName}
                                                    </TableCell>
                                                }

                                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left"
                                                           onClick={event => event.stopPropagation()}>
                                                    {n.document?.fileName ? (<Button color={"primary"} variant={"outlined"} onClick={()=>getDownload(n.document?.fileName)}>{n.document?.fileName}</Button>):("")}
                                                </TableCell>
                                                <TableCell style={{paddingLeft: "10px", textAlign:"left"}} scope="row" padding="none" align="right" >
                                                    {n.task?.taskConfirmations?.length === 0 ? t('PENDING') : t(n.task?.taskConfirmations?.find(i => i.id === (Math.max(...n.task?.taskConfirmations.map(a => a.id))))?.taskConfirm.toString())}
                                                </TableCell><br/>

                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                        </TableContainer>


                    <TablePagination
                        className="flex-shrink-0 border-t-1"
                        component="div"
                        count={helpList?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page'
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page'
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}

                    />
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle style={{backgroundColor: '#132332', color: '#fff'}}
                                     id="alert-dialog-title"></DialogTitle>

                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Formsy
                                    // onValidSubmit={handleSubmit}
                                >
                                    <Div columns={1}>
                                        <TextFieldFormsy
                                            id="outlined-multiline-static"
                                            label={t('DESCRIPTION')}
                                            className="mb-16"
                                            multiline
                                            name="description"
                                            rows={5}
                                            variant="outlined"
                                            disabled={true}
                                            value={selectedHelp?.description}
                                        />
                                    </Div>
                                    <Div columns={1}>
                                        <TextFieldFormsy
                                            id="outlined-multiline-static"
                                            label={t('RESPONSE')}
                                            className="mb-16"
                                            multiline
                                            name="answer"
                                            rows={5}
                                            variant="outlined"
                                            disabled={true}
                                            value={selectedHelp?.answer}
                                            // onChange={handleForm}
                                        />
                                    </Div>
                                    <DialogActions>
                                        <Div className="flex flex-end">
                                            <Button variant="contained" autoFocus
                                                    onClick={handleClose}
                                                    color="secondary">
                                                {t('CLOSE')}
                                            </Button>
                                            <Button  variant="contained" type="submit" color="primary">
                                                {t('SAVE')}
                                            </Button>
                                        </Div>
                                    </DialogActions>
                                </Formsy>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        open={openDivide}
                        onClose={()=>{setOpenDivide(false)}}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        {selectedHelp?.task?.taskConfirmations.length>0 ?
                            selectedHelp?.task?.taskConfirmations?.map((confirmation)=>
                                confirmation?.taskConfirm?.toString() == "DONE"?
                                    <div>
                                    <DialogTitle style={{}} id="alert-dialog-title">
                                        <Button onClick={()=>{
                                            handleExportPdf();
                                            setOpenDivide(false);
                                        }}>Save</Button>
                                        <Button onClick={()=>{setOpenDivide(false)}}>Close</Button>
                                    </DialogTitle>
                                    <DialogContent  id='divToPrint' style={{ backgroundImage: `url(${back})`,backgroundSize : "450px, contain", backgroundRepeat: 'no-repeat'}}>
                                        <div style={{ width : "450px", height:"600px", marginTop : "50px"}} >
                                            <Grid item xs={12} sm={12}
                                                  style={{textAlign : "center", border : "black", margin : "2%", fontWeight : "bold"}}
                                            >
                                                <label style={{margin : "2%"}}>Dividend Voucher</label>
                                            </Grid>
                                            <Grid container  style={{textAlign : "center"}} >
                                                <Grid item xs={12} sm={6}>
                                                    <label>Payment Number</label>
                                                    <div style={{border:'groove',borderBlockColor:"grey", borderBlockEndColor:"grey", borderColor:"grey", padding:'10px 20px', margin:'20px'}}>
                                                        {/*@ts-ignore*/}
                                                        <label style={{ color:"blue"}}>{divided?.paymentNumber}</label>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label>Date Payment Made</label>
                                                    <div style={{border:'groove',borderBlockColor:"grey", borderBlockEndColor:"grey", borderColor:"grey", padding:'10px 20px', margin:'20px', marginRight:"40px"}}>
                                                        {/*@ts-ignore*/}
                                                        <label style={{ color:"blue"}}>{divided?.datePaymentRate}</label>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    {/*@ts-ignore*/}
                                                    <label style={{fontWeight:"bold"}} >{selectedHelp?.client?.clientName }</label>
                                                </Grid>
                                                { selectedHelp?.client?.customerClients?.map((customer)=> (
                                                    customer?.customerInfo?.userInfo?.id == divided?.directorId ?
                                                        <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                                            { "Employee Name & Address:"+ "\n" } <br/>
                                                            {/*@ts-ignore*/}
                                                            {customer?.customerInfo?.userInfo?.name + " " + customer?.customerInfo?.userInfo?.surname + "\n"}
                                                        </Grid>
                                                        :
                                                        selectedHelp?.client?.company?.directorDetails?.map((director)=>(
                                                            director?.id == divided?.directorId ?
                                                                <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                                                    { "Employee Name & Address:"+ "\n" } <br/>
                                                                    {/*@ts-ignore*/}
                                                                    {director?.name + " " + director?.surname + "\n"}
                                                                </Grid>
                                                                :
                                                                <Grid>
                                                                    <label></label>
                                                                </Grid>
                                                        ))

                                                ))}

                                                <Grid item xs={12} sm={12}  style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                                    { /*@ts-ignore*/
                                                        selectedHelp?.client?.addressList?.map((a)=>(a.addressType=="HOME"?<p>
                                                            {a.street == null ? "" : a.street}  {a.district == null ? "" : a.district} {a.number == null ? "" : a.number}
                                                            {a.city == null ? "" : a.city} {a.postcode == null ? "" : a.postcode} {a.county == null ? "" : a.county}

                                                        </p>:<p></p>))
                                                    }
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <label></label>
                                                </Grid>

                                                <Grid container style={{marginLeft : "10%", marginRight : "10%"}}>
                                                    <Grid item xs={12} sm={4}>
                                                        <label>Shareholding</label>
                                                        <div style={{border:'groove',borderBlockColor:"grey", borderBlockEndColor:"grey", borderColor:"grey", padding:'10px 20px', margin:'20px'}}>
                                                            {/*@ts-ignore*/}
                                                            <label style={{ color:"blue"}}>{divided?.shareHolding}</label>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>

                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <label> Amount Payable</label>
                                                        <div style={{border:'groove',borderBlockColor:"grey", borderBlockEndColor:"grey", borderColor:"grey", padding:'10px 20px', margin:'20px'}}>
                                                            {/*@ts-ignore*/}
                                                            <label style={{ color:"blue"}}>{divided?.amountPayable}</label>
                                                        </div>
                                                    </Grid>

                                                    <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                                        <label>
                                                            This cheque is in payment of the Interim dividend<br/>
                                                            for the year ended :
                                                            <label style={{color:"blue"}}>
                                                                {/*@ts-ignore*/}
                                                                {divided?.dividedEndDate}
                                                            </label> <br/>
                                                            paid at the rate of <label style={{color:"blue"}}>£
                                                            {/*@ts-ignore*/}
                                                            {divided?.amountPayable}
                                                        </label> on those<br/>
                                                            ordinary shares  registered in your name on <label style={{color:"blue"}}>
                                                            {/*@ts-ignore*/}
                                                            {divided?.dividedEndDate}
                                                        </label>

                                                        </label>
                                                        <br/>
                                                        <label>
                                                            Given on behalf of<br/>
                                                            <Grid item xs={12} sm={6}>
                                                                {/*@ts-ignore*/}
                                                                <label style={{fontWeight:"bold"}}>{selectedHelp?.client?.clientName }</label>
                                                            </Grid>
                                                            <label style={{color:"blue"}}>
                                                                Registered Office Address 17 Greenlanes, London, United Kingdom, N16 9BS
                                                            </label>
                                                        </label>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </DialogContent>
                                    </div>
                                    :
                                    <div>
                                        <DialogTitle>
                                            <Button onClick={()=>{setOpenDivide(false)}}>Close</Button>
                                        </DialogTitle>
                                    </div>
                            )
                            :
                            <div>
                                <DialogTitle>
                                    <Button onClick={()=>{
                                        setOpenDivide(false);
                                    }}>Close</Button>
                                </DialogTitle>
                                <DialogContent id='divToPrint' style={{ backgroundImage: `url(${back})`,backgroundSize : "450px, contain", backgroundRepeat: 'no-repeat'}}>
                                <DividedVoucherTemplate helpType={selectedHelp} divided={divided} setDivided={setDivided}></DividedVoucherTemplate>
                                </DialogContent>
                            </div>
                        }
                    </Dialog>
                </div>
            }

            innerScroll
        />
    );
}


export default withSnackbar(DocumentsList);
