import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
const analyticsDashboardAppDB = {
    widgets: [
        {
            id: 'widget1',
            chartType: 'line',
            datasets: {
                '2015': [
                    {
                        label: 'Sales',
                        data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9],
                        fill: 'start'
                    }
                ],
                '2016': [
                    {
                        label: 'Sales',
                        data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8],
                        fill: 'start'
                    }
                ],
                '2017': [
                    {
                        label: 'Sales',
                        data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9],
                        fill: 'start'
                    }
                ]
            },
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 32,
                        left: 32,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    },
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                                drawBorder: false,
                                tickMarkLength: 18
                            },
                            ticks: {
                                fontColor: '#ffffff'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 1.5,
                                max: 5,
                                stepSize: 0.5
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    },
                    xLabelsOnTop: {
                        active: true
                    }
                }
            }
        },
        {
            id: 'widget2',
            conversion: {
                value: 363,
                ofTarget: 2
            },
            chartType: 'bar',
            datasets: [
                {
                    label: 'Daily Transactions',
                    data: [50, 76, 88, 33, 48, 21, 47]
                }
            ],
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16
                    }
                },
                scales: {
                    xAxes: [
                        {
                            display: false
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 0,
                                max: 100
                            }
                        }
                    ]
                }
            }
        },
        {
            id: 'widget3',
            impressions: {
                value: '87',
                ofTarget: 4
            },
            chartType: 'line',
            datasets: [
                {
                    label: 'Processes',
                    data: [
                        67,
                        54,
                        82,
                        57,
                        72,
                        57,
                        87,
                        72,
                        89,
                        98,
                        112,
                        136,
                        11,
                        38,
                        98
                    ],
                    fill: false
                }
            ],
            labels: [
                'Jan 1',
                'Jan 2',
                'Jan 3',
                'Jan 4',
                'Jan 5',
                'Jan 6',
                'Jan 7',
                'Jan 8',
                'Jan 9',
                'Jan 10',
                'Jan 11',
                'Jan 12',
                'Jan 13',
                'Jan 14',
                'Jan 15'
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 2,
                        borderWidth: 1,
                        hoverRadius: 2,
                        hoverBorderWidth: 1
                    },
                    line: {
                        tension: 0
                    }
                },
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16
                    }
                },
                scales: {
                    xAxes: [
                        {
                            display: false
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                // min: 100,
                                // max: 500
                            }
                        }
                    ]
                }
            }
        },
        {
            id: 'widget4',
            visits: {
                value: 882,
                ofTarget: -9
            },
            chartType: 'bar',
            datasets: [
                {
                    label: 'Visits',
                    data: [432, 428, 327, 363, 456, 267, 231]
                }
            ],
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16
                    }
                },
                scales: {
                    xAxes: [
                        {
                            display: false
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 150,
                                max: 500
                            }
                        }
                    ]
                }
            }
        },
        {
            id: 'widget5',
            chartType: 'line',
            datasets: {
                yesterday: [
                    {
                        label: 'Expense',
                        data: [190, 300, 340, 220, 290, 390, 250, 380, 410, 380, 320, 290],
                        fill: 'start'
                    },
                    {
                        label: 'Income',
                        data: [2200, 2900, 3900, 2500, 3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800],
                        fill: 'start'
                    }
                ],
                today: [
                    {
                        label: 'Expense',
                        data: [410, 380, 320, 290, 190, 390, 250, 380, 300, 340, 220, 290],
                        fill: 'start'
                    },
                    {
                        label: 'Income',
                        data: [3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900, 2900, 3900, 2500, 3800],
                        fill: 'start'
                    }
                ]
            },
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false
                },
                layout: {
                    padding: {
                        left: 24,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: 'rgba(0,0,0,0.54)'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                tickMarkLength: 16
                            },
                            ticks: {
                                stepSize: 1000
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    }
                }
            }
        },
        {
            id: 'widget6',
            markers: [
                {
                    lat: 52,
                    lng: -73,
                    label: '120'
                },
                {
                    lat: 37,
                    lng: -104,
                    label: '498'
                },
                {
                    lat: 21,
                    lng: -7,
                    label: '443'
                },
                {
                    lat: 55,
                    lng: 75,
                    label: '332'
                },
                {
                    lat: 51,
                    lng: 7,
                    label: '50'
                },
                {
                    lat: 31,
                    lng: 12,
                    label: '221'
                },
                {
                    lat: 45,
                    lng: 44,
                    label: '455'
                },
                {
                    lat: -26,
                    lng: 134,
                    label: '231'
                },
                {
                    lat: -9,
                    lng: -60,
                    label: '67'
                },
                {
                    lat: 33,
                    lng: 104,
                    label: '665'
                }
            ],
            styles: [
                {
                    featureType: 'administrative',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#444444'
                        }
                    ]
                },
                {
                    featureType: 'landscape',
                    elementType: 'all',
                    stylers: [
                        {
                            color: '#f2f2f2'
                        }
                    ]
                },
                {
                    featureType: 'poi',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'all',
                    stylers: [
                        {
                            saturation: -100
                        },
                        {
                            lightness: 45
                        }
                    ]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'simplified'
                        }
                    ]
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'transit',
                    elementType: 'all',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'all',
                    stylers: [
                        {
                            color: '#039be5'
                        },
                        {
                            visibility: 'on'
                        }
                    ]
                }
            ]
        },
        {
            id: 'widget7',
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: {
                Today: [
                    {
                        data: [92.8, 6.1, 1.1],
                        change: [-0.6, 0.7, 0.1]
                    }
                ],
                Yesterday: [
                    {
                        data: [77.2, 8.4, 14.4],
                        change: [-2.3, 0.3, -0.2]
                    }
                ],
                'Last 7 days': [
                    {
                        data: [88.2, 9.2, 2.6],
                        change: [1.9, -0.4, 0.3]
                    }
                ],
                'Last 28 days': [
                    {
                        data: [65.2, 2.6, 32.2],
                        change: [-12.6, -0.7, 4.2]
                    }
                ],
                'Last 90 days': [
                    {
                        data: [93.5, 4.2, 2.3],
                        change: [2.6, -0.7, 2.1]
                    }
                ]
            },
            options: {
                cutoutPercentage: 75,
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false
            }
        },
        {
            id: 'widget8',
            datasets: [
                [
                    {
                        label: '1Day',
                        data: [72, 65, 70, 78, 85, 82, 88],
                        fill: false,
                        borderColor: '#5c84f1'
                    }
                ],
                [
                    {
                        label: '1Week',
                        data: [540, 539, 527, 548, 540, 552, 566],
                        fill: false,
                        borderColor: '#5c84f1'
                    }
                ],
                [
                    {
                        label: '1Month',
                        data: [1520, 1529, 1567, 1588, 1590, 1652, 1622],
                        fill: false,
                        borderColor: '#5c84f1'
                    }
                ]
            ],
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            options: {
                spanGaps: true,
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                elements: {
                    point: {
                        radius: 2,
                        borderWidth: 1,
                        hoverRadius: 2,
                        hoverBorderWidth: 1
                    },
                    line: {
                        tension: 0
                    }
                },
                layout: {
                    padding: {
                        top: 24,
                        left: 16,
                        right: 16,
                        bottom: 16
                    }
                },
                scales: {
                    xAxes: [
                        {
                            display: false
                        }
                    ],
                    yAxes: [
                        {
                            display: true,
                            ticks: {
                                // min: 100,
                                // max: 500
                            }
                        }
                    ]
                }
            },
            today: '12,540',
            change: {
                value: 321,
                percentage: 2.05
            }
        },
        {
            id: 'widget9',
            rows: [
                {
                    title: 'Holiday Travel',
                    clicks: 3621,
                    conversion: 90
                },
                {
                    title: 'Get Away Deals',
                    clicks: 703,
                    conversion: 7
                },
                {
                    title: 'Airfare',
                    clicks: 532,
                    conversion: 0
                },
                {
                    title: 'Vacation',
                    clicks: 201,
                    conversion: 8
                },
                {
                    title: 'Hotels',
                    clicks: 94,
                    conversion: 4
                }
            ]
        },
        {
            id: 'widget10',
            ranges: {
                DY: 'Last Week',
                DT: 'This Week',
                DTM: 'Next Week'
            },
            currentRange: 'DT',
            data: {
                label: 'APPLICATIONS',
                count: {
                    DY: 21,
                    DT: 25,
                    DTM: 19
                },
                extra: {
                    label: 'Completed',
                    count: {
                        DY: 6,
                        DT: 7,
                        DTM: '-'
                    }
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
        {
            id: 'widget11',
            title: 'Overdue',
            data: {
                label: 'TASKS',
                count: 4,
                extra: {
                    label: "Yesterday's overdue",
                    count: 2
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
               {
            id: 'widget12',
            title: 'Issues',
            data: {
                label: 'OPEN',
                count: 32,
                extra: {
                    label: 'Closed today',
                    count: 0
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
        {
            id: 'widget13',
            title: 'Completed',
            data: {
                label: 'TASKS',
                count: 42,
                extra: {
                    label: 'Today',
                    count: 3
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
        {
            id: 'widget15',
            title: 'Task Distribution',
            ranges: {
                TW: 'This Week',
                LW: 'Last Week',
                '2W': '2 Weeks Ago'
            },
            currentRange: 'TW',
            mainChart: {
                labels: ['Overdue', 'Issues', 'Applications', 'Completed'],
                datasets: {
                    TW: [
                        {
                            data: [15, 20, 38, 27],
                            backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
                            hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
                        }
                    ],
                    LW: [
                        {
                            data: [19, 16, 42, 23],
                            backgroundColor: ['#f44336', '#9c27b0', '#03A9F4', '#E91E63'],
                            hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
                        }
                    ],
                    '2W': [
                        {
                            data: [18, 17, 40, 25],
                            backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
                            hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
                        }
                    ]
                },
                options: {
                    cutoutPercentage: 66,
                    spanGaps: false,
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            usePointStyle: true
                        }
                    },
                    maintainAspectRatio: false
                }
            },
            footerLeft: {
                title: 'Tasks Added',
                count: {
                    '2W': 487,
                    LW: 526,
                    TW: 594
                }
            },
            footerRight: {
                title: 'Tasks Completed',
                count: {
                    '2W': 193,
                    LW: 260,
                    TW: 287
                }
            }
        },
        {
            id: 'widget16',
            title: 'Task Distribution',
            ranges: {
                TW: 'This Week',
                LW: 'Last Week',
                '2W': '2 Weeks Ago'
            },
            currentRange: 'TW',
            mainChart: {
                labels: ['Frontend', 'Backend', 'API', 'Issues'],
                datasets: {
                    TW: [
                        {
                            data: [15, 20, 38, 27],
                            backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
                            hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
                        }
                    ],
                    LW: [
                        {
                            data: [19, 16, 42, 23],
                            backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
                            hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
                        }
                    ],
                    '2W': [
                        {
                            data: [18, 17, 40, 25],
                            backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
                            hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
                        }
                    ]
                },
                options: {
                    cutoutPercentage: 66,
                    spanGaps: false,
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            usePointStyle: true
                        }
                    },
                    maintainAspectRatio: false
                }
            },
            footerLeft: {
                title: 'Tasks Added',
                count: {
                    '2W': 487,
                    LW: 526,
                    TW: 594
                }
            },
            footerRight: {
                title: 'Tasks Completed',
                count: {
                    '2W': 193,
                    LW: 260,
                    TW: 287
                }
            }
        },
        {
            id: 'widget17',
            title: 'Schedule',
            currentRange: 'T',
            ranges: {
                T: 'Today',
                TM: 'Tomorrow'
            },
            schedule: {
                T: [
                    {
                        id: 1,
                        title: 'Group Meeting',
                        time: 'In 32 minutes'
                    },
                    {
                        id: 2,
                        title: 'Coffee Break',
                        time: '10:30 AM'
                    },
                    {
                        id: 3,
                        title: 'Public Beta Release',
                        time: '11:00 AM'
                    },
                    {
                        id: 4,
                        title: 'Lunch',
                        time: '12:10 PM'
                    },
                    {
                        id: 5,
                        title: 'Dinner with David',
                        time: '17:30 PM'
                    },
                    {
                        id: 6,
                        title: "Jane's Birthday Party",
                        time: '19:30 PM'
                    },
                    {
                        id: 7,
                        title: "Overseer's Retirement Party",
                        time: '21:30 PM'
                    }
                ],
                TM: [
                    {
                        id: 1,
                        title: 'Marketing Meeting',
                        time: '09:00 AM'
                    },
                    {
                        id: 2,
                        title: 'Public Announcement',
                        time: '11:00 AM'
                    },
                    {
                        id: 3,
                        title: 'Lunch',
                        time: '12:10 PM'
                    },
                    {
                        id: 4,
                        title: 'Meeting with Beta Testers',
                        time: '15:00 AM'
                    },
                    {
                        id: 5,
                        title: 'Live Stream',
                        time: '17:30 PM'
                    },
                    {
                        id: 6,
                        title: 'Release Party',
                        time: '19:30 PM'
                    },
                    {
                        id: 7,
                        title: "CEO's Party",
                        time: '22:30 PM'
                    }
                ]
            }
        },
        {
            id: 'widget18',
            title: 'Notifications',
            currentRange: 'T',
            ranges: {
                T: 'Today',
                TM: 'Tomorrow'
            },
            schedule: {
                T: [
                    {
                        id: 1,
                        title: 'Legal amendment notice',
                        time: '12:10 PM'

                    },
                    {
                        id: 2,
                        title: 'Brp Date Expire',
                        time: 'In 3 days'

                    },
                    {
                        id: 3,
                        title: 'Police Registration',
                        time: 'In 5 days'

                    },
                    {
                        id: 4,
                        title: 'Announcement',
                        time: '7 Days Later'
                    },

                ],
                TM: [
                    {
                        id: 1,
                        title: 'Marketing Meeting',
                        time: '09:00 AM'
                    },
                    {
                        id: 2,
                        title: 'Public Announcement',
                        time: '11:00 AM'
                    },
                    {
                        id: 3,
                        title: 'Lunch',
                        time: '12:10 PM'
                    },
                    {
                        id: 4,
                        title: 'Meeting with Beta Testers',
                        time: '15:00 AM'
                    },
                    {
                        id: 5,
                        title: 'Live Stream',
                        time: '17:30 PM'
                    },
                    {
                        id: 6,
                        title: 'Release Party',
                        time: '19:30 PM'
                    },
                    {
                        id: 7,
                        title: "CEO's Party",
                        time: '22:30 PM'
                    }
                ]
            }
        },
        // {
        //     id: 'widget18',
        //     title: 'Budget Distribution',
        //     mainChart: {
        //         labels: ['Wireframing', 'Design', 'Coding', 'Marketing', 'Extra'],
        //         datasets: [
        //             {
        //                 data: [12, 17, 28, 25, 15],
        //                 backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63', '#FFC107'],
        //                 hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F', '#FFD341']
        //             }
        //         ],
        //         options: {
        //             cutoutPercentage: 0,
        //             spanGaps: false,
        //             legend: {
        //                 display: true,
        //                 position: 'bottom',
        //                 labels: {
        //                     padding: 16,
        //                     usePointStyle: true
        //                 }
        //             },
        //             maintainAspectRatio: false
        //         }
        //     }
        // },
        {
            id: 'widget19',
            title: 'Spent',
            ranges: {
                TW: 'This Week',
                LW: 'Last Week',
                '2W': '2 Weeks Ago'
            },
            currentRange: 'TW',
            weeklySpent: {
                title: 'WEEKLY SPENT',
                count: {
                    '2W': '2,682.85',
                    LW: '1,445.34',
                    TW: '3,630.15'
                },
                chart: {
                    '2W': {
                        datasets: [
                            {
                                label: 'Created',
                                data: [2, 6, 5, 4, 5, 3, 6],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    LW: {
                        datasets: [
                            {
                                label: 'Created',
                                data: [4, 6, 2, 2, 1, 3, 4],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    TW: {
                        datasets: [
                            {
                                label: 'Created',
                                data: [2, 6, 5, 4, 5, 3, 6],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [
                                {
                                    display: false
                                }
                            ],
                            yAxes: [
                                {
                                    display: false
                                }
                            ]
                        }
                    }
                }
            },
            totalSpent: {
                title: 'TOTAL SPENT',
                count: {
                    '2W': '29,682.85',
                    LW: '31,128.19',
                    TW: '34,758.34'
                },
                chart: {
                    '2W': {
                        datasets: [
                            {
                                label: 'Created',
                                data: [3, 2, 2, 4, 7, 7, 4],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    LW: {
                        datasets: [
                            {
                                label: 'Created',
                                data: [5, 7, 8, 8, 6, 4, 1],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    TW: {
                        datasets: [
                            {
                                label: 'Created',
                                data: [6, 4, 7, 5, 5, 4, 7],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [
                                {
                                    display: false
                                }
                            ],
                            yAxes: [
                                {
                                    display: false
                                }
                            ]
                        }
                    }
                }
            },
            remaining: {
                title: 'REMAINING',
                count: {
                    '2W': '94.317,15',
                    LW: '92.871,81',
                    TW: '89.241,66'
                },
                chart: {
                    '2W': {
                        datasets: [
                            {
                                label: 'Created',
                                data: [1, 4, 5, 7, 8, 2, 4],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    LW: {
                        datasets: [
                            {
                                label: 'Created',
                                data: [3, 2, 1, 4, 8, 8, 4],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    TW: {
                        datasets: [
                            {
                                label: 'Created',
                                data: [2, 4, 8, 6, 2, 5, 1],
                                fill: true,
                                backgroundColor: '#42BFF7',
                                pointRadius: 0,
                                pointHitRadius: 20,
                                borderWidth: 0
                            }
                        ],
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [
                                {
                                    display: false
                                }
                            ],
                            yAxes: [
                                {
                                    display: false
                                }
                            ]
                        }
                    }
                }
            },
            totalBudget: {
                title: 'TOTAL BUDGET',
                count: '124.000,00'
            }
        },
        {
            id: 'widget20',
            title: 'Budget Details',
            table: {
                columns: [
                    {
                        id: 'budget_type',
                        title: 'Budget Type'
                    },
                    {
                        id: 'total_budget',
                        title: 'Total Budget'
                    },
                    {
                        id: 'spent_usd',
                        title: 'Spent ($)'
                    },
                    {
                        id: 'spent_perc',
                        title: 'Spent (%)'
                    },
                    {
                        id: 'remaining_usd',
                        title: 'Remaining ($)'
                    },
                    {
                        id: 'remaining_perc',
                        title: 'Remaining (%)'
                    }
                ],
                rows: [
                    {
                        id: 1,
                        cells: [
                            {
                                id: 'budget_type',
                                value: 'Wireframing',
                                classes: 'bg-blue text-white',
                                icon: ''
                            },
                            {
                                id: 'total_budget',
                                value: '$14,880.00',
                                classes: 'font-bold',
                                icon: ''
                            },
                            {
                                id: 'spent_usd',
                                value: '$14,000.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'spent_perc',
                                value: '%94.08',
                                classes: 'text-green',
                                icon: 'trending_up'
                            },
                            {
                                id: 'remaining_usd',
                                value: '$880.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'remaining_perc',
                                value: '%5.92',
                                classes: '',
                                icon: ''
                            }
                        ]
                    },
                    {
                        id: 2,
                        cells: [
                            {
                                id: 'budget_type',
                                value: 'Design',
                                classes: 'bg-green text-white',
                                icon: ''
                            },
                            {
                                id: 'total_budget',
                                value: '$21,080.00',
                                classes: 'font-bold',
                                icon: ''
                            },
                            {
                                id: 'spent_usd',
                                value: '$17,240.34',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'spent_perc',
                                value: '%81.78',
                                classes: 'text-green',
                                icon: 'trending_up'
                            },
                            {
                                id: 'remaining_usd',
                                value: '$3,839.66',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'remaining_perc',
                                value: '%18.22',
                                classes: '',
                                icon: ''
                            }
                        ]
                    },
                    {
                        id: 3,
                        cells: [
                            {
                                id: 'budget_type',
                                value: 'Coding',
                                classes: 'bg-red text-white',
                                icon: ''
                            },
                            {
                                id: 'total_budget',
                                value: '$34,720.00',
                                classes: 'font-bold',
                                icon: ''
                            },
                            {
                                id: 'spent_usd',
                                value: '$3,518.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'spent_perc',
                                value: '%10.13',
                                classes: 'text-red',
                                icon: 'trending_down'
                            },
                            {
                                id: 'remaining_usd',
                                value: '$31,202.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'remaining_perc',
                                value: '%89.87',
                                classes: '',
                                icon: ''
                            }
                        ]
                    },
                    {
                        id: 4,
                        cells: [
                            {
                                id: 'budget_type',
                                value: 'Marketing',
                                classes: 'bg-pink text-white',
                                icon: ''
                            },
                            {
                                id: 'total_budget',
                                value: '$34,720.00',
                                classes: 'font-bold',
                                icon: ''
                            },
                            {
                                id: 'spent_usd',
                                value: '$0.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'spent_perc',
                                value: '%0.00',
                                classes: 'text-blue',
                                icon: 'trending_flat'
                            },
                            {
                                id: 'remaining_usd',
                                value: '$34,720.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'remaining_perc',
                                value: '%100.00',
                                classes: '',
                                icon: ''
                            }
                        ]
                    },
                    {
                        id: 5,
                        cells: [
                            {
                                id: 'budget_type',
                                value: 'Extra',
                                classes: 'bg-orange text-white',
                                icon: ''
                            },
                            {
                                id: 'total_budget',
                                value: '$18,600.00',
                                classes: 'font-bold',
                                icon: ''
                            },
                            {
                                id: 'spent_usd',
                                value: '$0.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'spent_perc',
                                value: '%0.00',
                                classes: 'text-blue',
                                icon: 'trending_flat'
                            },
                            {
                                id: 'remaining_usd',
                                value: '$34,720.00',
                                classes: '',
                                icon: ''
                            },
                            {
                                id: 'remaining_perc',
                                value: '%100.00',
                                classes: '',
                                icon: ''
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'widget21',
            title: 'Team Members',
            table: {
                columns: [
                    {
                        id: 'avatar',
                        title: ''
                    },
                    {
                        id: 'name',
                        title: 'Name'
                    },
                    {
                        id: 'position',
                        title: 'Position'
                    },
                    {
                        id: 'office',
                        title: 'Office'
                    },
                    {
                        id: 'email',
                        title: 'Email'
                    },
                    {
                        id: 'phone',
                        title: 'Phone'
                    }
                ],
                rows: [
                    {
                        id: 1,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/james.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Jack Gilbert'
                            },
                            {
                                id: 'position',
                                value: 'Design Manager'
                            },
                            {
                                id: 'office',
                                value: 'Johor Bahru'
                            },
                            {
                                id: 'email',
                                value: 'jgilbert48@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+16 298 032 7774'
                            }
                        ]
                    },
                    {
                        id: 2,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/katherine.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Kathy Anderson'
                            },
                            {
                                id: 'position',
                                value: 'Recruiting Manager'
                            },
                            {
                                id: 'office',
                                value: 'Solţānābād'
                            },
                            {
                                id: 'email',
                                value: 'kanderson49@mail.com.br'
                            },
                            {
                                id: 'phone',
                                value: '+23 572 311 1136'
                            }
                        ]
                    },
                    {
                        id: 3,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/garry.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Gary Gonzalez'
                            },
                            {
                                id: 'position',
                                value: 'Speech Pathologist'
                            },
                            {
                                id: 'office',
                                value: 'Gangkou'
                            },
                            {
                                id: 'email',
                                value: 'ggonzalez4r@mail.cc'
                            },
                            {
                                id: 'phone',
                                value: '+10 862 046 7916'
                            }
                        ]
                    },
                    {
                        id: 4,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/andrew.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Mark Turner'
                            },
                            {
                                id: 'position',
                                value: 'Recruiting Manager'
                            },
                            {
                                id: 'office',
                                value: 'Neftegorsk'
                            },
                            {
                                id: 'email',
                                value: 'mturner4a@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+01 139 803 9263'
                            }
                        ]
                    },
                    {
                        id: 5,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/jane.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Kathryn Martinez'
                            },
                            {
                                id: 'position',
                                value: 'Director of Sales'
                            },
                            {
                                id: 'office',
                                value: 'Palekastro'
                            },
                            {
                                id: 'email',
                                value: 'kmartinez4b@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+25 467 022 5393'
                            }
                        ]
                    },
                    {
                        id: 6,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/alice.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Annie Gonzales'
                            },
                            {
                                id: 'position',
                                value: 'Actuary'
                            },
                            {
                                id: 'office',
                                value: 'Candon'
                            },
                            {
                                id: 'email',
                                value: 'agonzales4c@mail.edu'
                            },
                            {
                                id: 'phone',
                                value: '+99 891 619 7138'
                            }
                        ]
                    },
                    {
                        id: 7,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/vincent.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Howard King'
                            },
                            {
                                id: 'position',
                                value: 'Human Resources'
                            },
                            {
                                id: 'office',
                                value: 'Bergen op Zoom'
                            },
                            {
                                id: 'email',
                                value: 'hking4d@mail.gov'
                            },
                            {
                                id: 'phone',
                                value: '+46 984 348 1409'
                            }
                        ]
                    },
                    {
                        id: 8,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/joyce.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Elizabeth Dixon'
                            },
                            {
                                id: 'position',
                                value: 'Electrical Engineer'
                            },
                            {
                                id: 'office',
                                value: 'Písečná'
                            },
                            {
                                id: 'email',
                                value: 'edixon4e@mail.gov'
                            },
                            {
                                id: 'phone',
                                value: '+33 332 067 9063'
                            }
                        ]
                    },
                    {
                        id: 9,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/danielle.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Dorothy Morris'
                            },
                            {
                                id: 'position',
                                value: 'Office Assistant'
                            },
                            {
                                id: 'office',
                                value: 'Magsaysay'
                            },
                            {
                                id: 'email',
                                value: 'dmorris4f@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+05 490 958 6120'
                            }
                        ]
                    },
                    {
                        id: 10,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/carl.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Mark Gonzales'
                            },
                            {
                                id: 'position',
                                value: 'Quality Control'
                            },
                            {
                                id: 'office',
                                value: 'Matsue-shi'
                            },
                            {
                                id: 'email',
                                value: 'mgonzales4g@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+03 168 394 9935'
                            }
                        ]
                    },
                    {
                        id: 11,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/profile.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Catherine Rogers'
                            },
                            {
                                id: 'position',
                                value: 'Programmer Analyst'
                            },
                            {
                                id: 'office',
                                value: 'Kangar'
                            },
                            {
                                id: 'email',
                                value: 'crogers4h@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+86 235 407 5373'
                            }
                        ]
                    },
                    {
                        id: 12,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/garry.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Ruth Grant'
                            },
                            {
                                id: 'position',
                                value: 'Community Outreach'
                            },
                            {
                                id: 'office',
                                value: 'Beaune'
                            },
                            {
                                id: 'email',
                                value: 'rgrant4i@mail.pl'
                            },
                            {
                                id: 'phone',
                                value: '+36 288 083 8460'
                            }
                        ]
                    },
                    {
                        id: 13,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/james.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Phyllis Gutierrez'
                            },
                            {
                                id: 'position',
                                value: 'Administrative Assistant'
                            },
                            {
                                id: 'office',
                                value: 'Shlissel’burg'
                            },
                            {
                                id: 'email',
                                value: 'pgutierrez4j@mail.net'
                            },
                            {
                                id: 'phone',
                                value: '+52 749 861 9304'
                            }
                        ]
                    },
                    {
                        id: 14,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/alice.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Lillian Morris'
                            },
                            {
                                id: 'position',
                                value: 'Media Planner'
                            },
                            {
                                id: 'office',
                                value: 'Berlin'
                            },
                            {
                                id: 'email',
                                value: 'lmorris4k@mail.de'
                            },
                            {
                                id: 'phone',
                                value: '+59 695 110 3856'
                            }
                        ]
                    },
                    {
                        id: 15,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/vincent.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Jeremy Anderson'
                            },
                            {
                                id: 'position',
                                value: 'Systems Engineer'
                            },
                            {
                                id: 'office',
                                value: 'Lũng Hồ'
                            },
                            {
                                id: 'email',
                                value: 'janderson4l@mail.uk'
                            },
                            {
                                id: 'phone',
                                value: '+40 384 115 1448'
                            }
                        ]
                    },
                    {
                        id: 16,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/carl.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Arthur Lawrence'
                            },
                            {
                                id: 'position',
                                value: 'Nurse Practicioner'
                            },
                            {
                                id: 'office',
                                value: 'Sarkanjut'
                            },
                            {
                                id: 'email',
                                value: 'alawrence4m@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+36 631 599 7867'
                            }
                        ]
                    },
                    {
                        id: 17,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/andrew.jpg'
                            },
                            {
                                id: 'name',
                                value: 'David Simmons'
                            },
                            {
                                id: 'position',
                                value: 'Social Worker'
                            },
                            {
                                id: 'office',
                                value: 'Ushumun'
                            },
                            {
                                id: 'email',
                                value: 'dsimmons4n@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+01 189 681 4417'
                            }
                        ]
                    },
                    {
                        id: 18,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/danielle.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Daniel Johnston'
                            },
                            {
                                id: 'position',
                                value: 'Help Desk'
                            },
                            {
                                id: 'office',
                                value: 'São Carlos'
                            },
                            {
                                id: 'email',
                                value: 'djohnston4o@mail.gov'
                            },
                            {
                                id: 'phone',
                                value: '+60 028 943 7919'
                            }
                        ]
                    },
                    {
                        id: 19,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/joyce.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Ann King'
                            },
                            {
                                id: 'position',
                                value: 'Internal Auditor'
                            },
                            {
                                id: 'office',
                                value: 'Liren'
                            },
                            {
                                id: 'email',
                                value: 'aking4p@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+91 103 932 6545'
                            }
                        ]
                    },
                    {
                        id: 20,
                        cells: [
                            {
                                id: 'avatar',
                                value: 'assets/images/avatars/james.jpg'
                            },
                            {
                                id: 'name',
                                value: 'Phillip Franklin'
                            },
                            {
                                id: 'position',
                                value: 'VP Accounting'
                            },
                            {
                                id: 'office',
                                value: 'Soba'
                            },
                            {
                                id: 'email',
                                value: 'pfranklin4q@mail.com'
                            },
                            {
                                id: 'phone',
                                value: '+25 820 986 7626'
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'weatherWidget',
            locations: {
                NewYork: {
                    name: 'New York',
                    icon: 'rainy2',
                    temp: {
                        C: '22',
                        F: '72'
                    },
                    windSpeed: {
                        KMH: 12,
                        MPH: 7.5
                    },
                    windDirection: 'NW',
                    rainProbability: '98%',
                    next3Days: [
                        {
                            name: 'Sunday',
                            icon: 'rainy',
                            temp: {
                                C: '21',
                                F: '70'
                            }
                        },
                        {
                            name: 'Monday',
                            icon: 'cloudy',
                            temp: {
                                C: '19',
                                F: '66'
                            }
                        },
                        {
                            name: 'Tuesday',
                            icon: 'windy3',
                            temp: {
                                C: '24',
                                F: '75'
                            }
                        }
                    ]
                }
            },
            currentLocation: 'NewYork',
            tempUnit: 'C',
            speedUnit: 'KMH'
        }
    ]
};

export const getWidgets = createAsyncThunk('analyticsDashboardApp/widgets/getWidgets', async () => {
    // const response = await axios.get('/api/analytics-dashboard-app/widgets');
    const data = analyticsDashboardAppDB.widgets

    return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgetsEntities, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
    state => state.analyticsDashboardApp.widgets
);

const widgetsSlice = createSlice({
    name: 'analyticsDashboardApp/widgets',
    initialState: widgetsAdapter.getInitialState({}),
    reducers: {},
    extraReducers: {
        [getWidgets.fulfilled]: widgetsAdapter.setAll
    }
});



export default widgetsSlice.reducer;
