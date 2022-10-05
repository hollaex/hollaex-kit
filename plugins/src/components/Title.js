import React from "react";
import { withKit } from 'components/KitContext';

const Title = ({ user: { username } = {}, strings: STRINGS, generateId }) => (
  <div className="secondary-text">
    {STRINGS.formatString(STRINGS[generateId('hello')], username)}
  </div>
);

const mapContextToProps = ({ user, generateId, strings }) => ({ user, generateId, strings });
export default withKit(mapContextToProps)(Title);
