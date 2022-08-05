import React from 'react';
import QuickPanel from 'app/fuse-layouts/shared-components/quickPanel/QuickPanel';
import ChatPanel from "../../shared-components/chatPanel/ChatPanel";

function RightSideLayout1(props) {
	return (
		<>
			{/*<ChatPanel />*/}
			<QuickPanel />
		</>
	);
}

export default React.memo(RightSideLayout1);
