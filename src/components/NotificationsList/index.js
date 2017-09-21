import React, { Component } from 'react';
import { Notification } from '../';

const NotificationsList = ({ notifications }) => (
  <div className="notifications_list_wrapper">
    {notifications.map((currentNotification, index) => <Notification {...currentNotification} key={index} />)}
  </div>
);

export default NotificationsList;
