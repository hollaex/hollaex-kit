/***
 * @license
 * https://github.com/bitcoincashjs/bchaddr
 * Copyright (c) 2018 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

var assert = require('chai').assert
var bchaddr = require('..')

describe('bchaddr', function () {
  var LEGACY_MAINNET_P2PKH_ADDRESSES = [
    '1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR',
    '185K5yAfcrARrHjNVt4iAUHtkYqcogF4km',
    '1EUrmffDt4SQQkGVfmDTyFcp57PuByeadW',
    '1H6YWsFBxvDx6Ce9dyUFZvjG29npxQpBpR',
    '15z9kQvBaZmTGRTRbP3K1VBM3BQvRsj4U4',
    '1P238gziZdeS5Wj9nqLhQHSBK2Lz6zPSke',
    '13WamBttqMB9AHNovKBCeLFGC5sbN4iZkh',
    '17Sa1fdVXh2NVgcn5xoWzTLGNivg9gUDQ7',
    '1tQ2P2q5cVERY8AkGD4K8RGc6NmZQVTKN',
    '1FJSGaq7Wip2ADSJboxMXniPhnYM8ym5Ri',
    '1GxjvJnjF6t29gDnX4jF3u25u5JRqANYPV',
    '1N7gqB2GtgJG8ap3uwRoKyrcrrSTa4qfXu',
    '1JG6fXqEiu9H2fktGxqpFfGGLdy6ie7QgY',
    '14ipzRgYAbSZUnmeRNhhrPMQ8XQrzGg4wo',
    '185FScTRCtVXRoy5gSDbuLnnQaQWqCK4A1',
    '1NPRQpCNaeVvZLYw6Z3Y1XkKxLt9BrFTn5',
    '1Pa8bRApFwCZ8rkgCJh9mfUmj4XJMUYdom',
    '13HmTnwyKacGJCt2WseTReCeEAtG5ZAyci',
    '1Mdob5JY1yuwoj6y76Vf3AQpoqUH5Aft8z',
    '1D8zGeRj3Vkns6VwKxwNoW2mDsxF25w2Zy'
  ]

  var LEGACY_MAINNET_P2SH_ADDRESSES = [
    '3BqVJRg7Jf94yJSvj2zxaPFAEYh3MAyyw9',
    '38mL1Wf7AkUowTRocyjJb6epu58LSafEYf',
    '3FAshD9fRxknVuxvnrt4PsykDdgckmK7xD',
    '3HnZSQjdWpYLBNLam58qzZ6CAg5YXBddBW',
    '36gAfxQd8U5qMb9riUhuS7YHBhhdvjr8u1',
    '3Pi44EVA7XxpAgRauw1Hpuo7TYdhd7WMon',
    '34CbgjPLPFVXFT5F3Qqo4xcCLcAJwvkM85',
    '388awD7w5bLkarKDD4U7R5hCXFDPmHuWW7',
    '32aQwvXGdWocWhpbsMsejknCkcfVB4ivTM',
    '3FzTC8KZ4d8QFP8jiucwxR5KrJq4bcevn7',
    '3HekqrHAo1CQEqvDeAPqUXP23bb9Sf9WoA',
    '3NohkiWiSaceDkWV336PkcDZ1NjBBWBewT',
    '3Jx7b5KgGoTf7qTKQ4WQgHdCVAFpCKiqsB',
    '35QquyAyiVkwZxU5YUNJH1iLH3haZ5TEfC',
    '38mGN9wrknouWyfWoXtCKy9iZ6hEMRGsyp',
    '3P5SLMgp8YpJeWFNDei8SA7G6sArkNKQKL',
    '3QG9WxfFoqWwE2T7KQMkCHqhsap1waSfDu',
    '33ynPLSQsUvePNaTdyK3rGZaNhAyfeAmbT',
    '3NKpWcnyZtEKttoQECAFTnmkxMkzgbT4WX',
    '3Dq1CBvAbQ5AxGCNT4byE8PhNQExZcR6Q2'
  ]

  var LEGACY_TESTNET_P2PKH_ADDRESSES = [
    'mqfRfwGeZnFwfFE7KWJjyg6Yx212iGi6Fi',
    'mnbGP2FeRsbgdQCzDT35zPWDcYSKm4wrcg',
    'mtzp4ikCh5sfBrk7PLBqoAq8w6zc48PsGn',
    'mwcVovLAmwfCsK7mMYSdPqwat9PXqcMiFt',
    'mkW73U1APbCi3Xw3Jx1gqQPfuB1dHFDiEU',
    'n3XzRk5hNf5grdCmWQK5ECeWB1wgzzYzZd',
    'mi2Y4EyseNcPwPrRdt9aUFTb45UJHNgtbL',
    'mmxXJiiULiTdGo6PoXmtpNYbEiXP2v746S',
    'mgQMKS7otdvVCebnTqBS93dbU5yUZPsANB',
    'mupPZdv6KkFGwKuvKNvjMhviZn93yznq73',
    'mwUhDMsi48KGvnhQEdhcspEQm4u8o754bx',
    'n2de8E7FhhjWuhHfdWQB9u4wir3AXqspCt',
    'mxn3xavDXvaXonEVzXpC5aUbCdZoaTEB2g',
    'mjEnHUmWycspFuFG8wg5gJZizX1ZtEF1XN',
    'mnbCjfYQ1uvnCvShQ1ByjG17Ga1Dk3RTXN',
    'n2uNhsHMPfwBLT2Yp81uqSxepLUr6zCnCz',
    'n465tUFo4xdouyEHusfXbah6b481K5Nivk',
    'mhoikr2x8c3X5KMeEScqFZQy6AUy4GeR4M',
    'n29kt8PWq1MCaqaapfU2s5d9fq4yytS1xJ',
    'msewZhWhrXC3eCyZ3XukdRF65sYwtbmARy'
  ]

  var LEGACY_TESTNET_P2SH_ADDRESSES = [
    '2N3PhNAc8v7eRB65UQAcqCLERStuD93JXLD',
    '2MzKY5Fb8nCzA9F4MJ7MBD3e67RLWFE1ciP',
    '2N6j5kx5h3RG8hhbUTzVw1py1RytnZNYoXo',
    '2N9LmW9ff8H3gP9y8SCkicW5TP2HiFpeK4z',
    '2MxENjhLejvbBZNnQPcKn44XYQ3uoiBT3fF',
    '2NFGG7yRBizUANU48b4dASrnNftqsNwzSM1',
    '2MukokUKMzhzsTEhniYTfgubTYxNUi6PtTX',
    '2Mygnzx3xh3r6ndwktC5z32gTjbRZXkJpFr',
    '2Mt8d1fTJEyJxiVT9YVVXMhmTxxsexLdJiE',
    '2N7YfFsFag5dkTAmHQ3EpaN4b4f3EPkwQkk',
    '2N9CxubDCQThkSdYmKJ1i6UNHFwoKBxp2Hj',
    '2NEMupTSk437zRY92iAiGNZCpDiwLvwnZEL',
    '2NAWKepFhtFy1Kd5s5C8HJEcThWTyzKiNGA',
    '2Mvy3yi71KxGHmk6dDbzAtxhbVPukK6MD5u',
    '2MzKURtstNFKFimJ4UfW4wv8ymSuQCcZPN2',
    '2NEdeQ6cqk1KerHsutnL1476XKDP2agcCh5',
    '2NFpMahbHRJ2HRp5ezXycpEpy5w2BmnVM9W',
    '2MuXzT5NSUwRzbAD1K6vvUDYqb3P9RUvPgK',
    '2NDt2aMj1BLjg6gRwuKn85jm2AhyAV8e2VF',
    '2N5PDFvrCCraXA3pv8CDqr5NxakT8KJb3Gg'
  ]

  var BITPAY_MAINNET_P2PKH_ADDRESSES = [
    'CScMwvXjdooDnGevHgfHjGWFi9cjk75Aaj',
    'CPYCf1WjVu8xkRdoBdPdjyuvNg42oA7g3o',
    'CVwkLi1Hm7QwJtAvMWYPYmEqhEcK4KW3my',
    'CYZS5ubFqyCUzLYaKioB9SMHeH1Eno9teV',
    'CMT3KTGFTcjzAZMrH8NEazoNfJdLLwdA2P',
    'CeUvhjLnSgcxyedaUafcyo4Cw9ZPwGq9JJ',
    'CJyULEExiQ9g4RHEc4W8DqsHpD61DzD2KS',
    'CNuTahyZQjzuPpXCmi8SZxxHzr966Y3NWT',
    'CHMHbRNtxfTmKg2bS1Xyte3JEDbBZJdBDR',
    'CWmKqdBBPmnZ4MLjHZHH7JLRKukm2ZLsY3',
    'CYRdVM8o89rZ3p8DCp4AdQe7XCWqo98EJW',
    'CdaaQDNLmjGo2iiUbgkiuVUeUyesW7zuM3',
    'CZizEaBJbx7ovofJxiAjqAtHxmBWaYnQ8e',
    'CLBiZU2c3eR6Nvg5782dRtyRkedGxq5zep',
    'CPY91eoV5wU4KwsWNBYXUrQp2hcvm6nds4',
    'CdrJyrYSThUTTUTMnJNTb3NMaU6Z4RU7ZN',
    'Cf32ATWt8zB62zf6t425MB6oMBjiHc6XZf',
    'CJkf2qJ3CdaoCLnTCcyP19pfrJ6fyRmeF4',
    'Cd6hA7ebu2tUhs1Pnqpacg2rRxgh4RX3ij',
    'CUbsqgmnvYjKmEQN1iGJP1enr1Aet3jrNW'
  ]

  var BITPAY_MAINNET_P2SH_ADDRESSES = [
    'HGfbmE7C9yMjbUKxaif7YmmhGCi4FN8hzH',
    'HDbSUK6C24hUZdJqUfPTZVBMvj9MGEzYSY',
    'HKzzA1akHGyT85qxeYYDNGWHFHhddvQabB',
    'HNcfuDAiN8kzoYDccknzxwcjCL6ZLVoQNQ',
    'HBWH8kqhynJVym2taAN4QW4pDMiepA7r24',
    'HUYAX2vExrBUnrJcmcfSoJKeVCeiW7ZdQA',
    'H92i9XpREZiBscxGu6Vx3M8jNGBKqscBBB',
    'HCxhQ1Z1vuZRD2CF4k8GPUDjYuEQdZhDyJ',
    'H7QXQixMUq2H8shdj3Xoi9JjnGgW4UtQvF',
    'HLpZevkduwM4sZ1mabH6vobrsxr5XLQ9Xh',
    'HNUsJeiFeKR4s1oFVr3zSuuZ5FcAJ5fEvi',
    'HTdpDWwoHtqJqvPWtikYizk632kC3jeVq5',
    'HPnE3skm87gKk1LMFkAZeg9jWpGq5JcGD2',
    'HAExNmc4ZoycC8M7QA2TFQEsJhibS24Sff',
    'HDbNpxNwc72a99YYfDYMJMgFakiFCURWsc',
    'HTuYoA7tys2yGg8Q5LNHQYdo8XBsZkPfms',
    'HV6Fym6Lf9jbrCL9B61uAgNEuEq2mwoPKw',
    'H8otr8sVio9K1YTVVeyCpf67QMBzV5ieHM',
    'HT9vyRE4RCSzX4gS5spQSBJHz1n1ZBCcYM',
    'HJf7ezMFSiHqaS5QJkG8CWvEQ4FyTTnjMB'
  ]

  var BITPAY_TESTNET_P2PKH_ADDRESSES = [
    'mqfRfwGeZnFwfFE7KWJjyg6Yx212iGi6Fi',
    'mnbGP2FeRsbgdQCzDT35zPWDcYSKm4wrcg',
    'mtzp4ikCh5sfBrk7PLBqoAq8w6zc48PsGn',
    'mwcVovLAmwfCsK7mMYSdPqwat9PXqcMiFt',
    'mkW73U1APbCi3Xw3Jx1gqQPfuB1dHFDiEU',
    'n3XzRk5hNf5grdCmWQK5ECeWB1wgzzYzZd',
    'mi2Y4EyseNcPwPrRdt9aUFTb45UJHNgtbL',
    'mmxXJiiULiTdGo6PoXmtpNYbEiXP2v746S',
    'mgQMKS7otdvVCebnTqBS93dbU5yUZPsANB',
    'mupPZdv6KkFGwKuvKNvjMhviZn93yznq73',
    'mwUhDMsi48KGvnhQEdhcspEQm4u8o754bx',
    'n2de8E7FhhjWuhHfdWQB9u4wir3AXqspCt',
    'mxn3xavDXvaXonEVzXpC5aUbCdZoaTEB2g',
    'mjEnHUmWycspFuFG8wg5gJZizX1ZtEF1XN',
    'mnbCjfYQ1uvnCvShQ1ByjG17Ga1Dk3RTXN',
    'n2uNhsHMPfwBLT2Yp81uqSxepLUr6zCnCz',
    'n465tUFo4xdouyEHusfXbah6b481K5Nivk',
    'mhoikr2x8c3X5KMeEScqFZQy6AUy4GeR4M',
    'n29kt8PWq1MCaqaapfU2s5d9fq4yytS1xJ',
    'msewZhWhrXC3eCyZ3XukdRF65sYwtbmARy'
  ]

  var BITPAY_TESTNET_P2SH_ADDRESSES = [
    '2N3PhNAc8v7eRB65UQAcqCLERStuD93JXLD',
    '2MzKY5Fb8nCzA9F4MJ7MBD3e67RLWFE1ciP',
    '2N6j5kx5h3RG8hhbUTzVw1py1RytnZNYoXo',
    '2N9LmW9ff8H3gP9y8SCkicW5TP2HiFpeK4z',
    '2MxENjhLejvbBZNnQPcKn44XYQ3uoiBT3fF',
    '2NFGG7yRBizUANU48b4dASrnNftqsNwzSM1',
    '2MukokUKMzhzsTEhniYTfgubTYxNUi6PtTX',
    '2Mygnzx3xh3r6ndwktC5z32gTjbRZXkJpFr',
    '2Mt8d1fTJEyJxiVT9YVVXMhmTxxsexLdJiE',
    '2N7YfFsFag5dkTAmHQ3EpaN4b4f3EPkwQkk',
    '2N9CxubDCQThkSdYmKJ1i6UNHFwoKBxp2Hj',
    '2NEMupTSk437zRY92iAiGNZCpDiwLvwnZEL',
    '2NAWKepFhtFy1Kd5s5C8HJEcThWTyzKiNGA',
    '2Mvy3yi71KxGHmk6dDbzAtxhbVPukK6MD5u',
    '2MzKURtstNFKFimJ4UfW4wv8ymSuQCcZPN2',
    '2NEdeQ6cqk1KerHsutnL1476XKDP2agcCh5',
    '2NFpMahbHRJ2HRp5ezXycpEpy5w2BmnVM9W',
    '2MuXzT5NSUwRzbAD1K6vvUDYqb3P9RUvPgK',
    '2NDt2aMj1BLjg6gRwuKn85jm2AhyAV8e2VF',
    '2N5PDFvrCCraXA3pv8CDqr5NxakT8KJb3Gg'
  ]

  var CASHADDR_MAINNET_P2PKH_ADDRESSES = [
    'bitcoincash:qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk',
    'bitcoincash:qpxenfpcf975gxdjmq9pk3xm6hjmfj6re56t60smsm',
    'bitcoincash:qzfau6vrq980qntgp5e7l6cpfsf7jw88c5u7y85qx6',
    'bitcoincash:qzcguejjfxld867ck4zudc9a6y8mf6ftgqqrxzfmlh',
    'bitcoincash:qqm2lpqdfjsg8kkhwk0a3e3gypyswkd69urny99j70',
    'bitcoincash:qrccfa4qm3xfcrta78v7du75jjaww0ylnss5nxsy9s',
    'bitcoincash:qqdcsl6c879esyxyacmz7g6vtzwjjwtznsv65x6znz',
    'bitcoincash:qpr2ddwe8qnnh8h20mmn4zgrharmy0vuy5y4gr8gl2',
    'bitcoincash:qqymsmh0nhfhs9k5whhnjwfxyaumvtxm8g2z0s4f9y',
    'bitcoincash:qzwdmm83qjx7372wxgszaukan73ffn8ct54v6hs3dl',
    'bitcoincash:qzh3f9me5z5sn2w8euap2gyrp6kr7gf6my5mhjey6s',
    'bitcoincash:qrneuckcx69clprn4nnr82tf8sycqrs3ac4tr8m86f',
    'bitcoincash:qz742xef07g9w8q52mx0q6m9hp05hnzm657wqd0ce2',
    'bitcoincash:qq5dzl0drx8v0layyyuh5aupvxfs80ydmsp5444280',
    'bitcoincash:qpxedxtug7kpwd6tgf5vx08gjamel7sldsc40mxew8',
    'bitcoincash:qr4fs2m8tjmw54r2aqmadggzuagttkujgyrjs5d769',
    'bitcoincash:qrmed4fxlhkgay9nxw7zn9muew5ktkyjnuuawvycze',
    'bitcoincash:qqv3cpvmu4h0vqa6aly0urec7kwtuhe49yz6e7922v',
    'bitcoincash:qr39scfteeu5l573lzerchh6wc4cqkxeturafzfkk9',
    'bitcoincash:qzzjgw37vwls805c9fw6g9vqyupadst6wgmane0s4l'
  ]

  var CASHADDR_MAINNET_P2SH_ADDRESSES = [
    'bitcoincash:pph5kuz78czq00e3t85ugpgd7xmer5kr7crv8a2z4t',
    'bitcoincash:ppxenfpcf975gxdjmq9pk3xm6hjmfj6re5dw8qhctx',
    'bitcoincash:pzfau6vrq980qntgp5e7l6cpfsf7jw88c5tmegnra8',
    'bitcoincash:pzcguejjfxld867ck4zudc9a6y8mf6ftgqhxmdwcy2',
    'bitcoincash:pqm2lpqdfjsg8kkhwk0a3e3gypyswkd69u5ke2z39j',
    'bitcoincash:prccfa4qm3xfcrta78v7du75jjaww0ylns83wfh87d',
    'bitcoincash:pqdcsl6c879esyxyacmz7g6vtzwjjwtznsmlffapgl',
    'bitcoincash:ppr2ddwe8qnnh8h20mmn4zgrharmy0vuy5ns4vqtyh',
    'bitcoincash:pqymsmh0nhfhs9k5whhnjwfxyaumvtxm8ga8jlj27e',
    'bitcoincash:pzwdmm83qjx7372wxgszaukan73ffn8ct5zf8chjkz',
    'bitcoincash:pzh3f9me5z5sn2w8euap2gyrp6kr7gf6myr72a78pd',
    'bitcoincash:prneuckcx69clprn4nnr82tf8sycqrs3aczw7guyp5',
    'bitcoincash:pz742xef07g9w8q52mx0q6m9hp05hnzm65ftazgmzh',
    'bitcoincash:pq5dzl0drx8v0layyyuh5aupvxfs80ydmsk3g6jfuj',
    'bitcoincash:ppxedxtug7kpwd6tgf5vx08gjamel7slds0sj5p646',
    'bitcoincash:pr4fs2m8tjmw54r2aqmadggzuagttkujgy5hdm2apc',
    'bitcoincash:prmed4fxlhkgay9nxw7zn9muew5ktkyjnutcnrrmey',
    'bitcoincash:pqv3cpvmu4h0vqa6aly0urec7kwtuhe49y4ly3zf33',
    'bitcoincash:pr39scfteeu5l573lzerchh6wc4cqkxetu5c5dw4dc',
    'bitcoincash:pzzjgw37vwls805c9fw6g9vqyupadst6wgvcwkgnwz'
  ]

  var CASHADDR_TESTNET_P2PKH_ADDRESSES = [
    'bchtest:qph5kuz78czq00e3t85ugpgd7xmer5kr7csm740kf2',
    'bchtest:qpxenfpcf975gxdjmq9pk3xm6hjmfj6re57e7gjvh8',
    'bchtest:qzfau6vrq980qntgp5e7l6cpfsf7jw88c5cvqqkhpx',
    'bchtest:qzcguejjfxld867ck4zudc9a6y8mf6ftgqy3z9tvct',
    'bchtest:qqm2lpqdfjsg8kkhwk0a3e3gypyswkd69u8pqz89en',
    'bchtest:qrccfa4qm3xfcrta78v7du75jjaww0ylns5xhpjnzv',
    'bchtest:qqdcsl6c879esyxyacmz7g6vtzwjjwtznsggspc457',
    'bchtest:qpr2ddwe8qnnh8h20mmn4zgrharmy0vuy5q8vy9lck',
    'bchtest:qqymsmh0nhfhs9k5whhnjwfxyaumvtxm8gwsthh7zc',
    'bchtest:qzwdmm83qjx7372wxgszaukan73ffn8ct5377sjx2r',
    'bchtest:qzh3f9me5z5sn2w8euap2gyrp6kr7gf6mysfn4mnav',
    'bchtest:qrneuckcx69clprn4nnr82tf8sycqrs3ac3e8qesa4',
    'bchtest:qz742xef07g9w8q52mx0q6m9hp05hnzm656uy2d07k',
    'bchtest:qq5dzl0drx8v0layyyuh5aupvxfs80ydms9x3jhaqn',
    'bchtest:qpxedxtug7kpwd6tgf5vx08gjamel7sldsu8tuywfm',
    'bchtest:qr4fs2m8tjmw54r2aqmadggzuagttkujgy8q5n0fae',
    'bchtest:qrmed4fxlhkgay9nxw7zn9muew5ktkyjnuc02tx099',
    'bchtest:qqv3cpvmu4h0vqa6aly0urec7kwtuhe49yxgae8ads',
    'bchtest:qr39scfteeu5l573lzerchh6wc4cqkxetu80d9tp3e',
    'bchtest:qzzjgw37vwls805c9fw6g9vqyupadst6wgl0h7d8jr'
  ]

  var CASHADDR_TESTNET_P2SH_ADDRESSES = [
    'bchtest:pph5kuz78czq00e3t85ugpgd7xmer5kr7c87r6g4jh',
    'bchtest:ppxenfpcf975gxdjmq9pk3xm6hjmfj6re5fur840v6',
    'bchtest:pzfau6vrq980qntgp5e7l6cpfsf7jw88c50fa0356m',
    'bchtest:pzcguejjfxld867ck4zudc9a6y8mf6ftgqn5l2v0rk',
    'bchtest:pqm2lpqdfjsg8kkhwk0a3e3gypyswkd69usyadqxzw',
    'bchtest:prccfa4qm3xfcrta78v7du75jjaww0ylnsrr2w4se3',
    'bchtest:pqdcsl6c879esyxyacmz7g6vtzwjjwtznslddwlk0r',
    'bchtest:ppr2ddwe8qnnh8h20mmn4zgrharmy0vuy5hz3tzurt',
    'bchtest:pqymsmh0nhfhs9k5whhnjwfxyaumvtxm8ge4kcsae9',
    'bchtest:pzwdmm83qjx7372wxgszaukan73ffn8ct5xmrl4937',
    'bchtest:pzh3f9me5z5sn2w8euap2gyrp6kr7gf6my8vw6usx3',
    'bchtest:prneuckcx69clprn4nnr82tf8sycqrs3acxu607nxg',
    'bchtest:pz742xef07g9w8q52mx0q6m9hp05hnzm65dee92v9t',
    'bchtest:pq5dzl0drx8v0layyyuh5aupvxfs80ydmsjrvas7mw',
    'bchtest:ppxedxtug7kpwd6tgf5vx08gjamel7sldstzknrdjx',
    'bchtest:pr4fs2m8tjmw54r2aqmadggzuagttkujgys9fug2xy',
    'bchtest:prmed4fxlhkgay9nxw7zn9muew5ktkyjnu02hypv7c',
    'bchtest:pqv3cpvmu4h0vqa6aly0urec7kwtuhe49y3dqkq7kd',
    'bchtest:pr39scfteeu5l573lzerchh6wc4cqkxetus2s2vz2y',
    'bchtest:pzzjgw37vwls805c9fw6g9vqyupadst6wgg2232yf7'
  ]

  var LEGACY_ADDRESSES = flatten([
    LEGACY_MAINNET_P2PKH_ADDRESSES,
    LEGACY_MAINNET_P2SH_ADDRESSES,
    LEGACY_TESTNET_P2PKH_ADDRESSES,
    LEGACY_TESTNET_P2SH_ADDRESSES
  ])

  var BITPAY_MAINNET_ADDRESSES = flatten([
    BITPAY_MAINNET_P2PKH_ADDRESSES,
    BITPAY_MAINNET_P2SH_ADDRESSES
  ])

  var BITPAY_ADDRESSES = flatten([
    BITPAY_MAINNET_ADDRESSES,
    BITPAY_TESTNET_P2PKH_ADDRESSES,
    BITPAY_TESTNET_P2SH_ADDRESSES
  ])

  var CASHADDR_ADDRESSES = flatten([
    CASHADDR_MAINNET_P2PKH_ADDRESSES,
    CASHADDR_MAINNET_P2SH_ADDRESSES,
    CASHADDR_TESTNET_P2PKH_ADDRESSES,
    CASHADDR_TESTNET_P2SH_ADDRESSES
  ])

  var CASHADDR_ADDRESSES_NO_PREFIX = CASHADDR_ADDRESSES.map(function (address) {
    var parts = address.split(':')
    return parts[1]
  })

  var MAINNET_ADDRESSES = flatten([
    LEGACY_MAINNET_P2PKH_ADDRESSES,
    LEGACY_MAINNET_P2SH_ADDRESSES,
    BITPAY_MAINNET_P2PKH_ADDRESSES,
    BITPAY_MAINNET_P2SH_ADDRESSES,
    CASHADDR_MAINNET_P2PKH_ADDRESSES,
    CASHADDR_MAINNET_P2SH_ADDRESSES
  ])

  var TESTNET_ADDRESSES = flatten([
    LEGACY_TESTNET_P2PKH_ADDRESSES,
    LEGACY_TESTNET_P2SH_ADDRESSES,
    BITPAY_TESTNET_P2PKH_ADDRESSES,
    BITPAY_TESTNET_P2SH_ADDRESSES,
    CASHADDR_TESTNET_P2PKH_ADDRESSES,
    CASHADDR_TESTNET_P2SH_ADDRESSES
  ])

  var P2PKH_ADDRESSES = flatten([
    LEGACY_MAINNET_P2PKH_ADDRESSES,
    LEGACY_TESTNET_P2PKH_ADDRESSES,
    BITPAY_MAINNET_P2PKH_ADDRESSES,
    BITPAY_TESTNET_P2PKH_ADDRESSES,
    CASHADDR_MAINNET_P2PKH_ADDRESSES,
    CASHADDR_TESTNET_P2PKH_ADDRESSES
  ])

  var P2SH_ADDRESSES = flatten([
    LEGACY_MAINNET_P2SH_ADDRESSES,
    LEGACY_TESTNET_P2SH_ADDRESSES,
    BITPAY_MAINNET_P2SH_ADDRESSES,
    BITPAY_TESTNET_P2SH_ADDRESSES,
    CASHADDR_MAINNET_P2SH_ADDRESSES,
    CASHADDR_TESTNET_P2SH_ADDRESSES
  ])

  function flatten (arrays) {
    return [].concat.apply([], arrays)
  }

  describe('#detectAddressFormat()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.detectAddressFormat()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.detectAddressFormat('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.detectAddressFormat('st1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('it should detect a legacy address\' format correctly', function () {
      LEGACY_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressFormat(address), bchaddr.Format.Legacy)
      })
    })
    it('it should detect a bitpay address\' format correctly', function () {
      BITPAY_MAINNET_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressFormat(address), bchaddr.Format.Bitpay)
      })
    })
    it('it should detect a cashaddr address\' format correctly', function () {
      CASHADDR_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressFormat(address), bchaddr.Format.Cashaddr)
      })
    })
  })

  describe('#detectAddressNetwork()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.detectAddressNetwork()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.detectAddressNetwork('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.detectAddressNetwork('t1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('it should detect a mainnet address\' network correctly', function () {
      MAINNET_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressNetwork(address), bchaddr.Network.Mainnet)
      })
    })
    it('it should detect a testnet address\' network correctly', function () {
      TESTNET_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressNetwork(address), bchaddr.Network.Testnet)
      })
    })
  })

  describe('#detectAddressType()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.detectAddressType()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.detectAddressType('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.detectAddressType('somt1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should detect a P2PKH address\' type correctly', function () {
      P2PKH_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressType(address), bchaddr.Type.P2PKH)
      })
    })
    it('should detect a P2SH address\' type correctly', function () {
      P2SH_ADDRESSES.forEach(function (address) {
        assert.strictEqual(bchaddr.detectAddressType(address), bchaddr.Type.P2SH)
      })
    })
  })

  describe('#toLegacyAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.toLegacyAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.toLegacyAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.toLegacyAddress('some t1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should translate legacy address format to itself correctly', function () {
      assert.deepEqual(
        LEGACY_ADDRESSES.map(bchaddr.toLegacyAddress),
        LEGACY_ADDRESSES
      )
    })
    it('should translate bitpay address format to legacy format correctly', function () {
      assert.deepEqual(
        BITPAY_ADDRESSES.map(bchaddr.toLegacyAddress),
        LEGACY_ADDRESSES
      )
    })
    it('should translate cashaddr address format to legacy format correctly', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES.map(bchaddr.toLegacyAddress),
        LEGACY_ADDRESSES
      )
    })
  })

  describe('#toBitpayAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.toBitpayAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.toBitpayAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.toBitpayAddress('some t1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should translate legacy address format to bitpay format correctly', function () {
      assert.deepEqual(
        LEGACY_ADDRESSES.map(bchaddr.toBitpayAddress),
        BITPAY_ADDRESSES
      )
    })
    it('should translate bitpay address format to itself correctly', function () {
      assert.deepEqual(
        BITPAY_ADDRESSES.map(bchaddr.toBitpayAddress),
        BITPAY_ADDRESSES
      )
    })
    it('should translate cashaddr address format to bitpay format correctly', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES.map(bchaddr.toBitpayAddress),
        BITPAY_ADDRESSES
      )
    })
  })

  describe('#toCashAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.toCashAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.toCashAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.toCashAddress('some int1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should translate legacy address format to cashaddr format correctly', function () {
      assert.deepEqual(
        LEGACY_ADDRESSES.map(bchaddr.toCashAddress),
        CASHADDR_ADDRESSES
      )
    })
    it('should translate bitpay address format to cashaddr format correctly', function () {
      assert.deepEqual(
        BITPAY_ADDRESSES.map(bchaddr.toCashAddress),
        CASHADDR_ADDRESSES
      )
    })
    it('should translate cashaddr address format to itself correctly', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES.map(bchaddr.toCashAddress),
        CASHADDR_ADDRESSES
      )
    })
    it('should translate no-prefix cashaddr address format to itself correctly', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.toCashAddress),
        CASHADDR_ADDRESSES
      )
    })
  })

  describe('#isLegacyAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isLegacyAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isLegacyAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isLegacyAddress('some t1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return true for a legacy address', function () {
      LEGACY_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isLegacyAddress(address))
      })
    })
    it('should return false for a bitpay address', function () {
      BITPAY_MAINNET_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isLegacyAddress(address))
      })
    })
    it('should return false for a cashaddr address', function () {
      CASHADDR_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isLegacyAddress(address))
      })
    })
  })

  describe('#isBitpayAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isBitpayAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isBitpayAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isBitpayAddress('some t1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return false for a legacy address', function () {
      LEGACY_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isBitpayAddress(address))
      })
    })
    it('should return true for a bitpay address', function () {
      BITPAY_MAINNET_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isBitpayAddress(address))
      })
    })
    it('should return false for a cashaddr address', function () {
      CASHADDR_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isBitpayAddress(address))
      })
    })
  })

  describe('#isCashAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isCashAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isCashAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isCashAddress('some int1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return false for a legacy address', function () {
      LEGACY_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isCashAddress(address))
      })
    })
    it('should return false for a bitpay address', function () {
      BITPAY_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isCashAddress(address))
      })
    })
    it('should return true for a cashaddr address', function () {
      CASHADDR_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isCashAddress(address))
      })
    })
  })

  describe('#isMainnetAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isMainnetAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isMainnetAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isMainnetAddress('somet1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return true for a mainnet address', function () {
      MAINNET_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isMainnetAddress(address))
      })
    })
    it('should return false for a testnet address', function () {
      TESTNET_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isMainnetAddress(address))
      })
    })
  })

  describe('#isTestnetAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isTestnetAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isTestnetAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isTestnetAddress('somet1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return false for a mainnet address', function () {
      MAINNET_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isTestnetAddress(address))
      })
    })
    it('should return true for a testnet address', function () {
      TESTNET_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isTestnetAddress(address))
      })
    })
  })

  describe('#isP2PKHAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isP2PKHAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isP2PKHAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isP2PKHAddress('some it1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return true for a P2PKH address', function () {
      P2PKH_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isP2PKHAddress(address))
      })
    })
    it('should return false for a P2SH address', function () {
      P2SH_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isP2PKHAddress(address))
      })
    })
  })

  describe('#isP2SHAddress()', function () {
    it('should fail when called with an invalid address', function () {
      assert.throws(function () {
        bchaddr.isP2SHAddress()
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isP2SHAddress('some invalid address')
      }, bchaddr.InvalidAddressError)
      assert.throws(function () {
        bchaddr.isP2SHAddress('some int1LuPdPkGH5QoNSewQrr8EzNbM27ktPdgQX')
      }, bchaddr.InvalidAddressError)
    })
    it('should return false for a P2PKH address', function () {
      P2PKH_ADDRESSES.forEach(function (address) {
        assert.isFalse(bchaddr.isP2SHAddress(address))
      })
    })
    it('should return true for a P2SH address', function () {
      P2SH_ADDRESSES.forEach(function (address) {
        assert.isTrue(bchaddr.isP2SHAddress(address))
      })
    })
  })

  describe('cashaddr prefix detection', function () {
    it('should return the same result for detectAddressFormat', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.detectAddressFormat),
        CASHADDR_ADDRESSES.map(bchaddr.detectAddressFormat)
      )
    })
    it('should return the same result for detectAddressNetwork', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.detectAddressNetwork),
        CASHADDR_ADDRESSES.map(bchaddr.detectAddressNetwork)
      )
    })
    it('should return the same result for detectAddressType', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.detectAddressType),
        CASHADDR_ADDRESSES.map(bchaddr.detectAddressType)
      )
    })
    it('should return the same result for toLegacyAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.toLegacyAddress),
        CASHADDR_ADDRESSES.map(bchaddr.toLegacyAddress)
      )
    })
    it('should return the same result for toBitpayAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.toBitpayAddress),
        CASHADDR_ADDRESSES.map(bchaddr.toBitpayAddress)
      )
    })
    it('should return the same result for isLegacyAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isLegacyAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isLegacyAddress)
      )
    })
    it('should return the same result for isBitpayAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isBitpayAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isBitpayAddress)
      )
    })
    it('should return the same result for isCashAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isCashAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isCashAddress)
      )
    })
    it('should return the same result for isMainnetAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isMainnetAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isMainnetAddress)
      )
    })
    it('should return the same result for isTestnetAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isTestnetAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isTestnetAddress)
      )
    })
    it('should return the same result for isP2PKHAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isP2PKHAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isP2PKHAddress)
      )
    })
    it('should return the same result for isP2SHAddress', function () {
      assert.deepEqual(
        CASHADDR_ADDRESSES_NO_PREFIX.map(bchaddr.isP2SHAddress),
        CASHADDR_ADDRESSES.map(bchaddr.isP2SHAddress)
      )
    })
  })
})
