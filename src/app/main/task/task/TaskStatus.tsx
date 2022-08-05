import _ from '@lodash';
import clsx from 'clsx';
import React from 'react';
import {useTranslation} from "react-i18next";
function TasksStatus(props: any) {
	const { t } = useTranslation('task');
	const orderStatuses = [

		{
			id: 'DEFAULT',
			name: t("DEFAULT"),
			color: 'bg-blue text-white'
		},
		{
			id: 'INPROGRESS',
			name: t("INPROGRESS"),
			color: 'bg-orange text-white'
		},
		{
			id: 'DONE',
			name: t("DONE"),
			color: 'bg-green text-white'
		},
		{	id: 'REJECTED',
			name: t("REJECTED"),
			color: 'bg-red text-white'
		}
		// ,
		// {
		// 	id: "RET",
		// 	name: 'İşlem Başarısız',
		// 	color: 'bg-red text-white'
		// }
	];
	return (
		<div className={clsx('inline text-16 p-4 rounded truncate', _.find(orderStatuses, { id: props.id }).color)}>
			{_.find(orderStatuses, { id: props.id }).name}
		</div>
	);
}

export default TasksStatus;
