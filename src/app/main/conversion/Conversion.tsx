import Icon from '@material-ui/core/Icon';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import history from '@history/@history'
import SaveIcon from '@material-ui/icons/Save';
import Button from "@material-ui/core/Button";
import {Div} from "../../components/Grid";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Formsy from "formsy-react";
import {
    Checkbox,
    createStyles,
    IconButton,
    LinearProgress,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Theme,
    Tooltip, Typography,
    withStyles,Select,Input
} from "@material-ui/core";
import SelectFormsy from "../../../@fuse/core/formsy/SelectFormsy";
import Snackbar from "@material-ui/core/Snackbar";
import api from "../../services/BackendApi";
import BackendApi from "../../services/BackendApi";
import {Alert} from "@material-ui/lab";
import {isValidErrorResponse} from "../../utils/utils";
import {BankTransaction, BankType} from "../../types/UserModel";
import _ from "lodash";
import FuseScrollbars from "../../../@fuse/core/FuseScrollbars";
import clsx from "clsx";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {withSnackbar} from 'notistack';
import {useTranslation} from "react-i18next";
import moment from "moment";
import * as events from "events";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {any, number} from "prop-types";

function ProductsTableHead(props) {
    const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
    const {t} = useTranslation('conversion');
    const createSortHandler = property => event => {
        props.onRequestSort(event, property);
    };
    const{selectedClientType,setSelectedClientType,selectedAmountType,setSelectedAmountType}=props;
    
    const rows = [
        {
            id: 'businessName',
            align: 'left',
            disablePadding: false,
            label: t("BUSINESSNAME"),
            sort: false
        },
        {
            id: 'startDate',
            align: 'left',
            disablePadding: false,
            label: t("STARTDATE"),
            sort: false
        },
        {
            id: 'endDate',
            align: 'left',
            disablePadding: false,
            label: t("ENDDATE"),
            sort: false
        },
        {
            id: 'totalMoneyIn',
            align: 'left',
            disablePadding: false,
            label: t("TOTALMONEYIN"),
            sort: false
        },
        {
            id: 'totalMoneyOut',
            align: 'left',
            disablePadding: false,
            label: t("TOTALMONEYOUT"),
            sort: false
        },
        {
            id: 'clienttype',
            align: 'left',
            disablePadding: false,
            label: t("CLIENTTYPE"),
            sort: false
        },

        {
            id: 'bankName',
            align: 'left',
            disablePadding: false,
            label: t("BANKNAME"),
            sort: false
        },
        {
            id: 'amount',
            align: 'left',
            disablePadding: false,
            label: t("AMOUNT"),
            sort: false
        },
        {
            id: 'fileName',
            align: 'left',
            disablePadding: false,
            label: t("FILENAME"),
            sort: false
        },
        {
            id: 'createdDateTime',
            align: 'right',
            disablePadding: false,
            label: t("CREATEDATETIME"),
            sort: true
        },

    ];

    function openSelectedProductsMenu(event) {
        setSelectedProductsMenu(event.currentTarget);
    }

    function closeSelectedProductsMenu() {
        setSelectedProductsMenu(null);
    }
    
    function handleChangeCheckbox(value: string, checked: boolean, type: string) {
        console.log(value)
        if(type==="amount")
        {
            if(checked && !selectedAmountType.includes(value))
            {
             setSelectedAmountType(oldArray=>[...oldArray,value]);
            console.log(selectedAmountType)
            }
             else if(!checked && selectedAmountType.includes(value))
             setSelectedAmountType(selectedAmountType.filter(item => item != value))
        }
        else
        {
            if(checked && !selectedClientType.includes(value))
            {
                setSelectedClientType(oldArray=>[...oldArray,value]);
                    console.log(selectedClientType)
            }
            else if(!checked && selectedClientType.includes(value))
            setSelectedClientType(selectedClientType.filter(item => item != value))
        }
       
        return
    }
    //SOLETRADE,SELFASSESMENT,LIMITED
    return (
        <TableHead>
            <TableRow className="h-64">
                {/*<TableCell padding="none" className="w-40 md:w-64 text-center z-99">*/}
                {/*    <Checkbox*/}
                {/*        indeterminate={props.numSelected > 0 && props.numSelected < props.rowCount}*/}
                {/*        checked={props.numSelected === props.rowCount}*/}
                {/*        onChange={props.onSelectAllClick}*/}
                {/*    />*/}
                {/*    {props.numSelected > 0 && (*/}
                {/*        <div*/}
                {/*            className={clsx(*/}
                {/*                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',*/}
                {/*                // classes.actionsButtonWrapper*/}
                {/*            )}*/}
                {/*        >*/}
                {/*            <IconButton*/}
                {/*                aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}*/}
                {/*                aria-haspopup="true"*/}
                {/*                onClick={openSelectedProductsMenu}*/}
                {/*            >*/}
                {/*                <Icon>more_horiz</Icon>*/}
                {/*            </IconButton>*/}
                {/*            <Menu*/}
                {/*                id="selectedProductsMenu"*/}
                {/*                anchorEl={selectedProductsMenu}*/}
                {/*                open={Boolean(selectedProductsMenu)}*/}
                {/*                onClose={closeSelectedProductsMenu}*/}
                {/*            >*/}
                {/*                <MenuList>*/}
                {/*                    <MenuItem*/}
                {/*                        onClick={() => {*/}
                {/*                            closeSelectedProductsMenu();*/}
                {/*                        }}*/}
                {/*                    >*/}
                {/*                        <ListItemIcon className="min-w-40">*/}
                {/*                            <Icon>delete</Icon>*/}
                {/*                        </ListItemIcon>*/}
                {/*                        <ListItemText primary="Remove"/>*/}
                {/*                    </MenuItem>*/}
                {/*                </MenuList>*/}
                {/*            </Menu>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</TableCell>*/}
                {rows.map(row => {
                    return (
                        row.id =="amount" || row.id =="clienttype"?
                        row.id =="amount"?
                        <TableCell>
                             <span style={{marginRight:"20px"}}>{row.label}</span>
                            
                            <Select
                               multiple
                               labelId="demo-mutiple-checkbox-label"
                               id="demo-mutiple-checkbox"
                               value={selectedAmountType}
                               label="Age"
                               style={{maxWidth:"100px"}}
                              // onChange={e => handleChange(e, row.id)}
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
                               <MenuItem value={'MULTIPLE'}>
                               <Checkbox onChange={(e,checked) => {handleChangeCheckbox("MULTIPLE", checked, row.id)}}  checked = {selectedAmountType.indexOf("MULTIPLE") > -1 }/>
                                <ListItemText primary={"MULTIPLE"} />
                               </MenuItem>
                               <MenuItem value={'SINGLE'}>
                               <Checkbox onChange={(e,checked) => {handleChangeCheckbox("SINGLE", checked, row.id)}}  checked = {selectedAmountType.indexOf("SINGLE") > -1 }/>
                                <ListItemText primary={"SINGLE"} />
                               </MenuItem>
                           </Select>


                        </TableCell>
                        :
                        <TableCell>
                             <span style={{marginRight:"20px"}}>{row.label}</span>
                            
                            <Select
                               multiple
                               labelId="demo-mutiple-checkbox-label"
                               id="demo-mutiple-checkbox"
                               value={selectedClientType}
                               label="Age"
                               style={{maxWidth:"100px"}}
                              // onChange={e => handleChange(e, row.id)}
                               //SOLETRADE,SELFASSESMENT,LIMITED
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
                               <MenuItem value={'LIMITED'}>
                               <Checkbox onChange={(e,checked) => {handleChangeCheckbox("LIMITED", checked, row.id)}}  checked = {selectedClientType.indexOf("LIMITED") > -1 }/>
                                <ListItemText primary={"LIMITED"} />
                               </MenuItem>
                               <MenuItem value={'SELFASSESMENT'}>
                               <Checkbox onChange={(e,checked) => {handleChangeCheckbox("SELFASSESMENT", checked, row.id)}}  checked = {selectedClientType.indexOf("SELFASSESMENT") > -1 }/>
                                <ListItemText primary={"SELFASSESMENT"} />
                               </MenuItem>
                               <MenuItem value={'SOLETRADE'}>
                               <Checkbox onChange={(e,checked) => {handleChangeCheckbox("SOLETRADE", checked, row.id)}}  checked = {selectedClientType.indexOf("SOLETRADE") > -1 }/>
                                <ListItemText primary={"SOLETRADE"} />
                               </MenuItem>
                           </Select>


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
                            {row.sort ?(
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
                            ):
                            row.label}
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}
ProductsTableHead.propTypes = {
    selectedClientType:any,
    setSelectedClientType:any,
    numSelected:any,
    order:any,
    onSelectAllClick:any,
    rowCount:any,
    onRequestSort:any,
    selectedAmountType:any,
    setSelectedAmountType:any

};


const useStyles = makeStyles({
    root: {
        width: '100%',
        padding: 15,
    },
    container: {
        maxHeight: 440,
    },
});

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }),
)(LinearProgress);

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

function Conversion(props) {
    const {t} = useTranslation('conversion');
    // const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [open1, setOpen1] = React.useState(false);
    const [name, setName] = useState(false);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [progress, setProgress] = React.useState(0);
    const [hidden, setHidden] = useState(false);
    const [file, setFile] = React.useState<File>(null);
    const [error, setError] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [bankType, setBankType] = useState<string>('none');
    const [statementType, setStatementType] = useState<string>('none');
    // @ts-ignore
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [bankTransactionList, setBankTransactionList] = useState<BankTransaction[]>();
    const [selected, setSelected] = React.useState([]);
    const [selectedStatement, setSelectedStatement] = React.useState<BankTransaction>();
    const [uploadFileName, setUploadFileName] = useState(null);
    const [order, setOrder] = useState({
        direction: 'asc',
        id:"createdDateTime"
    });

    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [disabled, setDisabled] = useState<boolean>(true);

    //filtreme
    const [selectedAmountType,setselectedAmountType] = useState([])
    const [selectedClientType,setSelectedClientType] = useState([]);
    const [filteredBankTransactionList,setFilteredBankTransactionList] = useState([]);

    const getDownload = (fileName: string) => {
        BackendApi.getDownloadStatement(fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }
    useEffect(() => {
        console.log(bankType);
    }, [bankType])
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function getTransactions() {

        api.getBankTransactions(clientId).then(res => {setBankTransactionList(res);
            setFilteredBankTransactionList(res)
        })
    }


    function handleChange2(e) {
        if (!e.target.files[0].type.match('application/pdf')) {
            props.enqueueSnackbar(<h4>{t("PLEASEUPLOADPDFFILEONLY")}.</h4>, {
                variant: 'error',
            })
        } else {
            setFile(e.target.files[0])
            setUploadFileName(e.target.files[0].name)
        }
    }

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

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = bankTransactionList.map(n => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let propStatement = bankTransactionList.find(i => i.id === name);
        setSelectedStatement(bankTransactionList.find(i => i.id === name));
        //@ts-ignore
        history.push({
            pathname: "/conversions/" + name,
            displayRouteData: {
                fileName: propStatement.document.documentName.substring(0, propStatement.document.documentName.indexOf(".")).toString(),
            }
        });
        // setOpen(true);
    };

    // const handleClick2 = (transactionId: string)=>{
    //     history.push("/conversions/"+transactionId)
    // };

    function handleSaveClick(e) {
        setDisabled(true);
        if (bankType === 'none' || statementType === 'none') {
            props.enqueueSnackbar(<h4>{t("PLEASESELECT")}.</h4>, {
                variant: 'error',
            })
            return;
        }
        setProgress(0)
        e.preventDefault();

        console.log(file);
        setTimeout(function() { window.location=window.location;},5000);
        let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
        };

        // setUploadDocumentList([...uploadDocumentList, document])

        api.uploadDocumentData2(file, clientId, bankType, statementType, progressCallback).then((data) => {
            // history.push('/documentcreate' )
            // history.go(0)
            // setIsSuccess(true)ss})
            setFileName(data.processId)
            setHidden(true);

            // setResponseFile(data);
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });
    }

    useEffect(() => {
        test.forEach(x=>{

            if(x.client.id===clientId){
                console.log(x.client.isActive)
                if(x.client.state!=="3"){
                    props.enqueueSnackbar(<h4>{t("MAKECOMPANYAPPLICATION")}</h4>,{
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                }else{
                    getTransactions();
                }

            }
        })
    }, [])
     useEffect(()=>{
        if(bankTransactionList !== null && bankTransactionList !== undefined)
        {
            filterByTypes(selectedAmountType,selectedClientType);
        }
        

    },[selectedAmountType,selectedClientType])

     function filterByTypes(selectedAmountType:any,selectedClientType:any)
     {
        setFilteredBankTransactionList([])
         if(selectedClientType.length>0 && selectedAmountType.length>0)
         {
            filterForAllTypes(selectedAmountType,selectedClientType)

         }
         else if(selectedClientType.length>0)
         {
            filterForClientTypes(selectedClientType);

         }
         else if(selectedAmountType.length>0)
         {
            filterForAmountTypes(selectedAmountType);
         }
         else
        {
            setFilteredBankTransactionList(bankTransactionList)

        }
     }

     function filterForClientTypes(selectedClientType:any)
     {
         selectedClientType.map((clientType)=>{
            if(selectedClientType.indexOf(clientType)>-1)
            {
                const temp = bankTransactionList.filter((bankList)=>bankList.clientType===clientType)
                setFilteredBankTransactionList(filteredBankTransactionList=>[...filteredBankTransactionList,...temp])
            }
         })
         
     }

     function filterForAmountTypes(selectedAmountType:any)
     {
        selectedAmountType.map((amountType)=>{
            if(selectedAmountType.indexOf(amountType)>-1)
            {
                const temp = bankTransactionList.filter((bankList)=>bankList.statementType===amountType)
                setFilteredBankTransactionList(filteredBankTransactionList=>[...filteredBankTransactionList,...temp])
            }
         })

     }
     //iki filtre birbirini etkilediği için eklendi.
      function filterForAllTypes(selectedAmountType:any,selectedClientType:any)
      { selectedClientType.map((clientType)=>{
            
        selectedAmountType.map((amountType)=>{
            if(selectedAmountType.indexOf(amountType)>-1)
            {
                const temp = bankTransactionList.filter((bankList)=>bankList.statementType===amountType &&  (selectedClientType.indexOf(clientType)>-1 ? bankList.clientType===clientType:false))
                setFilteredBankTransactionList(filteredBankTransactionList=>[...filteredBankTransactionList,...temp])
            }
         })
        
     })
     }
    //-----------------------------------CSV EXPORT----------------------------------------------------//
    function exportdata(id: number) {
        // console.log("girdi")
        let details;
        api.getBankTransactionDetails(id.toString()).then(
            res => {
                details = res.forEach(function (v) {
                    delete v.id
                });
            })
        downloadCSV(details);
    }

    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }


    const Export = ({onExport}) => (
        // @ts-ignore
        <Button onClick={e => onExport(e.target.value)}>Export</Button>
    );
    
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
        console.log(a)
        if(orderBy ==="createdDateTime")
        {
            
              const  da = new Date(a[orderBy])?.getTime();
              const db = new Date(b[orderBy])?.getTime();
              console.log(db)
            if (db<da) {
                console.log("sonucu : -1")
               
                return -1;
                
            }
             else if (db>da)
             {
                console.log("sonucu : +1")
                return 1;
            }
            
            return 0;
        }
       
        return
       
    }
    
    function getComparator(order, orderBy) {
        console.log(order,orderBy);
        
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

//-----------------------------------------------------------------------------------------------------------------//

    // @ts-ignore
    return (
        <div>{/*büyük div küçük div olarak değişti*/}
            <div>
                <Formsy>
                    <Div columns={2} className={"p-20"}>
                        <SelectFormsy
                            className="my-16"
                            label={t("SELECTBANK")}
                            value={bankType}
                            variant="outlined"
                            name="banks"
                            onChange={(e) => {
                                setBankType(e.target.value)
                            }}
                        >
                            <MenuItem value="none">
                                <em>{t("PLEASESELECT")}</em>
                            </MenuItem>
                            {Object.keys(BankType)
                                .map(key => (<MenuItem value={key}>{BankType[key]}</MenuItem>))}

                        </SelectFormsy>
                        <SelectFormsy
                            className="my-16"
                            label={t("AMOUNTTYPE")}
                            value={statementType}
                            variant="outlined"
                            name="type"
                            onChange={(e) => {
                                setStatementType(e.target.value)
                            }}
                        >
                            <MenuItem value="none">
                                <em>{t("PLEASESELECT")}</em>
                            </MenuItem>
                            <MenuItem value="MULTIPLE">{t("MULTIPLEAMOUNT")}</MenuItem>
                            <MenuItem value="SINGLE">{t("SINGLEAMOUNT")}</MenuItem>
                        </SelectFormsy>
                    </Div>
                    <div className={"flex w-full justify-self-stretch pr-32 mx-8 my-12"}>


                        <div className={classes.root}>
                            {uploadFileName &&
                            <Typography className="-mt-2 font-bold text-base">{uploadFileName}</Typography>}
                            <BorderLinearProgress variant="determinate" value={progress}/>
                        </div>
                        {/*{/<LinearProgress variant="determinate"/}*/}
                        {/*                  color={progress === 100 ? "secondary" : "primary"}*/}
                        {/*                  value={progress}/>*/}
                        <input className={"hidden"}
                               type="file"
                               accept="application/pdf"
                               onChange={handleChange2}
                               id="contained-button-file"
                        />

                        <label htmlFor="contained-button-file">
                            <Button startIcon={<CloudUploadIcon/>} onClick={()=>{setDisabled(false)}} variant="contained" color="default" component="span">
                                {t("UPLOAD")}
                            </Button>

                        </label>
                        <label>
                            <Button startIcon={<SaveIcon/>} disabled={disabled} className="mx-8"
                                    variant="contained" type="submit" color="secondary" onClick={(event)=>{

                                        handleSaveClick(event);
                                    }}>
                                {t("SAVE")}
                            </Button>
                        </label>

                    </div>

                    <div>
                        <Paper className={classes.root}>
                            <FuseScrollbars className="flex-grow overflow-x-auto">
                                <TableContainer className={classes.container}>
                                <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                                    <ProductsTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                        rowCount={bankTransactionList?.length}
                                        selectedClientType = {selectedClientType}
                                        setSelectedClientType = {setSelectedClientType}
                                        selectedAmountType = {selectedAmountType}
                                        setSelectedAmountType={setselectedAmountType}
                                    />

                                    <TableBody>
                                        {stableSort(filteredBankTransactionList,getComparator(order.direction,order.id))
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            ?.map(n => {
                                                const isSelected = selected.indexOf(n.id) !== -1;
                                                const createDate = moment(n.createdDateTime).format('DD-MM-YYYY,h:mm:ss a')
                                                return (
                                                    <TableRow
                                                        className="h-64 cursor-pointer"
                                                        hover
                                                        // role="checkbox"
                                                        // aria-checked={isSelected}
                                                        tabIndex={-1}
                                                        key={n.id}
                                                        // selected={isSelected}
                                                        onClick={event => handleClick(event, n.id)}
                                                    >
                                                        {/*<TableCell className="w-40 md:w-64 text-center" padding="none">*/}
                                                        {/*    <Checkbox*/}
                                                        {/*        checked={isSelected}*/}
                                                        {/*        onClick={event => event.stopPropagation()}*/}
                                                        {/*        // onChange={event => handleCheck(event, n.id)}*/}
                                                        {/*    />*/}
                                                        {/*</TableCell>*/}

                                                        <TableCell className="p-4 md:p-16" component="th" scope="row">
                                                            {n?.businessName}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row">
                                                            {n?.startDate}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row">
                                                            {n?.endDate}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row">
                                                            {n?.totalMoneyIn}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row">
                                                            {n?.totalMoneyOut}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row">
                                                            {n?.clientType}
                                                        </TableCell>

                                                        <TableCell className="p-4 md:p-16 truncate" component="th"
                                                                   scope="row">
                                                            {n?.bankType}
                                                        </TableCell>

                                                        <TableCell className="p-4 md:p-16" component="th" scope="row"
                                                                   align="left">
                                                            {n.statementType}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row"
                                                                   align="left"
                                                                   onClick={event => event.stopPropagation()}>
                                                            {n.document.documentName ? (
                                                                <Button color={"primary"} variant={"outlined"}
                                                                        onClick={() => getDownload(n.document.documentName)}>{n.document.documentName}</Button>) : ("")}
                                                        </TableCell>
                                                        <TableCell className="p-4 md:p-16" component="th" scope="row"
                                                                   align="right"
                                                                   onClick={event => event.stopPropagation()}>
                                                            {createDate}

                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </FuseScrollbars>

                            <TablePagination
                                className="flex-shrink-0 border-t-1"
                                component="div"
                                count={bankTransactionList?.length}
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
                        </Paper>
                        {/*<a className="truncate"*/}
                        {/*   onClick={() => getDownload()}>Download</a>*/}
                    </div>


                </Formsy>

            </div>
            <Snackbar open={open1} autoHideDuration={3000}>
                <Alert severity="success">
                    {name}{t("CLIENTADDEDSUCCESFULLY")}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default withSnackbar(Conversion);
