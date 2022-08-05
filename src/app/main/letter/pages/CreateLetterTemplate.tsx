import React from 'react';
import LetterEmployee from './LetterEmployee';

function CreateLetterTemplate(props) {
	return (
		<LetterEmployee isReadOnly={false}/>
	);
}

export default CreateLetterTemplate;