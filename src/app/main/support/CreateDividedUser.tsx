import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactsMultiSelectMenu from "../user/ContactsMultiSelectMenu";
import ContactsTable from "../user/components/UITable";
import {openEditContactDialog, selectContacts,} from "../user/store/contactsSlice";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { createStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
    DialogTitle,
    Grid, IconButton,
    makeStyles, MenuItem,
    Theme,
} from '@material-ui/core';
import Snackbar from "@material-ui/core/Snackbar";
import api from "../../services/BackendApi";
import {useSnackbar, withSnackbar} from "notistack";
import { useTranslation } from "react-i18next";
import history from "@history";
import CloseIcon from "@material-ui/icons/Close";
import PdfComponent from "../letter/components/PdfComponent";
import {
    Client, DirectorDetail, Divided,
    DynamicInformations, DynamicInformationsEntry,
    Letter, LetterType, VisaInvitedFormType,
} from "../../types/UserModel";

import config from "../../services/Config";
import back from "./image1.jpg";
import {Div} from "../../components/Grid";
import Select from "@material-ui/core/Select";
import {log} from "util";
import {UserTypeFilter} from "../user/UserTypeFilter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: "center",
            color: theme.palette.text.secondary,
        },
    })
);

function CreateDividedUser(props) {
    const classes = useStyles();
    const [client, setClient] = useState();
    const dispatch = useDispatch();
    const contacts = useSelector(selectContacts);
    const searchText = useSelector(
        ({ contactsApp }) => contactsApp.contacts.searchText
    );
    const user = useSelector(({ contactsApp }) => contactsApp.user);
    const [filteredData, setFilteredData] = useState(null);
    const {t} = useTranslation("letter");
    const [company, setCompany] = useState([]);
    const [selectedCompany,setSelectedCompany] = useState({});
    const [open, setOpen] = useState(false);
    const [openFirstScreen, setOpenFirstScreen] = useState(false);
    const [directors, setDirectors] = useState([]);
    const [client1, setClient1] = useState<Client>({} as Client);
    const [addresses, setAddresses] = useState([]);
    const [selectedDirector, setSelectedDirector] = useState(null)
    const [progress, setProgress] = React.useState(0);
    const [divided,setDivided] = useState<Divided>({} as Divided);
    const { enqueueSnackbar } = useSnackbar();

    const handleCreateDivided = (e,row) => {
        e.stopPropagation();
        row.original.userType === "CLIENT"
            ? deneme(row.original) // SORUN!
            : props.enqueueSnackbar(
                <h4>{t("ONLYCREATEDFORCLIENT")}</h4>,
                {
                    variant: "error",
                }
            );
    }

    const getPhotoUrlByFileName = (id, photoUrl) => {
        var id = id
        var filename = photoUrl
        var url = config.BACKEND_API_URL + "/api/file/downloadPhoto/" + id + "/" + filename
        return url
    }

    useEffect(()=>{
    },[selectedDirector])

    function multiSelectFilter(rows, columnIds, filterValue) {
        // Filters only if filters are selected
        console.log("multi : "+filterValue)
        console.log("multi : "+columnIds)

        filterValue.map((type)=>{
            let temp = rows.filter((data)=>data.values.userType===type);
            //setFiltered(filtered=>[...filtered,...temp])
        })
        //filtered.map(data=>console.log(data))

        return filterValue.length === 0 ? rows : rows.filter((row) =>  filterValue.includes(String(row.values.userType)));

    }
    const customStringSort: any = (rowA: any, rowB: any, columnId: string, desc: boolean) => {
        let A = String(rowA.values[columnId]).toLowerCase();
        let B = String(rowB.values[columnId]).toLowerCase();
        return A.localeCompare(B)
    };
    const columns = React.useMemo(
        () => [
            {
                Header: ({ selectedFlatRows }) => {
                    const selectedRowIds = selectedFlatRows.map((row) => row.original.id);
                    return (
                        selectedFlatRows.length > 0 && (
                            <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
                        )
                    );
                },
                accessor: "avatar",
                Cell: ({ row }) => {
                    return row.original.photoURL ? (
                        <Avatar
                            className="mx-3"
                            alt={row.original.name}
                            src={getPhotoUrlByFileName(row.original.id, row.original.photoURL)}
                        />
                    ) : (
                        <Avatar
                            className="mx-3"
                            alt={row.original.name}
                            src="assets/images/avatars/alice.jpg"
                        />
                    );
                },
                className: "justify-center",
                width: 50,
                sortable: false,
            },
            {
                Header: t("FIRSTNAME"),
                accessor: "name",
                className: "font-bold",
                sortable: true,
                sortType:customStringSort,
            },
            {
                Header: t("LASTNAME"),
                accessor: "surname",
                className: "font-bold",
                sortable: true,
                sortType:customStringSort,
            },
            {
                Header: t("EMAIL"),
                accessor: "email",
                sortable: true,
            },
            {
                Header: t("USERTYPE"),
                accessor: "userType",
                sortable: false,
                Filter : UserTypeFilter,
                filter: multiSelectFilter,
            },
            {
                Header: t("PHONE"),
                accessor: "msisdn",
                sortable: false,
            },
            {
                Header: t("CREATEDIVIDED"),
                accessor: "createDivided",
                sortable: false,
                Cell: ({ row }) => (
                    <div className="flex items-center">
                        <Button
                            variant="contained"
                            color="primary"
                            aria-label="close"
                            onClick={(e)=>handleCreateDivided(e,row)}
                        >
                            {t("CREATEDIVIDED")}
                        </Button>
                    </div>
                ),
            },
        ],
        [] // dep array empty
    );

    useEffect(() => {
        function getFilteredArray(entities, _searchText) {
            if (_searchText.length === 0) {
                return contacts;
            }
            return FuseUtils.filterArrayByString(contacts, _searchText);
        }

        if (contacts) {
            setFilteredData(getFilteredArray(contacts, searchText));
        }
    }, [contacts, searchText]);

    if (!filteredData) {
        return null;
    }

    if (filteredData.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                    {t("THEREARENOCONTACTS")}
                </Typography>
            </div>
        );
    }


    function deneme(propsDeneme) {
        api.getCompaniesByUserId(propsDeneme.id).then((res) => {
            setClient(res);
            res.map((x) => {
                if (x.state !== "3") {
                    props.enqueueSnackbar(
                        <h4>
                            {t('PLEASEPLEASE')}
                        </h4>,
                        {
                            variant: "error",
                        }
                    );
                    history.push("/clientapplist");
                } else {
                    if (x.clientTypeEnum == "LIMITED") {
                        api.getCompanyByClientId(x.id).then((response) => {
                            setCompany((company) => [...company, response.company]);
                            setClient1(response);
                            //getLetterTypes(response?.clientTypeEnum.toString())
                            const { addressList } = response;
                            setAddresses(addressList);
                        });
                    } else {
                        props.enqueueSnackbar(
                            <h4>
                                {t('ONLYLIMITED')}
                            </h4>,
                            {
                                variant: "error",
                            }
                        );
                    }
                }
            });
        });
        setProgress(0)
        setOpen(true);
    }

    const progressCallback = (loaded: number, total: number) => {
        setProgress(Math.round((loaded / total) * 100))
    };

    function handleControl(){
        if(divided?.shareHolding == null || divided?.shareHolding?.toString().indexOf(",")> 0){
            if(divided?.shareHolding?.toString().indexOf(",")){
                enqueueSnackbar(<h4>Please use "." instead of ","</h4>, {
                    variant: 'error',
                })
            }else {
                enqueueSnackbar(<h4>Please enter a valid share Holding</h4>, {
                    variant: 'error',
                })
            }
            return false;
        }else if(divided?.amountPayable == null || divided?.amountPayable?.toString().indexOf(",")> 0){
            if(divided?.amountPayable?.toString().indexOf(",")){
                enqueueSnackbar(<h4>Please use "." instead of ","</h4>, {
                    variant: 'error',
                })
            }else {enqueueSnackbar(<h4>Please enter a valid amount payable</h4>, {
                variant: 'error',
            })
            }
            return false;
        }else if(divided?.paymentNumber == null || divided?.paymentNumber?.toString().indexOf(",")> 0){
            if(divided?.paymentNumber?.toString().indexOf(",")){
                enqueueSnackbar(<h4>Please use "." instead of ","</h4>, {
                    variant: 'error',
                })
            }else {
                enqueueSnackbar(<h4>Please enter a valid payment number</h4>, {
                    variant: 'error',
                })
            }
            return false;
        }else if(divided?.dividedEndDate == null){
            enqueueSnackbar(<h4>Please enter a valid end date number</h4>, {
                variant: 'error',
            })
            return false;
        }
        else if(divided?.datePaymentRate == null){
            enqueueSnackbar(<h4>Please select a payment date</h4>, {
                variant: 'error',
            })
            return false;
        }else{
            try{
                const payment = parseFloat(divided.paymentNumber.toString())
                const share = parseFloat(divided.shareHolding.toString())
                const amount = parseFloat(divided.amountPayable.toString())
                const date = Date.parse(divided.datePaymentRate.toString());
                const endDate = Date.parse(divided.dividedEndDate.toString());
                console.log(payment, "payment")
                if(payment && share && amount && date && endDate) {
                    setDivided({...divided, paymentNumber: payment, amountPayable: amount,directorId:selectedDirector,shareHolding: share,
                        //@ts-ignore
                        datePaymentRate:date, dividedEndDate: endDate});
                    return true;
                }else{
                    enqueueSnackbar(<h4>Please fill all of the blank with correct values</h4>, {
                        variant: 'error',
                    })
                    return false;
                }
            }catch(e){
                return false;
            }
        }
    }
    function handleSave(){
        if(handleControl()){
            api.saveDivided(divided,client1.id).then();
            setOpenFirstScreen(false);
            history.go(0);
        }
    }

    function handleCreate(){
        setOpen(false);
        if(selectedDirector == null){
            props.enqueueSnackbar(<h4>{t("SELECTDIRECTOR")}</h4>,{
                variant: 'error',
            });
            setCompany([]);
        }
        else if(company == null || company.length<=0 ){
            props.enqueueSnackbar(<h4>{t("SELECTCOMPANY")}</h4>,{
                variant: 'error',
            });
            setCompany([]);
        }
        else{
            setDivided({...divided, directorId : selectedDirector})
            setOpenFirstScreen(true);
        }
    }

    const handleChangeDirector = (value) => {
        try{
            const director = client1?.company?.directorDetails?.find(director => director.id = value)
            console.log(director)
            setSelectedDirector(director.id)
        }catch{
            const director = client1?.customerClients?.find(director => director.customerInfo.userInfo.id = value)
            setSelectedDirector(director.id)
        }
       // const director = client1?.company?.directorDetails?.length>0?client1?.company?.directorDetails.find(director => director.id = value): client1?.customerClients?.find(director => director.id = value);
    };

    return (
        
        <div>
            <Div>
                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <ContactsTable
                        columns={columns}
                        data={filteredData}
                        onRowClick={(ev, row) => {
                            if (row) {
                                dispatch(openEditContactDialog(row.original));
                            }
                        }}
                    />
                </FuseAnimate>
                <div></div>
            </Div>
            <Dialog
                open={open}
                onClose={()=>{
                    setOpen(false)
                    setCompany([]);
                }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Grid container  direction="row"
                          alignItems="center" spacing={3}>
                        <Grid xs={12} sm={4}>

                        </Grid>
                        <Grid xs={12} sm={6}>
                            <p>DIVIDEND VOUCHER</p>
                        </Grid>
                        <Grid xs={12} sm={2}>
                            <Button
                                variant="contained"
                                autoFocus
                                onClick={handleCreate}
                                color="secondary"
                            >
                                {t('CREATE')}
                            </Button>
                        </Grid>
                    </Grid>

                </DialogTitle>
                <DialogContent
                    style={{width:"650px", height:"150px"}}
                >
                    <Select
                        label="İl"
                        variant="outlined"
                        defaultValue={"none"}
                        //@ts-ignore
                        onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                        <MenuItem value="none">
                            <em>{t("PLEASESELECTCOMPANYFORDIVIDEND")}</em>
                        </MenuItem>
                        {company.length > 0 ? (
                            company.map((result) => (
                                <MenuItem value={result}>{result.name}</MenuItem>
                            ))
                        ) : (
                            <MenuItem></MenuItem>
                        )}
                    </Select>
                    {company.length > 0 && (
                        <Select
                            variant="outlined"
                            defaultValue={"none"}
                            onChange={(e) => handleChangeDirector(e.target.value)}
                        >
                            <MenuItem value="none">
                                <em>{t("PLEASESELECTDIRECTORFORDIVIDEND")}</em>
                            </MenuItem>
                            {
                                client1?.company?.directorDetails?.length > 0 ? (
                                    client1?.company.directorDetails.map((result) => (
                                        <MenuItem
                                            value={result.id}>{result.name}-{t('DIRECTOR')}
                                        </MenuItem>
                                    ))
                                ) : null}
                            &&
                            {client1?.customerClients?.length > 0 ? (
                                    client1?.customerClients?.map((result)=>(
                                        <MenuItem value={result?.customerInfo?.userInfo?.id} >{result?.customerInfo?.userInfo?.name + " " + result?.customerInfo?.userInfo?.surname + " owner"}</MenuItem>
                                    ))
                                ) : null
                            }
                        </Select>
                    )}

                </DialogContent>
            </Dialog>

            <Dialog
                open={openFirstScreen}
                onClose={()=>{
                    setOpenFirstScreen(false)
                    setCompany([]);
                    setSelectedDirector(null);
                    setOpen(false);
                    history.go(0);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={4}>
                            <IconButton edge="start" color="inherit"
                                        onClick={()=> {
                                            setOpenFirstScreen(false);
                                            setCompany([]);
                                            selectedDirector(null);
                                            setOpen(false);
                                            history.go(0);
                                        }} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                        <Grid xs={12} sm={4}>
                            <Typography variant="h6" className={classes.title}>
                                DIVIDEND VOUCHER
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={4}>
                            <Button
                                variant="contained"
                                autoFocus
                                onClick={handleSave}
                                color="secondary"
                            >
                                {t('SAVE')}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent id='divToPrint'
                               style={{ backgroundImage: `url(${back})`,backgroundSize : "450px, contain", backgroundRepeat: 'no-repeat'}}>
                    <div style={{ width : "450px", height:"600px", marginTop : "50px"}} >
                        <Grid item xs={12} sm={12}
                              style={{textAlign : "center", border : "black", margin : "2%", fontWeight : "bold"}}
                        >
                            <label style={{margin : "2%"}}>Dividend Voucher</label>
                        </Grid>
                        <Grid container  style={{textAlign : "center"}} >
                            <Grid item xs={12} sm={6}>
                                <label>Payment Number</label>
                                <div>
                                    <TextField
                                        onChange={(e) =>setDivided({...divided, directorId: divided?.directorId,
                                            //@ts-ignore
                                            paymentNumber: e.target.value})}
                                        className="my-16 mx-6"
                                        name="invitedSurname"
                                       // label="Payment Number"
                                        variant="outlined"
                                        value={divided?.paymentNumber}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label>Date Payment Made</label>
                                <div>
                                    <TextField
                                        type="date"
                                        onChange={(e)=>setDivided({...divided, directorId : divided?.directorId,
                                            datePaymentRate:e.target.value})}
                                        className="my-16 mx-6"
                                        name="invitedSurname"
                                        //label="datePaymentRate"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        inputProps={{
                                            max: '3000-01-01',
                                            min:'1000-01-01'
                                        }}
                                        value={divided?.datePaymentRate}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                {client1?.company?.name}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                Employee Name & Address:<br/>

                            </Grid>

                            <Grid item xs={12} sm={6}></Grid>

                            <Grid container style={{marginLeft : "10%", marginRight : "10%"}}>
                                <Grid item xs={12} sm={4}>
                                    Shareholding
                                    <br/>
                                    <TextField
                                        onChange={(e)=>setDivided({...divided, directorId : divided?.directorId,
                                            //@ts-ignore
                                            shareHolding:e.target.value})}
                                        className="my-16 mx-6"
                                        name="invitedSurname"
                                        //label="Share Holding"
                                        variant="outlined"
                                        value={divided?.shareHolding}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    Amount Payable
                                       <br/>
                                    <TextField
                                        fullWidth={true}
                                        onChange={(e)=>{
                                            setDivided({...divided, directorId : divided?.directorId,
                                                //@ts-ignore
                                                 amountPayable:e.target.value })
                                        }}
                                        className="my-16 mx-6"
                                        name="invitedSurname"
                                        //label="Amount Payable"
                                        variant="outlined"
                                        value={divided?.amountPayable}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                                    <label>
                                        This cheque is in payment of the Interim dividend<br/>
                                        for the year ended :
                                        <TextField
                                            type="date"
                                            onChange={(e)=>setDivided({...divided, directorId : divided?.directorId,
                                                dividedEndDate:e.target.value})}
                                            className="my-16 mx-6"
                                            name="invitedSurname"
                                           // label="Year End Date For Payment Rate"
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                max: '3000-01-01',
                                                min:'1000-01-01'
                                            }}
                                            value={divided?.dividedEndDate}
                                        />
                                    <br/>
                                        paid at the rate of <label style={{color:"blue"}}>£
                                        {/*@ts-ignore*/}
                                        {divided?.amountPayable}
                                    </label>
                                        on those<br/>
                                        ordinary shares  registered in your name on <label style={{color:"blue"}}>
                                        {/*@ts-ignore*/}
                                        {divided?.dividedEndDate}
                                    </label>
                                        <br/>
                                    </label><br/>
                                    <label>
                                        Given on behalf of<br/>
                                        {client1?.company?.name}<br/>
                                        <label style={{color:"blue"}}>
                                            Registered Office Address 17 Greenlanes, London, United Kingdom, N16 9BS
                                        </label>
                                    </label>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>                </DialogContent>
            </Dialog>
        </div>
    );
}

export default withSnackbar(CreateDividedUser);
