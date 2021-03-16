import React from 'react';
import { Banner } from './Banner';
import add1 from './img/add-banner/add-1.png';
import add2 from './img/add-banner/add-2.png';
import add3 from './img/add-banner/add-3.png';
import add4 from './img/add-banner/add-4.png';

const images = [add1, add2, add3, add4];
export const Banners = () => {
	return (
		<>
			<div className={'bg-white'}>
				<div className="container">
					<div className={'row addBanner'}>
						{images.map((image, index) => {
							return (
								<div key={index} className="col-md-3">
									<Banner img={image} />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};
