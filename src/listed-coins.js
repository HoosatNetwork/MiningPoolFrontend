const listedCoins = [
  {
    coin: "BTC",
    prefix: ["1", "3", "bc1"],
    wallet: "https://www.blockchain.com/btc/address/",
    transaction: "https://www.blockchain.com/btc/tx/",
    blocks: "https://www.blockchain.com/btc/block/",
    stratum: [{ location: "Global", domain: "stratum+tcp://btc.pool.com" }],
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
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "CYTX",
    prefix: ["cryptix"],
    wallet: "https://explorer.cryptix-network.org/addresses/",
    transaction: "https://explorer.cryptix-network.org/txs/",
    blocks: "https://explorer.cryptix-network.org/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "GUUS",
    wallet: [""],
    transaction: "https://explorer.guus.website/block/transaction/",
    blocks: "https://explorer.guus.website/block/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "WALA",
    prefix: ["waglayla"],
    wallet: "https://explorer.waglayla.com/addresses/",
    transaction: "https://explorer.waglayla.com/txs/",
    blocks: "https://explorer.waglayla.com/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "AIX",
    prefix: ["astrix"],
    wallet: "https://explorer.astrix-network.com/addresses/",
    transaction: "https://explorer.astrix-network.com/txs/",
    blocks: "https://explorer.astrix-network.com/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "ANUM",
    prefix: ["anuma"],
    wallet: "https://explorer.anuma.network/addresses/",
    transaction: "https://explorer.anuma.network/txs/",
    blocks: "https://explorer.anuma.network/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "BTCS",
    prefix: ["1", "3", "bc1"],
    wallet: "http://explorer.btcs.pools4mining.com:3001/address/",
    transaction: "http://explorer.btcs.pools4mining.com:3001/tx/",
    blocks: "http://explorer.btcs.pools4mining.com:3001/block/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "SDR",
    prefix: ["sedra"],
    wallet: "https://explorer.sedracoin.com/addresses/",
    transaction: "https://explorer.sedracoin.com/txs/",
    blocks: "https://explorer.sedracoin.com/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "PYI",
    prefix: ["pyrin"],
    wallet: "https://explorer.pyrin.network/addresses/",
    transaction: "https://explorer.pyrin.network/txs/",
    blocks: "https://explorer.pyrin.network/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "NXL",
    prefix: ["nexellia"],
    wallet: "https://explorer.nexell-ia.net/addresses/",
    transaction: "https://explorer.nexell-ia.net/txs/",
    blocks: "https://explorer.nexell-ia.net/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "KAS",
    prefix: ["kaspa"],
    wallet: "https://explorer.kaspa.org/addresses/",
    transaction: "https://explorer.kaspa.org/txs/",
    blocks: "https://explorer.kaspa.org/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "BGA",
    prefix: ["bugna"],
    wallet: "https://explorer.bugna.org/addresses/",
    transaction: "https://explorer.bugna.org/txs/",
    blocks: "https://explorer.bugna.org/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "DOGE",
    prefix: ["D"],
    wallet: "https://dogechain.info/address/",
    transaction: "https://dogechain.info/tx/",
    blocks: "https://dogechain.info/block/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
  {
    coin: "KODA",
    prefix: ["kobra"],
    wallet: "https://explorer.k0bradag.com/addresses/",
    transaction: "https://explorer.k0bradag.com/txs/",
    blocks: "https://explorer.k0bradag.com/blocks/",
    stratum: [
      {
        location: "Europe",
        domain: "eu.MiningPool.com",
      },
      {
        location: "Türkiye",
        domain: "MiningPool.com",
      },
      {
        location: "France",
        domain: "fr.MiningPool.com",
      },
      {
        location: "Asia",
        domain: "asia-sg.MiningPool.com",
      },
      {
        location: "US",
        domain: "us.MiningPool.com",
      },
    ],
  },
];
