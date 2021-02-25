import styled from '@emotion/styled';
import React from 'react';
import EmailIcon from './icon/email';
import GithubIcon from './icon/github';
import TwitterIcon from './icon/twitter';

const IconLink = styled.a`
  & + & {
    margin-left: 25px;
  }
`;

function Socials(props) {
  return (
    <nav {...props}>
      <IconLink
        href="mailto:visser.onno@gmail.com"
        aria-label="Send an Email"
        title="Send an Email"
      >
        <EmailIcon />
      </IconLink>
      <IconLink
        href="https://twitter.com/_onnovisser"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
        title="Twitter"
      >
        <TwitterIcon />
      </IconLink>
      <IconLink
        href="https://github.com/onnovisser"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Github"
        title="Github"
      >
        <GithubIcon />
      </IconLink>
    </nav>
  );
}

export default Socials;
