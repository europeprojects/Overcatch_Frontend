import React, { useEffect, useState } from 'react';
import PropTypes, {any, number, string} from 'prop-types';
import clsx from 'clsx';
import {createStyles, createTheme, lighten, makeStyles, Theme, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import {
	Button,
	CircularProgress,
	DialogContent,
	Grid,
	MenuItem,
	Select,
	TableFooter,
	TextField,
	Card
} from '@material-ui/core';
import { PageContainer, PageContent, PageMain } from './notifCreate';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import api from '../../services/BackendApi';
import { NoticeLog, NoticeLogDTO, NotificationLogFilter } from '../../types/UserModel';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Slide from '@material-ui/core/Slide';

import List from '@material-ui/core/List';
import _ from 'lodash';

import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';

import FuseAnimate from '@fuse/core/FuseAnimate';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Checkbox from "@material-ui/core/Checkbox";
import {Div} from "../../components/Grid";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import history from "../../../@history/@history";
import Backdrop from "@material-ui/core/Backdrop";
import Textfield from "@material-ui/core/TextField";
import config from "../../services/Config";

const theme = createTheme();

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

const useStyles1 = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexShrink: 0,
			marginLeft: theme.spacing(2.5)
		}
	})
);

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
	const classes = useStyles1();
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<div className={classes.root}>
			<IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
				{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</div>
	);
}

function EnhancedTableHead(props) {
	const { t } = useTranslation('task');
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		notificationLogFilter,
		setNotificationLogFilter,
		numSelected,
		rowCount,
		onRequestSort
	} = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};
	//'Created Date Time' translater'ı güncellendi.
	const headCells = [
		{ id: 'subject', numeric: false, disablePadding: false, label: t('SUBJECT') },
		{ id: 'createdDateTime', numeric: true, disablePadding: false, label: t('CREATEDDATETIME') },
		{ id: 'notitype', numeric: false, disablePadding: false, label: t('NOTIFICATIONTYPE') },
		{ id: 'action', numeric: false, disablePadding: false, label: 'Action' }

		// { id: 'company', numeric: false, disablePadding: true, label: t('COMPANY') },
		// { id: 'clienttype', numeric: true, disablePadding: false, label: t('CLIENTTYPE') },
		// { id: 'processtime', numeric: true, disablePadding: false, label: t('PROCESSTIME') },
		// { id: 'notitype', numeric: true, disablePadding: false, label: t('NOTIFICATIONTYPE') },
		// { id: 'notito', numeric: true, disablePadding: false, label: t('NOTIFICATIONTO') },
		// { id: 'foreandlastname', numeric: true, disablePadding: false, label: t('FIRSTANDLASTNAME') },
	];

	// Notification Tablosundan verileri almak için prob kullanıyorum.
	const { notificationType, setnotificationType, clientType, setClientType } = props;

	function handleChange(e, type) {
		setNotificationLogFilter({ ...notificationLogFilter, [e.target.name]: e.target.value, page: 0 });
		// if (type == 'clienttype') return setClientType(e.target.value);
		// else if (type == 'notitype') return setnotificationType(e.target.value);
	}

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell =>
					headCell.id == 'notitype' ? (
						<TableCell
							key={headCell.id}
							align={headCell.numeric ? 'center' : 'left'}
							padding={headCell.disablePadding ? 'none' : 'default'}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							{t('NOTIFICATIONTYPE')}
							<Select
								style={{ marginLeft: '8px' }}
								className="my-16"
								variant="standard"
								name="notificationType"
								//value={notificationLogFilter?.notificationType === "APP" ? "APP" : "Mail" }
								renderValue={(selected) => (selected)}
								onChange={e => handleChange(e, headCell.id)}
							>
								<MenuItem value={""}>{t('NOTIFICATIONTYPE')}</MenuItem>
								<MenuItem value={`MAIL`}>{`MAIL`}</MenuItem>
								<MenuItem value={`APP`}>{`APP`}</MenuItem>
							</Select>
						</TableCell>
					) : (
						<TableCell
							key={headCell.id}
							align={headCell.numeric ? 'center' : 'left'}

						>
							{headCell.label}
						</TableCell>
					)
				)}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
	notificationLogFilter: any,
	setNotificationLogFilter: any,
	clientType: any,
	setClientType: any
};

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1)
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark
			},
	title: {
		flex: '1 1 100%'
	}
}));

const EnhancedTableToolbar = props => {
	const classes = useToolbarStyles();
	const { numSelected } = props;
	const { t } = useTranslation('task');
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
					{t('NOTIFICATIONLISTS')}
				</Typography>
			)}

			{/*{numSelected > 0 ? (*/}
			{/*    <Tooltip title="Delete">*/}
			{/*        <IconButton aria-label="delete">*/}
			{/*            <DeleteIcon />*/}
			{/*        </IconButton>*/}
			{/*    </Tooltip>*/}
			{/*) : (*/}
			{/*    <Tooltip title="Filter list">*/}
			{/*        <IconButton aria-label="filter list">*/}
			{/*            <FilterListIcon />*/}
			{/*        </IconButton>*/}
			{/*    </Tooltip>*/}
			{/*)}*/}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	},
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	container: {
		maxHeight: 410
	}
}));

export default function EnhancedTable(props) {
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('soletraderaccountsdue');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);

	const [pageDialog, setPageDialog] = React.useState(0);
	const [rowsPerPageDialog, setRowsPerPageDialog] = React.useState(10);

	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const [totalElements, setTotalElements] = React.useState(0);
	const [notificationLogFilter, setNotificationLogFilter] = useState<NotificationLogFilter>();
	const [openBackDrop, setOpenBackDrop] = React.useState(false);
	const { t } = useTranslation('task');

	const mainTheme = useSelector(selectMainTheme);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = notifLOG.map(n => n.subject);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, company) => {
		const selectedIndex = selected.indexOf(company);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, company);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	// const handleChangePage = (event, newPage) => {
	//
	// 	setNotificationLogFilter({ ...notificationLogFilter, page: newPage, size: rowsPerPage });
	// 	// getNotificatonLogs(newPage, rowsPerPage, search, notificationType, startDate, endDate);
	// 	// getNotifitications(newPage, rowsPerPage, notificationType, clientType, search);
	// };
	//Benim kodladıklarım

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
		setNotificationLogFilter({ ...notificationLogFilter, page:newPage, size:rowsPerPage})
	};

	const handleChangePageDialog = (event: unknown, newPage: number) => {
		setPageDialog(newPage);
	};

	const handleChangeRowsPerPageDialog = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setRowsPerPageDialog(parseInt(event.target.value, 10))
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setNotificationLogFilter({ ...notificationLogFilter, page:0,size:parseInt(event.target.value, 10)});
	};

	// const handleChangeRowsPerPage = event => {
	// 	setRowsPerPage(parseInt(event.target.value, 10));
	// 	setPage(0);
	// 	setNotificationLogFilter({ ...notificationLogFilter, page: 0, size: parseInt(event.target.value, 10) });
	// 	// getNotificatonLogs(0, rowsPerPage, search, notificationType, startDate, endDate);
	// 	// getNotifitications(0, parseInt(event.target.value, 10), notificationType, clientType, search);
	// };
	//Benim kodladıklarım

	const handleChangeDense = event => {
		setDense(event.target.checked);
	};

	const isSelected = company => selected.indexOf(company) !== -1;
	const [notifLOG, setNotifLOG] = useState([]);
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, notifLOG?.length - 0 * rowsPerPage);
	// const emptyRows = rowsPerPage - Math.min(rowsPerPage,clients.length - 0 * rowsPerPage);
	const [open, setOpen] = React.useState(false);
	const [selectedNotice, setSelectedNotice] = useState<NoticeLog>();


	const [search, setSearch] = useState<string>('');
	const [clientType, setClientType] = React.useState('');
	const [notificationType, setNotificationType] = React.useState('');
	const [startDate, setStartDate] = React.useState<string>('');
	const [endDate, setEndDate] = React.useState<string>('');
	const [disabled, setDisabled] = useState<boolean>(false);

	const [clientOfNotification, setClientOfNotification] = React.useState([]);

	//Bugünün tarihini alan metot
	function MyFunction() {
		var myCurrentDate = new Date();
		var date = myCurrentDate.getFullYear() + '-' + (myCurrentDate.getMonth() + 1) + '-' + myCurrentDate.getDate();
		return date;
	}

	const handleClickOpen = (notice: NoticeLog) => {
		setSelectedNotice(notice);
		setPageDialog(0);
		setRowsPerPageDialog(5);

		api.getClientOfNotifications(notice?.id).then(res => {
			setClientOfNotification(res);
			console.log("Responsive Doküman var mı bak:",res);
		});
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [notif,setNotif]=useState<NoticeLogDTO>({
		soleTrade:false,
		limited:false,
		selfAssesment:false,
		trading:false,
		ECAA:false,
		other:false,
		vat:false,
		mail:false,
		sms:false,
		app:false,
		subject:"",
		content:"" } as NoticeLogDTO );
	const [value, setValue] = useState<NoticeLogDTO>({} as NoticeLogDTO);

	const handleSend = () => {
		let notificationSend = new  NoticeLogDTO();
		notificationSend = {
			id: selectedNotice?.id,
			soleTrade:false,
			limited:false,
			selfAssesment:false,
			trading:false,
			ECAA:false,
			other:false,
			vat:false,
			mail:true,
			sms:false,
			app:false,
			content:selectedNotice.message.toString(),
			subject:selectedNotice.subject.toString(),
			clientList:clientOfNotification
		}
		console.log("Mail atılacak veriler : ",clientOfNotification);
		console.log("Object atılacak veriler : ",notificationSend);
		//Resend mail gönderiyor ...
		setDisabled(true);
		setOpenBackDrop(!openBackDrop)
		api.resendNotification(notificationSend).then(
			res => {
				//setOpen(false);
				//props.enqueueSnackbar( <h4>{t('NOTIFICATIONSHASBEENSENT')}</h4>,{variant:'success',});
				window.location.reload()
				//history.push("/notification");
			})
	};

	useEffect(() => {
		api.getNoticeLogs(page, rowsPerPage).then(res => {
			setNotifLOG(res.content);
			setTotalElements(res.totalElements);
			setNotificationType(notificationType);
			console.log("First Page Data :",res);
		});
		setNotificationLogFilter({
			...notificationLogFilter,
			page: page,
			size: rowsPerPage,
			search: '',
			notificationType: '',
			startDate: '',
			endDate: ''
		});
		console.log("NotifLog Filter :",notificationLogFilter);
	}, []);

	useEffect(() => {
		if (notificationLogFilter != null) {
			api.getNoticeLogFilters(notificationLogFilter).then(res => {
				setNotifLOG(res.content);
				setTotalElements(res.totalElements);
				setNotificationType(notificationType);
			});
		}
	}, [notificationLogFilter]);

	// useEffect(() => {
	// 	if (search != null) {
	// 		api.getNoticeLogFiltersOfSearch(search , selectedNotice?.subject , selectedNotice?.message).then(res => {
	// 			setClientOfNotification(res)
	// 			//setPage(res.page)	;
	// 			console.log('getNoticeLogs response', res);
	// 		});
	// 	}
	// }, [search]);

	// function getNotifitications(page, rowsPerPage, notificationType, clientType, search) {
	// 	api.getNotice(page, rowsPerPage, notificationType, clientType, search).then(res => {
	// 		console.log('getNotice response', res);
	// 		setNotifLOG(res.content);
	// 		console.log('Responsive :', res);
	//
	// 		//setTotalElements(res.totalElements);
	// 	});
	// }

	function getNotificatonLogs(notificationLogFilter: NotificationLogFilter) {
		api.getNoticeLogFilters(notificationLogFilter).then(res => {
			setNotifLOG(res.content);
			console.log('getNoticeLogs response', res);
			console.log('getNotice :', notifLOG);
			//setTotalElements(res.totalElements);
		});
	}

	function handleClear() {
		setNotificationLogFilter({
			...notificationLogFilter,
			page: 0,
			size: 5,
			search:'',
			notificationType:'',
			startDate:'',
			endDate:''
		});
		getNotificatonLogs(notificationLogFilter);
	}

	//formatDate fonksiyonunda değişiklik oldu
	//formatDate fonksiyonunda değişiklik oldu
	function formatDate(date) {
		var newdate;
		if (date) {
			console.log("if içinde")
			let dayTime = new Date(date)
			let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(dayTime);
			let mount = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(dayTime);
			let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(dayTime);
			newdate = `${year}-${mount}-${day}`
		}
		else
			newdate = null

		if (newdate?.split("-")[0].length < 4)
			newdate = null
		else if (date?.split("-")[0].length > 4)
			date = date?.split("-")[0].substring(0, 4)
		return date
	}

	function handleChangeDate(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
		formatDate(event.target.value);
		//@ts-ignore
		setNotificationLogFilter({
			...notificationLogFilter,
			[event.target.name]: event.target.value,
			page: 0,
			size: rowsPerPage
		});
	}

	return (
		<FusePageCarded
			classes={{
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				<div className="flex flex-1 items-center justify-center px-12">
					<div className="flex items-center">
						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Icon className="insert_drive_file">notifications_active</Icon>
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
								{t('NOTIFICATION')}
							</Typography>
						</FuseAnimate>
					</div>

					<ThemeProvider theme={mainTheme}>
						<FuseAnimate animation="transition.slideDownIn" delay={300}>
							<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
								<Icon color="action">search</Icon>

								<Input
									placeholder={t('SUBJECT')}
									className="flex flex-1 mx-8"
									disableUnderline
									fullWidth
									name="search"
									value={notificationLogFilter?.search}
									inputProps={{
										'aria-label': 'Search'
									}}
									onChange={(event)=> {
										setNotificationLogFilter({ ...notificationLogFilter, search:event.target.value , page:0 , size:rowsPerPage})
									}}
								/>
							</Paper>
						</FuseAnimate>
					</ThemeProvider>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
						<TextField
							type="date"
							size={'small'}
							name="startDate"
							className={'ml-6 object-center'}
							id="date"
							value={notificationLogFilter?.startDate}
							label={t("STARTDATETIME")}
							InputLabelProps={{
								shrink: true
							}}
							inputProps={{
								max: '3000-01-01',
								min:'1000-01-01'
							}}
							variant="outlined"
							onChange={event => {
								handleChangeDate(event);
							}}
						/>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
						<TextField
							type="date"
							size={'small'}
							name="endDate"
							className={'ml-6 object-center'}
							id="date"
							value={notificationLogFilter?.endDate}
							label={t("ENDDATETIME")}
							InputLabelProps={{
								shrink: true
							}}
							inputProps={{
								max: '3000-01-01',
								min:'1000-01-01'
							}}
							variant="outlined"
							onChange={event => {
								handleChangeDate(event);
							}}
						/>
					</FuseAnimate>
					{/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
					{/*	<Button*/}
					{/*		className="ml-5 rounded-8 bg-white"*/}
					{/*		variant="contained"*/}
					{/*		// onClick={() => {*/}
					{/*		// 	handleClickSearch();*/}
					{/*		// }}*/}
					{/*	>*/}
					{/*		{t('SEARCH')}*/}
					{/*	</Button>*/}
					{/*</FuseAnimate>*/}
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<Button
							className="ml-5 rounded-8 bg-white"
							variant="contained"
							onClick={() => {
								handleClear();
							}}
						>
							{t('SEARCHCLEAR')}
						</Button>
					</FuseAnimate>
				</div>
			}
			content={
				<PageContainer>
					<PageMain>
						<PageContent>
							<div>
								{/*box autoRow*/}
								<div>
									{/*autoCol*/}
									<div>
										<Paper className={classes.paper}>
											<TableContainer className={classes.container}>
												<Table
													stickyHeader={true}
													className={classes.table}
													aria-labelledby="tableTitle"
													size={dense ? 'small' : 'medium'}
													aria-label="enhanced table"
												>
													<EnhancedTableHead
														classes={classes}
														numSelected={selected.length}
														order={order}
														orderBy={orderBy}
														onSelectAllClick={handleSelectAllClick}
														onRequestSort={handleRequestSort}
														rowCount={notifLOG?.length}
														clientType={clientType}
														setClientType={setClientType}
														notificationLogFilter={notificationLogFilter}
														setNotificationLogFilter={setNotificationLogFilter}
													/>
													<TableBody>
														{_.orderBy(notifLOG)
															.slice(0 * rowsPerPage, 1 * rowsPerPage + rowsPerPage)
															.map(log => {
																//Bu kısmı commentlememizin sebebi 799. satırdaki tarihlerin gelmemesi
																//const logCreatedTime = moment(log?.document.createdDateTime).format('DD-MM-YYYY,h:mm:ss a');
																//console.log(logCreatedTime)
																console.log("LOGG-------",log)
																return (
																	<TableRow
																		className="cursor-pointer"
																		hover
																		tabIndex={-1}
																		key={log?.id}
																	>
																		<TableCell
																			// className="md:p-16 truncate"
																			component="th"
																			scope="row"
																		>
																			{log?.subject}
																		</TableCell>

																		<TableCell
																			// className="md:p-16 truncate"
																			component="th"
																			scope="row"
																			style={{
																				fontSize: '14px',
																				padding: '2px',
																				textAlign: 'center'
																			}}
																		>
																			{log?.document.createdDateTime[2]} / {log?.document.createdDateTime[1]} / {log?.document.createdDateTime[0]}
																		</TableCell>
																		<TableCell
																			// className="md:p-16 truncate"
																			component="th"
																			scope="row"
																			style={{
																				fontSize: '12px',
																				padding: '2px',
																				textAlign: 'center'
																			}}
																		>
																			{log?.notiType}
																		</TableCell>
																		<TableCell>
																			<Button
																				variant="text"
																				color="secondary"
																				onClick={() => handleClickOpen(log)}
																			>
																				<Icon
																					style={{
																						color: 'secondary',
																						fontSize: 35,
																						justifyContent: 'center'
																					}}
																				>
																					search
																				</Icon>
																			</Button>
																		</TableCell>
																		<div>
																			<Dialog fullScreen open={open} onClose={handleClose} >
																				<AppBar className={classes.appBar}>
																					<Toolbar>
																						<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
																							<CloseIcon />
																						</IconButton>
																						<Button autoFocus color="inherit" onClick={handleClose}>
																							{t('NOTIFICATIONLIST')}
																						</Button>
																					</Toolbar>
																				</AppBar>
																				<DialogContent>
																					{/*<Paper className="flex items-center w-full px-2 py-12 mt-12 mb-12 rounded-8" elevation={1}>*/}
																					{/*	<Input*/}

																					{/*		placeholder={t("COMPANYNAME") +  " , " + t("FIRSTORLASTNAME") + " , " + t("DIRECTORNAME")}*/}
																					{/*		className="flex flex-1 mx-8"*/}
																					{/*		disableUnderline*/}
																					{/*		value={search}*/}
																					{/*		inputProps={{*/}
																					{/*			'aria-label': 'Search'*/}
																					{/*		}}*/}
																					{/*		onChange={ (e) => setSearch(e.target.value)}*/}
																					{/*	/>*/}
																					{/*	<Button*/}
																					{/*		className="ml-5 rounded-8"*/}
																					{/*		variant="outlined"*/}
																					{/*		>*/}
																					{/*		{t("SEARCH")}*/}
																					{/*	</Button>*/}

																					{/*	<Button*/}
																					{/*		className="mx-auto ml-5 mr-8 rounded-8"*/}
																					{/*		variant="outlined"*/}
																					{/*		// onClick={() => {handleClear()}}*/}
																					{/*		>*/}
																					{/*		{t("SEARCHCLEAR")}*/}
																					{/*	</Button>*/}
																					{/*</Paper>*/}

																					<Div columns={1}>
																						<Card className="rounded-16 shadow-6 mt-12">
																							<Div columns={1} className="flex flex-col justify-left sm:justify-start m-12">
																								<Textfield
																									label={t("SUBJECT")}
																									placeholder={t("REMINDERSUBJECT")}
																									//style={{width:"100%"}}
																									variant={"outlined"}
																									multiline
																									rows={2}
																									inputProps={{
																										maxlength: 50
																									}}
																									id="reminderTypeName"
																									name={"reminderTypeName"}
																									disabled={true}
																									className={'text-justify'}
																									value={selectedNotice?.subject}
																								>
																								</Textfield>
																								<Textfield
																									label={t("CONTENT")}
																									placeholder={t("REMINDERSUBJECT")}
																									//style={{width:"100%"}}
																									variant={"outlined"}
																									multiline
																									rows={8}
																									inputProps={{
																										maxlength: 250
																									}}
																									id="reminderTypeName"
																									name={"reminderTypeName"}
																									disabled={true}
																									className={'text-justify'}
																									value={selectedNotice?.message}
																								>
																								</Textfield>

																								<Button
																									variant="outlined"
																									color="primary"
																									className="w-full mx-auto mr-16 normal-case animate-pulse"
																									value="legacy"
																									onClick={handleSend}
																									disabled={disabled}
																								>
																									<MailOutlineIcon>{t('SEND')}</MailOutlineIcon>
																								</Button>
																								<div className={"flex mx-8 my-12"}>
																									<Backdrop className={classes.backdrop} open={openBackDrop}>
																										<CircularProgress color="inherit"/>
																										<ThemeProvider theme={theme}>
																											<Typography variant="h4">{t('RESENDMAIL')}</Typography>
																										</ThemeProvider>
																									</Backdrop>
																								</div>

																							</Div>
																						</Card>
																					</Div>
																					<Card className={'w-full rounded-8 shadow-6 mt-12'}>
																						<TableContainer component={Paper} className={classes.container}>
																							<Table className={classes.table} aria-label="simple table">
																								<TableHead>
																									<TableRow>
																										<TableCell align="left">{t("")}</TableCell>
																										<TableCell align="left">{t("COMPANYNAME")}</TableCell>
																										<TableCell align="left">{t("FIRSTANDLASTNAME")}</TableCell>
																										<TableCell align="left">{t("DIRECTORNAME")}</TableCell>
																										<TableCell align="center">{t("DIRECTOREMAIL")}</TableCell>
																									</TableRow>
																								</TableHead>
																								<TableBody>
																									{_.orderBy( clientOfNotification)
																										.slice(pageDialog * rowsPerPageDialog, pageDialog * rowsPerPageDialog + rowsPerPageDialog)
																										.map(listOfData => {
																											return (
																												<TableRow
																													className="cursor-pointer" hover tabIndex={-1} key={listOfData.id}
																												>
																													{/*<TableCell padding="none">*/}
																													{/*	<Checkbox*/}
																													{/*		// checked*/}
																													{/*		// value={}*/}
																													{/*		checked={selectedMail.indexOf(listOfData) > -1 ? true : false}*/}
																													{/*		inputProps={{ 'aria-label': 'Checkbox A' }}*/}
																													{/*		style={{ color : '#172a3a'}}*/}
																													{/*		onChange={ (e,checked) => {*/}
																													{/*			handleCheckBox(e ,checked,listOfData)*/}
																													{/*		}}*/}
																													{/*	/>*/}
																													{/*</TableCell>*/}
																													<TableCell className="md:p-16 truncate" component="th" scope="row"></TableCell>

																													<TableCell className="md:p-16 truncate" component="th" scope="row">
																														{ listOfData.company === null ? listOfData.founderOwner.tradeAsName : listOfData.company.name}
																													</TableCell>

																													<TableCell className="md:p-16 truncate" component="th" scope="row">
																														{ listOfData.customerClients[0].customerInfo.user?.name} {listOfData.customerClients[0].customerInfo.user?.surname}
																													</TableCell>

																													<TableCell className="md:p-16 truncate" component="th" scope="row">
																														{ listOfData.company === null ? listOfData.founderOwner.name +" "+ listOfData.founderOwner.surname : listOfData?.company?.directorDetails.map( (detail) =>{
																															return(
																																<TableRow className="mt-6">
																																	<TableCell className="md:p-16 truncate" component="th" scope="row">
																																		<Typography>{detail.name} {detail.surname}</Typography>
																																	</TableCell>
																																</TableRow>
																															);
																														} )}
																													</TableCell>

																													<TableCell className="md:p-16" component="th" scope="row">
																														{ listOfData.company === null ? listOfData.founderOwner.email : listOfData.company?.directorDetails.map( (detail) => {
																															return(
																																<TableRow className="mt-6">
																																	<TableCell component="th" align={'center'}>
																																		<Typography>{detail.email}</Typography>
																																	</TableCell>
																																</TableRow>
																															);
																														})}
																													</TableCell>
																												</TableRow>
																											);
																										})}
																								</TableBody>
																							</Table>
																							<TablePagination
																								className="flex justify-end border-t-1"
																								rowsPerPageOptions={[15, 15, 25]}
																								component="div"
																								colSpan={3}
																								count={clientOfNotification.length}
																								rowsPerPage={rowsPerPageDialog}
																								page={pageDialog}
																								SelectProps={{
																									inputProps: { 'aria-label': 'rows per page' },
																									native: true
																								}}
																								onPageChange={handleChangePageDialog}
																								onRowsPerPageChange={handleChangeRowsPerPageDialog}
																								ActionsComponent={TablePaginationActions}
																							/>
																						</TableContainer>
																					</Card>
																				</DialogContent>
																			</Dialog>
																		</div>
																	</TableRow>
																);
															})}
													</TableBody>
												</Table>
											</TableContainer>
											<TablePagination
												rowsPerPageOptions={[5, 10, 25]}
												colSpan={3}
												className="flex justify-end border-t-1"
												component="div"
												count={totalElements}
												rowsPerPage={rowsPerPage}
												page={page}
												SelectProps={{
													inputProps: { 'aria-label': 'rows per page' },
													native: true
												}}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
												ActionsComponent={TablePaginationActions}
											/>
										</Paper>
									</div>
								</div>
							</div>
						</PageContent>
					</PageMain>
				</PageContainer>

			}
			innerScroll
		/>
	);
}
