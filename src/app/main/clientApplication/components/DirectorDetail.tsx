// import React, {useEffect, useMemo, useState} from "react";
import {
    Card, CardContent,
    createStyles,
    makeStyles, MenuItem, Select,
    TextField,
    TextFieldProps,
    Theme, Typography
} from "@material-ui/core";
import {useEffect, useMemo, useRef, useState} from "react";
import React from 'react';
import {
    DirectorDetail,
} from "../../../types/UserModel";
import Button from "@material-ui/core/Button";
import Formsy from "formsy-react";
import { SelectFormsy, TextFieldFormsy} from "../../../../@fuse/core/formsy";
import {Div} from "../../../components/Grid";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {
    directorDetailSheme,
} from "../../validations/ValidationSchemes";


export type DirectorDetailFormProps = {
    onInput: (form: DirectorDetail) => void
    handleBack: any
    handleNext:any
    formDetail: DirectorDetail
    setFormDetail:any
    directors:any
}
const useStyles2 = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
export default function DirectorDetailForm({onInput,directors,handleBack,handleNext,setFormDetail,formDetail}: DirectorDetailFormProps) {
    const formState = useState<DirectorDetail>(formDetail);
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const classes = useStyles2();
    const {t} = useTranslation('application');
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 200,
            },
        }),
    );
    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            dob: '',
            sex: '',
            nino: '',
            utr: '',
            maritalStatus:'',
            visaType:'',
            nextOfKinName:'',
            nextOfKinNumber:'',
            nextOfKinEmail:'',
            nextOfKinAddress:'',
            spouseName:'',
            director:'',
            owner:'',
            taxReturn:''
        },
        validationSchema: directorDetailSheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSubmit(values)
        },
    });

    useEffect(() => {
        formik.values.name = formDetail.name
        formik.values.surname = formDetail.surname
        formik.values.email = formDetail.email
        formik.values.phoneNumber = formDetail.phoneNumber
        formik.values.dob = formDetail.dob
        formik.values.sex = formDetail.sex
        formik.values.nino = formDetail.nino
        formik.values.spouseName = formDetail.spouseName
        formik.values.visaType = formDetail.visaType
        formik.values.nextOfKinAddress = formDetail.nextOfKinAddress
        formik.values.nextOfKinNumber = formDetail.nextOfKinNumber
        formik.values.nextOfKinEmail = formDetail.nextOfKinEmail
        formik.values.nextOfKinName = formDetail.nextOfKinName
        formik.values.utr = formDetail.utr
        formik.values.director=formDetail.director
        formik.values.owner=formDetail.owner
        formik.values.taxReturn=formDetail.taxReturn

    }, [])
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const [form] = formState;
    // useEffect(() => {
    //
    //     console.log(formDetail)
    //
    // }, []);

    //String Validation
useEffect(()=>{
    console.log(formDetail)
},[setFormDetail])
    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }

    //Number Validation
    const onNumberClick = (e: any) => {
        e.target.value = e.target.value.replace(/[a-zA-Z]/g, '');
    }
    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }
    function handleSubmitChange(model:DirectorDetail) {
        setFormDetail(model)
    }
    function handleSubmit(model:DirectorDetail) {

        model.name = formik.values.name
        model.surname = formik.values.surname
        model.email = formik.values.email
        model.phoneNumber = formik.values.phoneNumber
        model.dob = formik.values.dob
        model.sex = formik.values.sex
        model.nino = formik.values.nino
        model.maritalStatus = formik.values.maritalStatus
        model.spouseName = formik.values.spouseName
        model.visaType = formik.values.visaType
        model.nextOfKinAddress = formik.values.nextOfKinAddress
        model.nextOfKinNumber = formik.values.nextOfKinNumber
        model.nextOfKinEmail = formik.values.nextOfKinEmail
        model.nextOfKinName = formik.values.nextOfKinName
        model.director=formik.values.director
        model.owner=formik.values.owner
        model.utr = formik.values.utr
            if(model.sex=="true"){
                model.initial="Mr."
            }else if(model.sex =="false" && model.maritalStatus=="true"){
                model.initial="Mrs.";
            }else if(model.sex=="false"){
                model.initial="Miss."
            }
            onInput(model)
            setFormDetail({} as DirectorDetail)
    }
    function handle() {
        if (directors.length !== 0 ){
        handleNext()}
        else{
            alert(t("ADDDIRECTOR"))
        }
    }




    useEffect(() => {
        console.log(formik)
    }, [formik]);
    return(
        <Div gap={2}>
            <Formsy
                onValidSubmit={formik.handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                onChange={formik.handleChange}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >
                <Div columns={2}>
                    <TextField
                        className="my-16"
                        id="mui-theme-provider-outlined-input"
                        label={t("FORENAME")}
                        name="name"
                        value={formik.values.name}
                        onChange = {formik.handleChange}
                        error = {formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        // formState={formState}
                        variant="outlined"
                    />
                    <TextField
                        className="my-16"
                        id="mui-theme-provider-outlined-input"
                        label={t("LASTNAME")}
                        name="surname"
                        value={formik.values.surname}
                        onChange = {formik.handleChange}
                        error = {formik.touched.surname && Boolean(formik.errors.surname)}
                        helperText={formik.touched.surname && formik.errors.surname}

                        // formState={formState}

                        variant="outlined"
                    />
                </Div>
                <Div columns={2}>
                    <TextField
                                     className="my-16"
                                     name="email"
                                     type="email"
                                     label={t("EMAIL")}
                                     value={formik.values.email}
                                     onChange = {formik.handleChange}
                                     error = {formik.touched.email && Boolean(formik.errors.email)}
                                     helperText={formik.touched.email && formik.errors.email}

                        // formState={formState}
                                     variant="outlined"
                    />
                    <TextField
                                     name="phoneNumber"
                                     className="my-16"
                                     value={formik.values.phoneNumber}
                                     onChange = {formik.handleChange}
                                     error = {formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                     helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                     label={ "+" + t("CODE") + " XXXXXXXXXX"}

                                     variant="outlined"/>

                </Div>
                <Div columns={2}>
                    <TextField
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange = {formik.handleChange}

                        error = {formik.touched.dob && Boolean(formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
                        id="date"
                        label={t("DATEOFBIRTHDAY")}
                        className="my-16"
                        InputLabelProps={{
                            shrink:true
                        }}
                        inputProps={{
                            max: '3000-01-01',
                            min:'1000-01-01'
                        }}
                        variant="outlined"/>
                    <Select
                        className="my-16"
                        label={t("SEX")}
                        name="sex"
                        value={formik.values.sex? formik.values.sex:"none"}
                        onChange = {formik.handleChange}
                        error = {formik.touched.sex && Boolean(formik.errors.sex)}
                        variant="outlined"
                        required            >
                        <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                        <MenuItem value="true">{t("MALE")}</MenuItem>
                        <MenuItem value="false">{t("FEMALE")}</MenuItem>
                    </Select>
                </Div>
                <Div columns={2}>
                    <TextField
                        className="my-16"
                        id="mui-theme-provider-outlined-input"
                        label={t("NINO")}
                        name="nino"
                        value={formik.values.nino}
                        onChange = {formik.handleChange}
                        error = {formik.touched.nino && Boolean(formik.errors.nino)}
                        helperText={formik.touched.nino && formik.errors.nino}
                        // formState={formState}
                        variant="outlined"
                    />
                    <TextField
                        className="my-16"
                        id="mui-theme-provider-outlined-input"
                        label={t("UTR")}
                        name="utr"
                        value={formik.values.utr}
                        onChange = {formik.handleChange}
                        error = {formik.touched.utr && Boolean(formik.errors.utr)}
                        helperText={formik.touched.utr && formik.errors.utr}
                        // formState={formState}
                        variant="outlined"
                    />
                </Div>
                <Div columns={3}>
                    <Div columns={formik.values.maritalStatus === 'true'?2:1} className={formik.values.maritalStatus === 'true' ? "":"w-1/2 self-center content-center"} >
                        <Select
                            className="my-16"
                            label={t("MARITALSTATUS")}
                            name="maritalStatus"
                            value={formik.values.maritalStatus ? formik.values.maritalStatus:"none"}
                            onChange = {formik.handleChange}
                            error = {formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}
                            variant="outlined">
                            <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                            <MenuItem value='true'>{t("MARRIED")}</MenuItem>
                            <MenuItem value='false'>{t("SINGLE")}</MenuItem>
                        </Select>
                        { (formik.values.maritalStatus === 'true') &&(
                            <TextField
                                name="spouseName"
                                className="my-16"
                                value={formik.values.spouseName}
                                onChange = {formik.handleChange}
                                error = {formik.touched.spouseName && Boolean(formik.errors.spouseName)}
                                helperText={formik.touched.spouseName && formik.errors.spouseName}
                                label={t("SPOUSENAME")}
                                required={true}
                                variant="outlined"/>)}
                    </Div>

                    <Select
                        className="my-16"
                        label={("DIRECTOR")}
                        name="director"
                        value={formik.values.director? formik.values.director:"none"}
                        onChange = {formik.handleChange}
                        error = {formik.touched.director && Boolean(formik.errors.director)}
                        variant="outlined">
                        <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                        <MenuItem value='DIRECTOR'>{t("DIRECTOR")}</MenuItem>
                        <MenuItem value='OWNER'>{t("OWNER")}</MenuItem>
                        <MenuItem value='ALL'>{t("ALL")}</MenuItem>
                    </Select>

                    <Select
                        className="my-16"
                        label={("TAX_RETURN")}
                        name="taxReturn"
                        value={formik.values.taxReturn? formik.values.taxReturn:"none"}
                        onChange = {formik.handleChange}
                        error = {formik.touched.taxReturn && Boolean(formik.errors.taxReturn)}
                        variant="outlined">
                        <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                        <MenuItem value='TAX_RETURN'>{("TAX RETURN")}</MenuItem>
                        <MenuItem value='NOT_TAX_RETURN'>{("NOT TAX RETURN")}</MenuItem>

                    </Select>

                </Div>


                <TextField
                                 className="my-16"
                                 name="visaType"
                                 type="text"
                                 label={t("VISATYPE")}
                                 value={formik.values.visaType}
                                 onChange = {formik.handleChange}
                                 error = {formik.touched.visaType && Boolean(formik.errors.visaType)}
                                 helperText={formik.touched.visaType && formik.errors.visaType}

                                 variant="outlined"
                />
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {t("NEXTOFKINDESCRIPTION")}
                        </Typography>
                        <Div columns={2}>
                            <TextField
                                className="my-16"
                                id="mui-theme-provider-outlined-input"
                                label={t("NAMEANDSURNAME")}
                                name="nextOfKinName"
                                value={formik.values.nextOfKinName}
                                onChange = {formik.handleChange}
                                error = {formik.touched.nextOfKinName && Boolean(formik.errors.nextOfKinName)}
                                helperText={formik.touched.nextOfKinName && formik.errors.nextOfKinName}
                                // formState={formState}

                                variant="outlined"
                            />
                            <TextField
                                className="my-16"
                                id="mui-theme-provider-outlined-input"
                                label={ "+" + t("CODE") + " XXXXXXXXXX"}
                                name="nextOfKinNumber"
                                value={formik.values.nextOfKinNumber}
                                onChange = {formik.handleChange}
                                error = {formik.touched.nextOfKinNumber && Boolean(formik.errors.nextOfKinNumber)}
                                helperText={formik.touched.nextOfKinNumber && formik.errors.nextOfKinNumber}
                                // formState={formState}

                                variant="outlined"
                            />
                        </Div>
                        <Div columns={2}>
                            <TextField
                                className="my-16"
                                id="mui-theme-provider-outlined-input"
                                label={t("EMAIL")}
                                name="nextOfKinEmail"
                                type={"email"}
                                value={formik.values.nextOfKinEmail}
                                onChange = {formik.handleChange}
                                error = {formik.touched.nextOfKinEmail && Boolean(formik.errors.nextOfKinEmail)}
                                helperText={formik.touched.nextOfKinEmail && formik.errors.nextOfKinEmail}
                                // formState={formState}
                                variant="outlined"
                            />
                            <TextField
                                className="my-16"
                                id="mui-theme-provider-outlined-input"
                                label={t("ADDRESS")}
                                name="nextOfKinAddress"
                                rows={4}
                                multiline
                                value={formik.values.nextOfKinAddress}
                                onChange = {formik.handleChange}
                                error = {formik.touched.nextOfKinAddress && Boolean(formik.errors.nextOfKinAddress)}
                                helperText={formik.touched.nextOfKinAddress && formik.errors.nextOfKinAddress}
                                // formState={formState}
                                variant="outlined"
                            />
                        </Div>
                    </CardContent>
                </Card>
                <Div columns={1} className="my-16 flex flex-end self-end">


                    <Button type="submit"

                            variant="contained"
                    >
                        {t("ADD")}
                    </Button>

                </Div>
                <Div columns={2} className="my-16 flex flex-end self-end">

                    <Button onClick={()=>handleBack()}

                            variant="contained"
                            color="secondary" >
                        {t("BACK")}
                    </Button>

                    <Button onClick={()=>handle()}

                            variant="contained"
                            color="primary" >
                        {t("NEXT")}
                    </Button>

                </Div>


            </Formsy>
        </Div>
    )
};

//
function FormTextField(
    {formState, field, ...props}:
        TextFieldProps & { formState: any, field: string }
) {
    const [state, dispatch] = formState;
    // Performans sorunu olduğu için onChange yerine onBlur'da state güncellemesi yapıyoruz.
    return (
        <TextField  {...props} onBlur={e => dispatch({...state, [field]: e.target.value})}/>
    )
}
