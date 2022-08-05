import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import _ from '@lodash';
import reducer from './store';
import {getWidgets, selectWidgetsEntities} from './store/widgetsSlice';
import Widget10 from "./components/Widget10";
import Widget11 from "./components/Widget11";
import Widget12 from "./components/Widget12";
import Widget13 from "./components/Widget13";
import Widget15 from "./components/Widget15";
import FuseAnimate from "../../../@fuse/core/FuseAnimate/FuseAnimate";
import WidgetNow from "./components/WidgetNow";
import Widget17 from "./components/Widget17";


function AnalyticsDashboardApp(props) {
    const dispatch = useDispatch();
    const widgets = useSelector(selectWidgetsEntities);

    useEffect(() => {
        dispatch(getWidgets());
    }, [dispatch]);

    if (_.isEmpty(widgets)) {
        return null;
    }

    return (
        <div className="w-full">

            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row sm:p-8 container">
                    <div className="flex flex-1 flex-col md:w-2/3 w-full">


                        <div className="flex flex-col sm:flex sm:flex-row pb-32 ">
                            <div className="widget flex w-full sm:w-1/4 p-16">
                                <Widget10 data={widgets.widget10}/>
                            </div>

                            <div className="widget flex w-full sm:w-1/4 p-16">
                                <Widget11 data={widgets.widget11}/>

                            </div>

                            <div className="widget w-full sm:w-1/4 p-16">
                                <Widget12 data={widgets.widget12}/>
                            </div>

                            <div className="widget w-full sm:w-1/4 p-16">
                                <Widget13 data={widgets.widget13}/>
                            </div>
                        </div>


                        <div className="widget w-full p-16 pb-32">
                            <Widget17 data={widgets.widget17}/>
                        </div>


                    </div>

                    <div className="flex flex-wrap w-full md:w-1/3">
                        <div className="widget w-full p-16 pb-32">
                            <WidgetNow />
                        </div>
                        <div className="widget w-full p-16 ">
                            <Widget15 data={widgets.widget15}/>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}


export default withReducer('analyticsDashboardApp', reducer)(AnalyticsDashboardApp);
