import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import React from 'react';
import Content from './content';
import CodepenIcon from './icon/codepen';
import EmailIcon from './icon/email';
import GithubIcon from './icon/github';
import TwitterIcon from './icon/twitter';

const TextLink = styled(Link)`
  color: ${props => props.theme.color.neutralDark};
  font-family: ${props => props.theme.fontFamily.accent};
  margin-right: 40px;
`;

const IconLink = styled.a`
  margin-left: 25px;
`;

function Header() {
  return (
    <header
      css={({ color }) => css`
        position: fixed;
        top: 0;
        width: 100%;
        background-color: ${color.neutralLightest};
        border-bottom: 1px solid ${color.neutralLight};
        z-index: 10;
      `}
    >
      <Content
        css={css`
          height: 10vh;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <nav>
          <TextLink to="/">Home</TextLink>
          <TextLink to="/work">Work</TextLink>
          <TextLink to="/about">About</TextLink>
          <TextLink to="/lab">Lab</TextLink>
        </nav>
        <nav>
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
          <IconLink
            href="https://codepen.io/Penno/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Codepen"
            title="Codepen"
          >
            <CodepenIcon />
          </IconLink>
        </nav>
      </Content>
    </header>
  );
}

export default Header;
