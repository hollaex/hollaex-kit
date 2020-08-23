import React, { Fragment} from 'react';
import { number, bool } from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from "classnames";

class ControlledScrollbar extends React.PureComponent {

  scrollbar = React.createRef()

  state = {
    isUpButtonDisabled: true,
    isDownButtonDisabled: true,
  }

  onUpdate = ({ top }) => {
    if(top === 0) {
      this.setState({
        isUpButtonDisabled: true,
        isDownButtonDisabled: false,
      })
    } else if (top === 1) {
      this.setState({
        isUpButtonDisabled: false,
        isDownButtonDisabled: true,
      })
    } else {
      this.setState({
        isUpButtonDisabled: false,
        isDownButtonDisabled: false,
      })
    }
  }

  relativeScrollTo = (relativeValue) => {
    const value = this.scrollbar.current.getScrollTop() + relativeValue
    this.scrollbar.current.view.scroll({
      top: value,
      behavior: 'smooth',
    });
  }

  scrollUp = () => {
    const { isUpButtonDisabled } = this.state;
    const { scrollingStep } = this.props;

    if (isUpButtonDisabled) return;

    this.relativeScrollTo(-scrollingStep)
  }

  scrollDown = () => {
    const { isDownButtonDisabled } = this.state;
    const { scrollingStep } = this.props;

    if (isDownButtonDisabled) return;

    this.relativeScrollTo(scrollingStep)
  }

  render() {
    const { isDownButtonDisabled, isUpButtonDisabled } = this.state;
    const { showButtons, scrollingStep, ...restProps } = this.props;
    const { onUpdate, scrollUp, scrollDown, scrollbar } = this;

    return (
      <Fragment>
        {
          showButtons && (
            <div
              className={classnames("controlled-scrollbar__button", { disabled: isUpButtonDisabled })}
              onClick={scrollUp}

            >
              Up
            </div>
          )
        }

        <Scrollbars
          {...restProps}
          onUpdate={onUpdate}
          ref={scrollbar}
        />

        {
          showButtons && (
            <div
              className={classnames("controlled-scrollbar__button", { disabled: isDownButtonDisabled })}
              onClick={scrollDown}
            >
              Down
            </div>
          )
        }
      </Fragment>
    );
  }
}

ControlledScrollbar.propTypes = {
  showButtons: bool,
  scrollingStep: number,
}

ControlledScrollbar.defaultProps = {
  showButtons: true,
  scrollingStep: 35,
}

export default ControlledScrollbar;