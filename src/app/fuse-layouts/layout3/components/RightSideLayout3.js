import QuickPanel from 'app/fuse-layouts/shared-components/quickPanel/QuickPanel';
import ChatPanel from 'app/fuse-layouts/shared-components/chatPanel/ChatPanel';
import React from 'react';

function RightSideLayout3() {
	return (
		<>
			<ChatPanel />

			<QuickPanel />
		</>
	);
}

export default React.memo(RightSideLayout3);
