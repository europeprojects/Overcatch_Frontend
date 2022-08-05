// import React, {useEffect, useMemo, useState} from "react";
import {TextField, TextFieldProps} from "@material-ui/core";
import React, {useEffect, useMemo, useState} from "react";
import {AddressInfo} from "../../types/UserModel";
import { Div } from "app/components/Grid";
import Button from "@material-ui/core/Button";
import {Form} from "formik";
import {useTranslation} from "react-i18next";

export type BusinessInfoFormProps = {
    onInput: (form: AddressInfo) => void
}

export default function BusinessAdresForm({onInput}: BusinessInfoFormProps) {
    const formState = useState<AddressInfo>({} as AddressInfo);

    const [form] = formState;
    useEffect(() => {
        onInput(form)

    }, [form]);

    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }

    const {t} = useTranslation('application');

    return (
            <Div gap={2}>
                <Form>
                <h3>{t("BUSINESSADDRESS")}</h3>
                <FormTextField
                    label={t("BUILDINGNUMBER")}
                    fullWidth field="number"
                    formState={formState}
                    variant="outlined"/>
                <FormTextField onChange={onChanceClick}
                               label={t("CITY")}
                               fullWidth field="city"
                               formState={formState}
                               variant="outlined"/>
                <FormTextField onChange={onChanceClick}
                               label={t("DISTRICT")}
                               fullWidth field="district"
                               formState={formState}
                               variant="outlined"/>
                <FormTextField onChange={onChanceClick}
                               label={t("NEIGHBOURHOOD")}
                               fullWidth field="neighbourhood"
                               formState={formState}
                               variant="outlined"/>
                <FormTextField onChange={onChanceClick}
                               label={t("STREET")}
                               fullWidth field="street"
                               formState={formState}
                               variant="outlined"/>
                <FormTextField onChange={onChanceClick}
                               label={t("POSTCODE")}
                               fullWidth field="postcode"
                               formState={formState}
                               variant="outlined"/>
                <Div columns={1} className="flex flex-end self-end">
                    <Button type="submit"
                            variant="contained"
                            color="primary" >
                        {t("NEXT")}
                    </Button>
                </Div>
            </Form>
            </Div>
    )
};
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