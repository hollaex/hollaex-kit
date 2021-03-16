import React from 'react';
import { Section4Sub } from './Section4Sub';
import supportImg from './img/support.png';
import blogIco from './img/blog-icon.png';
import communityIco from './img/community-users-icon.png';
import careerIco from './img/interview-icon.png';

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
						img={supportImg}
						title="24 / 7 Support"
						description={
							'Got a problem? Just get in touch. Our support team is available 24/7.'
						}
					/>

					<Section4Sub
						img={blogIco}
						title="HollaEx Blog"
						description={
							'News and updates from the world’s leading cryptocurrency exchange.'
						}
					/>

					<Section4Sub
						img={communityIco}
						title="Community"
						description={
							'News and updates from the world’s leading cryptocurrency exchange.'
						}
					/>

					<Section4Sub
						img={careerIco}
						title="Career"
						description={
							'News and updates from the world’s leading cryptocurrency exchange.'
						}
					/>
				</div>
			</div>
		</div>
	);
};
