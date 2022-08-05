// import React, {useEffect, useMemo, useState} from "react";
import {
    Chip, createStyles,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    TextField,
    TextFieldProps,
    Theme, useTheme
} from "@material-ui/core";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {NatureBusiness, FounderOwner, Company} from "../../../types/UserModel";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import { Div } from "app/components/Grid";
import api from "app/services/BackendApi";
import Formsy from "formsy-react";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import Select from 'react-select';
import {Autocomplete} from "@material-ui/lab";
import {log} from "util";
import {useTranslation} from "react-i18next";





const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
    }),
);

export type IncorprationInfoFormProps = {
    onInput: (form: Company) => void
    setTabValue: any
    tabValue:number
    formDetail: Company
}

export default function IncorprationInfoForm({ onInput,setTabValue,tabValue,formDetail}: IncorprationInfoFormProps) {
    const classes = useStyles();
    const formState = useState<Company>(formDetail);
    const [itemNatureBusiness, setItemNatureBusiness] = useState<NatureBusiness[]>([]);
    const [natureList, setNatureList] = useState<NatureBusiness[]>([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [form] = formState;
    const formRef = useRef(null);
    useEffect(() => {
            //formState);
            console.log(itemNatureBusiness);
    },[itemNatureBusiness]);

    useEffect(() => {

        onInput(form)

    }, [form]);

    useEffect(()=>{
        api.getNatureBusiness().then(result => {
            setNatureList(result);
        });
    },[])

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );
    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {

        // const [state, dispatch] = formState;
        //                  dispatch({
        // ...state, ['natureBusinesses']: (event.target.value as NatureBusiness[])
        //    });
        setItemNatureBusiness(event.target.value as NatureBusiness[])
        console.log(itemNatureBusiness);


    };
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
            },
        },
    };

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmitPrevious(model:Company){
        console.log(model)
        onInput(model)

    }

    const onTagsChange = (event, values) => {
        setItemNatureBusiness(values)
        console.log(values)


    }

    function handleSubmit(model:Company) {
        model.natureBusinesses=itemNatureBusiness;
        console.log(model);
        setTabValue(tabValue + 1)
        // //console.log(model);
        onInput(model)
    }


    const {t} = useTranslation('companyApplications');

    return useMemo(() => (
        <Div gap={2}>
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                onChange={handleSubmitPrevious}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >

            {/*<TextFieldFormsy*/}

            {/*    className="my-16"*/}
            {/*    id="yearEndDate"*/}
            {/*    field="yearEndDate"*/}
            {/*    label="Year End Date"*/}
            {/*    type="date"*/}
            {/*    InputLabelProps={{*/}
            {/*        shrink: true,*/}
            {/*    }}*/}
            {/*    value={formDetail.yearEndDate}*/}
            {/*    variant="outlined"*/}
            {/*    name="yearEndDate"*/}
            {/*    formState={formState}*/}

            {/*/>*/}

            <TextFieldFormsy

                className="my-16"
                field="dueDate"
                id="dueDate"
                label= {t("DUEDATE")}
                type="date"
                value={formDetail.dueDate}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: '3000-01-01',
                    min:'1000-01-01'
                }}
                variant="outlined"
                name="dueDate"
             formState={formState}/>

            <TextFieldFormsy

                label={t("REGISTRATION")}
                className="my-16"
                name="registration"
                value={formDetail.registration}
                fullWidth field="registration"
                formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy

                value={formDetail.authentication}
                name="authentication"
                className="my-16"
                label={t("AUTHENTICATION")}
                fullWidth field="authentication"
                formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy

                name="payeNumber"
                value={formDetail.payeNumber}
                className="my-16"
                label={"PAYE"}
                fullWidth field="paye"
                formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy

                value={formDetail.companyUtr}
                name="companyUtr"
                className="my-16"
                label={t("COMPANYUTR")}
                fullWidth field="companyUtr"
                formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy

                value={formDetail.nationality}
                className="my-16"
                name="nationality"
                label={t("NATIONALITY")}
                fullWidth field="nationality"
                formState={formState}
                           variant="outlined"/>



                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={natureList}
                    getOptionLabel={option => option.description+ "-" + option.code}
                    onChange={onTagsChange}
                    renderTags={(value: any[], getTagProps) =>
                        value.map((option: any, index: number) => (
                            <Chip variant="outlined" label={option.description +" - "+option.code} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="Nature Business" placeholder="Favorites"/>
                    )}
                />




                <Div columns={2} >
                    <Button  type="submit" onClick={()=>setTabValue(tabValue - 1)}
                             variant="contained"
                             color="secondary">
                        {t("PREVIOUS")}
                    </Button>
                    <Button  variant="contained" color="primary" type="submit">Save and Continue</Button> :
                </Div>
            </Formsy>
        </Div>
    ), [form, formState, natureList])
};

//
function FormTextField(
    { formState, field, ...props }:
        TextFieldProps & { formState: any, field: string }
) {
    const [state, dispatch] = formState;
    // Performans sorunu olduğu için onChange yerine onBlur'da state güncellemesi yapıyoruz.
    return (
        <TextField  {...props} onBlur={e => dispatch({ ...state, [field]: e.target.value })} />
    )
}
