const mocha = require("mocha");  

const mochaRun = async (path) => {
    return new Promise((resolve, reject) => {
    const mochaEngine = new mocha({ });
        mochaEngine.addFile(path);
        mochaEngine.run(failures => {
            if (!failures) {
                resolve(0);
            } else {
                reject(failures);
            }
        });
    })
}

const execute = async () => {
    try {
        await mochaRun(__dirname + "/admin/admin-audits-test.js");
        await mochaRun(__dirname + "/admin/admin-balance-test.js");
        await mochaRun(__dirname + "/admin/admin-bank-revoke-test.js");
        await mochaRun(__dirname + "/admin/admin-bank-verify-test.js");
        await mochaRun(__dirname + "/admin/admin-coins-network-test.js");
        await mochaRun(__dirname + "/admin/admin-coins-test.js");
        await mochaRun(__dirname + "/admin/admin-complete-setup-test.js");
        await mochaRun(__dirname + "/admin/admin-dash-token-test.js");
        await mochaRun(__dirname + "/admin/admin-deactivate-otp-test.js");
        await mochaRun(__dirname + "/admin/admin-deposits-test.js");
        await mochaRun(__dirname + "/admin/admin-email-types-test.js");
        await mochaRun(__dirname + "/admin/admin-exchange-test.js");
        await mochaRun(__dirname + "/admin/admin-fees-settle-test.js");
        await mochaRun(__dirname + "/admin/admin-fees-test.js");
        await mochaRun(__dirname + "/admin/admin-flag-user-test.js");
        await mochaRun(__dirname + "/admin/admin-kit-test.js");
        await mochaRun(__dirname + "/admin/admin-kit-user-meta-test.js");
        await mochaRun(__dirname + "/admin/admin-logins-test.js");
        await mochaRun(__dirname + "/admin/admin-network-credentials-test.js");
        await mochaRun(__dirname + "/admin/admin-operator-invite-test.js");
        await mochaRun(__dirname + "/admin/admin-operators-test.js");
        await mochaRun(__dirname + "/admin/admin-order-test.js");
        await mochaRun(__dirname + "/admin/admin-orders-test.js");
        await mochaRun(__dirname + "/admin/admin-pair-fees-test.js");
        await mochaRun(__dirname + "/admin/admin-pairs-network-test.js");
        await mochaRun(__dirname + "/admin/admin-pairs-test.js");
        await mochaRun(__dirname + "/admin/admin-signup-test.js");
        await mochaRun(__dirname + "/admin/admin-tier-test.js");
        await mochaRun(__dirname + "/admin/admin-tiers-limits-test.js");
        await mochaRun(__dirname + "/admin/admin-trades-test.js");
        await mochaRun(__dirname + "/admin/admin-transfer-test.js");
        await mochaRun(__dirname + "/admin/admin-upgrade-user-test.js");
        await mochaRun(__dirname + "/admin/admin-user-activate-test.js");
        await mochaRun(__dirname + "/admin/admin-user-balance-test.js");
        await mochaRun(__dirname + "/admin/admin-user-bank-test.js");
        await mochaRun(__dirname + "/admin/admin-user-discount-test.js");
        await mochaRun(__dirname + "/admin/admin-user-meta-test.js");
        await mochaRun(__dirname + "/admin/admin-user-note-test.js");
        await mochaRun(__dirname + "/admin/admin-user-role-test.js");
        await mochaRun(__dirname + "/admin/admin-user-test.js");
        await mochaRun(__dirname + "/admin/admin-users-test.js");
        await mochaRun(__dirname + "/admin/admin-verify-email-test.js");
        await mochaRun(__dirname + "/broker/broker-test.js");
        await mochaRun(__dirname + "/chart/chart-test.js");
        await mochaRun(__dirname + "/chart/charts-test.js");
        await mochaRun(__dirname + "/orderbook/orderbook-test.js");
        await mochaRun(__dirname + "/orderbook/orderbooks-test.js");
        await mochaRun(__dirname + "/order/order-all-test.js");
        await mochaRun(__dirname + "/order/order-test.js");
        await mochaRun(__dirname + "/order/orderbook-test.js");
        await mochaRun(__dirname + "/order/orderbooks-test.js");
        await mochaRun(__dirname + "/order/orders-test.js");
        await mochaRun(__dirname + "/login/login-test.js");
        await mochaRun(__dirname + "/plugin/plugin-test.js");
        await mochaRun(__dirname + "/quick-trade/quick-trade-test.js");
        await mochaRun(__dirname + "/reset-password/reset-password-test.js");
        await mochaRun(__dirname + "/signup/signup-test.js");
        await mochaRun(__dirname + "/session/user-session-test.js");
        await mochaRun(__dirname + "/ticker/ticker-all-test.js");
        await mochaRun(__dirname + "/ticker/ticker-test.js");
        await mochaRun(__dirname + "/ticker/tickers-test.js");
        await mochaRun(__dirname + "/tier/tiers-test.js");
        await mochaRun(__dirname + "/trades/trades-test.js");
        await mochaRun(__dirname + "/user/user-activate-otp-test.js");
        await mochaRun(__dirname + "/user/user-affiliation-test.js");
        await mochaRun(__dirname + "/user/user-balance-test.js");
        await mochaRun(__dirname + "/user/user-confirm-withdrawal-test.js");
        await mochaRun(__dirname + "/user/user-create-address-test.js");
        await mochaRun(__dirname + "/user/user-deposits-test.js");
        await mochaRun(__dirname + "/user/user-logins-test.js");
        await mochaRun(__dirname + "/user/user-request-email-confirmation-test.js");
        await mochaRun(__dirname + "/user/user-request-otp-test.js");
        await mochaRun(__dirname + "/user/user-request-withdrawal-test.js");
        await mochaRun(__dirname + "/user/user-settings-test.js");
        await mochaRun(__dirname + "/user/user-test.js");
        await mochaRun(__dirname + "/user/user-token-test.js");
        await mochaRun(__dirname + "/user/user-tokens-test.js");
        await mochaRun(__dirname + "/user/user-trades-test.js");
        await mochaRun(__dirname + "/user/user-username-test.js");
        await mochaRun(__dirname + "/user/user-withdrawal-fee-test.js");
        await mochaRun(__dirname + "/user/user-withdrawal-test.js");
        await mochaRun(__dirname + "/user/user-withdrawals-test.js");
      
        process.exit(0);
    } 
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}

execute()



