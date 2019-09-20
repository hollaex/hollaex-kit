require('should')
var j = require('./index')

describe('toJalaali', function () {
  it('should convert Gregorian to Jalaali correctly', function () {
    j.toJalaali(1981, 8, 17).should.be.eql({jy: 1360, jm: 5, jd: 26})
    j.toJalaali(2013, 1, 10).should.be.eql({jy: 1391, jm: 10, jd: 21})
    j.toJalaali(2014, 8, 4).should.be.eql({jy: 1393, jm: 5, jd: 13})
  })

  it('should convert Date object to Jalaali', function () {
    j.toJalaali(new Date(1981, 8 - 1, 17)).should.be.eql({jy: 1360, jm: 5, jd: 26})
    j.toJalaali(new Date(2013, 1 - 1, 10)).should.be.eql({jy: 1391, jm: 10, jd: 21})
    j.toJalaali(new Date(2014, 8 - 1, 4)).should.be.eql({jy: 1393, jm: 5, jd: 13})
  })
})

describe('toGregorian', function () {
  it('should convert Jalaali to Gregorian correctly', function () {
    j.toGregorian(1360, 5, 26).should.be.eql({gy: 1981, gm: 8, gd: 17})
    j.toGregorian(1391, 10, 21).should.be.eql({gy: 2013, gm: 1, gd: 10})
    j.toGregorian(1393, 5, 13).should.be.eql({gy: 2014, gm: 8, gd: 4})
  })
})

describe('isValidJalaaliDate', function () {
  it('should check validity of a Jalaali date', function () {
    j.isValidJalaaliDate(-62, 12, 29).should.be.false
    j.isValidJalaaliDate(-62, 12, 29).should.be.false
    j.isValidJalaaliDate(-61, 1, 1).should.be.true
    j.isValidJalaaliDate(3178, 1, 1).should.be.false
    j.isValidJalaaliDate(3177, 12, 29).should.be.true
    j.isValidJalaaliDate(1393, 0, 1).should.be.false
    j.isValidJalaaliDate(1393, 13, 1).should.be.false
    j.isValidJalaaliDate(1393, 1, 0).should.be.false
    j.isValidJalaaliDate(1393, 1, 32).should.be.false
    j.isValidJalaaliDate(1393, 1, 31).should.be.true
    j.isValidJalaaliDate(1393, 11, 31).should.be.false
    j.isValidJalaaliDate(1393, 11, 30).should.be.true
    j.isValidJalaaliDate(1393, 12, 30).should.be.false
    j.isValidJalaaliDate(1393, 12, 29).should.be.true
    j.isValidJalaaliDate(1395, 12, 30).should.be.true
  })
})

describe('isLeapJalaaliYear', function () {
  it('should check if a Jalaali year is leap or common', function () {
    j.isLeapJalaaliYear(1393).should.be.false
    j.isLeapJalaaliYear(1394).should.be.false
    j.isLeapJalaaliYear(1395).should.be.true
    j.isLeapJalaaliYear(1396).should.be.false
  })
})

describe('jalaaliMonthLength', function () {
  it('should return number of days in a given Jalaali year and month', function () {
    j.jalaaliMonthLength(1393, 1).should.be.exactly(31)
    j.jalaaliMonthLength(1393, 4).should.be.exactly(31)
    j.jalaaliMonthLength(1393, 6).should.be.exactly(31)
    j.jalaaliMonthLength(1393, 7).should.be.exactly(30)
    j.jalaaliMonthLength(1393, 10).should.be.exactly(30)
    j.jalaaliMonthLength(1393, 12).should.be.exactly(29)
    j.jalaaliMonthLength(1394, 12).should.be.exactly(29)
    j.jalaaliMonthLength(1395, 12).should.be.exactly(30)
  })
})
