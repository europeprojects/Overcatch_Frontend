import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import LetterEmployee from './LetterEmployee';

function LetterTemplateEdit(props) {

  const [letter, setLetter] = useState({});
  const { state } = useLocation();
  const history = useHistory();


  useEffect(()=>{
    // @ts-ignore
    const stLetter = state.letter;
    if(stLetter)
      setLetter({ ...stLetter, letterTemplate:(JSON.parse(decodeURIComponent(escape(window.atob(stLetter.letterTemplate))))) })
    else
      history.push("/letter-templates");
  },[state])

  console.log("state",state);

  return (
    <LetterEmployee letter={letter} isReadOnly={false} />
  );
}

export default LetterTemplateEdit;