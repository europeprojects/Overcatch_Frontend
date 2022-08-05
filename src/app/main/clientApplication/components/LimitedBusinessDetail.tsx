// import React, {useEffect, useMemo, useState} from "react";
import {Chip, MenuItem, Select, TextField, TextFieldProps} from "@material-ui/core";
import React, {useEffect, useRef, useState} from "react";
import {Company} from "../../../types/UserModel";
import Button from "@material-ui/core/Button";
import Formsy from "formsy-react";
import api from "../../../services/BackendApi";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import {Div} from "../../../components/Grid";
import {Autocomplete} from "@material-ui/lab";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {limitedBusinessScheme} from "../../validations/ValidationSchemes";


export type LimitedBusinessDetailFormProps = {
    onInput: (form: Company) => void
    handleBack: any
    handleNext: any
    formDetail: Company
    itemNatureBusiness: any
    setItemNatureBusiness: any
    natureList: any
    setNatureList: any
}




export default function LimitedBusinessDetail({
                                                  setNatureList,
                                                  natureList,
                                                  setItemNatureBusiness,
                                                  itemNatureBusiness,
                                                  onInput,
                                                  handleBack,
                                                  handleNext,
                                                  formDetail
                                              }: LimitedBusinessDetailFormProps) {
    const {t} = useTranslation('application');
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    // const useStyles = makeStyles((theme: Theme) =>
    //     createStyles({
    //         textField: {
    //             marginLeft: theme.spacing(1),
    //             marginRight: theme.spacing(1),
    //             width: 200,
    //         },
    //     }),
    // );

    useEffect(() => {
        api.getNatureBusiness().then(result => {
            setNatureList(result);
        });
    }, [])

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    // const handleDateChange = (date: Date | null) => {
    //     setSelectedDate(date);
    // };

    const onTagsChange = (event, values) => {
        setItemNatureBusiness(values)
        console.log(itemNatureBusiness)
    }

    //String Validation
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

    function handleSubmit(model: Company) {
        model.name=formik.values.name
        model.email=formik.values.email
        model.phoneNumber=formik.values.phoneNumber
        model.eoriNumber=formik.values.eoriNumber
        model.payeNumber=formik.values.payeNumber
        model.vatNumber=formik.values.vatNumber
        model.gateway=formik.values.gateway
        model.yearEndDate = formik.values.yearenddate
        model.quarterEndDate = formik.values.quarterend
        model.confirmationStatementDate = formik.values.confirmationstatement
        model.paOfficeNumber=formik.values.paOfficeNumber
        model.companyUtr=formik.values.companyUtr
        model.registration=formik.values.registration
        model.authentication=formik.values.authentication
        model.nationality=formik.values.nationality

        handleNext()
        //console.log(model);
        onInput(model)
    }

    const formik = useFormik({
        initialValues: {
            name:'',
            email:'',
            phoneNumber:'',
            eoriNumber:'',
            payeNumber:'',
            paOfficeNumber:'',
            vatNumber:'',
            companyUtr:'',
            registration:'',
            authentication:'',
            companyNumber:'',
            nationality:'',
            gateway:'',
            yearenddate:'',
            quarterend:'',
            confirmationstatement:'',
            vatRegisterDate:'',
            vatPeriod:''
        },
        validationSchema: limitedBusinessScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSubmit(values)
            // alert(JSON.stringify(values))
        },
    });

    useEffect(() => {
        formik.values.name = formDetail.name
        formik.values.email = formDetail.email
        formik.values.phoneNumber = formDetail.phoneNumber
        formik.values.eoriNumber = formDetail.eoriNumber
        formik.values.payeNumber = formDetail.payeNumber
        formik.values.vatNumber = formDetail.vatNumber
        formik.values.vatRegisterDate=formDetail.vatRegisterDate
        formik.values.gateway = formDetail.gateway
        formik.values.yearenddate = formDetail.yearEndDate
        formik.values.quarterend = formDetail.quarterEndDate
        formik.values.confirmationstatement = formDetail.confirmationStatementDate
        formik.values.paOfficeNumber = formDetail.paOfficeNumber
        formik.values.companyUtr = formDetail.companyUtr
        formik.values.registration = formDetail.registration
        formik.values.authentication = formDetail.authentication
        formik.values.nationality = formDetail.nationality
        formik.values.companyNumber=formDetail.companyNumber
        formik.values.vatPeriod=formDetail.vatPeriod
    },[] )

    return (
        <Div gap={2}>
            <Formsy
                onValidSubmit={formik.handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >
                <Div columns={2}>
                    <TextField
                        className="my-16"
                        id="mui-theme-provider-outlined-input"
                        label={t("COMPANYNAME")}
                        name="name"
                        value={formik.values.name}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        onChange={formik.handleChange}
                        variant="outlined"
                    />
                    <TextField
                        className="my-16"
                        name="companyNumber"
                        label={t("COMPANYNUMBER")}
                        variant="outlined"
                        value={formik.values.companyNumber}
                        error={formik.touched.companyNumber && Boolean(formik.errors.companyNumber)}
                        helperText={formik.touched.companyNumber && formik.errors.companyNumber}
                        onChange={formik.handleChange}
                    />

                </Div>
                <Div columns={2}>
                    <TextField
                                     name="companyUtr"
                                     className="my-16"
                                     value={formik.values.companyUtr}
                                     error={formik.touched.companyUtr && Boolean(formik.errors.companyUtr)}
                                     helperText={formik.touched.companyUtr && formik.errors.companyUtr}
                                     onChange={formik.handleChange}
                                     label={t("COMPANYUTR")}
                                     variant="outlined"/>


                    <TextField

                                     name="authentication"
                                     value={formik.values.authentication}
                                     error={formik.touched.authentication && Boolean(formik.errors.authentication)}
                                     helperText={formik.touched.authentication && formik.errors.authentication}
                                     onChange={formik.handleChange}
                                     label={t("AUTHENTICATIONCODE")}
                                     className="my-16"
                                     variant="outlined"/>
                </Div>
                <Div columns={2}>
                    <TextField

                                     name="payeNumber"
                                     className="my-16"
                                     value={formik.values.payeNumber}
                                     error={formik.touched.payeNumber && Boolean(formik.errors.payeNumber)}
                                     helperText={formik.touched.payeNumber && formik.errors.payeNumber}
                                     onChange={formik.handleChange}
                                     label={t("PAYENUMBER")}
                                     variant="outlined"/>


                    <TextField
                                     name="paOfficeNumber"
                                     value={formik.values.paOfficeNumber}
                                     error={formik.touched.paOfficeNumber && Boolean(formik.errors.paOfficeNumber)}
                                     helperText={formik.touched.paOfficeNumber && formik.errors.paOfficeNumber}
                                     onChange={formik.handleChange}
                                     label={t("PAYEACCOUNTSOFFICENUMBER")}
                                     className="my-16"
                        // formState={formState}
                                     variant="outlined"/>
                </Div>
                <Div columns={3}>
                    <TextField

                                     name="vatNumber"
                                     className="my-16"
                                     value={formik.values.vatNumber}
                                     error={formik.touched.vatNumber && Boolean(formik.errors.vatNumber)}
                                     helperText={formik.touched.vatNumber && formik.errors.vatNumber}
                                     onChange={formik.handleChange}
                                     label={t("VATNUMBER")}
                                     variant="outlined"/>
                    <TextField
                        type="date"
                        name="vatRegisterDate"
                        value={formik.values.vatRegisterDate}

                        onChange = {formik.handleChange}
                        error = {formik.touched.vatRegisterDate && Boolean(formik.errors.vatRegisterDate)}
                        helperText={formik.touched.vatRegisterDate && formik.errors.vatRegisterDate}
                        id="date"
                        label={("VAT Register Date")}
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
                        label={("VAT PERIOD")}
                        name="vatPeriod"
                        value={formik.values.vatPeriod? formik.values.vatPeriod:"none"}
                        onChange = {formik.handleChange}
                        error = {formik.touched.vatPeriod && Boolean(formik.errors.vatPeriod)}
                        variant="outlined"
                        required>
                        <MenuItem value="none">{t("VAT Period")}</MenuItem>
                        <MenuItem value="January/April/July/October">{("January/April/July/October")}</MenuItem>
                        <MenuItem value="February/May/August/November">{("February/May/August/November\n")}</MenuItem>
                        <MenuItem value="March/June/September/December">{("March/June/September/December\n")}</MenuItem>
                    </Select>



                </Div>
                <Div columns={3}>

                    <TextField
                        name="eoriNumber"
                        value={formik.values.eoriNumber}
                        error={formik.touched.eoriNumber && Boolean(formik.errors.eoriNumber)}
                        helperText={formik.touched.eoriNumber && formik.errors.eoriNumber}
                        onChange={formik.handleChange}
                        label={t("EORINUMBER")}
                        className="my-16"
                        variant="outlined"
                    />
                    <TextField

                                     name="email"
                                     type="email"
                                     className="my-16"
                                     value={formik.values.email}
                                     error={formik.touched.email && Boolean(formik.errors.email)}
                                     helperText={formik.touched.email && formik.errors.email}
                                     onChange={formik.handleChange}
                                     label={t("EMAIL")}
                                     variant="outlined"/>


                    <TextField

                                     name="phoneNumber"
                                     value={formik.values.phoneNumber}
                                     error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                     helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                     onChange={formik.handleChange}
                                     label={ "+" + t("CODE") + " XXXXXXXXXX"}
                                     className="my-16"
                                     variant="outlined"/>
                </Div>
                <TextField

                    name="nationality"
                    value={formik.values.nationality}
                    error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                    helperText={formik.touched.nationality && formik.errors.nationality}
                    onChange={formik.handleChange}
                    label={t("NATIONALITY")}
                    className="my-16"
                    variant="outlined"/>
                <TextField

                    label={t("GATEWAYID")}
                    name="gateway"
                    value={formik.values.gateway}
                    error={formik.touched.gateway && Boolean(formik.errors.gateway)}
                    helperText={formik.touched.gateway && formik.errors.gateway}
                    onChange={formik.handleChange}
                    className="my-16"
                    variant="outlined"/>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={natureList}
                    getOptionLabel={option => option.description + "-" + option.code}
                    onChange={onTagsChange}
                    renderTags={(value: any[], getTagProps) =>
                        value.map((option: any, index: number) => (
                            <Chip variant="outlined"
                                  label={option.description + " - " + option.code} {...getTagProps({index})} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label={t("NATUREBUSINESS")} placeholder={t("SELECTED")}/>
                    )}
                />
                <Div columns={3}>
                    <TextField
                        type="date"
                        name="yearenddate"
                        inputProps={{
                            max: '3000-01-01',
                            min:'1000-01-01'
                        }}
                        value={formik.values.yearenddate}
                        onChange = {formik.handleChange}
                        error = {formik.touched.yearenddate && Boolean(formik.errors.yearenddate)}
                        helperText={formik.touched.yearenddate && formik.errors.yearenddate}
                        id="date"
                        label={t("YEARENDDATE")}
                        className="my-16"
                        InputLabelProps={{
                            shrink:true
                        }}
                        variant="outlined"/>
                    <TextField
                        type="date"
                        name="quarterend"
                        value={formik.values.quarterend}
                        onChange = {formik.handleChange}
                        inputProps={{
                            max: '3000-01-01',
                            min:'1000-01-01'
                        }}
                        error = {formik.touched.quarterend && Boolean(formik.errors.quarterend)}
                        helperText={formik.touched.quarterend && formik.errors.quarterend}
                        id="date"
                        label={t("QUARTEREND")}
                        className="my-16"
                        InputLabelProps={{
                            shrink:true
                        }}
                        variant="outlined"/>
                    <TextField
                        type="date"
                        name="confirmationstatement"
                        value={formik.values.confirmationstatement}

                        onChange = {formik.handleChange}
                        error = {formik.touched.confirmationstatement && Boolean(formik.errors.confirmationstatement)}
                        helperText={formik.touched.confirmationstatement && formik.errors.confirmationstatement}
                        id="date"
                        label={t("CONFIRMATIONSTATEMENT")}
                        className="my-16"
                        InputLabelProps={{
                            shrink:true
                        }}
                        inputProps={{
                            max: '3000-01-01',
                            min:'1000-01-01'
                        }}
                        variant="outlined"/>
                </Div>
                {/*<SelectFormsy*/}
                {/*    className="my-16"*/}
                {/*    label="Company Title"*/}
                {/*    name="companyTitle"*/}
                {/*    value={formDetail.notes? formDetail.notes:"LIMITED"}*/}
                {/*    variant="outlined"*/}
                {/*    required            >*/}
                {/*    <MenuItem value="LIMITED">Limited</MenuItem>*/}
                {/*    <MenuItem value="LTD">ltd</MenuItem>*/}
                {/*/!*</SelectFormsy>*!/*/}
                <Div columns={1} className="flex flex-end self-end">

                    <Button type="submit"
                            variant="contained"
                            color="primary">
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
