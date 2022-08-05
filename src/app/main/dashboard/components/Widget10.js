import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import _ from "../../../../@lodash";
import {useTranslation} from "react-i18next";

function Widget10(props) {
    const widget = _.merge({}, props.data);
    const [currentRange, setCurrentRange] = useState(widget.currentRange);
    const {t} = useTranslation('dashboard1');

    function handleChangeRange(ev) {
        setCurrentRange(ev.target.value);
    }

    return (
        <Paper className="w-full rounded-8 shadow-1">
            <div className="flex items-center justify-between px-4 pt-4">
                <Typography className="text-16 px-12">{t("THISWEEK")}</Typography>

            </div>
            <div className="text-center pt-12 pb-28">
                <Typography className="text-72 leading-none text-blue">
                    {widget.data.count[currentRange]}
                </Typography>
                <Typography className="text-16" color="textSecondary">
                    {t("APPLICATIONS")}
                </Typography>
            </div>
            <div className="flex items-center px-16 h-52 border-t-1">
                <Typography className="text-15 flex w-full" color="textSecondary">
                    <span className="truncate">{t("COMPLETED")}</span>:
                    <b className="px-8">{widget.data.extra.count[currentRange]}</b>
                </Typography>
            </div>
        </Paper>
    );
}

export default React.memo(Widget10);
