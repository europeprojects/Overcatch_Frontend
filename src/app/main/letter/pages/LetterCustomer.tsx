import React, {useEffect, useState} from 'react';
import PdfComponent from "../components/PdfComponent";
import {Node} from "slate";
import LetterTypeSelector from "../components/LetterTypeSelector";
import VisaInvitedForm from "../components/VisaInvitedForm";
import FusePageSimple from "../../../../@fuse/core/FusePageSimple/FusePageSimple";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
    Client, Company, DirectorDetail,
    DynamicInformations, DynamicInformationsEntry,
    Letter,
    LetterType,
    VisaInvitedFormType
} from "../../../types/UserModel";
import api from "../../../services/BackendApi";
import {useSelector} from 'react-redux';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, Grid, LinearProgress,
    MenuItem,
    TextField, Theme, withStyles
} from "@material-ui/core";
import {withSnackbar} from "notistack";
import {useTimeout} from "../../../../@fuse/hooks";
import history from '@history';
import {useTranslation} from "react-i18next";
import { SampleInitialValue } from './LetterEmployee';
import { useHistory } from 'react-router-dom';
import CustomDialog from "../components/CustomDialog";
import {Div} from "../../../components/Grid";
import Select from "@material-ui/core/Select";
import LetterEditComponent from "../components/LetterEditComponent";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";

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
}));

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
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

function LetterCustomer(props: any) {
    //@ts-ignore
    const clientId = useSelector(({company}) => company.currentCompanyId);
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const [render, setRender] = useState<Node[]>();
    const classes = useStyles(props);
    const [edit, setEdit] = useState<Node[]>();
    const [value, setValue] = useState();
    const [value2, setValue2] = useState("");
    const isSelected = value;
    const [addresses, setAddresses] = useState([])
    const [selectedValue, setSelectedValue] = useState([]);
    const [letterValue, setLetterValue] = useState();
    const [client, setClient] = useState<Client>({} as Client);
    const [clientHomeAddress, setClientHomeAddress] = useState(null);
    const [clientBussAddress, setClientBussAddress] = useState(null);
    const [letterType, setLetterType] = useState<LetterType>()
    const [ltType, setLtType] = useState<LetterType>({} as LetterType);
    const [dynamicInfo, setDynamicInfo] = useState<DynamicInformations>({} as DynamicInformations);
    const [letterId, setLetterId] = useState<number>(null);
    const [selectedLetterTypeName, setSelectedLetterTypeName] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [btnState, setBtnState] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const {t} = useTranslation('letter');
    const history = useHistory();
    const [selectedDirector, setSelectedDirector] = useState(null)
    const [companyId1, setCompanyId1] = useState();
    const [dynamicInfoEntry, setDynamicInfoEntry] = useState<DynamicInformationsEntry>(
        {} as DynamicInformationsEntry
    );
    const [entries, setEntries] = useState([]);
    const [open2, setOpen2] = useState(false);
    const [letterTypeName, setLetterTypeName] = useState("");
    const [displayNone, setDisplayNone] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const [file, setFile] = React.useState<File>(null);

    useEffect(()=> {
        console.log("letter use effect")
        console.log("use effect", entries)
        dynamicInfoEntry.$Address$ = null
        dynamicInfoEntry.$countryName$ = null
        dynamicInfoEntry.$natureofBusiness$ = null
        dynamicInfoEntry.$nameOfBank$ = null
        dynamicInfoEntry.$taxYear$ = null
        dynamicInfoEntry.$HMRCRefNumberOnLetter$ = null
        dynamicInfoEntry.$penaltyAmount$ = null
        dynamicInfoEntry.$lettersDate$ = null
        dynamicInfoEntry.$turnOver$ = null
        dynamicInfoEntry.$netProfitBeforeTax$ = null
        dynamicInfoEntry.$directorSalary$ = null
        dynamicInfoEntry.$divident$ = null
        dynamicInfoEntry.$netIncome$ = null
        dynamicInfoEntry.$interimAccountsTurnOver$ = null
        dynamicInfoEntry.$interimAccountsYearEndDate$ = null
        dynamicInfoEntry.$interimAccountsNetProfitBeforeTax$ = null
        dynamicInfoEntry.$interimAccountStartDate$ = null
        dynamicInfoEntry.$interimAccountEndDate$ = null
    }, [])


    useEffect(() => {
        console.log(test);
        test.forEach(x => {

            if (x.client.id === clientId) {
                console.log(x.client.isActive)
                if (x.client.state !== "3") {
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>, {
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                } else {
                    api.getClient(clientId).then(response => {
                        setClient(response)
                        getLetterTypes(response?.clientTypeEnum.toString())
                        const {addressList} = response;
                        setAddresses(addressList)
                    })
                }

            }
        })


    }, [])

    useEffect(() => {
        var address1 = addresses?.find(adr => adr.addressType === "HOME");
        var addressString = address1?.number + " " + address1?.street + " " + address1?.county + " " + address1?.city + " " + address1?.postcode;
        //@ts-ignore
        setClientHomeAddress(addressString)

        var address2 = addresses?.find(adr => adr.addressType === "BUSINESS");
        var addressString = address2?.number + " " + address2?.street + " " + address2?.county + " " + address2?.city + " " + address2?.postcode;
        //@ts-ignore
        setClientBussAddress(addressString)
    }, [addresses])


    const invitedFormInitial = {
        invitedName: "",
        invitedSurname: "",
        invitedAddress: "",
        invitedDOB: "",
        invitedRelation: "",
        invitedSex: "male"
    }
    const [invitedForm, setInvitedForm] = useState<VisaInvitedFormType>(invitedFormInitial)

    const [letterTypeList, setLetterTypeList] = useState([]);

    const [letter, setLetter] = useState({
        id : null,
        letterTemplate: SampleInitialValue,
        letterTypeName: "",
    })

    const onCreateRequest = () => {
        //@ts-ignore
        setDisplayNone(true)
        setDisabled(true)
        ltType.id = letterValue
        client.id = clientId

        const convertLetter =  window.btoa(unescape(encodeURIComponent(JSON.stringify(letter.letterTemplate))));
        // @ts-ignore
        let letterSent: Letter = {
            "client": client,
            "letter": window.btoa(
                unescape(encodeURIComponent(JSON.stringify(selectedValue)))
            ),
            "letterType": {...letter, letterTemplate: convertLetter},
            "id": null
        }
        api.saveLetters(letterSent, file, progressCallback).then(()=>{
            props.enqueueSnackbar(<h4>{t("LETTERREQUEST")}</h4>, {
                variant: 'success',
            })
            history.push("/myLetters")
        })

        console.log(letterSent);
    };

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }


    function getAddressByAddressType(addressType){
        var address = client?.addressList?.find(address => address.addressType.toString() == addressType)
        var address1 = address?.number ? address?.number : null +
        " " +
        address?.street  ? address?.street : null+
        " " +
        address?.county  ? address?.county : null+
        " " +
        address?.city  ? address?.city : null+
        " " +
        address?.postcode  ? address?.postcode : null;
        return address1
    }


    function onPreview2() {
        // dynamicInfo.heshe = (client.founderOwner?.sex === "true" || client.company?.directorDetails[0].sex) ? ("he") : ("she")
        // dynamicInfo.HeShe = (client.founderOwner?.sex === "true" || client.company?.directorDetails[0].sex) ? ("He") : ("She")
        // dynamicInfo.hisher = (client.founderOwner?.sex === "true" || client.company?.directorDetails[0].sex) ? ("his") : ("her")
        // dynamicInfo.himher = (client.founderOwner?.sex === "true" || client.company?.directorDetails[0].sex) ? ("him") : ("her")
        // dynamicInfo.invheshe = (invitedForm.invitedSex === "true") ? ("he") : ("she")
        // dynamicInfo.invhimher = (invitedForm.invitedSex === "true") ? ("him") : ("her")
        // dynamicInfo.invhisher = (invitedForm.invitedSex === "true") ? ("his") : ("her")
        // dynamicInfo.initial = (client.founderOwner?.initial || client.company?.directorDetails[0].initial)
        // dynamicInfo.selectedUserName = (client.founderOwner?.name || client.company?.directorDetails[0].name)
        // dynamicInfo.selectedUserSurname = (client.founderOwner?.surname || client.company?.directorDetails[0].surname)
        // dynamicInfo.selectedUserHomeAddress = (clientHomeAddress)
        // dynamicInfo.selectedUserBussAddress = (clientBussAddress)
        // dynamicInfo.selectedBussName = (client?.founderOwner?.tradeAsName || client?.company?.name)
        // dynamicInfo.selectedUserDOB = (client?.founderOwner?.dob || client?.company?.directorDetails[0]?.dob || "").toString()
        // let today = new Date(),
        //   date = (today.getDate()) + '-' + (today.getMonth()) + '-' + today.getFullYear();


        // dynamicInfo.date = date

        //@ts-ignore
        // setDynamicInfo({...dynamicInfo})

        var nulls = 0
        for (let entry in entries) {
            nulls = (entries[entry] === undefined || entries[entry] == null || entries[entry]?.length <= 0) ? nulls +1 : nulls
        }
        if(nulls > 0 || (client?.company && !selectedDirector) || letterTypeList?.length <1){
            setOpen2(true)
            return
        }
        console.log(selectedDirector,"selected director")
        dynamicInfo.$clientRef$ = client?.code
        dynamicInfo.$clientTitle$ = client?.founderOwner ? (client.founderOwner.sex == "true" ? "Mr." : (client.founderOwner.sex == "false" ? "Mrs." : "Mr. / Mrs.")) : (selectedDirector?.sex == "true" ? "Mr." : (selectedDirector?.sex == "false" ?  "Mrs." :"Mr. / Mrs."))
        dynamicInfo.$clientAddress$ = getAddressByAddressType("HOME");
        dynamicInfo.$clientKnownAs$ = client?.founderOwner ? client?.founderOwner.tradeAsName : selectedDirector?.name + " " + selectedDirector?.surname
        dynamicInfo.$clientFullName$ = client?.founderOwner ? client?.founderOwner?.name + " " + client?.founderOwner?.surname :
            selectedDirector?.name + " " + selectedDirector?.surname
        dynamicInfo.$clientSurname$ = selectedDirector?.surname
        dynamicInfo.$clientDob$ =  (client?.founderOwner ? client?.founderOwner?.dob : selectedDirector?.dob)
        dynamicInfo.$sheHe$ = client?.founderOwner ? (client.founderOwner.sex  == "true" ? "he" : client.founderOwner.sex == "false" ? "she" : "he/she") : (selectedDirector?.sex  == "true" ? "he" : selectedDirector?.sex == "false" ? "she" :"he/she")
        dynamicInfo.$SheHe$ = client?.founderOwner ? (client.founderOwner.sex == "true" ? "He" : client.founderOwner.sex == "false" ? "She" : "He/She") : (selectedDirector?.sex == "true" ? "He" : selectedDirector?.sex == "false" ? "She" : "He/She")
        dynamicInfo.$herHim$ = client?.founderOwner ? (client.founderOwner.sex == "true" ? "him" : client.founderOwner.sex == "false" ? "her" :"him/her") : (selectedDirector?.sex == "true" ? "him" : selectedDirector?.sex == "false" ? "her" : "him/her")
        dynamicInfo.$herHis$ = client?.founderOwner ? (client.founderOwner.sex == "true" ? "his" : client.founderOwner.sex == "false" ? "her" :"his/her") : (selectedDirector?.sex == "true" ? "his" : selectedDirector?.sex == "false" ? "her" : "his/her")
        dynamicInfo.$HerHis$ = client?.founderOwner ? (client.founderOwner.sex == "true" ? "His" : client.founderOwner.sex == "false" ? "Her" :"His/Her") : (selectedDirector?.sex == "true" ? "His" : selectedDirector?.sex == "false" ? "Her" :"His/Her")
        dynamicInfo.$herselfHimself$ = client?.founderOwner ? (client.founderOwner.sex == "true" ? "himself" : client.founderOwner.sex == "false" ? "herself" :"himself / herself") : (selectedDirector?.sex == "true" ? "himself" : selectedDirector?.sex == "false" ? "herself" :"himself/herself")
        dynamicInfo.$clientCommencementDate$ = client?.clientTypeEnum?.toString() == "LIMITED" ? client?.company?.incorporatedDate : client?.founderOwner?.workStartDate

        dynamicInfo.$companyRegisterAddress$ = getAddressByAddressType("BUSINESS")
        dynamicInfo.$companyUTR$ = client?.company ? client?.company.companyUtr : client?.founderOwner?.utr
        dynamicInfo.$whereIsLocated$ = getAddressByAddressType("TRADING") ? getAddressByAddressType("TRADING") : getAddressByAddressType("HOME")
        dynamicInfo.$clientRegistrationNo$ = client?.clientTypeEnum?.toString() == "LIMITED" ? client?.company?.registration : null
        dynamicInfo.$yearEndDate$ = client?.clientTypeEnum?.toString() == "LIMITED" ? client?.company?.yearEndDate : null
        dynamicInfo.$clientLocation$ = getAddressByAddressType("TRADING") ? getAddressByAddressType("TRADING") : null
        dynamicInfo.$clientNinoNumber$ = client?.founderOwner ? client?.founderOwner?.nino : " - "

        let findOutNature = "SIC Codes: "
        if(client?.company && client?.company?.natureBusinesses?.length > 0){
            for(var i=0; i<client?.company?.natureBusinesses?.length; i++){
                findOutNature += client?.company?.natureBusinesses?.[i]?.code ? client?.company?.natureBusinesses?.[i]?.code : "" + " - " + client?.company?.natureBusinesses?.[i]?.description ? client?.company?.natureBusinesses?.[i]?.description : "" + ","
            }
        }else
            findOutNature += " - "

        // client1?.company?.natureBusinesses?.map(code => {
        //     findOutNature += code.code + " - " + code.description + ","
        // }) : findOutNature += " - "
        dynamicInfo.$findOutFromNatureOfbusiness$ = client?.company ? findOutNature : ""


        let today = new Date(),
            date = new Date().toJSON().slice(0,10).split('-').reverse().join('/');

        // dynamicInfo.date = date;
        dynamicInfo.$longDate$ = date;


        // letter?.letterTemplate?.forEach((ch) =>
        //   ch.children.forEach((cc) =>
        //     cc.code === true && (dynamicInfo[cc.text] || invitedForm[cc.text])
        //       ? (cc.text = dynamicInfo[cc.text] || invitedForm[cc.text])
        //       : cc.text
        //   )
        // );
        const Yedekletter = JSON.parse(JSON.stringify(letter?.letterTemplate))


        Yedekletter.forEach((ch) =>
            ch.children.forEach((cc) =>
                // (dynamicInfo[cc.text] || invitedForm[cc.text])
                //   ? (cc.text = dynamicInfo[cc.text] || invitedForm[cc.text])
                //   : cc.text
                Object.keys(dynamicInfo).map(key => {
                    if(cc.text.includes(key)){
                        cc.text = cc.text.replaceAll(key, dynamicInfo[key] ? dynamicInfo[key] : "")
                    }
                    else{
                        Object.keys(entries)?.map(entry => {
                            if(cc.text.includes(entry)){
                                cc.text = cc.text.replaceAll(entry, entries[entry] ? entries[entry] : "")
                            }
                        })
                    }
                })
            )
        );

        //@ts-ignore
        setSelectedValue(Yedekletter)
        // setOpen(true)
        setBtnState(true);
        setDisabled(false)
        setDisplayNone(false)
        setOpenDialog(true)
    }

    const handleChangeName = (e) =>{
        setDisplayNone(true)
        var entries2 = []
        setLetterTypeName(e.target.value);
        const found = letterTypeList.find(item=>item.letterTypeName === e.target.value);
        if(found)
        api.getLetterTypeByID(found?.id).then(r=>{
            setLetter({...found,  letterTemplate : r })
            // entries?.splice(0, entries.length)
            r?.forEach((ch) =>
                ch.children.forEach((cc) =>
                    // (dynamicInfo[cc.text] || invitedForm[cc.text])
                    //   ? (cc.text = dynamicInfo[cc.text] || invitedForm[cc.text])
                    //   : cc.text
                    Object.keys(dynamicInfoEntry).map(key => {
                        if(cc.text.includes(key)){
                            if (!entries2.includes(key)){
                                entries2[key] = null
                            }

                        }
                    })
                )
            );
            setEntries(entries2);
            console.log("letter update")
        })
        setSelectedValue([]);
    }


    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClickClose = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        setBtnState(false)
    }, [selectedLetterTypeName])

    function getLetterTypes(clientType){
        api.getLetterTypesByClientType(clientType).then(r=> {
            const list = r;
            setLetterTypeList(list);
            setLetterTypeName(list?.[0]?.letterTypeName)
            if(list?.[0]?.letterTemplate)
             setLetter({ ...list?.[0], letterTemplate:  JSON.parse(decodeURIComponent(escape(window.atob(list?.[0]?.letterTemplate))))})
            var entries2 = []
                    // entries?.splice(0, entries.length)
            JSON.parse(decodeURIComponent(escape(window.atob(list?.[0]?.letterTemplate))))?.forEach((ch) =>
                ch.children.forEach((cc) =>
                    // (dynamicInfo[cc.text] || invitedForm[cc.text])
                    //   ? (cc.text = dynamicInfo[cc.text] || invitedForm[cc.text])
                    //   : cc.text
                    Object.keys(dynamicInfoEntry).map(key => {
                        if(cc.text.includes(key)){
                            if (!entries2.includes(key)){
                                entries2[key] = null
                            }
                        }
                    })
                )
            );
            setEntries(entries2);
        })
    }
    // useEffect(()=> {
    //     getLetterTypes()
    // },[])


    const handleChange = (value) => {
        setCompanyId1(value);
    };

    const handleChangeDirector = (value) => {
        const director = client?.company.directorDetails.find(director => director.id = value)
        setSelectedDirector(director as DirectorDetail)
    };

    function handleChangeEntry(value, entry) {
        setEntries(entries=>({...entries, [entry]: value}))
        setDisplayNone(true)
    }

    const handleChangeNew = (e) => {
        setLetter({
            ...letter, [e.target.name] : e.target.value
        })
    }

    const handleChangeEditor = (value) => {
        setLetter({
            ...letter, letterTemplate : value
        })
    }

    function handleClose2() {
        setOpen2(false)
    }

    function handleChange2(event) {
        event.target.value = null;
        setProgress(0)
        // setFileDescription(event.target.value)
        // console.log(document)
    }

    const progressCallback = (loaded: number, total: number) => {
        setProgress(Math.round((loaded / total) * 100))
    };

    function handleFileChange(event) {
        console.log("handle File Change : ",event.target.files[0]);
        setFile(event.target.files[0]);
    }

    return (

      <FusePageSimple
        classes={{
            root: classes.layoutRoot
        }}
        // header={
        //     <div className="p-24">
        //         <h4>Letter Page</h4>
        //     </div>
        // }
        content={
            <div className="flex w-full h-full flex flex-col">
                <div className="auto-rows-auto">
                    <div className="auto-rows-auto flex justify-center m-20">
                        <div className="customize__item">
                            <FormControl size={"small"}>
                                <Div columns={1}>
                                    {/*<Select*/}
                                    {/*    label="İl"*/}
                                    {/*    variant="outlined"*/}
                                    {/*    defaultValue={"none"}*/}
                                    {/*    onChange={(e) => handleChange(e.target.value)}*/}
                                    {/*>*/}
                                    {/*    <MenuItem value="none">*/}
                                    {/*        <em>Please Select Company For Letter</em>*/}
                                    {/*    </MenuItem>*/}
                                    {/*    {client?.company ? (*/}
                                    {/*            <MenuItem value={client?.company.id}>{client?.company.name}</MenuItem>*/}
                                    {/*    ) : (*/}
                                    {/*        <MenuItem value={client?.founderOwner?.id}>{client?.founderOwner?.name + " " + client?.founderOwner?.surname}</MenuItem>*/}
                                    {/*    )}*/}
                                    {/*</Select>*/}

                                    {client?.company && (

                                        <Select
                                            variant="outlined"
                                            defaultValue={"none"}
                                            onChange={(e) => handleChangeDirector(e.target.value)}
                                        >
                                            <MenuItem value="none">
                                                <em>{t('PLEASESELECETDIRECTOR')}</em>
                                            </MenuItem>
                                            {
                                                client?.company?.directorDetails?.length > 0 ? (
                                                    client?.company.directorDetails.map((result) => (
                                                        <MenuItem
                                                            value={result.id}>{result.name}-{t('DIRECTOR')}</MenuItem>
                                                    ))
                                                ) : null
                                            }
                                            {
                                                client?.customerClients?.length > 0 ? (
                                                    client?.customerClients?.map((result)=>(
                                                        <MenuItem value={result.id} >{result.customerInfo.userInfo.name + " " + result.customerInfo.userInfo.surname + " owner"}</MenuItem>
                                                    ))
                                                ) : null
                                            }
                                        </Select>
                                    )}
                                </Div>
                            </FormControl>
                        </div>
                        <div
                            className="mx-8">
                            <LetterTypeSelector
                                name={"letterTypeName"}
                                handleChange={handleChangeName}
                                value={letterTypeName}
                                selectList={letterTypeList}
                                disabled={false}
                                fullWidth={false}
                                size={"small"}
                            />
                        </div>


                        <div className="flex justify-between">

                            <Button variant="contained" color="primary" className="ml-10"
                                    onClick={onPreview2}>{t("PREVIEW")}</Button>

                            {btnState === false ? ("") : (
                              <Button variant="contained" color="primary" className="ml-10"
                                      onClick={onCreateRequest} disabled={disabled} style={displayNone ? {display:"none"} : null}>{t("CREATEREQUEST")} </Button>)}

                        </div>


                    </div>
                    {entries && (
                        <Div columns={2} className="mx-32">
                            {
                                Object.keys(entries).map(entry => (
                                    <div className="visa-form">
                                        <TextField
                                            required={true}
                                            id="outlined-basic"
                                            label={t(entry)}
                                            name={entry}
                                            value={entries[entry] ? entries[entry] : ""}
                                            variant="outlined"
                                            className="w-full my-10"
                                            onChange={e => handleChangeEntry(e.target.value, entry)}
                                        />
                                    </div>
                                ))
                            }
                        </Div>
                    )}

                    <div className="flex justify-center items-center m-32">
                        <div>
                            <input
                                className={"hidden"}
                                type="file"
                                onClick={handleChange2}
                                onChange={event => {handleFileChange(event)}}
                                id="contained-button-file"
                            />

                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    {t('UPLOAD')}
                                </Button>
                            </label>
                        </div>
                        <BorderLinearProgress className="flex-1 m-32" variant="determinate" value={progress}/>
                    </div>

                    <div className="w-full flex justify-center" >
                        {/*{*/}
                        {/*    letter?.letterTypeName.toString().includes("nvitation") ? (*/}
                        {/*      <VisaInvitedForm invitedForm={invitedForm}*/}
                        {/*                       setInvitedForm={setInvitedForm}/>) : ("")*/}
                        {/*}*/}
                        <div>
                            <Grid direction="row" item xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    label={"Template Name"}
                                    name="letterTypeName"
                                    variant="outlined"
                                    className="w-3/5 my-10 mx-32"
                                    value={letter.letterTypeName}
                                    onChange={handleChangeNew}
                                    inputProps={
                                        {readOnly : true}
                                    }
                                />
                                {/*<div className="flex justify-center items-center">*/}
                                {/*    <div>*/}
                                {/*        <input*/}
                                {/*            className={"hidden"}*/}
                                {/*            type="file"*/}
                                {/*            onClick={handleChange2}*/}
                                {/*            onChange={event => {handleFileChange(event)}}*/}
                                {/*            id="contained-button-file"*/}
                                {/*        />*/}

                                {/*        <label htmlFor="contained-button-file">*/}
                                {/*            <Button variant="contained" color="primary" component="span">*/}
                                {/*                {t('UPLOAD')}*/}
                                {/*            </Button>*/}
                                {/*        </label>*/}
                                {/*    </div>*/}
                                {/*    <BorderLinearProgress className="flex-1 mx-8" variant="determinate" value={progress}/>*/}
                                {/*</div>*/}
                            </Grid>

                            <div className="mx-32">
                                <LetterEditComponent
                                    isReadOnly={true}
                                    name={"letterTemplate"}
                                    value={letter.letterTemplate}
                                    handleChange={handleChangeEditor}
                                ></LetterEditComponent>
                            </div>

                            <Snackbar open={open2} autoHideDuration={6000} onClose={()=> handleClose2()}>
                                <Alert onClose={()=>handleClose2()} severity="error" variant="filled">
                                    {t('PLEASEFILL')}
                                </Alert>
                            </Snackbar>
                        </div>
                    </div>

                </div>

                    <CustomDialog open={openDialog} handleClickOpen={handleClickOpen} handleClose={handleClickClose}>
                        <div className="show__pdf" style={{height:"100%"}}>
                            <PdfComponent selectedValue={selectedValue} />
                        </div>
                    </CustomDialog>

            </div>

        }
      />


    );
}


export default withSnackbar(LetterCustomer);
