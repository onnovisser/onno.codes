import React from 'react';
import Page from '../components/page';
import PageHeading from '../components/pageHeading';
import AllWork from '../components/work/all';

function WorkPage() {
  return (
    <Page>
      <PageHeading>I can make anything work</PageHeading>
      <AllWork />
    </Page>
  );
}

export default WorkPage;
