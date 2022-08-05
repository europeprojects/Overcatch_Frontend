import {
    Grid,
    MenuItem, Select, TextField
} from "@material-ui/core";
import {CustomerCreate, UserDTO, UserType} from "../../../types/UserModel";
import {useEffect, useRef, useState} from "react";
import React from 'react';
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import history from '../../../../@history/@history'
import api from "app/services/BackendApi";
import {useFormik} from 'formik';
import {customerFormValidationSchema} from "../../validations/ValidationSchemes";
import {useTranslation} from "react-i18next";

export type CustomerInfoFormProps = {
    onInput: (form: UserDTO) => void
}

export default function CustomerInfoForm({onInput}: CustomerInfoFormProps) {
    const formState = useState<UserDTO>({} as UserDTO);
    const [isOther, setIsOther] = useState(false);
    const [isSelfAssesment, setIsSelfAssesment] = useState(false);
    const [form] = formState;
    const [disabled, setDisabled] = useState(false);
    const {t} = useTranslation('usercreate');
    const [checked, setChecked] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        // @ts-ignore
        formik.values.isVatMember=event.target.checked;
    };

    useEffect(() => {
        onInput(form)

    }, [form]);

    function changeSelf() {
        setIsSelfAssesment(true)
        setIsOther(false)
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            surname: '',
            msisdn: '',
            payment: '',
            clientType: '',
            isExisting: '',
            agreementType: '',
            notes:'',
            visaType:'',
            isVatMember: false,
        },
        validationSchema: customerFormValidationSchema,
        onSubmit: (values) => {
            setDisabled(true);
            // @ts-ignore
            handleSubmit(formik.values)
        },
    });

    function handleSubmit(model: CustomerCreate) {
        model.userType = UserType.CUSTOMER;
        api.createUser(model).then(
           response => {
               history.push('/users')
            }).catch(reason =>setDisabled(false) );
    }

    useEffect(()=>{
        if (isSelfAssesment===true){
            formik.values.agreementType="OTHER"
        }
    },[isSelfAssesment])

    return (

        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid xs={12} sm={12} lg={12} >
                    <Select style={{marginLeft:"8px"}}
                            className="my-16"
                            label={t("CLIENTTYPE")}
                            variant="outlined"
                            name="clientType"
                            displayEmpty
                            value={formik.values.clientType}
                            onChange={(e)=>{e.target.value=="SELFASSESMENT" ?changeSelf():setIsSelfAssesment(false);
                                formik.handleChange(e)}}
                            error={formik.touched.clientType && Boolean(formik.errors.clientType)}
                    >
                        <MenuItem value="" disabled>
                            <em>{t("CLIENTTYPE")}</em>
                        </MenuItem>
                        <MenuItem value="SOLETRADE">SOLE TRADE</MenuItem>
                        <MenuItem value="LIMITED">LIMITED</MenuItem>
                        <MenuItem value="SELFASSESMENT">SELF ASSESMENT</MenuItem>
                    </Select>
                    {isSelfAssesment === false && (
                        <Select style={{marginLeft:"8px"}}
                                className="my-16"
                                label={t("AGGREMENTTYPE")}
                                variant="outlined"
                                name="agreementType"
                                displayEmpty
                                value={formik.values.agreementType}
                                onChange={formik.handleChange}
                                required={true}>
                            <MenuItem value="">
                                <em>{t("AGGREMENTTYPE")}</em>
                            </MenuItem>
                            <MenuItem value="TRADING">TRADING</MenuItem>
                            <MenuItem value="ECAA">ECAA</MenuItem>
                            <MenuItem value="OTHER">OTHER</MenuItem>
                        </Select>
                    )}
                    <Select style={{marginLeft:"8px"}}
                            className="my-16"
                            label={t("NEWEXIST")}
                            value={formik.values.isExisting}
                            onChange={formik.handleChange}
                            error={formik.touched.isExisting && Boolean(formik.errors.isExisting)}
                            name="isExisting"
                            variant="outlined"
                            displayEmpty
                    >
                        <MenuItem value="" disabled>
                            <em>{t("NEWEXIST")}</em>
                        </MenuItem>
                        <MenuItem value="false">{t("NEW")}</MenuItem>
                        <MenuItem value="true">{t("EXIST")}</MenuItem>
                    </Select>
                </Grid>

                <Grid xs={12} sm={6} lg={3} >
                    {
                        (isOther === true || isSelfAssesment === true) && (
                            <TextField
                                className="mb-16"
                                type="text"
                                name="visaType"
                                label={t("VISATYPE")}
                                value={formik.values.visaType}
                                onChange={formik.handleChange}
                                error={formik.touched.visaType && Boolean(formik.errors.visaType)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                public
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                                required={true}
                            />
                        )}
                </Grid>
                <Grid xs={12} sm={12} lg={12}>
                    <TextField style={{width:"100%"}}
                               className="mb-16"
                               id="name"
                               name="name"
                               label={t("NAME")}
                               value={formik.values.name}
                               onChange={formik.handleChange}
                               error={formik.touched.name && Boolean(formik.errors.name)}
                               helperText={formik.touched.name && formik.errors.name}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end" >
                                           <Icon className="text-20" color="action" >
                                               perm_identity
                                           </Icon>
                                       </InputAdornment>
                                   )
                               }}
                               variant="outlined"
                    />
                    <TextField style={{width:"100%"}}
                               className="mb-16"
                               name="surname"
                               label={t("SURNAME")}
                               value={formik.values.surname}
                               onChange={formik.handleChange}
                               error={formik.touched.surname && Boolean(formik.errors.surname)}
                               helperText={formik.touched.surname && formik.errors.surname}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <Icon className="text-20" color="action">
                                               perm_identity
                                           </Icon>
                                       </InputAdornment>
                                   )
                               }}
                               variant="outlined"
                    />
                </Grid>

                <Grid xs={12} sm={12} lg={12}>
                    <TextField  style={{width:"100%"}}
                                className="mb-16"
                                name="email"
                                label={t("EMAIL")}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                email
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                    />
                    <TextField style={{width:"100%"}}
                               className="mb-16"
                               type="text"
                               name="msisdn"
                               label={ "+" + t("CODE") + " XXXXXXXXXX"}
                               value={formik.values.msisdn}
                               onChange={formik.handleChange}
                               error={formik.touched.msisdn && Boolean(formik.errors.msisdn)}
                               helperText={formik.touched.msisdn && formik.errors.msisdn}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <Icon className="text-20" color="action">
                                               phone
                                           </Icon>
                                       </InputAdornment>
                                   )
                               }}
                               variant="outlined"
                    />
                    <TextField style={{width:"100%"}}
                               id="outlined-multiline-static"
                               label={t("THINGSTOCONSIDER")}
                               className="mb-16"
                               multiline
                               name="notes"
                               rows={4}
                               variant="outlined"
                               value={formik.values.notes}
                               onChange={formik.handleChange}
                               error={formik.touched.notes && Boolean(formik.errors.notes)}
                               helperText={formik.touched.notes && formik.errors.notes}
                    />
                    <TextField style={{width:"100%"}}
                               className="mb-16"
                               type="number"
                               name="payment"
                               label={t("AGREEDPRICE")}
                               value={formik.values.payment}
                               onChange={formik.handleChange}
                               error={formik.touched.payment && Boolean(formik.errors.payment)}
                               helperText={formik.touched.payment && formik.errors.payment}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <Icon className="text-20" color="action">
                                               money
                                           </Icon>
                                       </InputAdornment>
                                   )
                               }}
                               variant="outlined"
                    />
                </Grid>
                <Grid xs={12} sm={12} lg={12}>
                    <Button style={{width:"100%"}}
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="w-full mx-auto mt-16 normal-case"
                            aria-label="LOG IN"
                            value="legacy"
                            disabled={disabled}
                    >
                        {t('SUBMIT')}
                    </Button>
                </Grid>
            </form>
        </div>
    )
};
