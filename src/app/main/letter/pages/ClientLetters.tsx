import React, {useEffect, useState} from 'react';
import {lighten, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

import {
    AppBar,
    Button,
    createStyles,
    Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, Icon,
    IconButton,
    Slide,
    TablePagination,
    TableSortLabel, TextField,
    Toolbar,
    Tooltip,
    Typography,Select,MenuItem,Input,ListItemText,Checkbox
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {any, array, func, number, object, oneOf, string} from 'prop-types';
import {useSelector} from 'react-redux';
import history from "../../../../@history/@history";
import {useParams} from "react-router-dom";
import api from "../../../services/BackendApi";
import {Letter} from "../../../types/UserModel";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded/FusePageCarded";
import CloseIcon from "@material-ui/icons/Close";
import {Document, Image, Page, PDFViewer, StyleSheet, Text, View} from "@react-pdf/renderer";
import {TransitionProps} from "@material-ui/core/transitions";

import {withSnackbar} from "notistack";

import ReactDOM from 'react-dom';
import {useTranslation} from "react-i18next";
import moment from "moment";
import {Div} from "../../../components/Grid";
import config from "../../../services/Config";
import FuseScrollbars from "../../../../@fuse/core/FuseScrollbars";


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

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald'
    },
    text1: {
        marginTop: 140,
        marginLeft: 60,
        fontSize: 12,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
        position: 'absolute',
        paddingHorizontal: 35,

    },
    text2: {
        marginLeft: 10,
        fontSize: 12,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
        position: 'relative',
        paddingHorizontal: 35,

    },
    text3: {
        fontSize: 12,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
        position: 'relative',
        paddingHorizontal: 35,

    },
    image: {
        position: 'relative',
    },
    view: {
        position: 'absolute',
        textAlign: 'justify',
        paddingTop: 90,

    },
    header: {
        fontSize: 14,
        marginTop: 100,
        marginLeft: 60,
        position: 'absolute',
        fontFamily: 'Times-Roman',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
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
    const {t} = useTranslation('letter');
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,statusTypeSelected} = props;
    const {setOrder, setOrderBy, setPage,setStatusTypeSelected} = props
    const createSortHandler = property => event => {
        // onRequestSort(event, property);
        setPage(0)
        setOrder(order == "asc" ? "desc" : "asc")
        setOrderBy(property)
    };

    const headCells = [
        // {id: 'id', numeric: false, disablePadding: false, label: "ID"},
        {id: 'lt.letter_type_name', numeric: false, disablePadding: false, label: t('LETTERTYPE')},
        // {id: 'createDate', numeric: false, disablePadding: false, label: "CREATE DATE"},
        {id: 'insert_time', numeric: false, disablePadding: false, label: t('PROCESSDATE')},
        {id: 'd.document_name', numeric: false, disablePadding: false, label: t('DOCUMENT')},
        {id: 'status', numeric: false, disablePadding: false, label: t('STATUS')},
        {id: 'action', numeric: false, disablePadding: false, label: t('ACTION')},
        // {id: 'customerFullName', numeric: false, disablePadding: false, label: 'Customer Full Name'},
        // {id: 'userFullName', numeric: false, disablePadding: false, label: 'Apply User Name'},
        // {id: 'clientType', numeric: false, disablePadding: false, label: 'Client Type'},
        // {id: 'agreementType', numeric: false, disablePadding: false, label: 'aggrement Type'},
        // {id: 'confirmDate', numeric: false, disablePadding: false, label: 'Confirm Order Date'},
        // {id: 'personelFullName', numeric: false, disablePadding: false, label: 'Approved Staff'},
        // {id: 'confirmType', numeric: false, disablePadding: false, label: 'Confirm Type'}

    ];
    function handleChangeCheckbox(value: string, checked: boolean) {
        console.log()
        if(checked && !statusTypeSelected.includes(value))
        {
                setStatusTypeSelected(statusTypeSelected=>[...statusTypeSelected,value]);
                console.log(statusTypeSelected)
        }
        else if(!checked && statusTypeSelected.includes(value))
        setStatusTypeSelected(statusTypeSelected.filter(item => item != value))
        return
    }


    return (
        <TableHead>
            <TableRow>

                {headCells.map(headCell => {
                    return(
                    (headCell.id === "status") ?
                   <TableCell>
                     <span style={{marginRight:"20px"}}>{headCell.label}</span>  
                       <Select
                                multiple
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                value={statusTypeSelected}
                                label="myletter"
                                style={{maxWidth:"150px"}}
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
                                <MenuItem value={'Pending Transaction'}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox("Pending Transaction", checked)}}  checked = {statusTypeSelected.indexOf("Pending Transaction") > -1 }/> 
                                 <ListItemText primary={"Pending Transaction"} />
                                </MenuItem>
                                <MenuItem value={'Done'}>
                                <Checkbox onChange={(e,checked) => {handleChangeCheckbox("Done", checked)}}  checked = {statusTypeSelected.indexOf("Done") > -1 }/>
                                 <ListItemText primary={"Done"} />
                                </MenuItem>
                            </Select>

                   </TableCell>
                    :
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {
                            ( headCell.id == "action") ?
                                (
                                    headCell.label
                                ) :
                                (
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                        {/*{orderBy === headCell.id ? (*/}
                                        {/*    <span className={classes.visuallyHidden}>*/}
                                        {/*		{order === 'desc' ? 'sorted descending' : 'sorted ascending'}*/}
                                        {/*	</span>*/}
                                        {/*) : null}*/}
                                    </TableSortLabel>
                                )
                        }

                    </TableCell>
                    )
                       
                    }, this)}
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
    setOrder: any,
    setOrderBy: any,
    setPage: any,
    statusTypeSelected:any,
    setStatusTypeSelected:any,

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
                    {/*{window.atob(props.moduleType)}*/}
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
    container: {
        maxHeight: 450
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

const useStyles2 = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);


function TaskList(props: any) {

    // @ts-ignore
    const routingData = history.location.displayRouteData;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [selectedLetterContent, setSelectedLetterContent] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const routeParams = useParams();
    //const [documents, setDocuments] = React.useState<DocumentInfo[]>(props .documents);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const [letterList, setLetterList] = useState([]);
    // @ts-ignore
    const {moduleType} = routeParams;
    const clientId = useSelector(({company}) => company.currentCompanyId);
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const [open1, setOpen1] = React.useState(false);
    const classes2 = useStyles2();
    const [shown, setShown] = useState(false);
    const [orderColumn, setOrderColumn] = useState("insert_time")
    const [orderBy1, setOrderBy1] = useState("desc")
    const [total, setTotal] = useState(0)
    const [statusTypeSelected, setStatusTypeSelected] = React.useState([]);
    const [filteredLetterList,setFilteredLetterList] = useState([])

    const {t} = useTranslation('letter');

    function getLetters(){
        api.getLettersByClientID(clientId, orderColumn, orderBy1, page, rowsPerPage).then(response => {
            setLetterList(response.content);
            setFilteredLetterList(response.content)
            setTotal(response.totalElements)
        });
    }

    useEffect(() => {

        test.forEach(x=>{

            if(x.client.id===clientId){
                if(x.client.state!=="3"){
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>,{
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                }else{
                    //@ts-ignore
                    getLetters()
                }
            }
        })

    }, []);

    useEffect(() => {
        getLetters()
    }, [page, rowsPerPage, orderColumn, orderBy1])


    useEffect(() => {
        if(letterList!==null && letterList!==undefined && statusTypeSelected.length>0)
        {
            console.log(letterList)
            setFilteredLetterList([])
              if(statusTypeSelected.indexOf("Done")>-1)
              {
                  console.log("done")
               const temp =  letterList.filter((letter)=>letter?.userRole == "MANAGER" || letter?.userRole == "EMPLOYEE" || letter.task?.taskConfirmations?.sort()[0]?.taskConfirm)
               setFilteredLetterList(filteredLetterList=>[...filteredLetterList,...temp])
            
             

              }
              if(statusTypeSelected.indexOf("Pending Transaction")>-1)
              {
                const temp =  letterList.filter((letter)=>!(letter?.userRole == "MANAGER" || letter?.userRole == "EMPLOYEE" || letter.task?.taskConfirmations?.sort()[0]?.taskConfirm))
                setFilteredLetterList(filteredLetterList=>[...filteredLetterList,...temp])
                    console.log("pending")
              }
        }
        else
        {
            setFilteredLetterList(letterList);
        }
      
        
    }, [statusTypeSelected])

    function handledetails(task: any) {

        // @ts-ignore
        // history.push({
        // 	pathname: '/tasks/detail/'+window.btoa(task?.id),
        // 	displayRouteData: {
        // 		clientId: task?.clientId,
        // 		clientType: task?.clientType,
        // 		moduleType: task?.moduleTypeEnum,
        // 		userFolder: task?.userFolder,
        // 		taskId: task?.id,
        // 		confirmType: task?.confirmType
        // 	}
        // });
        // // @ts-ignore
        // history.push({
        // 	pathname: '/tasks/detail/'+window.btoa(task?.clientId),
        // 	displayRouteData: {
        // 		taskId: task?.id
        // 	}
        // });
    }

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = letterList.map(n => n.id);
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

    const handleClose2 = () => {
        setOpen1(false);
    };

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children?: React.ReactElement },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickOpen = (letter) => {
        setSelectedLetterContent(JSON.parse(decodeURIComponent(escape(window.atob(letter?.letter)))));
        setSelectedLetter(letter)
        setOpen1(true);
    };

    const modalBody = () => (
        <Dialog fullScreen open={open1} onClose={handleClose2}
                TransitionComponent={Transition}>
            <AppBar className={classes2.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit"
                                onClick={handleClose2} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes2.title}>
                        {t("PREVIEWLETTER")}
                    </Typography>
                </Toolbar>
            </AppBar>
            <PDFViewer className={"flex w-full h-full"}>

                <Document>
                    <Page object-fit="fill" style={styles.pageNumber} size="A4">
                        {/*ONAYLANMAMIŞ İSE BU IMAGE OLMAYACAK*/}
                        { (selectedLetter?.userRole == "MANAGER" || selectedLetter?.userRole == "EMPLOYEE" || (selectedLetter?.task?.taskConfirmations && selectedLetter?.task?.taskConfirmations?.[0]?.taskConfirm == "DONE") )&&
                            <Image fixed src="/assets/images/pdf/image1.png"/>
                        }
                        <View object-fit style={styles.view}>
                            {/*@ts-ignore*/}
                            {selectedLetterContent?.map((ch) => <Text style={styles.text2}>{

                                    //@ts-ignore
                                    ch.children.map((cc) => (
                                        <Text
                                            style={styles.text3}> {
                                            cc.text
                                        }
                                            {/*            <span style={{whiteSpace: "pre-line"}}>*/}
                                            {/*{cc.split("").join("\n")}*/}
                                            {/*</span>*/}
                                        </Text>

                                    ))
                                }
                                </Text>
                            )}

                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </Dialog>
    );



    const handleChangeDense = event => {
        setDense(event.target.checked);
    };
    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, letterList.length - page * rowsPerPage);

    const [open, setOpen] = useState(false);
    function handleClick2(letter) {
        setSelectedLetter(letter)
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }
    function setBgColor(status){
        if(status == "DONE")
            return "bg-green text-white hover:bg-green-700"
        else if(status == "INPROGRESS")
            return "bg-orange text-white hover:bg-orange-700"
        else if(status == "REJECTED")
            return "bg-red text-white hover:bg-red-700"
        else if (status == "DEFAULT")
            return "bg-blue text-white hover:bg-blue-700"
    }

    const getDocumentUrlByFileName = (client, document) => {
        var clientId = client?.id
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + clientId + "/" + document?.fileName
        return url
    }

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            // header={<DocumentHeader />}
            content={


                <div className={"w-full flex flex-col"}>
                    <FuseScrollbars className="flex-grow overflow-x-auto">

                        {/* @ts-ignore*/}
                        {/*<EnhancedTableToolbar moduleType={moduleType} numSelected={selected.length} />*/}
                        <TableContainer className={classes.container}>
                            <Table
                                stickyHeader={true}
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                                aria-label="enhanced table"

                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={orderBy1} setOrder={setOrderBy1}
                                    orderBy={orderColumn} setOrderBy={setOrderColumn}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={letterList.length}
                                    setPage={setPage}
                                    statusTypeSelected = {statusTypeSelected}
                                    setStatusTypeSelected ={setStatusTypeSelected}
                                    
                                />
                                
                                <TableBody>
                                    {stableSort(filteredLetterList, getComparator(order, orderBy))
                                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((letter, index) => {
                                            const isItemSelected = isSelected(letter.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            const dt = moment(letter.createdDateTime).format('DD-MM-YYYY,h:mm:ss a');
                                            return (
                                                <TableRow
                                                    hover
                                                    // onClick={event => handleClick(event, task.id)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={letter.id}
                                                    selected={isItemSelected}
                                                    // onClick={event => handledetails(letter)}
                                                >

                                                    <TableCell scope="row" padding="default">
                                                        {letter.letterType?.letterTypeName || "Custom Letter"}
                                                    </TableCell>

                                                    <TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
                                                        {/*{*/}
                                                        {/*    letter.task?.taskConfirmations?.length > 0 ?*/}
                                                        {/*            letter.task?.taskConfirmations?.sort(function (a,b) {*/}
                                                        {/*                if(a.processDate < b.processDate)*/}
                                                        {/*                    return 1*/}
                                                        {/*                return -1*/}
                                                        {/*            })[0].processDate : (dt ? dt : "-")}*/}
                                                        {dt}
                                                    </TableCell>
                                                    <TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
                                                        {letter.document ?
                                                            <a href={getDocumentUrlByFileName(letter.client, letter.document)}>{letter.document?.documentName}</a>
                                                            :
                                                            "-"
                                                        }
                                                    </TableCell>
                                                    <TableCell style={{paddingLeft: "10px"}} padding="none">
                                                        <Button
                                                            onClick={()=> handleClick2(letter)}
                                                            className={ letter?.userRole == "MANAGER" || letter?.userRole == "EMPLOYEE" ? setBgColor("DONE") : (letter.task?.taskConfirmations?.length > 0 ?
                                                                setBgColor(letter?.task?.taskConfirmations?.sort(function (a,b) {
                                                                    if(a.processDate < b.processDate)
                                                                        return 1
                                                                    return -1
                                                                })[0].taskConfirm) : setBgColor("DEFAULT")) }
                                                        >

                                                            { letter?.userRole == "MANAGER" || letter?.userRole == "EMPLOYEE"  ? t("DONE") : (letter.task?.taskConfirmations?.length > 0 ?
                                                                t(letter.task?.taskConfirmations?.sort()[0].taskConfirm) : t("PENDINGTRANSACTION"))}
                                                        </Button>
                                                    </TableCell>

                                                    <TableCell style={{paddingLeft: "10px"}} padding="none">
                                                        <Button variant="contained" color="primary"
                                                                onClick={()=>handleClickOpen(letter)}>
                                                            {t("SHOWLETTER")}
                                                        </Button>
                                                    </TableCell>


                                                </TableRow>
                                            );
                                        })}
                                    {/*{emptyRows > 0 && (*/}
                                    {/*    <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>*/}
                                    {/*        <TableCell colSpan={6}/>*/}
                                    {/*    </TableRow>*/}
                                    {/*)}*/}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            className="flex-shrink-0 border-t-1"
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />

                        <Dialog
                            fullWidth={true}
                            maxWidth={"xs"}
                            open={open}
                            onClose={handleClose} aria-labelledby="customized-dialog-title" >
                            <DialogTitle id="customized-dialog-title" >
                                {t("PROCESSMESSAGE")}
                            </DialogTitle>
                            <DialogContent dividers>

                                { selectedLetter?.userRole == "MANAGER" || selectedLetter?.userRole == "EMPLOYEE"  ?
                                    <span className={ "p-6 " +
                                            (setBgColor("DONE") )}>
                                        {t("DONE")}
                                    </span> :

                                    selectedLetter?.task?.taskConfirmations?.length > 0 ?
                                    selectedLetter?.task.taskConfirmations.map((confirmations, index) => (
                                        <div className="my-8">
                                            <p>
                                                {confirmations.message ?
                                                    confirmations.message : t("NOMESSAGE")
                                                }
                                            </p>
                                            {confirmations.personel &&
                                            <Div columns={2} className="my-8 flex justify-center">

                                                <Grid xs={6} md={12} lg={12} xl={12}>
                                                    <div className="flex justify-start items-center">
                                                    <span className={ "p-6 " +
                                                    (selectedLetter?.task?.taskConfirmations?.[index + 1] ?
                                                        setBgColor(selectedLetter?.task?.taskConfirmations?.[index + 1]?.taskConfirm) :
                                                        setBgColor("DEFAULT") )}>
                                                        {
                                                            selectedLetter?.task?.taskConfirmations?.[index + 1] ?
                                                                t(selectedLetter?.task?.taskConfirmations?.[index + 1]?.taskConfirm)
                                                                :
                                                                t("PENDINGTRANSACTION")
                                                        }
                                                    </span>
                                                        <Icon>arrow_right</Icon>
                                                        <span className={ "p-6 " + setBgColor(confirmations.taskConfirm)}>{t(confirmations.taskConfirm)}</span>
                                                    </div>
                                                </Grid>
                                                <Grid xs={6} md={12} lg={12} xl={12}>
                                                    <div>
                                                        <div className="my-8 flex justify-end">
                                                            {
                                                                confirmations.personel.userInfo.name
                                                                + " " +
                                                                confirmations.personel.userInfo.surname
                                                            }
                                                        </div>
                                                        <div className="my-8 flex justify-end">
                                                            {
                                                                confirmations.processDate
                                                            }
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Div>
                                            }
                                            {index != selectedLetter?.task?.taskConfirmations?.length - 1 && <hr/>}
                                        </div>

                                    )) :
                                    <span className={ "p-6 " + setBgColor("DEFAULT")}>
								{t("PENDINGTRANSACTION")}
							</span>
                                }
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" color="primary"
                                        onClick={()=>handleClickOpen(selectedLetter)}>
                                    {t("SHOWLETTER")}
                                </Button>
                                <Button variant="contained" color = "primary"
                                        onClick={handleClose}>
                                    {t("CLOSE")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </FuseScrollbars>

                    {open1 && ReactDOM.createPortal(modalBody(), document.body)}

                </div>}
            innerScroll
        />

    );
}
export default withSnackbar(TaskList);
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
