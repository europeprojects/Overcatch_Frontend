import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {FormControl, InputLabel, Select, TextField} from "@material-ui/core";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            padding: 4,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export type VisaInvitedformProps = {
    invitedForm: any
    setInvitedForm: any
}

export default function VisaInvitedform({invitedForm, setInvitedForm}: VisaInvitedformProps) {
    const {t} = useTranslation('letter');

    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    function handleForm(event){
        console.log(invitedForm)
        setInvitedForm({...invitedForm, [event.target.name]: event.target.value })
    }


    return (
        <div>
            <div className="flex w-full">

                <TextField onChange={handleForm}
                           fullWidth={true}
                           className="my-16 mx-6"
                           name="invitedName"
                           label={t("INVITEDNAME")}
                           variant="outlined"
                           value={invitedForm.invitedName}


                />
                <TextField onChange={handleForm}
                           fullWidth={true}
                           className="my-16 mx-6"
                           name="invitedSurname"
                           label={t("INVITEDSURNAME")}
                           variant="outlined"
                           value={invitedForm.invitedSurname}

                />
            </div>
            <div className="flex w-full">

                <TextField
                    onChange={handleForm}
                    fullWidth={true}
                    className="my-16 mx-6 w-1/2"
                    id="date"
                    name="invitedDOB"
                    label={t("INVITEDDOB")}
                    type="date"
value={invitedForm.invitedDOB}
                    defaultValue={selectedDate}

                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        max: '3000-01-01',
                        min:'1000-01-01'
                    }}
                    variant="outlined"

                />

                <FormControl variant="filled" className="my-16 mx-6 w-1/2">
                    <InputLabel htmlFor="filled-age-native-simple">{t("SEX")}</InputLabel>
                    <Select
                        native
                        value={invitedForm.sex}
                        onChange={handleForm}
                        inputProps={{
                            name: 'age',
                            id: 'filled-age-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={"true"}>{t("MALE")}</option>
                        <option value={"false"}>{t("FEMALE")}</option>
                    </Select>
                </FormControl>
            </div>
            <div className="flex w-full">

                <TextField onChange={handleForm}
                           fullWidth={true}
                           className="my-16 mx-6"
                           name="invitedRelation"
                           label={t("RELATIONSHIP")}
                           variant="outlined"
                           value={invitedForm.invitedRelation}

                />
            </div>
            <div className="flex w-full">

                <TextField onChange={handleForm}
                           fullWidth={true}
                           className="my-16 mx-6"
                           name="invitedAddress"
                           label={t("INVITEDADDRESS")}
                           variant="outlined"
                           value={invitedForm.invitedAddress}
                />
            </div>
        </div>
    );
}
