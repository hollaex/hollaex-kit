import React from 'react';
export interface PortalProps {
    getContainer: () => Element;
}
export default class Portal extends React.Component<PortalProps, any> {
    container: Element;
    constructor(props: PortalProps);
    render(): any;
}
