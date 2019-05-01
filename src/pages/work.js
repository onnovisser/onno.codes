import { css } from '@emotion/core';
import React from 'react';
import Page from '../components/page';
import AllWork from '../components/work/all';
import PageHeading from '../components/pageHeading';

function WorkPage() {
  return (
    <Page>
    <PageHeading>I can make anything work</PageHeading>
      <AllWork />
    </Page>
  );
}

export default WorkPage;
