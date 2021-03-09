import React from 'react';

export const Section4Sub = ({ img, title, description }) => {
	return (
		<div className="col-md-3">
			<div className="card-style2">
				<div className="card-body">
					<div className="sect4-img">
						<img srcSet={img} alt="customer support" />
					</div>
					<div className="sect4-title">{title}</div>
					<div className="sect4-content">{description}</div>
				</div>
			</div>
		</div>
	);
};
