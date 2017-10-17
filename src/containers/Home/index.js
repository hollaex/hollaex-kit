import React from 'react';
import classnames from 'classnames';
import { AppBar } from '../../components';

const FLEX_CLASSES = ['d-flex', 'justify-content-center', 'align-items-center'];

const renderAppBar = () => {
  return <AppBar />
}

const renderHomeContent = () => {
  return (
    <div className={classnames(...FLEX_CLASSES, {})}>
      HOME
    </div>
  )
}
const Home = (props) => {
  return (
    <div className={classnames('app_container')}>
      {renderAppBar(props)}
      {renderHomeContent()}
    </div>
  )
}

export default Home;
