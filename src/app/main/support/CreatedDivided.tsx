import React, { useEffect, useState } from 'react';
import api from '../../services/BackendApi';
import FusePageCarded from '../../../@fuse/core/FusePageCarded';
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import {makeStyles, ThemeProvider, useTheme} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectMainTheme} from "../../store/fuse/settingsSlice";
import {
    DialogContent,
    Grid,
    IconButton,
    TableBody,
    TableContainer,
    TablePagination,
    TextField
} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Dialog from "@material-ui/core/Dialog";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import DialogTitle from "@material-ui/core/DialogTitle";
import back from "./image1.jpg";
import { func } from 'prop-types';

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
const headCells = [
    {id: 'client', numeric: false, disablePadding: true, label: ''},
    {id: 'directorName', numeric: true, disablePadding: false, label: 'Director Name'},
    {id: 'date', numeric: true, disablePadding: false, label: ''},
    {id: 'createDate', numeric: false, disablePadding: true, label: 'Create Date'},
    {id: 'description', numeric: true, disablePadding: false, label: ''},
    {id: 'show', numeric: false, disablePadding: true, label: 'Show'},


    // {id: 'url', numeric: true, disablePadding: false, label: ''},
    // {id: 'fileName', numeric: true, disablePadding: false, label: 'File Name'},
    //{id: 'description', numeric: true, disablePadding: false, label: 'Description'},
    //{id: 'status', numeric: true, disablePadding: false, label: 'Status'},

];
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

function CreatedDividded(props:any) {
    const mainTheme = useSelector(selectMainTheme);
    const classes=useStyles();
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [orderColumn, setOrderColumn] = useState("insert_time")
    const [orderBy, setOrderBy] = useState("desc")
    const { t } = useTranslation('letter');
    const [divideds, setDivideds] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedDivide, setSelectedDivide] = useState({});
    const [selected, setSelected] = React.useState({});
    const [selectedClient, setSelectedClient] = React.useState({});
    const [directors, setDirectors] = useState([]);
    const [clients , setClients] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        getDivided()
    }, []);

    //useEffect(()=>{
        //divideds?.map((divide)=>{
      //      setDirectors((director)=>[...director,divide?.directorId])
    //    })
  //  },[divideds])

   // useEffect(() => {
     //   getDivided()
   // }, [ orderColumn, orderBy, page, rowsPerPage]);

    useEffect(()=>{
        console.log(selected,"selected")
        console.log(clients,"cl")
        handleSelected(selected);
    },[selected])
    useEffect(()=>{
        console.log(selectedClient,"cline")
    },[selectedClient])
    function getDivided(){
        api.getAllDivided().then(response => {
            setDivideds(response);
        });
        api.getAllDividedDirectors().then(res=>{
            setDirectors(res?.body);
        })
        api.getAllClientForDivided().then(res=>{
            setClients(res?.body);
        })
    }

    function handleClear() {
        //	setPage(0);
        setSearch('');
        setPage(0)
        setRowsPerPage(25)
        setOrderColumn("insert_time")
        setOrderBy("desc")
        getDivided()
    }

    const handleClose = () => {
        setOpen(false);
    };
   // const isSelected = name => selected.indexOf(name) !== -1;


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
                    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                    // pdf.addImage(imgData, 'PNG', 10, 10, 0, 0);
                    pdf.save('Dividend.pdf');
                }).catch();
        }
    }
    function handleShow(divide){
        setSelectedDivide(divide);
    }

    function handleFileDownload(fileName){
        api.fileDownload(fileName).then(data =>{
            console.log(data)
            const url = window.URL.createObjectURL(new Blob([data]));
            console.log(url,"url")
            const link = document.createElement('a');
            console.log(link,"link")
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

        });
    }
 

    function handleSelected(director){
        console.log("selected dir", director)
        if(clients.length>0 && director != null){
                for(let i=0; i<clients.length; i++){
                    console.log("tryda", clients[i].customerClients.map((a)=>(a.customerInfo.userInfo.id)))
                    clients[i].customerClients.filter((customer)=>customer.customerInfo.userInfo.id == director.id).map((a)=>(setSelectedClient(clients[i])));
                }
                for(let i=0; i<clients.length; i++){
                    clients[i].company.directorDetails.filter((director1)=>director1.id == director.id).map((a)=>(setSelectedClient(clients[i])));
                }
        }
    }
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex items-center">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Icon className="insert_drive_file">insert_drive_file</Icon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t("CREATEDDIVIDEND")}
                            </Typography>
                        </FuseAnimate>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-12">
                        <ThemeProvider theme={mainTheme}>
                            <FuseAnimate animation="transition.slideDownIn" delay={300}>
                                <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
                                    <Icon color="action">{t("SEARCH")}</Icon>

                                    <Input
                                        placeholder={t("FIRSTNAME") + " " + t("LASTNAME")}
                                        className="flex flex-1 mx-8"
                                        disableUnderline
                                        fullWidth
                                        value={search}
                                        inputProps={{
                                            'aria-label': 'Search'
                                        }}
                                        onChange={(e)=>setSearch(e.target.value)}
                                    />
                                </Paper>
                            </FuseAnimate>
                        </ThemeProvider>
                        <Button
                            className="ml-5 rounded-8 bg-white"
                            variant="contained"
                            onClick={() => {handleClear()}}
                        >
                            {t("CLEAR")}
                        </Button>
                    </div>
                </div>
            }
            content={
                <div className="w-full flex flex-col">
                    <TableContainer className={classes.container}>
                        <TableHead>
                            <TableRow>
                                {headCells.map(headCell => (

                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'default'}
                                     //   sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        {headCell.label}
                                    </TableCell>

                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {divideds?.map((divide, index) => {
                                        //const isItemSelected = isSelected(divide.id);
                                       // const labelId = `enhanced-table-checkbox-${index}`;
                                        const dt = moment(divide.createdDateTime).format('DD-MM-YYYY,h:mm:ss a');

                                        return (
                                            <TableRow
                                                hover
                                                // onClick={event => handleClick(event, task.id)}
                                                role="checkbox"
                                                //aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={divide.id}
                                                //selected={isItemSelected}
                                                // onClick={event => handledetails(letter)}
                                            >
                                                {/*<TableCell scope="row" padding="default">
                                                    {divide.letterType?.letterTypeName || " "}
                                                </TableCell>*/}

                                                <TableCell>

                                                </TableCell>

                                                {directors?.map((director)=>( director.id == divide.directorId ?
                                                <TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
                                                    {director.name +" "+ director.surname}
                                                </TableCell> : null
                                                ))}
                                                <TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">

                                                </TableCell>

                                                <TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
                                                    {divide.task?.taskConfirmations?.length > 0 ?
                                                        divide.task?.taskConfirmations?.sort(function (a,b) {
                                                            if(a.processDate < b.processDate)
                                                                return 1
                                                            return -1
                                                        })[0].processDate : (dt ? dt : "-")}
                                                </TableCell>

                                               
                                                <TableCell>

                                                </TableCell>
                                                {directors?.map((director)=>( director.id == divide.directorId ?
                                                    <TableCell style={{paddingLeft: "10px"}} padding="none">
                                                        <Button variant="contained" color="primary"
                                                                onClick={()=> {
                                                                    handleFileDownload(divide.fileName)
                                                                    console.log(divide.fileName)
                                                                }}>{t("SHOWDIVIDEND")}</Button>
                                                    </TableCell>:null
                                                ))}
                                            </TableRow>
                                        );
                                    })}

                        </TableBody>
                        <TablePagination
                            className="flex-shrink-0 border-t-1"
                            component="div"
                            count={divideds?.length}
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
                    </TableContainer>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            <Button onClick={()=>{
                                handleExportPdf();
                                setOpen(false);
                            }}>Save</Button>
                            <Button onClick={()=>{
                                setOpen(false);
                            }}>Close</Button>
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
                                            <label style={{ color:"blue"}}>{selectedDivide?.paymentNumber}</label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <label>Date Payment Made</label>
                                        <div style={{border:'groove',borderBlockColor:"grey", borderBlockEndColor:"grey", borderColor:"grey", padding:'10px 20px', margin:'20px', marginRight:"40px"}}>
                                            {/*@ts-ignore*/}
                                            <label style={{ color:"blue"}}>{selectedDivide?.datePaymentRate}</label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {/*@ts-ignore*/}
                                        <label style={{fontWeight:"bold"}} >{selectedClient?.clientName }</label>
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                        { "Employee Name & Address:"+ "\n" } <br/>
                                        {/*@ts-ignore*/}
                                        {selected?.name + " " + selected?.surname + "\n"}
                                    </Grid>
                                    <Grid item xs={12} sm={12}  style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                        { /*@ts-ignore*/
                                            selectedClient?.addressList?.map((a)=>(a.addressType=="HOME"?<p>
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
                                                <label style={{ color:"blue"}}>{selectedDivide?.shareHolding}</label>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>

                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                           <label> Amount Payable</label>
                                            <div style={{border:'groove',borderBlockColor:"grey", borderBlockEndColor:"grey", borderColor:"grey", padding:'10px 20px', margin:'20px'}}>
                                                {/*@ts-ignore*/}
                                                <label style={{ color:"blue"}}>{selectedDivide?.amountPayable}</label>
                                            </div>
                                        </Grid>

                                        <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                            <label>
                                                This cheque is in payment of the Interim dividend<br/>
                                                for the year ended :
                                                <label style={{color:"blue"}}>
                                                    {/*@ts-ignore*/}
                                                    {selectedDivide?.dividedEndDate}
                                                </label> <br/>
                                                paid at the rate of <label style={{color:"blue"}}>£
                                                {/*@ts-ignore*/}
                                                {selectedDivide?.amountPayable}
                                            </label> on those<br/>
                                                ordinary shares  registered in your name on <label style={{color:"blue"}}>
                                                {/*@ts-ignore*/}
                                                {selectedDivide?.dividedEndDate}
                                            </label>

                                            </label>
                                            <br/>
                                            <label>
                                                Given on behalf of<br/>
                                                <Grid item xs={12} sm={6}>
                                                    {/*@ts-ignore*/}
                                                    <label style={{fontWeight:"bold"}}>{selectedClient?.clientName }</label>
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
                    </Dialog>
                </div>
            }
        />
    );
}

export default CreatedDividded;