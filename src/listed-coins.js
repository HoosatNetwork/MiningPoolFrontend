const listedCoins = [
  {
    coin: "BTC",
    prefix: ["1", "3", "bc1"],
    wallet: "https://www.blockchain.com/btc/address/",
    transaction: "https://www.blockchain.com/btc/tx/",
    blocks: "https://www.blockchain.com/btc/block/",
    stratum: [
      {
        location: "New Zealand",
        domain: "zenithpool.net",
      },
    ],
  },
  {
    coin: "LTC",
    prefix: ["L", "M", "ltc1"],
    wallet: "https://blockchair.com/litecoin/address/",
    transaction: "https://blockchair.com/litecoin/transaction/",
    blocks: "https://blockchair.com/litecoin/block/",
    stratum: [{ location: "Global", domain: "stratum+tcp://ltc.pool.com" }],
  },
  {
    coin: "XMR",
    prefix: ["4", "8"],
    wallet: "https://xmrchain.net/address/",
    transaction: "https://xmrchain.net/tx/",
    blocks: "https://xmrchain.net/block/",
    stratum: [{ location: "Global", domain: "stratum+tcp://xmr.pool.com" }],
  },
  {
    coin: "ZEC",
    prefix: ["t1", "t3"],
    wallet: "https://blockchair.com/zcash/address/",
    transaction: "https://blockchair.com/zcash/transaction/",
    blocks: "https://blockchair.com/zcash/block/",
    stratum: [{ location: "Global", domain: "stratum+tcp://zec.pool.com" }],
  },
  {
    coin: "RVN",
    prefix: ["R"],
    wallet: "https://ravencoin.network/address/",
    transaction: "https://ravencoin.network/tx/",
    blocks: "https://ravencoin.network/block/",
    stratum: [{ location: "Global", domain: "stratum+tcp://rvn.pool.com" }],
  },
  {
    coin: "ERG",
    prefix: ["9"],
    wallet: "https://explorer.ergoplatform.com/en/addresses/",
    transaction: "https://explorer.ergoplatform.com/en/transactions/",
    blocks: "https://explorer.ergoplatform.com/en/blocks/",
    stratum: [{ location: "Global", domain: "stratum+tcp://erg.pool.com" }],
  },
  {
    coin: "HTN",
    prefix: ["hoosat"],
    wallet: "https://explorer.hoosat.fi/addresses/",
    transaction: "https://explorer.hoosat.fi/txs/",
    blocks: "https://explorer.hoosat.fi/block/",
    stratum: [
      {
        location: "New Zealand",
        domain: "zenithpool.net",
      },
    ],
  },
];
