const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var client = new HollaEx({accessToken : ACCESS_TOKEN});

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);


  describe(client.getTickers('btc-eur'), () => {
    it('it should GET ticker', (done) => {
      chai.request(server)
          .get('/ticker')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
            done();
          });
    });
});
