import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import _ from "../../../../@lodash";
import {useTranslation} from "react-i18next";

function Widget17(props) {
    const widget = _.merge({}, props.data);
    const [currentRange, setCurrentRange] = useState(widget.currentRange);
    const {t} = useTranslation('dashboard1');

    function handleChangeRange(ev) {
        setCurrentRange(ev.target.value);
    }

    return (
        <Paper className="w-full rounded-8 shadow-1">
            <div className="flex items-center justify-between px-16 h-64 border-b-1">
                <Typography className="text-16">{t("NOTIFICATIONS")}</Typography>

                <Select
                    native
                    value={currentRange}
                    onChange={handleChangeRange}
                    inputProps={{
                        name: 'currentRange'
                    }}
                    disableUnderline
                >
                    {Object.entries(widget.ranges).map(([key, n]) => {
                        return (
                            <option key={key} value={key}>
                                {n}
                            </option>
                        );
                    })}
                </Select>
            </div>
            <List>
                {widget.schedule[currentRange].map(item => (
                    <ListItem key={item.id}>
                        <ListItemText primary={item.title} secondary={item.time} />
                        {/*<ListItemSecondaryAction>*/}
                        {/*    <IconButton aria-label="more">*/}
                        {/*        <Icon>more_vert</Icon>*/}
                        {/*    </IconButton>*/}
                        {/*</ListItemSecondaryAction>*/}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default React.memo(Widget17);
