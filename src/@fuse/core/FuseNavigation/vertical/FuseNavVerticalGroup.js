import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseUtils from '@fuse/utils';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, {useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { navbarCloseMobile } from 'app/store/fuse/navbarSlice';
import FuseNavItem from '../FuseNavItem';

const useStyles = makeStyles(theme => ({
	item: props => ({
		height: 40,
		width: 'calc(100% - 16px)',
		borderRadius: '0 20px 20px 0',
		paddingRight: 12,
		paddingLeft: props.itemPadding > 80 ? 80 : props.itemPadding,
		'&.active > .list-subheader-text': {
			fontWeight: 700
		}
	})
}));

function FuseNavVerticalGroup(props) {
	const userRole = useSelector(({ auth }) => auth.user.role);
	const dispatch = useDispatch();
	const languages = useSelector(({ auth }) => auth.user.data.usersClient);
	const [currentCompany,setCurrentCompany] = useState(languages[0]);


	const theme = useTheme();
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));
	const { item, nestedLevel } = props;
	const classes = useStyles({
		itemPadding: nestedLevel > 0 ? 40 + nestedLevel * 16 : 24
	});

	const hasPermission = useMemo(() => FuseUtils.hasPermission(item.auth, userRole), [item.auth, userRole]);
	const isCustomer = userRole[0] == "CUSTOMER" ? true : false;
	if (!hasPermission) {
		return null;
	}

	const companyId  = sessionStorage.getItem("companyId");



	return (
			<div    hidden={ (isCustomer && currentCompany?.client.state !== "3") &&
							 (item.id !== "applicationPage" && item.id !=="companyPageGroup")? true : false}>

			<ListSubheader
				className={clsx(classes.item, 'list-subheader flex items-center', !item.url&& 'cursor-default')}
				onClick={ev => mdDown && dispatch(navbarCloseMobile())}
				component={item.url ? NavLinkAdapter : 'li'}
				to={  item.url  }
				role="button"

			>
				<span className="list-subheader-text uppercase text-12">{item.title}</span>
			</ListSubheader>
			{item.children && (
				<div>
					{item.children.map(_item => (
						<FuseNavItem
							key={_item.id}
							type={`vertical-${_item.type}`}
							item={_item}
							nestedLevel={nestedLevel}

						/>
					))}
				</div>
			)}
		</div>
	)
}

FuseNavVerticalGroup.propTypes = {
	item: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string,
		children: PropTypes.array
	})
}

FuseNavVerticalGroup.defaultProps = {};

const NavVerticalGroup = withRouter(React.memo(FuseNavVerticalGroup));

export default NavVerticalGroup;