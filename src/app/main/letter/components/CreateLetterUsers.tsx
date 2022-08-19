import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseUtils from "@fuse/utils";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactsMultiSelectMenu from "../../user/ContactsMultiSelectMenu";
import ContactsTable from "../../user/components/UITable";
import {
    openEditContactDialog,
    selectContacts,
} from "../../user/store/contactsSlice";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Div } from "../../../components/Grid";
import { createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import {
    AppBar, FormControl,
    Grid, LinearProgress,
    makeStyles,
    MenuItem,
    Slide,
    Theme,
    Toolbar, withStyles
} from '@material-ui/core';
import Snackbar from "@material-ui/core/Snackbar";
import api from "../../../services/BackendApi";
import { withSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import history from "@history";
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import LetterTypeSelector from "./LetterTypeSelector";
import PdfComponent from "./PdfComponent";
import {
    Client, DirectorDetail,
    DynamicInformations, DynamicInformationsEntry,
    Letter,
    LetterType,
    VisaInvitedFormType,
} from "../../../types/UserModel";
import "./CreateLetterUsers.css";
import LetterEditComponent from './LetterEditComponent';
import { SampleInitialValue } from '../pages/LetterEmployee';
import CustomDialog from "./CustomDialog";
import config from "../../../services/Config";
import {Alert} from "@material-ui/lab";
import LetterCustomer from "../pages/LetterCustomer";
import {UserTypeFilter} from "../../user/UserTypeFilter";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

function CreateLetterUsers(props) {
    const classes = useStyles();
    const [client, setClient] = useState();
    const dispatch = useDispatch();
    const contacts = useSelector(selectContacts);
    const searchText = useSelector(
        //@ts-ignore
      ({ contactsApp }) => contactsApp.contacts.searchText
    );
    const user = useSelector(({
                                  //@ts-ignore
                                  contactsApp }) => contactsApp.user);
    const [filteredData, setFilteredData] = useState(null);
    const { t } = useTranslation("letter");
    const [company, setCompany] = useState([]);
    const [founder, setFounder] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [selectedLetterTypeName, setSelectedLetterTypeName] = useState(null);
    const [selectedValue, setSelectedValue] = useState([]);
    const [letterValue, setLetterValue] = useState();
    const [letterId, setLetterId] = useState<number>(null);
    const [value, setValue] = useState();
    const [value2, setValue2] = useState("");
    const [dynamicInfo, setDynamicInfo] = useState<DynamicInformations>(
      {} as DynamicInformations
    );
    const [dynamicInfoEntry, setDynamicInfoEntry] = useState<DynamicInformationsEntry>(
        {} as DynamicInformationsEntry
    );
    const [entries, setEntries] = useState([]);
    const [client1, setClient1] = useState<Client>({} as Client);
    const [clientHomeAddress, setClientHomeAddress] = useState(null);
    const [clientBussAddress, setClientBussAddress] = useState(null);
    const [ltType, setLtType] = useState<LetterType>({} as LetterType);
    const [addresses, setAddresses] = useState([]);
    const [companyId1, setCompanyId1] = useState();
    const invitedFormInitial = {
        invitedName: "",
        invitedSurname: "",
        invitedAddress: "",
        invitedDOB: "",
        invitedRelation: "",
        invitedSex: "male",
    };
    const [invitedForm, setInvitedForm] =
      useState<VisaInvitedFormType>(invitedFormInitial);
    const [btnState, setBtnState] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [displayNone, setDisplayNone] = React.useState(true);
    const [selectedDirector, setSelectedDirector] = useState(null)
    const [progress, setProgress] = React.useState(0);
    const [file, setFile] = React.useState<File>(null);
    const [type,setType] = useState("")

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const [letter, setLetter] = useState({
        id : null,
        letterTemplate: SampleInitialValue,
        letterTypeName: "",
        clientType: null,
        userRole: null
    })

        ///Home bilgisi olmayanlar için hata diyaloğu için tanımladı.
        const [homeError,setHomeError] = useState(false);

    // const [Yedekletter, setYedekLetter] = useState([])

    const [letterTypeList, setLetterTypeList] = useState([]);
    const [letterTypeName, setLetterTypeName] = useState("");

    const handleChangeNew = (e) => {
        setLetter({
            ...letter, [e.target.name] : e.target.value
        })
        // setYedekLetter({
        //     ...Yedekletter, [e.target.name] : e.target.value
        // })
    }

    const handleChangeEditor = (value) => {
        setLetter({
            ...letter, letterTemplate : value
        })
    }

    const handleChangeName = (e) =>{
        setDisplayNone(true)
        var entries2 = []
        setLetterTypeName(e.target.value);
        const found = letterTypeList?.find(item=>item.letterTypeName === e.target.value);
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
        })
        setSelectedValue([]);
    }

    useEffect(()=> {
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

    //
    // useEffect(()=> {
    //     setYedekLetter([...letter?.letterTemplate])
    // }, [letter])


    const handleCreateLetter = (e,row) => {
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

    function getLetterTypes (clientType){
        api.getLetterTypesByClientType(clientType).then(r=> {
            const list = r;
            setLetterTypeList(list);
            setLetterTypeName(list?.[0]?.letterTypeName);
            setLetter({...letter, letterTypeName: list?.[0]?.letterTypeName})
            if(list?.length > 0)
            api.getLetterTypeByID(list?.[0]?.id).then(r=>{
                setLetter({...list?.[0],  letterTemplate : r })
                var entries2 = []
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
            })
            // entries?.splice(0, entries.length);
            setEntries([])
        })
    }
    // useEffect(()=> {
    //    getLetterTypes()
    // },[])

    const getPhotoUrlByFileName = (id, photoUrl) => {
        var id = id
        var filename = photoUrl
        var url = config.BACKEND_API_URL + "/api/file/downloadPhoto/" + id + "/" + filename
        return url
    }
    const customStringSort: any = (rowA: any, rowB: any, columnId: string, desc: boolean) => {
        let A = String(rowA.values[columnId]).toLowerCase();
        let B = String(rowB.values[columnId]).toLowerCase();
        return A.localeCompare(B)
    };

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
              Header: t("CREATELETTER"),
              accessor: "createLetter",
              sortable: false,
              Cell: ({ row }) => (
                <div className="flex items-center">
                    <Button
                      variant="contained"
                      color="primary"
                      aria-label="close"
                      onClick={(e)=>handleCreateLetter(e,row)}
                    >
                        {t("CREATELETTER")}
                    </Button>
                </div>
              ),
          },
      ],
      [] // dep array empty
    );

    useEffect(() => {
        console.log(filteredData)

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

    useEffect(() => {
        var address1 = addresses?.find((adr) => adr.addressType === "HOME");
        var addressString =
          address1?.number +
          " " +
          address1?.street +
          " " +
          address1?.county +
          " " +
          address1?.city +
          " " +
          address1?.postcode;
        //@ts-ignore
        setClientHomeAddress(addressString);

        var address2 = addresses?.find((adr) => adr.addressType === "BUSINESS");
        var addressString =
          address2?.number +
          " " +
          address2?.street +
          " " +
          address2?.county +
          " " +
          address2?.city +
          " " +
          address2?.postcode;
        //@ts-ignore
        setClientBussAddress(addressString);
    }, [addresses]);

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
    const onCreateRequest = () => {
        //@ts-ignore
        setDisabled(true);
        setDisplayNone(true)
        ltType.id = letterValue;
        // @ts-ignore
        const convertLetter =  window.btoa(unescape(encodeURIComponent(JSON.stringify(letter.letterTemplate))));

        let letterSave: Letter = {
            client: client1,
            letter: window.btoa(
              unescape(encodeURIComponent(JSON.stringify(selectedValue)))
            ),
            letterType:  {...letter, letterTemplate: convertLetter}, //
            id: null,
            userRole: null,
            document: null
        };
        api
          .saveCustomLetter(letterSave, file, progressCallback)
          .then( () => {
                  props.enqueueSnackbar(<h4>{t("LETTERREQUEST")}</h4>, {
                      variant: "success",

                  })
                  setCompany([]);
                  setFounder([]);
                  setOpen(false);
          })
        // getLetterTypes()


        // CREATE EDERKEN TEMPLATE İ ÖNCE KAYDEDERİZ backende SONRA DEVAM.
    };

    const handleChange = (value) => {
        setCompanyId1(value.id);
    };
    
    const handleChangeDirector = (value) => {
        //director mu owner mı tipini belirlemek için
        if( company[0]?.directorDetails?.filter(director => director.id === value).length>0)
        {
            setType("ok1")
            const director = company[0]?.directorDetails?.find(director => director.id == value)
            setSelectedDirector(director as DirectorDetail)
        }
        else if(client1?.customerClients?.filter(director => director.customerInfo.user.id == value).length>0) {

            setType("ok2")
            const director = client1?.customerClients?.find(director => director.customerInfo.user.id == value)
            setSelectedDirector(director)
        }
        else
        {
            setType(null)
        }
    };

    function getAddressByAddressType(addressType){
        var address = client1?.addressList?.find(address => address?.addressType?.toString() == addressType)
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

    //@ts-ignore
    function onPreview2() {
        var nulls = 0

        for (let entry in entries) {
            nulls = (entries[entry] === undefined || entries[entry] == null || entries[entry]?.length <= 0) ? nulls +1 : nulls
        }
        if(nulls > 0 || (company.length>0 && !selectedDirector) || letterTypeList?.length <1 || type==null){
            setOpen2(true)
            return
        }


        //director için
        if(type==="ok1")
        {
            dynamicInfo.$clientKnownAs$ = client1?.founderOwner ? client1?.founderOwner.tradeAsName :selectedDirector?.name + " " + selectedDirector?.surname
            dynamicInfo.$clientFullName$ = client1?.founderOwner ? client1?.founderOwner?.name + " " + client1?.founderOwner?.surname :
                selectedDirector?.name + " " + selectedDirector?.surname
            dynamicInfo.$clientSurname$ = selectedDirector?.surname
            dynamicInfo.$clientDob$ =  (client1?.founderOwner ? client1?.founderOwner?.dob : selectedDirector?.dob)?.toString().replaceAll(",", "/")
        }
        //owner için
        else
        {

            dynamicInfo.$clientKnownAs$ = client1?.founderOwner ? client1?.founderOwner.tradeAsName :selectedDirector?.customerInfo.user.name + " " + selectedDirector?.customerInfo.user.surname
            dynamicInfo.$clientFullName$ = client1?.founderOwner ? client1?.founderOwner?.name + " " + client1?.founderOwner?.surname :
                selectedDirector?.customerInfo?.user?.name + " " + selectedDirector?.customerInfo?.user?.surname +" owner"
            dynamicInfo.$clientSurname$ = selectedDirector?.customerInfo?.user?.surname
            dynamicInfo.$clientDob$ =  (client1?.founderOwner ? client1?.founderOwner?.dob : "")?.toString().replaceAll(",", "/")
        }




        dynamicInfo.$clientRef$ = client1?.code;
        dynamicInfo.$clientTitle$ = client1?.founderOwner ? (client1.founderOwner.initial) : (selectedDirector?.initial)
        dynamicInfo.$clientAddress$ = getAddressByAddressType("HOME");
        dynamicInfo.$sheHe$ = client1?.founderOwner ? (client1.founderOwner.sex == "true"? "he" : client1.founderOwner.sex =="false"? "she" : "he/she") : (selectedDirector?.sex == "true" ? "he" : selectedDirector?.sex =="false" ? "she" : "he/she")
        dynamicInfo.$SheHe$ = client1?.founderOwner ? (client1.founderOwner.sex == "true"? "He" : client1.founderOwner.sex =="false"? "she" : "he/she") : (selectedDirector?.sex  == "true" ? "He" : selectedDirector?.sex =="false" ? "she" : "he/she")
        dynamicInfo.$herHim$ = client1?.founderOwner ? (client1.founderOwner.sex == "true"? "him" :client1.founderOwner.sex =="false"? "her" : "him/her") : (selectedDirector?.sex == "true" ? "him" : selectedDirector?.sex =="false" ? "her" : "him/her")
        dynamicInfo.$herHis$ = client1?.founderOwner ? (client1.founderOwner.sex == "true"? "his" :client1.founderOwner.sex =="false" ? "her" : "him/her") : (selectedDirector?.sex == "true" ? "his" :selectedDirector?.sex =="false" ? "her" : "him/her")
        dynamicInfo.$HerHis$ = client1?.founderOwner ? (client1.founderOwner.sex == "true"? "His" :client1.founderOwner.sex =="false"? "her" : "him/her") : (selectedDirector?.sex == "true" ? "His" : selectedDirector?.sex =="false" ? "her" : "him/her")
        dynamicInfo.$herselfHimself$ = client1?.founderOwner ? (client1.founderOwner.sex == "true"? "himself" : client1.founderOwner.sex =="false"? "herself" : "himself/herself") : (selectedDirector?.sex == "true" ? "himself" : selectedDirector?.sex =="false" ? "herself" : "himself/herself")
        dynamicInfo.$clientCommencementDate$ = client1?.clientTypeEnum?.toString() == "LIMITED" ? client1?.company?.incorporatedDate : client1?.founderOwner?.workStartDate

        dynamicInfo.$companyRegisterAddress$ = getAddressByAddressType("BUSINESS")
        dynamicInfo.$companyUTR$ = client1?.company ? client1?.company.companyUtr : client1?.founderOwner?.utr
        dynamicInfo.$whereIsLocated$ = getAddressByAddressType("TRADING") ? getAddressByAddressType("TRADING") : getAddressByAddressType("HOME")
        dynamicInfo.$clientRegistrationNo$ = client1?.clientTypeEnum?.toString() == "LIMITED" ? client1?.company?.registration : null
        dynamicInfo.$yearEndDate$ = client1?.clientTypeEnum?.toString() == "LIMITED" ? client1?.company?.yearEndDate : null
        dynamicInfo.$clientLocation$ = getAddressByAddressType("TRADING") ? getAddressByAddressType("TRADING") : null

        //limited için nino number bulunmamakta, ondan sadece founderOwner içinden alabilir
        dynamicInfo.$clientNinoNumber$ = client1?.founderOwner ? client1?.founderOwner?.nino : " - "
        let findOutNature = "SIC Codes: "
        if(client1?.company && client1?.company?.natureBusinesses?.length > 0){
            for(var i=0; i<client1?.company?.natureBusinesses?.length; i++){
                findOutNature += client1?.company?.natureBusinesses?.[i]?.code ? client1?.company?.natureBusinesses?.[i]?.code : "" + " - " + client1?.company?.natureBusinesses?.[i]?.description ? client1?.company?.natureBusinesses?.[i]?.description : "" + ","
            }
        }else
            findOutNature += " - "

        dynamicInfo.$findOutFromNatureOfbusiness$ = client1?.company ? findOutNature : ""

        let date = new Date().toJSON().slice(0,10).split('-').reverse().join('/');

        // dynamicInfo.date = date;
        dynamicInfo.$longDate$ = date;


        //@ts-ignore
        setDynamicInfo({ ...dynamicInfo });
        // setDynamicInfoEntry({ ...dynamicInfoEntry as DynamicInformationsEntry });

        const Yedekletter = JSON.parse(JSON.stringify(letter?.letterTemplate))

        // @ts-ignore
        Yedekletter?.forEach((ch) =>
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
        setSelectedValue(Yedekletter);
        // setOpen(true)
        setBtnState(true);
        setDisabled(false);
        setDisplayNone(false)

        setOpenDialog(true)
    }
    
 

     const handleCloseHomeError = () => {
        setHomeError(false);
      };

    function deneme(propsDeneme) {

        api.getCompaniesByUserId(propsDeneme.id).then((res) => {
            setClient(res);
            console.log("----RES----", res)
            console.log("----RES----", res.length)
           if(res.length === 0){
            setHomeError(true)
           }else{
            res.map((x) => {
                if (x.state !== "3") {
                    props.enqueueSnackbar(
                      <h4>
                          {t('PLEASEPLEASE')}
                      </h4>,
                      {
                          variant: "warning",
                      }
                    );
                    history.push("/clientapplist");
                }else {
                    if (x.clientTypeEnum == "LIMITED") {
                        api.getCompanyByClientId(x.id).then((response) => {
                            console.log("----lımıted----", response)
                            setCompany((company) => [...company, response.company]);
                            setClient1(response);
                            getLetterTypes(response?.clientTypeEnum.toString())
                            const { addressList } = response;
                            setAddresses(addressList);
                        });
                    } else {
                        api.getClient(x.id).then((resp) => {
                            console.log("----RESP----", resp)
                            setClient1(resp);
                            getLetterTypes(resp?.clientTypeEnum.toString())
                            const { addressList } = resp;
                            setAddresses(addressList);
                            setFounder((founder) => [
                                ...founder,
                                resp.founderOwner.tradeAsName,
                            ]);
                        });
                    }
                }
            });
            setProgress(0)
            setOpen(true);
        }}
        );
        }

    const getCompaniesByClientId = () => {

    }


    const handleSubmit = (e) =>{
        const saveLetter = {
            ...letter,
            letterTemplate: window.btoa(unescape(encodeURIComponent(JSON.stringify(letter.letterTemplate))))
        }

        if(letter?.letterTypeName){
            api.saveLetterType(saveLetter).then((r) => console.log(r));
            props.enqueueSnackbar(<h4>{t("TEMPLATESAVED")}.</h4>, {
                variant: "success",
            });
        } else {
            props.enqueueSnackbar(<h4>{t("TEMPLATENAMESHOULDNOTBLANK")}.</h4>, {
                variant: "error",
            });
        }

    }


    function handleChangeEntry(value, entry) {
        setEntries(entries=>({...entries, [entry]: value}))
        setDisplayNone(true)
    }

    function handleClose2() {
        setOpen2(false)
    }

    function handleFileChange(event) {
            setFile(event.target.files[0]);
    }

    const progressCallback = (loaded: number, total: number) => {
        setProgress(Math.round((loaded / total) * 100))
    };

    function handleChange2(event) {
        event.target.value = null;
        setProgress(0)
    }

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
            open={homeError}
                onClose={()=>{
                    setHomeError(false)
                    setCompany([]);
                }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle>{t("HOMEERROR")} </DialogTitle>
                <DialogContent>{t("HOMEERRORCONTENTLETTER")}</DialogContent>
                <DialogActions>
          <Button onClick={handleCloseHomeError}>{t("CANCEL")}</Button>
        </DialogActions>
            </Dialog>
          
          <Dialog
            fullScreen
            TransitionComponent={Transition}
            open={open}
            onClose={() => {
                setOpen(false);
                setCompany([]);
                setFounder([]);
                setDisplayNone(true)
                setSelectedValue(null)
            }}
          >
              <AppBar className={classes.appBar}>
                  <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            setOpen(false);
                            setFounder([]);
                            setCompany([]);
                            setDisplayNone(true)
                            setSelectedDirector(null)
                        }}
                        aria-label="close"
                      >
                          <CloseIcon />
                      </IconButton>
                      <Typography variant="h6" className={classes.title}>
                          {t("CREATELETTERFORCLIENT")}
                      </Typography>
                  </Toolbar>
              </AppBar>

              <DialogContent dividers>
                  <div className="create__letter-user">
                      <div className="letter__content">
                          <div className="customize__pdf">
                              <div className="customize__item">
                                  <FormControl size={"small"}>
                                      <Div columns={client1?.company?.directorDetails ? 2 : 1}>
                                          <Select
                                              label="İl"
                                              variant="outlined"
                                              defaultValue={"none"}
                                              onChange={(e) => handleChange(e.target.value)}
                                          >
                                              <MenuItem value="none">
                                                  <em>{t("PLEASESELECTCOMPANYFORLETTER")}</em>
                                              </MenuItem>
                                              {company.length > 0 ? (
                                                  company.map((result) => (
                                                      <MenuItem value={result}>{result.name}</MenuItem>
                                                  ))
                                              ) : (
                                                  <MenuItem value={founder}>{founder}</MenuItem>
                                              )}
                                          </Select>

                                          {company.length > 0 && (

                                              <Select
                                                  variant="outlined"
                                                  defaultValue={"none"}
                                                  onChange={(e) => handleChangeDirector(e.target.value)}
                                              >
                                                  <MenuItem value="none">
                                                      <em>{t("PLEASESELECTDIRECTORFORLETTER")}</em>
                                                  </MenuItem>
                                                  {
                                                      company[0].directorDetails?.length > 0 ? (
                                                          company[0].directorDetails.map((result) => (
                                                              <MenuItem value={result.id}>{result.name}</MenuItem>
                                                          ))
                                                      ) : null
                                                  }
                                                  &&
                                                  {
                                                      client1?.customerClients?.length > 0 ? (
                                                          client1?.customerClients?.map((result)=>(
                                                              <MenuItem value={result.customerInfo.user.id}>{result.customerInfo.user.name + " " + result.customerInfo.user.surname + " owner"}</MenuItem>
                                                          ))
                                                      ) : null
                                                  }
                                              </Select>
                                          )}
                                      </Div>
                                  </FormControl>
                              </div>
                              <div className="customize__item">
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
                              <div className="customize__item">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onPreview2}
                                  >
                                      {t("PREVIEWLETTER")}
                                  </Button>
                              </div>

                              <div className="pdf__dialog">
                                  <CustomDialog open={openDialog} handleClickOpen={handleClickOpen} handleClose={handleClose}>
                                      <div className="show__pdf" style={{height:"100%"}}>
                                          <PdfComponent selectedValue={selectedValue} />
                                      </div>
                                  </CustomDialog>
                              </div>

                              <div className="customize__item">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onCreateRequest}
                                    disabled={disabled}
                                    style={displayNone ? {display:"none"} : null}
                                  >
                                      {t("CREATEREQUEST")}
                                  </Button>
                              </div>
                          </div>
                          {/*<div className="visa-form" style={!(letterTypeName?.toString().includes("nvitation")) ? {display:"none"} : null}>*/}
                          {/*    <VisaInvitedForm*/}
                          {/*      invitedForm={invitedForm}*/}
                          {/*      setInvitedForm={setInvitedForm}*/}
                          {/*    />*/}
                          {/*</div>*/}
                          {entries && (
                              <Div columns={2}>
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
                          <div>
                              <Grid direction="row" item xs={12}>
                                  <TextField
                                    id="outlined-basic"
                                    label={t("TEMPLATENAME")}
                                    name="letterTypeName"
                                    variant="outlined"
                                    className="w-2/5 my-10"
                                    value={letter.letterTypeName}
                                    onChange={handleChangeNew}
                                    inputProps={
                                        {readOnly : true}
                                    }
                                  />

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

                              </Grid>
                              <LetterEditComponent
                                  isReadOnly={true}
                                name={"letterTemplate"}
                                value={letter.letterTemplate}
                                handleChange={handleChangeEditor}
                              ></LetterEditComponent>

                              <Snackbar open={open2} autoHideDuration={6000} onClose={()=> handleClose2()}>
                                  <Alert onClose={()=>handleClose2()} severity="error" variant="filled">
                                      {t("MAKESUREFILLORSELECT")}
                                  </Alert>
                              </Snackbar>
                          </div>
                      </div>

                  </div>
              </DialogContent>
          </Dialog>
      </div>
    );
}

export default withSnackbar(CreateLetterUsers);
