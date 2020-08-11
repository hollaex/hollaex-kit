import React from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';

import { CurrencyBall, ActionNotification, SearchBox } from 'components';
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
	searchValue
}) => {

	const AssetsTableCoins = searchValue ? searchResult : coins;

	return (
		<div className="wallet-assets_block">
			<section>
				<div>{STRINGS.WALLET_TABLE_TOTAL}</div>
				<div>{totalAssets}</div>
				<div className="d-flex justify-content-between">
					<SearchBox
						name={`${STRINGS.WALLET_ALL_ASSETS}_${STRINGS.SEARCH_TXT}`}
						placeHolder={`${STRINGS.SEARCH_TXT}...`}
						handleSearch={handleSearch}
					/>
					<div>Hide zero balance</div>
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
					<th>{STRINGS.TRADE_TAB_TRADE}</th>
				</tr>
				</thead>
				<tbody>
        {Object.entries(AssetsTableCoins)
          .filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
          .map(([key, { min, allow_deposit, allow_withdrawal }]) => {
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
								<td>
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
							</tr>
            );
          })}
				</tbody>
        {BASE_CURRENCY && IS_XHT
          ? <tfoot>
					<tr>
						<td colSpan={5}>
              {STRINGS.formatString(
                STRINGS.WALLET_DEPOSIT_USD,
								<span className="blue-link pointer" onClick={openContactUs}>{STRINGS.CONTACT_US_TEXT}</span>
              )}
						</td>
					</tr>
					</tfoot>
          : !isMobile && BASE_CURRENCY && isValidBase
            ? (<tfoot>
							<tr>
								<td />
								<td />
								<td />
								<td />
								<td>
									<div className="d-flex">
										<div className="mr-4">{STRINGS.WALLET_TABLE_TOTAL}</div>
										<div style={{ direction: 'rtl' }}>{totalAssets}</div>
									</div>
								</td>
							</tr>
							</tfoot>
            ) : null
        }
			</table>
		</div>
  );
}

export default AssetsBlock;