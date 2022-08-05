import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import reducer from './store';
import { selectWidgetsEntities, getWidgets } from './store/widgetsSlice';
import Widget1 from "./components/Widget1";
import Widget2 from "./components/Widget2";
import Widget3 from "./components/Widget3";
import Widget4 from "./components/Widget4";
import Widget5 from "./components/Widget5";
import Widget7 from "./components/Widget7";
import Widget8 from "./components/Widget8";
import Widget9 from "./components/Widget9";
import FuseAnimate from "../../../@fuse/core/FuseAnimate/FuseAnimate";
import WidgetNow from "./components/WidgetNow";
import Widget15 from "./components/Widget15";
import {useTranslation} from 'react-i18next';


function AnalyticsDashboardApp(props) {
	const dispatch = useDispatch();
	const widgets = useSelector(selectWidgetsEntities);
	const {t} = useTranslation('dashboard1');

	useEffect(() => {
		dispatch(getWidgets());
	}, [dispatch]);

	if (_.isEmpty(widgets)) {
		return null;
	}

	return (
		<div className="w-full">
			<Widget1 data={widgets.widget1} />

			<FuseAnimate animation="transition.slideUpIn" delay={200}>
				<div className="flex flex-col md:flex-row sm:p-8 container">
					<div className="flex flex-1 flex-col md:w-2/3 w-full">


						<div className="flex flex-col sm:flex sm:flex-row pb-32 ">
							<div className="widget flex w-full sm:w-1/3 p-16">
								<Widget2 data={widgets.widget2} />
							</div>

							<div className="widget flex w-full sm:w-1/3 p-16">
								<Widget3 data={widgets.widget3} />
							</div>

							<div className="widget w-full sm:w-1/3 p-16">
								<Widget4 data={widgets.widget4} />
							</div>
						</div>

						<FuseAnimate delay={600}>
							<Typography className="px-16 pb-8 text-18 font-300">
								{t("WIDGET5HEADER")}
							</Typography>
						</FuseAnimate>

						<div className="widget w-full p-16 pb-32">
							<Widget5 data={widgets.widget5} />
						</div>


					</div>

					<div className="flex flex-wrap w-full md:w-1/3 pt-16">
						<div className="widget w-full p-16">
							<WidgetNow/>
						</div>
						<div className="widget w-full p-16">
							<Widget15 data={widgets.widget15}/>
						</div>
					</div>
				</div>
			</FuseAnimate>
		</div>
	);
}


export default withReducer('analyticsDashboardApp', reducer)(AnalyticsDashboardApp);
