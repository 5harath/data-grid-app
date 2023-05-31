import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import DataGrid from './DataGrid';

const TabSwitcher = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Users" />
          <Tab label="Posts" />
          <Tab label="Comments" />
        </Tabs>
      </AppBar>
      {activeTab === 0 && <Typography>
        <DataGrid
        endpoint="https://jsonplaceholder.typicode.com/users"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'website', label: 'Website' },
        ]}
      /></Typography>}
      {activeTab === 1 && <Typography>
        <DataGrid
        endpoint="https://jsonplaceholder.typicode.com/posts"
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'body', label: 'Body' },
        ]}
      /></Typography>}
      {activeTab === 2 && <Typography>
        <DataGrid
        endpoint="https://jsonplaceholder.typicode.com/comments"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'body', label: 'Body' },
        ]}
      /></Typography>}
    </div>
  );
};

export default TabSwitcher;
