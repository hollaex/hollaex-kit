import React from 'react';
import './CurrencyCard.css';
export const CurrencyCard = ({ CurrencyList }) => {
	return (
		<>
			<div className="row side-line">
				{CurrencyList.map((obj) => {
					return (
						<div key={obj._id} className="col-sm-3">
							<div className="card coin-item">
								<div className="card-body">
									<div className="chart-widget-dashboard">
										<div className="media pair">
											<div className="media-body">
												<h5 className="mt-0 mb-0 f-w-600">
													<i className="fa fa-star"></i>
													<span className="name">{obj.currency}</span>
												</h5>
												<p className="price">{obj.count}</p>
												<div className="count">
													<span>Volume</span>
													<span>{obj.volume}</span>
												</div>
											</div>
											<div
												className={
													obj.upDown > 0 ? 'rate rate-red' : 'rate rate-green'
												}
											>
												{obj.upDown}%
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};
