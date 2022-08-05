// import React, {useEffect, useMemo, useState} from "react";
import React, {useEffect, useRef, useState} from "react";
import {FounderOwner, FounderOwnerBusiness} from "../../../types/UserModel";
import Button from "@material-ui/core/Button";
import Formsy from "formsy-react";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import {Div} from "../../../components/Grid";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {founderOwnerScheme} from "../../validations/ValidationSchemes";
import {TextField} from "@material-ui/core";


export type FounderOwnerDetailFormProps = {
    onInput: (form: FounderOwnerBusiness) => void
    handleBack: any
    handleNext: any
    formDetail: FounderOwnerBusiness
}

export default function FounderOwnerDetail({onInput, handleNext, formDetail}: FounderOwnerDetailFormProps) {
    const {t} = useTranslation('application');
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );
    const formik = useFormik({
        initialValues: {
            tradeAsName:'',
            businessEmail:'',
            phoneNumber:'',
            vatNumber:'',
            eoriNumber:'',
            payeNumber:'',
            gateway:'',
        },
        validationSchema: founderOwnerScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSubmit(values)
            // alert(JSON.stringify(values))
        },
    });

    useEffect(() => {
        formik.values.tradeAsName = formDetail.tradeAsName
        formik.values.businessEmail = formDetail.businessEmail
        formik.values.phoneNumber = formDetail.phoneNumber
        formik.values.eoriNumber = formDetail.eoriNumber
        formik.values.payeNumber = formDetail.payeNumber
        formik.values.vatNumber = formDetail.vatNumber
        formik.values.gateway = formDetail.gateway
    }, [])

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

    function handleSubmit(model: FounderOwner) {
        model.tradeAsName=formik.values.tradeAsName
        model.businessEmail=formik.values.businessEmail
        model.phoneNumber=formik.values.phoneNumber
        model.eoriNumber=formik.values.eoriNumber
        model.payeNumber=formik.values.payeNumber
        model.vatNumber=formik.values.vatNumber
        model.gateway=formik.values.gateway
        handleNext()
        //console.log(model);
        onInput(model)
    }

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
                        label={t("TRADEASNAME")}
                        name="tradeAsName"
                        value={formik.values.tradeAsName}
                        error={formik.touched.tradeAsName && Boolean(formik.errors.tradeAsName)}
                        helperText={formik.touched.tradeAsName && formik.errors.tradeAsName}
                        onChange={formik.handleChange}
                        variant="outlined"
                    />
                    <TextField
                                     className="my-16"
                                     name="businessEmail"
                                     type="email"
                                     label={t("BUSINESSEMAIL")}
                                     value={formik.values.businessEmail}
                                     error={formik.touched.businessEmail && Boolean(formik.errors.businessEmail)}
                                     helperText={formik.touched.businessEmail && formik.errors.businessEmail}
                                     onChange={formik.handleChange}
                                     variant="outlined"
                    />
                </Div>
                <Div columns={2}>
                    <TextField

                                     name="phoneNumber"
                                     className="my-16"
                                     label={ "+" + t("CODE") + " XXXXXXXXXX"}
                                     value={formik.values.phoneNumber}
                                     error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                     helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                     onChange={formik.handleChange}
                                     variant="outlined"/>


                    <TextField

                                     name="vatNumber"
                                     label={t("VATNUMBER")}
                                     className="my-16"
                                     value={formik.values.vatNumber}
                                     error={formik.touched.vatNumber && Boolean(formik.errors.vatNumber)}
                                     helperText={formik.touched.vatNumber && formik.errors.vatNumber}
                                     onChange={formik.handleChange}
                                     variant="outlined"/>
                </Div>

                <Div columns={2}>
                    <TextField

                        label={t("EORINUMBER")}
                        name="eoriNumber"
                        value={formik.values.eoriNumber}
                        error={formik.touched.eoriNumber && Boolean(formik.errors.eoriNumber)}
                        helperText={formik.touched.eoriNumber && formik.errors.eoriNumber}
                        onChange={formik.handleChange}
                        variant="outlined"/>


                    <TextField
                        label={t("PAYENUMBER")}
                        name="payeNumber"
                        value={formik.values.payeNumber}
                        error={formik.touched.payeNumber && Boolean(formik.errors.payeNumber)}
                        helperText={formik.touched.payeNumber && formik.errors.payeNumber}
                        onChange={formik.handleChange}
                        variant="outlined"/>
                </Div>
                <TextField
                    label={t("GATEWAYID")}
                    name="gateway"
                    value={formik.values.gateway}
                    error={formik.touched.gateway && Boolean(formik.errors.gateway)}
                    helperText={formik.touched.gateway && formik.errors.gateway}
                    onChange={formik.handleChange}
                    className="my-16"
                    variant="outlined"/>
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
// function FormTextField(
//     {formState, field, ...props}:
//         TextFieldProps & { formState: any, field: string }
// ) {
//     const [state, dispatch] = formState;
//     // Performans sorunu olduğu için onChange yerine onBlur'da state güncellemesi yapıyoruz.
//     return (
//         <TextField  {...props} onBlur={e => dispatch({...state, [field]: e.target.value})}/>
//     )
// }
