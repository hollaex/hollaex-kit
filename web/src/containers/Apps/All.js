import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'antd';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import { updateUserSettings, setUserData } from 'actions/userAction';
import { IconTitle, EditWrapper, Table, Button, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { unique } from 'utils/data';
import { isEnabled, appsSelector } from './utils';

const generateHeaders = (addApp, isAdded) => {
	return [
		{
			stringId: 'USER_APPS.TABLE.APP_NAME',
			label: STRINGS['USER_APPS.TABLE.APP_NAME'],
			key: 'name',
		},
		{
			stringId: 'USER_APPS.TABLE.DESCRIPTION',
			label: STRINGS['USER_APPS.TABLE.DESCRIPTION'],
			key: 'description',
		},
		{
			label: '',
			renderCell: ({ name }, key) => (
				<td key={`${key}-${name}-app`} className="text-align-right">
					{isAdded(name) ? (
						<Image icon={''} iconId={''} wrapperClassName={''} />
					) : (
						<Button
							label={STRINGS['USER_APPS.TABLE.ADD']}
							className="add-app-button"
							onClick={() => addApp(name)}
						/>
					)}
				</td>
			),
		},
	];
};

const NoData = ({ onClick }) => (
	<div className="text-align-center">
		<div>{STRINGS['USER_APPS.TABLE.NOT_FOUND']}</div>
		<div onClick={onClick} className="blue-link underline-text pointer">
			{STRINGS['USER_APPS.TABLE.RETRY']}
		</div>
	</div>
);

const All = ({
	icons: ICONS,
	apps,
	settings: { apps: user_apps = [] },
	setUserData,
}) => {
	const [search, setSearch] = useState();
	const [data, setData] = useState(apps);

	const inputRef = useRef(null);

	const addApp = (name) => {
		// send add app request and show toast notification
		const settings = {
			apps: unique([...user_apps, name]),
		};
		updateUserSettings(settings)
			.then(({ data }) => setUserData(data))
			.catch((err) => console.log('error'));
	};

	const isAdded = (name) => {
		return isEnabled(name, user_apps);
	};

	const retry = () => {
		setSearch('');
		inputRef.current.focus({
			cursor: 'start',
		});
	};

	const onSearch = (search, apps) => {
		if (search) {
			const result = apps.filter(({ name }) =>
				name.toLowerCase().includes(search.toLowerCase())
			);
			setData(result);
		} else {
			setData(apps);
		}
	};

	const debounced = useRef(debounce(onSearch, 1000));

	useEffect(() => {
		debounced.current(search, apps);
	}, [search, apps]);

	return (
		<div>
			<div className="settings-form-wrapper">
				<div className="settings-form apps-form">
					<IconTitle
						stringId="USER_APPS.ALL_APPS.TITLE"
						text={STRINGS['USER_APPS.ALL_APPS.TITLE']}
						textType="title"
						iconPath={ICONS['APPS_ALL']}
					/>
					<div>
						<EditWrapper stringId="USER_APPS.ALL_APPS.SUBTITLE">
							{STRINGS['USER_APPS.ALL_APPS.SUBTITLE']}
						</EditWrapper>
					</div>
					<div>
						<Input
							prefix={<SearchOutlined className="secondary-text" />}
							placeholder={STRINGS['USER_APPS.ALL_APPS.SEARCH_PLACEHOLDER']}
							value={search}
							onChange={({ target: { value } }) => setSearch(value)}
							style={{
								width: 200,
							}}
							bordered={false}
							className="kit-divider"
							ref={inputRef}
						/>
					</div>
					<Table
						showHeaderNoData={true}
						rowClassName="pt-2 pb-2"
						headers={generateHeaders(addApp, isAdded)}
						count={data.length}
						pageSize={data.length}
						data={data}
						rowKey={({ name }) => name}
						displayPaginator={false}
						{...(search ? { noData: <NoData onClick={retry} /> } : {})}
					/>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	const {
		user: { settings },
	} = state;

	return {
		apps: appsSelector(state),
		settings,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setUserData: bindActionCreators(setUserData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(All));
