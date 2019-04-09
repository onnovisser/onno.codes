import React, { useState, useEffect } from 'react';
import { string, func, boolean } from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';



function Header() {
  return (
    <Content as="header" css={css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `}>
      <nav css={css`


      `}>
      <Link to="/work">Work</Link>
      <Link to="/about">about</Link>

      </nav>
      <nav >
        <a href="mailto:onnovisser"
      <a href="https://github.com/onnovisser" target="_blank" rel="noopener noreferrer"></a>

      </nav>
    </Content>
  );
}

export default Header;

