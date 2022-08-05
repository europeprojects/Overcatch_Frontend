import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import _ from "../../../../@lodash";
import {useTranslation} from "react-i18next";

function Widget12(props) {
    const widget = _.merge({}, props.data);
    const {t} = useTranslation('dashboard1');


    return (
        <Paper className="w-full rounded-8 shadow-1">
            <div className="flex items-center justify-between px-4 pt-4">
                <Typography className="text-16 px-12">{t("ISSUES")}</Typography>

            </div>
            <div className="text-center pt-12 pb-28">
                <Typography className="text-72 leading-none text-orange">{widget.data.count}</Typography>
                <Typography className="text-16" color="textSecondary">
                    {t("OPEN")}
                </Typography>
            </div>
            <div className="flex items-center px-16 h-52 border-t-1">
                <Typography className="text-15 flex w-full" color="textSecondary">
                    <span className="truncate">{t("CLOSEDTODAY")}</span>:
                    <b className="px-8">{widget.data.extra.count}</b>
                </Typography>
            </div>
        </Paper>
    );
}

export default React.memo(Widget12);
