import React from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
	Button,
	TablePagination,
	TableSortLabel,
	Toolbar, Tooltip,
	Typography
} from '@material-ui/core';
import clsx from "clsx";
import { Link } from "react-router-dom";

import { func, number, object, oneOf, string } from "prop-types";
import {useTranslation} from "react-i18next";

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
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
	{ id: "id", numeric: false, disablePadding: false, label: "ID",sortable:true},
	{ id: "letterTypeName", numeric: false, disablePadding: false, label: "LETTER TYPE",sortable:true},
	{ id: "action", numeric: false, disablePadding: false, label: "ACTION",sortable:false},
];

function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "default"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						{headCell.sortable ?
							(
								<TableSortLabel
									active={orderBy === headCell.id}
									direction={orderBy === headCell.id ? order : "asc"}
									onClick={createSortHandler(headCell.id)}
								>
									{headCell.label}
									{orderBy === headCell.id ? (
										<span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
									) : null}
								</TableSortLabel>
							):headCell.label
						}

					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: object.isRequired,
	onRequestSort: func.isRequired,
	order: oneOf(["asc", "desc"]).isRequired,
	orderBy: string.isRequired,
	rowCount: number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === "light"
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	title: {
		flex: "1 1 100%",
	},
}));

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const { numSelected } = props;
	const { t } = useTranslation("letter");
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					className={classes.title}
					variant="h6"
					id="tableTitle"
					component="div"
				>
					{t('LETTERTEMPLATES')}
				</Typography>
			)}

			<Tooltip title="Add">
				<Button component={Link} to={"/create-template"} variant="contained" color="primary" style={{whiteSpace:"nowrap", padding:"8px 30px"}}>
					{t('CREATELETTERTEMPLATE')}
				</Button>
			</Tooltip>
		</Toolbar>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
	container:{
		maxHeight: 550
	}
}));

export default function LetterTemplateList({ data }) {
	const {t} = useTranslation("letter")
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(20);
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	//const emptyRows =
	//	rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);


	if(data.length > 1)
		console.log(new Date("2020/05/02"));

	console.log(data)
	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar />
				<TableContainer className={classes.container}>
					<Table
						stickyHeader
						className={classes.table}
						aria-labelledby="tableTitle"
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={data.length}
						/>
						<TableBody>
							{stableSort(data, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((letter, index) => {

									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={letter.id}
											style={{
												background: index % 2 === 0 ? "#f6f6f6" : "white",
											}}
										>
											<TableCell padding="default">{letter.id} </TableCell>
											<TableCell padding="default">{letter.letterTypeName}</TableCell>
											<TableCell>
												<Link to={{pathname: '/edit-template', state:{letter: letter} }}
													  style={{textDecoration:"none"}}>
													<Button
														variant="outlined"
														color="primary"
														startIcon={<EditIcon />}
													>
														{t("EDIT")}
													</Button>
												</Link>
											</TableCell>
										</TableRow>
									);
								})}

						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}
