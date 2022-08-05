import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ReminderType} from "../../types/UserModel";
import api from "../../services/BackendApi";
import FormControl from "@material-ui/core/FormControl";
import {useTranslation} from "react-i18next";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            // minWidth: 120,
            fullWidth: true
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export type ReminderTypeSelectorProps = {
    selectedValue: any
    setSelectedValue: any
    setValue: any
    setValue2: any
    value: any
    value2: any
    reminderValue: any
    setReminderValue: any
    reminderId: any
    setReminderId: any
    selectedReminderTypeName: any
    setSelectedReminderTypeName: any

}

export default function ReminderTypeSelector({
                                               setSelectedValue,
                                               selectedValue,
                                               reminderId,
                                               setReminderId,
                                               setValue2,
                                               setValue,
                                               value,
                                               value2,
                                               reminderValue,
                                               setReminderValue,
                                               selectedReminderTypeName,
                                               setSelectedReminderTypeName
                                           }: ReminderTypeSelectorProps) {
    const classes = useStyles();
    const [ReminderTypes, setReminderTypes] = useState<ReminderType[]>([]);
    const {t} = useTranslation('letter');


    useEffect(() => {
        api.getReminderTypes().then(res => {
            setReminderTypes(res)
            // console.log(data)
        })
    }, [])

    const SampleInitialValue = [
        {
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
    }, {"type": "paragraph", "children": [{"text": "Try it out for yourself!"}]}
    ]

    const handleChange = (event) => {


        if (event.target.value === 0) {
            setValue(SampleInitialValue)
        } else {
            // setValue(event.target.value)
            api.getReminderTypeByID(event.target.value).then(data => {
                console.log("selected reminder data: ", JSON.stringify(data));
                setSelectedValue(data);
            })
            api.getReminderTypes().then(res => {
                    setReminderTypes(res)
                     // console.log(res)
                }
            )
        }
        setValue2(event.target.reminderTypeName)
        setSelectedReminderTypeName(ReminderTypes.find(value1 => value1.id.toString() === event.target.value).reminderTypeName.toString())
        setReminderValue(event.target.value)
        setReminderId(event.target.value)

    };
    return (
        <FormControl variant="filled" className={classes.formControl}>
            <InputLabel shrink={true} htmlFor="filled-age-native-simple">
                {t("SELECTREMINDERTYPE")}
            </InputLabel>
            <div className="justify-items-stretch" style={{width:'300px'}}>
                <Select
                    native
                    fullWidth={true}
                    name={"ReminderType"}
                    onChange={handleChange}
                    value={value2}
                    inputProps={{
                        name: 'age',
                        id: 'filled-age-native-simple',
                        shrink: true,
                    }}
                >
                    {value2 === "" ? (<option value={0} label={t("SAMPLEVALUE")} aria-label="Sample Value"/>):("")}
                    {ReminderTypes.map((reminder) => <option value={reminder?.id} label={reminder?.reminderTypeName}/>)}
                </Select>
            </div>
        </FormControl>
    );
}
