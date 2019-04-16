import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import React from 'react';
import Content from './content';
import EmailIcon from './icon/email';
import TwitterIcon from './icon/twitter';
import GithubIcon from './icon/github';

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
        <nav css={css``}>
          <TextLink to="/">Home</TextLink>
          <TextLink to="/work">Work</TextLink>
          <TextLink to="/about">About</TextLink>
          <TextLink to="/lab">Lab</TextLink>
        </nav>
        <nav>
          <IconLink
            href="mailto:visser.onno@gmail.com"
            aria-label="Email Onno Visser"
          >
            <EmailIcon />
          </IconLink>
          <IconLink
            href="https://twitter.com/_onnovisser"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Onno Visser on Twitter"
          >
            <TwitterIcon />
          </IconLink>
          <IconLink
            href="https://github.com/onnovisser"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Onno Visser on Github"
          >
            <GithubIcon />
          </IconLink>
        </nav>
      </Content>
    </header>
  );
}

export default Header;
