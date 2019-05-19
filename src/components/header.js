import { css } from '@emotion/core';
import { Link } from 'gatsby';
import React from 'react';
import mq from '../style/mq';
import Content from './content';
import Socials from './socials';

function TextLink({ children, ...rest }) {
  return (
    <Link
      css={theme => css`
        position: relative;
        color: ${theme.color.neutralDark};
        font-family: ${theme.fontFamily.display};

        ${mq.mediumUp} {
          margin-right: 40px;
        }
      `}
      activeClassName="active"
      {...rest}
    >
      <span
        css={theme => css`
          display: none;
          width: 100%;
          height: 2px;
          position: absolute;
          left: 0;
          top: calc(50% - 2px);
          background: ${theme.color.neutralDark};

          .active & {
            display: block;
          }
        `}
      />
      {children}
    </Link>
  );
}

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
        <nav
          css={css`
            ${mq.mediumDown} {
              width: 100%;
              max-width: 300px;
              display: flex;
              justify-content: space-between;
            }
          `}
        >
          <TextLink to="/">Home</TextLink>
          <TextLink to="/work">Work</TextLink>
          <TextLink to="/about">About</TextLink>
          {/* <TextLink to="/lab">Lab</TextLink> */}
        </nav>
        <Socials
          css={css`
            ${mq.mediumDown} {
              display: none;
            }
          `}
        />
      </Content>
    </header>
  );
}

export default Header;
