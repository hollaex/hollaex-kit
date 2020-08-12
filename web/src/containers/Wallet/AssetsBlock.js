import React from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';

import { CurrencyBall, ActionNotification, SearchBox, AssetsBlockForm } from 'components';
import { calculatePrice, formatToCurrency } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import {
  ICONS,
  BASE_CURRENCY,
  CURRENCY_PRICE_FORMAT,
  DEFAULT_COIN_DATA,
  IS_XHT
} from 'config/constants';

const AssetsBlock = ({
	balance,
	prices,
	coins,
	pairs,
	totalAssets,
	wallets,
	onOpenDialog,
	bankaccount,
	navigate,
	isValidBase,
	openContactUs,
	handleSearch,
	searchResult,
 	handleCheck
}) => {

	const sortedSearchResults = Object.entries(searchResult)
    .filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
    .sort(([key_a], [key_b]) => {
      const price_a = calculatePrice(balance[`${key_a}_balance`], prices[key_a]);
      const price_b = calculatePrice(balance[`${key_b}_balance`], prices[key_b]);
      return price_a < price_b ? 1 : -1 // descending order
    })

	return (
		<div className="wallet-assets_block">
			<section className="ml-4 pt-4">
				<div className="wallet-search-improvement">
					{
						BASE_CURRENCY && IS_XHT
						? <div>
                {STRINGS.formatString(
                  STRINGS.WALLET_DEPOSIT_USD,
									<span className="blue-link pointer" onClick={openContactUs}>{STRINGS.CONTACT_US_TEXT}</span>
                )}
							</div>
							: BASE_CURRENCY && isValidBase ?
							<div>
								<div>Estimated Total Balance</div>
								<div className="font-title">{totalAssets}</div>
							</div>
							: null
					}
				</div>
				<div className="d-flex justify-content-between">
					<SearchBox
						name={`${STRINGS.WALLET_ALL_ASSETS}_${STRINGS.SEARCH_TXT}`}
						placeHolder={`${STRINGS.SEARCH_TXT}...`}
						handleSearch={handleSearch}
					/>
					<AssetsBlockForm
						handleCheck={handleCheck}
					/>
				</div>
			</section>
			<table className="wallet-assets_block-table">
				<thead>
				<tr className="table-bottom-border">
					<th />
					<th>{STRINGS.CURRENCY}</th>
					<th>{STRINGS.AMOUNT}</th>
					<th className="td-amount" />
					<th>{STRINGS.DEPOSIT_WITHDRAW}</th>
					{!isMobile && <th>{STRINGS.TRADE_TAB_TRADE}</th>}
				</tr>
				</thead>
				<tbody>
        {sortedSearchResults.map(([key, { min, allow_deposit, allow_withdrawal }]) => {
            const balanceValue = balance[`${key}_balance`];
            const pair = `${key.toLowerCase()}-${BASE_CURRENCY.toLowerCase()}`
            const { fullname, symbol = '' } = coins[key] || DEFAULT_COIN_DATA;
            const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
            const balanceText =
              key === BASE_CURRENCY
                ? formatToCurrency(balanceValue, min)
                : formatToCurrency(
                calculatePrice(balanceValue, prices[key]),
                baseCoin.min
                );
            return (
							<tr className="table-row table-bottom-border" key={key}>
								<td className="table-icon td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										<CurrencyBall
											name={symbol.toUpperCase()}
											symbol={key}
											size="s"
										/>
									</Link>
								</td>
								<td className="td-name td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>{fullname}</Link>
								</td>
								<td className="td-amount">
									<div className="d-flex">
										<div className="mr-4">
                      {STRINGS.formatString(
                        CURRENCY_PRICE_FORMAT,
                        formatToCurrency(balanceValue, min, true),
                        symbol.toUpperCase()
                      )}
										</div>
                    {!isMobile &&
                    key !== BASE_CURRENCY &&
                    parseFloat(balanceText || 0) > 0 && (
											<div>
                        {`(≈ ${baseCoin.symbol.toUpperCase()} ${balanceText})`}
											</div>
                    )}
									</div>
								</td>
								<th className="td-amount" />
								<td className="td-wallet">
                  {wallets[key] ? (
										<div className="d-flex justify-content-between deposit-withdrawal-wrapper">
											<ActionNotification
												text={STRINGS.WALLET_BUTTON_BASE_DEPOSIT}
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => navigate(`wallet/${key}/deposit`)}
												useSvg={true}
												className="csv-action"
												showActionText={isMobile}
												disable={!allow_deposit}
											/>
											<ActionNotification
												text={STRINGS.WALLET_BUTTON_BASE_WITHDRAW}
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => navigate(`wallet/${key}/withdraw`)}
												useSvg={true}
												className="csv-action"
												showActionText={isMobile}
												disable={!allow_withdrawal}
											/>
										</div>
                  ) : (
										<div className="d-flex justify-content-center">
											<ActionNotification
												text={STRINGS.GENERATE_WALLET}
												status="information"
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => onOpenDialog(key)}
												className="need-help"
												useSvg={true}
												showActionText={isMobile}
												disable={!allow_deposit}
											/>
										</div>
                  )}
								</td>
								{
									!isMobile && <td>
									<ActionNotification
										text={STRINGS.TRADE_TAB_TRADE}
										iconPath={ICONS.BLUE_PLUS}
										onClick={() => navigate(`/trade/${pair}`)}
										useSvg={true}
										className="csv-action"
										showActionText={isMobile}
										disable={!pairs[pair] || !pairs[pair].active}
									/>
								</td>
								}
							</tr>
            );
          })}
				</tbody>
			</table>
		</div>
  );
}

export default AssetsBlock;