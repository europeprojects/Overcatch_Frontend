import React, {useEffect, useState} from 'react';
import {Node} from "slate";
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import {makeStyles, ThemeProvider, useTheme} from "@material-ui/core/styles";
import api from "../../services/BackendApi";
import {BankType, Client, ClientDTO, LetterType, NoticeLogDTO, Reminder, ReminderType} from "../../types/UserModel";
import {
    Button, Card, CardContent,
    FormControlLabel,
    Grid,
    Icon, MenuItem,
    Paper, Table, TableBody, TableCell,
    TableContainer,
    TablePagination, TableRow,
    TextField
} from "@material-ui/core";
import {withSnackbar} from 'notistack';
import {useTranslation} from "react-i18next";
import history from '@history';
import ReminderTypeSelector from "./ReminderTypeSelector";
import ReminderEditComponent from "./ReminderEditComponent";
import Typography from "@material-ui/core/Typography";

import FuseAnimate from '@fuse/core/FuseAnimate';
import DateRangeIcon from '@material-ui/icons/DateRange';
import {PageContainer, PageMain} from "./notifCreate";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import {Div} from "../../components/Grid";
import TimerTwoToneIcon from '@material-ui/icons/TimerTwoTone';
import { useSelector } from 'react-redux';

import {Bar, Line} from 'react-chartjs-2'

import Textfield from "@material-ui/core/TextField";
import SaveIcon from '@material-ui/icons/Save';
import ReceiptIcon from '@material-ui/icons/Receipt';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import {Form, useFormik} from "formik";
import {reminderCreateSettingsScheme} from "../validations/ValidationSchemes";
import moment from 'moment';
import SelectFormsy from "../../../@fuse/core/formsy/SelectFormsy";
import Formsy from "formsy-react";
import axios from "axios";
import {selectMainTheme} from "../../store/fuse/settingsSlice";
import i18n from "i18next";
import IconButton from "@material-ui/core/IconButton";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import _ from "../../../@lodash";
import ReminderLimitedTable from './reminderLimitedTable'
import ReminderVATLimited from './ReminderVATLimited'

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
    paper: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: '#172a3a',
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"},
    button: {
        margin: theme.spacing(1),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
}));



function ReminderTemplate(props: any) {


    //const classes = useStyles(props);
    const [clientTypes, setClientTypes] = useState([]);
    const [aggTypes, setAggTypes] = useState([]);
    const [isVats, setIsVats] = useState(null);
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [selectedMail, setSelectedMail] = useState<ClientDTO[]>([]);
    const [selected, setSelected] = useState<ClientDTO[]>([]);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);

    const mainTheme = useSelector(selectMainTheme);
    const [search, setSearch] = useState<string>("");  // Başlangıç değerleri ""
    //const [disabled, setDisabled] = useState<boolean>(true);
    const [checkedButton, setCheckedButton] = useState<boolean>(false);

    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });

   // const {t1} = useTranslation('task');
    const theme = useTheme();
    const [render, setRender] = useState<Node[]>();
    const [edit, setEdit] = useState<Node[]>();
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [addresses, setAddresses] = useState([])
    const classes = useStyles(props);

    const [value, setValue] = useState(SampleInitialValue);
    const [value2, setValue2] = useState("");
    const [selectedValue, setSelectedValue] = useState();
    const [templateName, setTemplateName] = useState<string>();
    const [reminderValue, setReminderValue] = useState<number>(0);
    const [reminderId, setReminderId] = useState<number>(null);

    const [selectedReminderTypeName, setSelectedReminderTypeName] = useState<ReminderType[]>();
    const [reminderClientType,setReminderClientType]=useState<ReminderType>({
        reminderTypeName: '',
        reminderTemplate: '',
        reminderClientType:'',
        createdDateTime:'',
        isActive:0,
    } as ReminderType );

    const [firstDate,setFirstDate]=useState<string>("");
    const [secondDate,setSecondDate]=useState<string>("");
    const [thirdDate,setThirdDate]=useState<string>("");
    const [fourthDate,setFourthDate]=useState<string>("");
    const [resetDate,setResetDate]=useState<string>("");

    const [reminder, setReminder] = useState<Reminder>({} as Reminder);
    const [client, setClient] = useState<Client>({} as Client);

    const {t} = useTranslation('letter');
    const [checked, setChecked] = useState(false);
    const [expanded, setExpanded] = React.useState("panel1");
    const [expandedSecond, setExpandedSecond] = React.useState("panel1");
    const [isEditable, setIsEditable] = useState(false);
    const [disabled, setDisabled] = useState<boolean>(true);
    //const widgets = useSelector(selectWidgetsEntities);

    const [chartData, setChartData]  = useState({});
    const [clientList, setClientList] = useState<Client[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [totalElements, setTotalElements] = React.useState(0);
    const [aggrementType, setAggrementType] = React.useState([])
    const [clientType, setClientType] = React.useState([])
    const [state, setState] = React.useState('')
    const [exist, setExist] = React.useState('')


    useEffect(() => {
        //Reminder - Tablosunda bulunan Tarih ve Template ID getirdiği API
        api.getReminder().then( data => {
            setReminder(data);
            Chart();
            DateCheck(data);
        })
        // Reminder - Template Tablosunda bulunan şablonları getiren API
        api.getReminderTypes().then( reminderTemplates =>{
            setSelectedReminderTypeName(reminderTemplates);
        })

        //api silindi commit


    }, [])

    function DateCheck(date) {
        setFirstDate(formatDate(date?.reminderFirstDate));
        setSecondDate(formatDate(date?.reminderSecondDate));
        setThirdDate(formatDate(date?.reminderThirdDate));
        setFourthDate(formatDate(date?.reminderFourthDate));
        setResetDate(formatDate(date?.reminderResetDate));
    }

    function getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage){
        api.getApplyCompaniesByFilter(aggrementType, clientType,exist , state, search).then(response => {
            setClientList(response);
            setClients(response);
            setTotalElements(response.totalElements);
        });
    }
    function handleChangePage(page) {
        getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage);
    }

    const Chart = () => {
        let reminderDates = [];
        api.getReminder()
            .then(res => {
                api.getClientReminderCount( res?.reminderFirstDate?.toString() ,
                    res?.reminderSecondDate?.toString(),
                    res?.reminderThirdDate?.toString(),
                    res?.reminderFourthDate?.toString()
                ).then( reminderCounterValues =>{
                    reminderDates.push(res?.reminderFirstDate?.[2].toString() +"/"+ res?.reminderFirstDate?.[1].toString() +"/"+ res?.reminderFirstDate?.[0].toString());
                    reminderDates.push(res?.reminderSecondDate?.[2].toString() +"/"+ res?.reminderSecondDate?.[1].toString() +"/"+ res?.reminderSecondDate?.[0].toString());
                    reminderDates.push(res?.reminderThirdDate?.[2].toString() +"/"+ res?.reminderThirdDate?.[1].toString() +"/"+ res?.reminderThirdDate?.[0].toString());
                    reminderDates.push(res?.reminderFourthDate?.[2].toString() +"/"+ res?.reminderFourthDate?.[1].toString() +"/"+ res?.reminderFourthDate?.[0].toString());
                    reminderDates.push(res?.reminderResetDate?.[2].toString() +"/"+ res?.reminderResetDate?.[1].toString() +"/"+ res?.reminderResetDate?.[0].toString());
                    setChartData({
                        labels: reminderDates,
                        datasets: [{
                            label: t('REMINDER'),
                            data: reminderCounterValues,
                            backgroundColor: [ '#1A5276','#1A5276', '#1A5276', '#1A5276','#1A5276'],
                            borderColor: [ '#AED6F1', '#AED6F1', '#AED6F1','#AED6F1', '#AED6F1'],
                            hoverBackgroundColor: ['#172a3a', '#172a3a', '#172a3a', '#172a3a','#172a3a'],
                            borderWidth: 5,
                            borderRadius:5,
                            borderSkipped:true,
                        }]
                    })
                })
            })
            .catch(err =>{
                console.log(err);
            })
    }

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
                        const {addressList} = response;
                        setAddresses(addressList)
                    })
                }
            }
        })
    }, [])

    function saveReminderType() {
        if (templateName==null){
            props.enqueueSnackbar(<h4>{t("PLEASECREATETEMPLATENAME")}</h4>, {
                variant: 'error',
            })
        }
        else {
            let x= "";
            value.forEach(a => {
                a.children.forEach(b=>{
                    x = x + b.text;
                })})
            let reminderType: ReminderType = {
                reminderTemplate: window.btoa(unescape(encodeURIComponent(JSON.stringify(x)))),
                reminderTypeName: templateName,
                reminderClientType:'',
                createdDateTime:null,
                isActive: 1,
                id: null
            };
            api.saveReminderType(reminderType).then(() => console.log(reminderType))
            console.log(reminderType)
            props.enqueueSnackbar(<h4>{t("TEMPLATESAVED")}</h4>, {
                variant: 'success',
            })
            history.go(0);
        }
    }

    function updateReminderType(reminderId: any) {
        if (templateName==null){
            props.enqueueSnackbar(<h4>{t("PLEASECREATETEMPLATENAME")}</h4>, {
                variant: 'error',
            })
        }
        else {
            let x= "";
            value.forEach(a => {
                a.children.forEach(b=>{
                    x = x + b.text;
                })})
            let reminderType: ReminderType = {
                reminderTemplate: window.btoa(unescape(encodeURIComponent(JSON.stringify(x)))),
                reminderTypeName: templateName,
                reminderClientType:'',
                createdDateTime:null,
                isActive:0,
                id: reminderId,
            };
            api.saveReminderType(reminderType).then(() => console.log(reminderType))
            console.log(reminderType)
            props.enqueueSnackbar(<h4>{t("TEMPLATEUPDATED")}</h4>, {
                variant: 'success',
            })
            history.go(0);
        }
    }

    const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked){
            setChecked(true)
            setReminderClientType({... reminderClientType,[event.target.name]:event.target.value})
        }
        else {
            setChecked(false)
        }
        handleClick("panel2");
    };

    const handleChangeCheckVat = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked){
            setChecked(true)
            setReminderClientType({... reminderClientType,[event.target.name]:event.target.value})
        }
        else {
            setChecked(false)
        }
        handleClick("panel4");
    };

    const handleChangeCheckNotVat = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked){
            setChecked(true)
            setReminderClientType({... reminderClientType,[event.target.name]:event.target.value})
        }
        else {
            setChecked(false)
        }
        handleClick("panel3");
    };







    const handleChangeCheckBoxSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked){
            setChecked(true)
            setReminderClientType({... reminderClientType,[event.target.name]:event.target.value})
        }
        else {
            setChecked(false)
        }
        //LIMITED için ayrı bir CSS yazılacak !
        handleClickAcordion2("panel3");
    };



    function handleClick (panel)  {
        if (expanded == panel){
            setExpanded("");
        }
        else{
            setExpanded(panel);
        }
    };

    function handleClickAcordion(panel){
        if (expanded == panel){
            setExpanded("");
        }
        else{
            setExpanded(panel);
        }
    }

    function handleClickSecondAcordion(panel){
        if (expandedSecond == panel){
            setExpandedSecond("");
        }
        else{
            setExpandedSecond(panel);
        }
    }
    function handleClickAcordion2(panel){
        if (expanded == panel){
            setExpanded("");
        }
        else{
            setExpanded(panel);
        }
    }

    function handleClickAcordion3(panel){
        if (expanded == panel){
            setExpanded("");
        }
        else{
            setExpanded(panel);
        }
    }




    function handleSubmit() {
        setIsEditable(() => isEditable === true ? false : true)
        //iseditable false ise edit yapacak
        //iseditable true ise save kayıt

        if (isEditable){
            var dizi = []
            dizi.push(firstDate)
            dizi.push(secondDate)
            dizi.push(thirdDate)
            dizi.push(fourthDate)
            dizi.push(resetDate)

            var ayniVar = false
            for (var i=0; i<dizi.length; i++){
                for (var y=i+1; y<dizi.length; y++){
                    if (dizi[i] == dizi[y]){
                        ayniVar = true
                        props.enqueueSnackbar(<h5>{t('REMINDERTEMPLATEDATE')}</h5>, {
                            variant: 'error',
                        })
                        return
                        break
                    }
                }
                if (ayniVar)
                    break
            }
            if (!ayniVar){
                api.saveReminder(reminder).then( data => {
                    console.log('Reminder Data :',data);
                    props.enqueueSnackbar(<h5>{t("REMINDERDATEUPDATE")}</h5>, {
                        variant: 'warning',
                    })
                    const timeout = setTimeout(() => {
                        history.push("/ReminderList")
                    }, 3000);
                })
            }

        }
        /*
        // Birinci Hatırlatma Tarihi 2-3-4 Ve Sıfırlama Tarih Değerleri ile aynı parametrelere sahip olmamalı !!!
        if( (reminder?.reminderFirstDate?.toString() === secondDate) || (reminder?.reminderFirstDate?.toString() === thirdDate) || (reminder?.reminderFirstDate?.toString() === fourthDate) || (reminder?.reminderFirstDate?.toString() === resetDate)){
            props.enqueueSnackbar(<h5>{t('REMINDERTEMPLATEDATE')}</h5>, {
                variant: 'error',
            })
            const timeout = setTimeout(() => {
                window.location.reload(false)
            }, 3000);
        }
        // İkinci Hatırlatma Tarihi 1-3-4 Ve Sıfırlama Tarih Değerleri ile aynı parametrelere sahip olmamalı !!!
        else if( (reminder?.reminderSecondDate?.toString() === firstDate) || (reminder?.reminderSecondDate?.toString() === thirdDate) || (reminder?.reminderSecondDate?.toString() === fourthDate) || (reminder?.reminderSecondDate?.toString() === resetDate)){
            props.enqueueSnackbar(<h5>{t('REMINDERTEMPLATEDATE')}</h5>, {
                variant: 'error',
            })
            const timeout = setTimeout(() => {
                window.location.reload(false)
            }, 3000);
        }
        // Üçüncü Hatırlatma Tarihi 1-2-4 Ve Sıfırlama Tarihi ile aynı parametreye sahip olmamalı !!!
        else if( (reminder?.reminderThirdDate?.toString() === firstDate) ||(reminder?.reminderThirdDate?.toString() === secondDate) || (reminder?.reminderThirdDate?.toString() === fourthDate) || (reminder?.reminderThirdDate?.toString() === resetDate)){
            props.enqueueSnackbar(<h5>{t('REMINDERTEMPLATEDATE')}</h5>, {
                variant: 'error',
            })
            const timeout = setTimeout(() => {
                window.location.reload(false)
            }, 3000);
        }
        // Dördüncü Hatırlatma Tarihi 1-2-3 Ve Sıfırlama Tarihi ile aynı parametreye sahip olmamalı !!!
        else if( (reminder?.reminderFourthDate?.toString() === firstDate) ||(reminder?.reminderFourthDate?.toString() === secondDate) || (reminder?.reminderFourthDate?.toString() === thirdDate) || (reminder?.reminderFourthDate?.toString() === resetDate)){
            props.enqueueSnackbar(<h5>{t('REMINDERTEMPLATEDATE')}</h5>, {
                variant: 'error',
            })
            const timeout = setTimeout(() => {
                window.location.reload(false)
            }, 3000);
        }
        // Sıfırlama Hatırlatma Tarihi 1-2-3-4 Tarihleri ile aynı parametreye sahip olmamalı !!!
        else if( (reminder?.reminderResetDate?.toString() === firstDate) ||(reminder?.reminderResetDate?.toString() === secondDate) || (reminder?.reminderResetDate?.toString() === thirdDate) || (reminder?.reminderResetDate?.toString() === fourthDate)){
            props.enqueueSnackbar(<h5>{t('REMINDERTEMPLATEDATE')}</h5>, {
                variant: 'error',
            })
            const timeout = setTimeout(() => {
                window.location.reload(false)
            }, 3000);
        }
        else {
            if (isEditable === true) {
                console.log('Reminder Date Değişiklik kısmı :',reminder);
                //Tarih Formatında bir değişiklik yaptığında DB ' ye kayıt atan api
                api.saveReminder(reminder).then( data => {
                    console.log('Reminder Data :',data);
                    props.enqueueSnackbar(<h5>{t("REMINDERDATEUPDATE")}</h5>, {
                        variant: 'warning',
                    })
                    const timeout = setTimeout(() => {
                        history.push("/ReminderList")
                    }, 3000);
                })
            }
        }
         */
    }

    function handleReminder(event) {
        setReminder({...reminder, [event.target.name]: event.target.value})
    }

    function handleReminderTemplate(event) {
        setReminder({...reminder, [event.target.name]: event.target?.value})
    }

    //Tarihi YYY-MM-DD şeklinde formatlayan metot .
    function formatDate(date) {
        var newdate;
        if (date) {
            let d = new Date(date)
            let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
            let mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
            let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
            newdate = `${ye}-${mo}-${da}`
        } else
            newdate = null
        if (newdate?.split("-")[0].length < 4)
            newdate = null
        else if (newdate?.split("-")[0].length > 4)
            newdate = newdate?.split("-")[0].substring(0, 4)
        return newdate
    }

    //Bugünün tarihini alan metot
    function MyFunction() {
        var myCurrentDate = new Date();
        var date = myCurrentDate.getFullYear() + '-' + (myCurrentDate.getMonth() + 1) + '-' + myCurrentDate.getDate();
        return date;
    }

    const formik = useFormik({
        initialValues: {
            subject:'',
            content:'',
            reminderClientType:''
        },
        validationSchema: reminderCreateSettingsScheme,
        onSubmit: (values) => {
            saveReminderTemplate(values);
        },
    });

    const saveReminderTemplate = (values) => {
        setDisabled(true);
        let reminderType: ReminderType = {
            reminderTemplate:formik?.values?.content,
            reminderTypeName: formik?.values?.subject,
            reminderClientType:reminderClientType?.reminderClientType,
            createdDateTime: null,
            isActive: 1,
            id: null
        };

        if(reminderType?.reminderClientType === '' || reminderType?.reminderClientType === null){
            props.enqueueSnackbar(<h5>{t('TEMPLATESAVEDTYPE')}</h5>, {
                variant: 'error',
            })
            const timeout = setTimeout(() => {
                window.location.reload(false)
            }, 3000);
        }
        else{
            api.saveReminderType(reminderType).then(responsive =>{
                props.enqueueSnackbar(<h5>{t("TEMPLATESAVED")}</h5>, {
                    variant: 'info',
                })
                const timeout = setTimeout(() => {
                    history.push("/ReminderList")
                }, 3000);
            })
        }
    };





    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <div className="flex flex-1 items-center justify-left px-12">
                    <div className="flex items-center">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <DateRangeIcon></DateRangeIcon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t('REMINDERTEMPLATE')}
                            </Typography>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={
                <PageContainer>
                    <PageMain>
                        <PageContainer>
                            <Paper className={classes.paper}>

                                <Card className="w-full rounded-8 shadow-1 mb-24">
                                    <Typography className="relative h-600 sm:h-720 sm:pb-16">
                                        <Bar
                                            data={chartData}
                                            options={{
                                                responsive:true,
                                                title: { text: t('SOLETRADER'), display: true },
                                                legend: {
                                                    display: true,
                                                    position: 'bottom',
                                                    labels: {
                                                        padding: 16,
                                                        usePointStyle: true
                                                    }
                                                },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            gridLines: {
                                                                display: true,
                                                                ticks: {
                                                                    min: 0
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    yAxes: [
                                                        {
                                                            display: true,
                                                            ticks: {
                                                                min: 0,
                                                            }
                                                        }
                                                    ]
                                                },
                                                cutoutPercentage: 70,
                                                spanGaps: true,
                                            }}
                                        />
                                    </Typography>
                                </Card>

                                <Grid item container
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="flex-start"
                                      spacing={3}>

                                    <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <div style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                <label>{t('CLIENTTYPE')}</label>
                                            </div>
                                            <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                <div style={{textAlign:"left", padding:"8px"}}>

                                                    <RadioGroup>
                                                        <FormControlLabel
                                                            control={
                                                                <Radio
                                                                    icon={<CheckBoxOutlineBlankIcon/>}
                                                                    checkedIcon={<CheckBoxIcon/>}
                                                                    onChange={handleChangeCheckBox}
                                                                    value='SOLETRADER'
                                                                    name='reminderClientType'
                                                                    style={{ color : '#172a3a'}}
                                                                />
                                                            }
                                                            label={t('SOLETRADER')}
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Radio
                                                                    icon={<CheckBoxOutlineBlankIcon/>}
                                                                    checkedIcon={<CheckBoxIcon/>}
                                                                    onChange={handleChangeCheckBoxSecond}

                                                                    value='LIMITED'
                                                                    name="reminderClientType"
                                                                    style={{ color : '#172a3a'}}
                                                                />
                                                            }
                                                            label={t('LIMITED')}
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Radio
                                                                    icon={<CheckBoxOutlineBlankIcon/>}
                                                                    checkedIcon={<CheckBoxIcon/>}
                                                                    onChange={handleChangeCheckBoxSecond}  //bunu VAT'e uygula
                                                                    value='SELFASSESMENT'
                                                                    name="reminderClientType"
                                                                    style={{ color : '#172a3a'}}
                                                                    disabled={true}
                                                                />
                                                            }
                                                            label={t('SELFASSESMENTNOTI')}
                                                        />
                                                    </RadioGroup>
                                                </div>
                                            </Paper>
                                        </Grid>
                                    </FuseAnimate>

                                    <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <div  style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                <label>{t('AGREEMENTTYPE')}</label>
                                            </div>

                                            <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                <div style={{textAlign:"left", padding:"8px"}}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon/>}
                                                                checkedIcon={<CheckBoxIcon/>}
                                                                //onChange={handleChange4}
                                                                name="TRADING"
                                                                style={{ color : '#172a3a'}}
                                                                checked={checked}
                                                                disabled={true}
                                                            />
                                                        }
                                                        label={t('TRADING')}
                                                    /><br/>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon/>}
                                                                checkedIcon={<CheckBoxIcon/>}
                                                                //onChange={handleChange4}
                                                                name="ECAA"
                                                                style={{ color : '#172a3a'}}
                                                                checked={checked}
                                                                disabled={true}
                                                            />}
                                                        label={t("ECAA")}
                                                    /><br/>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                icon={<CheckBoxOutlineBlankIcon/>}
                                                                checkedIcon={<CheckBoxIcon/>}
                                                                //bunu VAT'e uygula
                                                                name="OTHER"
                                                                style={{ color : '#172a3a'}}
                                                                checked={checked}
                                                                disabled={true}
                                                            />}
                                                        label={t("OTHERNOTI")}
                                                    />
                                                </div>
                                            </Paper>
                                        </Grid>
                                    </FuseAnimate>

                                    <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <div  style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                <label >{t('VAT')}</label>
                                            </div>

                                            <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                <div style={{textAlign:"left", padding:"8px"}}>

                                                    <RadioGroup aria-label="gender" name="gender1"
                                                        //value={valueRadio}
                                                        //onChange={handleChange}
                                                    >
                                                        <FormControlLabel
                                                            value={"VAT"}
                                                            //handleChangeCheckBoxVAT
                                                            //disabled={false}
                                                            control={
                                                                <Radio style={{ color : '#172a3a'}}
                                                                    //onChange={handleChange7}
                                                                       onChange={handleChangeCheckVat}
                                                                />
                                                            }
                                                            label={t("VAT")} />
                                                        <FormControlLabel
                                                            value={"NOTVAT"}

                                                            //disabled={true}
                                                            control={<Radio style={{ color : '#172a3a'}}
                                                                            //checked={checked}

                                                                            onChange={handleChangeCheckNotVat}



                                                            />
                                                            }
                                                            label={t("NOTVAT")} />
                                                        <FormControlLabel
                                                            value="ALL"
                                                          disabled={true}
                                                            control={
                                                                <Radio style={{ color : '#172a3a'}}
                                                                    //onChange={handleChange7}

                                                                />
                                                            }
                                                            label={t("ALL")} />
                                                    </RadioGroup>
                                                </div>
                                            </Paper>
                                        </Grid>
                                    </FuseAnimate>

                                </Grid>

                                <Accordion
                                    className="w-full rounded-8 shadow-1 mb-24"
                                    expanded={expanded === 'panel2'}
                                    onChange={() => {handleClickAcordion('panel2')}}
                                    style={{marginTop:'50px'}}
                                >

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography style ={{ fontWeight:'bold' }}>{t('SOLETRADERREMINDERDATELIST')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ width: '100%' , textAlign:"center" }}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Div columns={6}>
                                                        <TextField
                                                            className={"flex w-full my-16"}
                                                            variant="outlined"
                                                            name={"helpType"}
                                                            id="demo-simple-select-outlined"
                                                            label={t('REMINDERTYPE')}
                                                            disabled={true}
                                                            value={reminder?.reminderType?.reminderTypeName}
                                                        >
                                                        </TextField>

                                                        <TextField
                                                            onChange={(e) => {
                                                                handleReminder(e)
                                                                setFirstDate(e.target.value)
                                                            }}
                                                            type="date"
                                                            name="reminderFirstDate"
                                                            disabled={isEditable === true ? false : true}
                                                            value={formatDate(reminder?.reminderFirstDate)}
                                                            id="date"
                                                            label={t("REMINDERDATE1")}
                                                            className="my-16"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                max: '3000-01-01',
                                                                min:'1000-01-01'
                                                            }}
                                                            variant="outlined"/>
                                                        <TextField
                                                            onChange={(e) => {
                                                                handleReminder(e)
                                                                setSecondDate(e.target.value)
                                                            }}
                                                            type="date"
                                                            name="reminderSecondDate"
                                                            disabled={isEditable === true ? false : true}
                                                            value={formatDate(reminder?.reminderSecondDate)}
                                                            id="date"
                                                            label={t("REMINDERDATE2")}
                                                            className="my-16"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                max: '3000-01-01',
                                                                min:firstDate
                                                                //min: reminder?.reminderFirstDate?.toString()
                                                            }}

                                                            variant="outlined"/>
                                                        <TextField
                                                            onChange={(e) => {
                                                                handleReminder(e)
                                                                setThirdDate(e.target.value)
                                                            }}
                                                            type="date"
                                                            name="reminderThirdDate"
                                                            disabled={isEditable === true ? false : true}
                                                            value={formatDate(reminder?.reminderThirdDate)}
                                                            id="date"
                                                            label={t("REMINDERDATE3")}
                                                            className="my-16"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                max: '3000-01-01',
                                                                min:secondDate
                                                                //min: reminder?.reminderSecondDate?.toString()
                                                            }}
                                                            variant="outlined"/>
                                                        <TextField
                                                            onChange={(e) => {
                                                                handleReminder(e)
                                                                setFourthDate(e.target.value)
                                                            }}
                                                            type="date"
                                                            name="reminderFourthDate"
                                                            disabled={isEditable === true ? false : true}
                                                            value={formatDate(reminder?.reminderFourthDate)}
                                                            id="date"
                                                            label={t("REMINDERDATE4")}
                                                            className="my-16"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                max: '3000-01-01',
                                                                //min:'1000-01-01'
                                                                min: thirdDate
                                                            }}
                                                            variant="outlined"/>
                                                        <TextField
                                                            onChange={(e) => {
                                                                handleReminder(e)
                                                                setResetDate(e.target.value)
                                                            }}
                                                            type="date"
                                                            name="reminderResetDate"
                                                            disabled={isEditable === true ? false : true}
                                                            value={formatDate(reminder?.reminderResetDate)}
                                                            id="date"
                                                            label={t("REMINDERRESETDATE")}
                                                            className="my-16"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                max: '3000-01-01',
                                                                min: fourthDate
                                                            }}
                                                            variant="outlined"/>
                                                    </Div>

                                                    <Div fullWidth>
                                                        <div className="table w-full ...">
                                                            <div className="table-row-group">
                                                                <div className="table-row">
                                                                    <div className="table w-full t-8">
                                                                        <TextField
                                                                            select={true}
                                                                            className={"flex w-full my-16"}
                                                                            variant="outlined"
                                                                            name={"reminderType"}
                                                                            id="demo-simple-select-outlined"
                                                                            label={t('REMINDERTYPESELECT')}
                                                                            disabled={isEditable === true ? false : true}
                                                                            onClick={(e) => handleReminderTemplate(e)}
                                                                        >
                                                                            {selectedReminderTypeName?.map(template =>
                                                                                <MenuItem
                                                                                    //@ts-ignore
                                                                                    value={template}>{template?.reminderTypeName}
                                                                                </MenuItem>)
                                                                            }
                                                                        </TextField>
                                                                    </div>

                                                                    <div className="table-cell t-16" style={{textAlign:"right"}}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            size="medium"
                                                                            className={classes.button}
                                                                            onClick={() => handleSubmit()}
                                                                            startIcon={<TimerTwoToneIcon />}
                                                                        >
                                                                            {isEditable === false ? t("EDIT") : t("SAVE")}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    className="w-full rounded-8 shadow-1 mb-24"
                                    expanded={expanded === 'panel3'}
                                    onChange={() => {handleClickAcordion2('panel3')}}
                                    style={{marginTop:'50px'}}
                                >

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography style ={{ fontWeight:'bold' }}>{t('LIMITEDREMINDERDATELIST')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <ReminderLimitedTable/>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    className="w-full rounded-8 shadow-1 mb-24"
                                    expanded={expanded === 'panel4'}
                                    onChange={() => {handleClickAcordion3('panel4')}}
                                    style={{marginTop:'50px'}}
                                >

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography style ={{ fontWeight:'bold' }}>{('Limited VAT Reminder List')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ReminderVATLimited/>
                                    </AccordionDetails>
                                </Accordion>



                                {/*Reminder-Template Save Acordion Menu */}
                                <Card  className="w-full rounded-8 shadow-1 mt-12">
                                    <Accordion
                                        expanded={expandedSecond === 'panel1'} onChange={() => {handleClickSecondAcordion('panel1')}}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >

                                            <div className="table w-full ...">
                                                <div className="table-row-group">
                                                    <div className="table-row">
                                                        <div className="table-row">
                                                            <Typography style ={{ fontWeight:'bold' }}>{t('REMINDERTEMPLATESAVE')}</Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </AccordionSummary><br/>
                                        <AccordionDetails>
                                            <Grid item xs={12} sm={12} lg={12}>
                                                <form
                                                    onSubmit={formik.handleSubmit}
                                                >
                                                    <Textfield
                                                        label={t("SUBJECT")}
                                                        placeholder={t("REMİNDERSUBJECT")}
                                                        style={{width:"100%"}}
                                                        variant={"outlined"}
                                                        multiline
                                                        rows={1}
                                                        inputProps={{
                                                            maxlength: 50
                                                        }}
                                                        id="subject"
                                                        name={"subject"}
                                                        disabled={disabled}
                                                        value={formik.values.subject}
                                                        error={formik.touched.subject && Boolean(formik.errors.subject)}
                                                        helperText={formik.touched.subject && formik.errors.subject || `${formik.values.subject.length} / 50`}
                                                        onChange={formik.handleChange}
                                                    >
                                                    </Textfield><br/><br/>

                                                    <Textfield
                                                        label={t("CONTENT")}
                                                        placeholder={t("REMİNDERCONTENT")}
                                                        style={{width:"100%"}}
                                                        variant={"outlined"}
                                                        multiline
                                                        rows={4}
                                                        inputProps={{
                                                            maxlength: 250
                                                        }}
                                                        id="content"
                                                        name={"content"}
                                                        disabled={disabled}
                                                        value={formik.values.content}
                                                        error={formik.touched.content && Boolean(formik.errors.content)}
                                                        helperText={formik.touched.content && formik.errors.content || `${formik.values.content.length} / 250`}
                                                        onChange={formik.handleChange}
                                                    >
                                                    </Textfield>

                                                    <div style={{textAlign:"right"}}>
                                                        <Button
                                                            variant="outlined"
                                                            color="default"
                                                            className="w-full mx-auto mt-8 normal-case  inline-flex rounded-8"
                                                            onClick={() => setDisabled(false)}
                                                            //style={{left:'120px'}}
                                                        >
                                                            <EditSharpIcon color={'error'} className={'animate-pulse'}></EditSharpIcon>
                                                        </Button>
                                                    </div>

                                                    <div style={{textAlign:"center"}}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            className="w-1/4 mx-auto mt-8 normal-case rounded-8"
                                                            value="legacy"
                                                            type={"submit"}
                                                            disabled={disabled}
                                                        >
                                                            <SaveIcon color={'primary'}></SaveIcon>
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </Card>

                            </Paper>
                        </PageContainer>
                    </PageMain>
                </PageContainer>
            }
        />
    );
}
const SampleInitialValue = [{
    "type": "paragraph",
    "children": [{"text": "This is editable rich text, "}, {
        "text": "much",
        "italic": true
    }, {"text": " better than a "}, {"text": "<textarea>", "code": true}, {"text": "!"}]
}, {
    "type": "paragraph",
    "children": [{"text": "Since it's rich text, you can do things like turn a selection of text "}, {
        "text": "bold",
        "bold": true
    }, {"text": ", or add a semantically rendered block quote in the middle of the page, like this:"}]
}, {"type": "paragraph", "children": [{"text": "Try it out for yourself!"}]}]

export default withSnackbar(ReminderTemplate);
//export default withReducer('analyticsDashboardApp', reducer)(ReminderTemplate);
