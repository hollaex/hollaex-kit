import React, { Fragment} from 'react';
import { number, bool } from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from "classnames";

class ControlledScrollbar extends React.PureComponent {

  state = {
    isUpButtonDisabled: true,
    isDownButtonDisabled: true,
  }

  scrollbar = React.createRef()

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

  scrollUp = () => {
    const { isUpButtonDisabled } = this.state;
    const { scrollingStep } = this.props;

    if (isUpButtonDisabled) return;

    const val = this.scrollbar.current.getScrollTop() - scrollingStep;
    this.scrollbar.current.scrollTop(val);
  }

  scrollDown = () => {
    const { isDownButtonDisabled } = this.state;
    const { scrollingStep } = this.props;

    if (isDownButtonDisabled) return;

    const val = this.scrollbar.current.getScrollTop() + scrollingStep;
    this.scrollbar.current.scrollTop(val);
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