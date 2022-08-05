// import React, {useEffect, useMemo, useState} from "react";
import {Card, CardContent, makeStyles, Snackbar, TextField, TextFieldProps, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {AddressCreate, AddressInfo, AddressType} from "../../types/UserModel";
import {Div} from "app/components/Grid";
import Button from "@material-ui/core/Button";
import Formsy from "formsy-react";
import {TextFieldFormsy} from "../../../@fuse/core/formsy";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {customerFormValidationSchema, homeAdresFormSheme} from "../validations/ValidationSchemes";
import {Alert} from "@material-ui/lab";

export type HomeAddressFormProps = {
    onInput: (form: AddressCreate) => void
    // setTabValue: any
    // tabValue:number
    formDetail: AddressCreate
    handleBack: any
    handleNext: any
    setAddressList: any
}


const useStyles2 = makeStyles({
    root: {
        minWidth: 275,
        marginBottom: 50,
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

export default function HomeAdresForm({
                                          onInput,
                                          formDetail,
                                          handleBack,
                                          handleNext,
                                          setAddressList
                                      }: HomeAddressFormProps) {
    const formState = useState<AddressCreate>(formDetail);
    const [isFormValid, setIsFormValid] = useState(false);
    const [open2, setOpen2] = useState(false)
    const {t} = useTranslation('application');
    const classes = useStyles2();

    // function handleClick() {
    //
    // }
    const [form] = formState;
    useEffect(() => {
        onInput(form)

    }, [form]);

    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    // function disableButton() {
    //     setIsFormValid(false);
    // }
    //
    // function enableButton() {
    //     setIsFormValid(true);
    // }
    //
    // function handleSubmitPrevious(model:IncorprationInfo){
    //     console.log(model)
    //     onInput(model)
    //
    // }
    // function handleSubmit(model:IncorprationInfo) {
    //     console.log(model);
    //     setTabValue(tabValue + 1)
    //     // //console.log(model);
    //     onInput(model)
    // }
    const formik = useFormik({
        initialValues: {
            country1: '',
            district1: '',
            number1: '',
            street1: '',
            county1: '',
            city1: '',
            postcode1: '',
            country2: '',
            district2: '',
            number2: '',
            street2: '',
            county2: '',
            city2: '',
            postcode2: '',
            country3: '',
            district3: '',
            number3: '',
            street3: '',
            county3: '',
            city3: '',
            postcode3: '',
        },
        validationSchema: homeAdresFormSheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSubmit(values)
        },
    });

    useEffect(() => {
        formik.values.country1 = formDetail?.country1
        formik.values.district1 = formDetail?.district1
        formik.values.number1 = formDetail?.number1
        formik.values.street1 = formDetail?.street1
        formik.values.county1 = formDetail?.county1
        formik.values.city1 = formDetail?.city1
        formik.values.postcode1 = formDetail?.postcode1
        formik.values.country2 = formDetail?.country2
        formik.values.district2 = formDetail?.district2
        formik.values.number2 = formDetail?.number2
        formik.values.street2 = formDetail?.street2
        formik.values.county2 = formDetail?.county2
        formik.values.city2 = formDetail?.city2
        formik.values.postcode2 = formDetail?.postcode2
        formik.values.country3 = formDetail?.country3
        formik.values.district3 = formDetail?.district3
        formik.values.number3 = formDetail?.number3
        formik.values.street3 = formDetail?.street3
        formik.values.county3 = formDetail?.county3
        formik.values.city3 = formDetail?.city3
        formik.values.postcode3 = formDetail?.postcode3
    }, [])

    function handleSubmitChange(model: AddressCreate) {
        onInput(model)
    }

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleClose(){
        setOpen2(false)
    }

    function handleSubmit(model: AddressCreate) {
        // model.number1 = formik.values.number1
        // model.county1 = formik.values.county1
        // model.street1 = formik.values.street1
        // model.city1 = formik.values.city1
        // model.postcode1 = formik.values.postcode1
        // model.number2 = formik.values.number2
        // model.county2 = formik.values.county2
        // model.street2 = formik.values.street2
        // model.city2 = formik.values.city2
        // model.postcode2 = formik.values.postcode2
        model = formik.values as AddressCreate
        var isValid = false
        for (let modelKey in model) {
            isValid = (model[modelKey] === undefined || model[modelKey] == null || model[modelKey]?.length <= 0) ? false : true
            if (isValid) break
        }
        if(!isValid){
            setOpen2(true)
            return
        }


        let address1: AddressInfo = {
            district: model?.district1,
            number: model.number1,
            county: model.county1,
            addressType: AddressType.HOME,
            postcode: model.postcode1,
            street: model.street1,
            city: model.city1,
            id: null,
            relocationDate: null,
            country: model?.country1
        };
        let address2: AddressInfo = {
            district: model?.district2,
            number: model.number2,
            county: model.county2,
            addressType: AddressType.BUSINESS,
            postcode: model.postcode2,
            street: model.street2,
            city: model.city2,
            id: null,
            relocationDate: null,
            country: model?.country2
        };

        let address3: AddressInfo = {
            district: model?.district3,
            number: model.number3,
            county: model.county3,
            addressType: AddressType.TRADING,
            postcode: model.postcode3,
            street: model.street3,
            city: model.city3,
            id: null,
            relocationDate: null,
            country: model?.country3
        };
        setAddressList([address1, address2, address3])
        handleNext()
        onInput(model)
    }

    return (
        <Div>
            {/*<Div columns={2}>*/}
            {/*</Div>*/}
            <Formsy
                onValidSubmit={formik.handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                onChange={formik.handleChange}
                className="flex flex-col justify-center w-full"
            >
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography>{t("RESIDENTIALADDRESS")}</Typography>
                        <Div columns={2}>
                            <TextField
                                autoFocus
                                value={formik.values.number1}
                                onChange = {formik.handleChange}
                                error = {formik.touched.number1 && Boolean(formik.errors.number1)}
                                helperText={formik.touched.number1 && formik.errors.number1}
                                name="number1"
                                className="my-16"
                                label={t("LINE1")}

                                variant="outlined"/>
                            <TextField
                                value={formik.values.street1}
                                onChange = {formik.handleChange}
                                error = {formik.touched.street1 && Boolean(formik.errors.street1)}
                                helperText={formik.touched.street1 && formik.errors.street1}
                                name="street1"
                                className="my-16"
                                label={t("LINE2")}
                                variant="outlined"/>

                        </Div>
                        <Div columns={2}>
                            <TextField
                                value={formik.values.district1}
                                onChange = {formik.handleChange}
                                error = {formik.touched.district1 && Boolean(formik.errors.district1)}
                                helperText={formik.touched.district1 && formik.errors.district1}
                                name="district1"
                                className="my-16"
                                label={t("LINE3")}
                                variant="outlined" />
                            <TextField
                                value={formik.values.postcode1}
                                onChange = {formik.handleChange}
                                error = {formik.touched.postcode1 && Boolean(formik.errors.postcode1)}
                                helperText={formik.touched.postcode1 && formik.errors.postcode1}
                                name="postcode1"
                                className="my-16"
                                label={t("POSTCODE")}
                                variant="outlined" />
                        </Div>
                        <Div columns={2}>
                            <TextField
                                name="city1"
                                value={formik.values.city1}
                                onChange = {formik.handleChange}
                                error = {formik.touched.city1 && Boolean(formik.errors.city1)}
                                helperText={formik.touched.city1 && formik.errors.city1}
                                className="my-16"
                                label={t("TOWNCITY")}
                                variant="outlined" />

                            <TextField
                                value={formik.values.country1}
                                onChange = {formik.handleChange}
                                error = {formik.touched.country1 && Boolean(formik.errors.country1)}
                                helperText={formik.touched.country1 && formik.errors.country1}
                                name="country1"
                                className="my-16"
                                label={t("COUNTRY")}
                                variant="outlined" />
                        </Div>
                    </CardContent>
                </Card>

                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography>{t("COMPANYREGISTERADDRESS")}</Typography>
                        <Div columns={2}>
                            <TextField
                                value={formik.values.number2}
                                onChange = {formik.handleChange}
                                error = {formik.touched.number2 && Boolean(formik.errors.number2)}
                                helperText={formik.touched.number2 && formik.errors.number2}
                                name="number2"
                                className="my-16"
                                label={t("LINE1")}
                                variant="outlined"/>
                            <TextField
                                value={formik.values.street2}
                                onChange = {formik.handleChange}
                                error = {formik.touched.street2 && Boolean(formik.errors.street2)}
                                helperText={formik.touched.street2 && formik.errors.street2}
                                name="street2"
                                className="my-16"
                                label={t("LINE2")}
                                variant="outlined"/>
                        </Div>
                        <Div columns={2}>
                            <TextField
                                value={formik.values.district2}
                                onChange = {formik.handleChange}
                                error = {formik.touched.district2 && Boolean(formik.errors.district2)}
                                helperText={formik.touched.district2 && formik.errors.district2}
                                name="district2"
                                className="my-16"
                                label={t("LINE3")}
                                variant="outlined" />

                            <TextField
                                value={formik.values.postcode2}
                                onChange = {formik.handleChange}
                                error = {formik.touched.postcode2 && Boolean(formik.errors.postcode2)}
                                helperText={formik.touched.postcode2 && formik.errors.postcode2}
                                name="postcode2"
                                className="my-16"
                                label={t("POSTCODE")}
                                variant="outlined" />
                        </Div>
                        <Div columns={2}>

                            <TextField
                                name="city2"
                                value={formik.values.city2}
                                onChange = {formik.handleChange}
                                error = {formik.touched.city2 && Boolean(formik.errors.city2)}
                                helperText={formik.touched.city2 && formik.errors.city2}
                                className="my-16"
                                label={t("TOWNCITY")}
                                variant="outlined" />

                            <TextField
                                value={formik.values.country2}
                                onChange = {formik.handleChange}
                                error = {formik.touched.country2 && Boolean(formik.errors.country2)}
                                helperText={formik.touched.country2 && formik.errors.country2}
                                name="country2"
                                className="my-16"
                                label={t("COUNTRY")}
                                variant="outlined" />
                        </Div>
                    </CardContent>
                </Card>

                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography>{t("BUSINESSTRADINGADDESS")}</Typography>
                        <Div columns={2}>
                            <TextField
                                value={formik.values.number3}
                                onChange = {formik.handleChange}
                                error = {formik.touched.number3 && Boolean(formik.errors.number3)}
                                helperText={formik.touched.number3 && formik.errors.number3}
                                name="number3"
                                className="my-16"
                                label={t("LINE1")}
                                variant="outlined"/>
                            <TextField
                                value={formik.values.street3}
                                onChange = {formik.handleChange}
                                error = {formik.touched.street3 && Boolean(formik.errors.street3)}
                                helperText={formik.touched.street3 && formik.errors.street3}
                                name="street3"
                                className="my-16"
                                label={t("LINE2")}
                                variant="outlined"/>
                        </Div>
                        <Div columns={2}>
                            <TextField
                                value={formik.values.district3}
                                onChange = {formik.handleChange}
                                error = {formik.touched.district3 && Boolean(formik.errors.district3)}
                                helperText={formik.touched.district3 && formik.errors.district3}
                                name="district3"
                                className="my-16"
                                label={t("LINE3")}
                                variant="outlined" />

                            <TextField
                                value={formik.values.postcode3}
                                onChange = {formik.handleChange}
                                error = {formik.touched.postcode3 && Boolean(formik.errors.postcode3)}
                                helperText={formik.touched.postcode3 && formik.errors.postcode3}
                                name="postcode3"
                                className="my-16"
                                label={t("POSTCODE")}
                                variant="outlined" />

                        </Div>
                        <Div columns={2}>

                            <TextField
                                name="city3"
                                value={formik.values.city3}
                                onChange = {formik.handleChange}
                                error = {formik.touched.city3 && Boolean(formik.errors.city3)}
                                helperText={formik.touched.city3 && formik.errors.city3}
                                className="my-16"
                                label={t("TOWNCITY")}
                                variant="outlined" />

                            <TextField
                                value={formik.values.country3}
                                onChange = {formik.handleChange}
                                error = {formik.touched.country3 && Boolean(formik.errors.country3)}
                                helperText={formik.touched.country3 && formik.errors.country3}
                                name="country3"
                                className="my-16"
                                label={t("COUNTRY")}
                                variant="outlined" />
                        </Div>
                    </CardContent>
                </Card>




                {/*<Div columns={2}>*/}

                {/*    */}
                {/*</Div>*/}
                {/*<Div columns={2}>*/}

                {/*    */}
                {/*</Div>*/}
                {/*<Div columns={2}>*/}

                {/*    */}
                {/*</Div>*/}
                {/*<Div columns={2}>*/}
                {/*    */}
                {/*    */}
                {/*</Div>*/}
                {/*<Div columns={2}>*/}

                {/*    */}
                {/*</Div>*/}
                <Div>
                    <Div columns={2} className="flex flex-end self-end">

                        <Button onClick={() => handleBack()}

                                variant="contained"
                                color="secondary">
                            {t("BACK")}
                        </Button>


                        <Button type="submit"

                                variant="contained"
                                color="primary">
                            {t("NEXT")}
                        </Button>

                    </Div>
                </Div>
            </Formsy>
            <Snackbar open={open2} autoHideDuration={6000} onClose={()=> handleClose()}>
                <Alert onClose={()=>handleClose()} severity="error" variant="filled">
                    {t('PLEASEFILL')}
                </Alert>
            </Snackbar>
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
