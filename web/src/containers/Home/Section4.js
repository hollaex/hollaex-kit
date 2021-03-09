import React from 'react';
import { Section4Sub } from './Section4Sub';

export const Section4 = () => {
	return (
		<div className="bg-light-gray">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="section-one-header text-dark al">
							Get in touch. Stay in touch.
						</div>
					</div>
				</div>
				<div className="row">
					<Section4Sub
						img={
							'https://lh3.googleusercontent.com/proxy/mskVZAAD7FGqJvLPefKD0GwpcuoykH0-sJ65DDnAG4pr2RbqaMnyMiNGGCjoiLn1RczhT3ajHAR0sAfKasQaAMtufkFJz8vk2TMmG6kzP592NqMY'
						}
						title="24 / 7 Support"
						description={
							'Got a problem? Just get in touch. Our support team is available 24/7.'
						}
					/>

					<Section4Sub
						img={
							'https://lh3.googleusercontent.com/proxy/mskVZAAD7FGqJvLPefKD0GwpcuoykH0-sJ65DDnAG4pr2RbqaMnyMiNGGCjoiLn1RczhT3ajHAR0sAfKasQaAMtufkFJz8vk2TMmG6kzP592NqMY'
						}
						title="HollaEx Blog"
						description={
							'News and updates from the world’s leading cryptocurrency exchange.'
						}
					/>

					<Section4Sub
						img={
							'https://lh3.googleusercontent.com/proxy/mskVZAAD7FGqJvLPefKD0GwpcuoykH0-sJ65DDnAG4pr2RbqaMnyMiNGGCjoiLn1RczhT3ajHAR0sAfKasQaAMtufkFJz8vk2TMmG6kzP592NqMY'
						}
						title="HollaEx Blog"
						description={
							'News and updates from the world’s leading cryptocurrency exchange.'
						}
					/>

					<Section4Sub
						img={
							'https://lh3.googleusercontent.com/proxy/mskVZAAD7FGqJvLPefKD0GwpcuoykH0-sJ65DDnAG4pr2RbqaMnyMiNGGCjoiLn1RczhT3ajHAR0sAfKasQaAMtufkFJz8vk2TMmG6kzP592NqMY'
						}
						title="HollaEx Blog"
						description={
							'News and updates from the world’s leading cryptocurrency exchange.'
						}
					/>
				</div>
			</div>
		</div>
	);
};
