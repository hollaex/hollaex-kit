import React, { Fragment } from 'react';
import { Breadcrumb } from 'antd';
import { withKit } from 'components/KitContext';

const { Item } = Breadcrumb;

const Form = ({ onBack: goToApps }) => {

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Item>
          <span onClick={goToApps}>Apps</span>
        </Item>
        <Item>app name</Item>
      </Breadcrumb>
    );
  };

  return (
    <Fragment>
      {renderBreadcrumb()}
      <div className="my-4 py-4">
        Admin Content
      </div>
    </Fragment>
  )
}

const mapContextToProps = ({ onBack }) => ({
  onBack,
});

export default withKit(mapContextToProps)(Form);