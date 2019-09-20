# Jalaali JavaScript

A few javascript functions for converting Jalaali (Jalali, Persian, Khayyami, Khorshidi, Shamsi) and Gregorian calendar systems to each other.

## About

Jalali calendar is a solar calendar that was used in Persia, variants of which today are still in use in Iran as well as Afghanistan. [Read more on Wikipedia](http://en.wikipedia.org/wiki/Jalali_calendar) or see [Calendar Converter](http://www.fourmilab.ch/documents/calendar/).

Calendar conversion is based on the [algorithm provided by Kazimierz M. Borkowski](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) and has a very good performance.

## Install

### Node.js

Use [`npm`](https://npmjs.org) to install:

```sh
$ npm install --save jalaali-js
```

Then import it:

```js
var jalaali = require('jalaali-js')
```


### Browser

Use [`component`](https://github.com/component/component) to install:

```sh
$ component install jalaali/jalaali-js
```

Then import it:

```js
var jalaali = require('jalaali-js')
```

## API

### toJalaali(gy, gm, gd)

Converts a Gregorian date to Jalaali.

```js
jalaali.toJalaali(2016, 4, 11) // { jy: 1395, jm: 1, jd: 23 }
```

### toJalaali(date)

Converts a JavaScript Date object to Jalaali.

```js
jalaali.toJalaali(new Date(2016, 3, 11)) // { jy: 1395, jm: 1, jd: 23 }
```

### toGregorian(jy, jm, jd)

Converts a Jalaali date to Gregorian.

```js
jalaali.toGregorian(1395, 1, 23) // { gy: 2016, gm: 4, gd: 11 }
```

### isValidJalaaliDate(jy, jm, jd)

Checks whether a Jalaali date is valid or not.

```js
jalaali.isValidJalaaliDate(1394, 12, 30) // false
jalaali.isValidJalaaliDate(1395, 12, 30) // true
```

### isLeapJalaaliYear(jy)

Is this a leap year or not?

```js
jalaali.isLeapJalaaliYear(1394) // false
jalaali.isLeapJalaaliYear(1395) // true
```

### jalaaliMonthLength(jy, jm)

Number of days in a given month in a Jalaali year.

```js
jalaali.jalaaliMonthLength(1394, 12) // 29
jalaali.jalaaliMonthLength(1395, 12) // 30
```

### jalCal(jy)

This function determines if the Jalaali (Persian) year is leap (366-day long) or is the common year (365 days), and finds the day in March (Gregorian calendar) of the first day of the Jalaali year (jy).

```js
jalaali.jalCal(1390) // { leap: 3, gy: 2011, march: 21 }
jalaali.jalCal(1391) // { leap: 0, gy: 2012, march: 20 }
jalaali.jalCal(1392) // { leap: 1, gy: 2013, march: 21 }
jalaali.jalCal(1393) // { leap: 2, gy: 2014, march: 21 }
jalaali.jalCal(1394) // { leap: 3, gy: 2015, march: 21 }
jalaali.jalCal(1395) // { leap: 0, gy: 2016, march: 20 }
```

### j2d(jy, jm, jd)

Converts a date of the Jalaali calendar to the Julian Day number.

```js
jalaali.j2d(1395, 1, 23) // 2457490
```

### d2j(jdn)

Converts the Julian Day number to a date in the Jalaali calendar.

```js
jalaali.d2j(2457490) // { jy: 1395, jm: 1, jd: 23 }
```

### g2d(gy, gm, gd)

Calculates the Julian Day number from Gregorian or Julian calendar dates. This integer number corresponds to the noon of the date (i.e. 12 hours of Universal Time). The procedure was tested to be good since 1 March, -100100 (of both calendars) up to a few million years into the future.

```js
jalaali.g2d(2016, 4, 11) // 2457490
```

### d2g(jdn)

Calculates Gregorian and Julian calendar dates from the Julian Day number (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both calendars) to some millions years ahead of the present.

```js
jalaali.d2g(2457490) // { gy: 2016, gm: 4, gd: 11 }
```

## License

MIT
