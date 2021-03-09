import React from 'react';
import { Banner } from './Banner';

const images = [
	'https://image.freepik.com/free-vector/crypto-currency-bitcoin-blue-background-digital-web-money-modern-technology-banner-with-copy-spac_48369-13790.jpg',
	'https://image.freepik.com/free-vector/crypto-currency-bitcoin-blue-background-digital-web-money-modern-technology-banner-with-copy-spac_48369-13790.jpg',
	'https://image.freepik.com/free-vector/crypto-currency-bitcoin-blue-background-digital-web-money-modern-technology-banner-with-copy-spac_48369-13790.jpg',
	'https://image.freepik.com/free-vector/crypto-currency-bitcoin-blue-background-digital-web-money-modern-technology-banner-with-copy-spac_48369-13790.jpg',
];
export const Banners = () => {
	return (
		<>
			<div className={'bg-white'}>
				<div className="container">
					<div className={'row addBanner'}>
						{images.map((image) => {
							return (
								<div className="col-md-3">
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
