import * as React from "react";

export interface Props {
  prefixCls: string,
  className: string,
  style: object,
  name: string,
  id: string,
  type: string,
  defaultChecked: number | boolean,
  checked: number | boolean,
  disabled: boolean,
  onFocus: (e: Event) => void,
  onBlur: (e: Event) => void,
  onChange: (e: Event) => void,
  onClick: (e: Event) => void,
  tabIndex: string | number,
  readOnly: boolean,
  autoFocus: boolean,
  value: any,
}

export default class CheckBox extends React.Component<Props> {}