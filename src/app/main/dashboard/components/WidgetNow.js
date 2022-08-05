import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

function WidgetNow(props) {
    const [time, setTime] = useState(moment());

    // useEffect(() => {
    //     intervalRef.current = setInterval(update, 1000);
    //     return () => {
    //         clearInterval(intervalRef.current);
    //     };
    // });

    useEffect(() => {
        setInterval(() => {
update();
        }, 1000);

    }, []);

    function update() {
        setTime(moment());
    }

    return (
        <Paper className="w-full rounded-8 shadow-1">
            <div className="flex items-center justify-between px-4 pt-4">
                <Typography className="text-16 px-12">{time.format('dddd, HH:mm:ss')}</Typography>

            </div>
            <div className="text-center px-24 py-32">
                <Typography className="text-24 leading-tight" color="textSecondary">
                    {time.format('MMMM')}
                </Typography>
                <Typography className="text-72 leading-tight" color="textSecondary">
                    {time.format('D')}
                </Typography>
                <Typography className="text-24 leading-tight" color="textSecondary">
                    {time.format('Y')}
                </Typography>
            </div>
        </Paper>
    );
}

export default React.memo(WidgetNow);
