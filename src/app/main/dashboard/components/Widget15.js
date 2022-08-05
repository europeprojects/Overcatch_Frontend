import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import React, {useEffect, useState} from 'react';
import { Doughnut } from 'react-chartjs-2';
import {useTranslation} from "react-i18next";

function Widget15(props) {
    const widget = _.merge({}, props.data);
    const [currentRange, setCurrentRange] = useState(widget.currentRange);
    const {t} = useTranslation('dashboard1');

 
    function handleChangeRange(ev) {
        setCurrentRange(ev.target.value);
    }

    return (

        <Paper className="w-full rounded-8 shadow-1">
            <div className="flex items-center justify-between px-16 h-64 border-b-1">
                <Typography className="text-16">{t("TASKDISTRUBUTION")}</Typography>

                {/*<Select*/}
                {/*    native*/}
                {/*    value={currentRange}*/}
                {/*    onChange={handleChangeRange}*/}
                {/*    inputProps={{*/}
                {/*        name: 'currentRange'*/}
                {/*    }}*/}
                {/*    disableUnderline*/}
                {/*>*/}
                {/*    /!*{Object.entries(widget.ranges).map(([key, n]) => {*!/*/}
                {/*    /!*    return (*!/*/}
                {/*    /!*        <option key={key} value={key}>*!/*/}
                {/*    /!*            {n}*!/*/}
                {/*    /!*        </option>*!/*/}
                {/*    /!*    );*!/*/}
                {/*    /!*})}*!/*/}
                {/*</Select>*/}
            </div>
            <div className="h-400 w-full p-32">
                <Doughnut
                    data={{
                        labels: widget.mainChart.labels,
                        datasets: widget.mainChart.datasets[currentRange]
                    }}
                    options={widget.mainChart.options}
                />
            </div>
            <div className="flex items-center p-8 border-t-1">
                <div className="flex flex-1 flex-col items-center justify-center p-16 border-r-1">
                    <Typography className="text-32 leading-none">{widget.footerLeft.count[currentRange]}</Typography>
                    <Typography className="text-15" color="textSecondary">
                        {t("TASKSADDED")}
                    </Typography>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center p-16">
                    <Typography className="text-32 leading-none">{widget.footerRight.count[currentRange]}</Typography>
                    <Typography className="text-15" color="textSecondary">
                        {t("TASKSCOMPLETED")}
                    </Typography>
                </div>
            </div>
        </Paper>
    );
}

export default React.memo(Widget15);
