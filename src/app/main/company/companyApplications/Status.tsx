import _ from '@lodash';
import clsx from 'clsx';
import React from 'react';
import {useTranslation} from "react-i18next";

function Status(props:any) {
    const {t} = useTranslation('companyApplications');

    const orderStatuses = [
        {
            id: "0",
            name: t('NOTAPPLIED'),
            color: 'bg-orange text-white'
        },
        {
            id: "1",
            name: t('APPLIED'),
            color: 'bg-blue text-white'
        },
        {
            id: "2",
            name: t('INVALIDAPPLICATION'),
            color: 'bg-red text-white'
        },
        {
            id: "3",
            name: t('APPROVED'),
            color: 'bg-green text-white'
        }
    ];

    return (
        <div className={clsx('inline text-16 p-4 rounded truncate', _.find(orderStatuses, { id: props.id }).color)}>
            {_.find(orderStatuses, { id: props.id }).name}
        </div>
    );
}

export default Status;
