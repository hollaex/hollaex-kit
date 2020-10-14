import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { EditWrapper } from 'components';

const Image = ({ icon, iconId, alt, wrapperClassName, imageWrapperClassName, svgWrapperClassName }) => {
  const useSvg = icon.indexOf('.svg') > 0
    return (
      <EditWrapper iconId={iconId}>
        {icon && useSvg && (
          <ReactSVG
            path={icon}
            wrapperClassName={classnames(wrapperClassName, svgWrapperClassName)}
          />
        )}
        {icon && !useSvg && (
          <img
            src={icon}
            alt={alt}
            className={classnames(wrapperClassName, imageWrapperClassName)}
          />
        )}
      </EditWrapper>
    )
}

Image.defaultProps = {
  icon: '',
  iconId: '',
  alt: '',
  wrapperClassName: '',
  imageWrapperClassName: '',
  svgWrapperClassName: '',
};

export default Image;