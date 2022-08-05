import withReducer from 'app/store/withReducer';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import _ from '@lodash';
import reducer from './store';
import {selectWidgetsEntities, getWidgets} from './store/widgetsSlice';
import Widget1 from "./components/Widget1";
import Widget5 from "./components/Widget5";
import Widget8 from "./components/Widget8";
import FuseAnimate from "../../../@fuse/core/FuseAnimate/FuseAnimate";
import Widget17 from "./components/Widget17";
import Widget18 from "./components/Widget18";


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
            <Widget1 data={widgets.widget1}/>

            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row sm:p-8 container">
                    <div className="flex flex-1 flex-col min-w-0">
                        <div className="widget w-full p-16 pb-32">
                            <Widget5 data={widgets.widget5}/>
                        </div>
                        <div className="widget w-full p-16 pb-32">
                            <Widget17 data={widgets.widget17}/>
                        </div>
                    </div>

                    <div className="flex flex-wrap w-full md:w-320 pt-16">

                            <div className="widget w-full p-16">
                                <Widget8 data={widgets.widget8}/>
                            </div>


                        <div className="mb-32 w-full sm:w-1/2 md:w-full">

                            <div className="widget w-full p-16">
                                <Widget18 data={widgets.widget18}/>
                            </div>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}


export default withReducer('analyticsDashboardApp', reducer)(AnalyticsDashboardApp);
