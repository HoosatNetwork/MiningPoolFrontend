var poolTypes = [];

const initLanding = async () => {
  addRoute("/", ["wallet-address-search-section", "pool-cards-section", "about-section", "hero-section"], async () => {
    console.log("Landing opened.");
    await setMinersOnline();
    await buildPoolCards("SOLO");
    await setTotalPaid();
  });
  await createPoolTypeButtons();
  $("#wallet-address-search-input").on("keypress", function (event) {
    console.log(event);
    if (event.keyCode == 13) {
      const wallet = $("#wallet-address-search-input").val();
      navigate(`/miner?miner=${wallet}`);
    }
  });
};

const openPoolWithType = async (type) => {
  await buildPoolCards(type);
};

const createPoolTypeButtons = async () => {
  var poolsResponse = await getPools();
  const pools = poolsResponse.pools;
  if (poolTypes.length == 0) {
    for (let i = 0; i < pools.length; i++) {
      const payoutScheme = pools[i].paymentProcessing.payoutScheme;
      if (!poolTypes.includes(payoutScheme)) {
        poolTypes.push(payoutScheme);
      }
    }
  }
  for (let i = 0; i < poolTypes.length; i++) {
    $("#pool-type-buttons").append(`<button onclick="openPoolWithType('${poolTypes[i]}')">${poolTypes[i]}</button>`);
  }
};

const getTimeSinceLastBlock = (time) => {
  const givenDate = new Date(time);
  const currentDate = new Date();
  const diffMilliseconds = currentDate - givenDate;
  const seconds = Math.floor(diffMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
};

const formatHashrate = (hashrate) => {
  if (typeof hashrate !== "number" || hashrate < 0) {
    console.error("Invalid hashrate. Please provide a positive number.");
    return;
  }

  const units = ["H/s", "kH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s"];
  let index = 0;

  // Scale the hashrate to the appropriate unit
  while (hashrate >= 1000 && index < units.length - 1) {
    hashrate /= 1000;
    index++;
  }

  return `${hashrate.toFixed(2)} ${units[index]}`;
};

const setMinersOnline = async () => {
  var poolsResponse = await getPools();
  const pools = poolsResponse.pools;
  var miners = 0;
  for (var i = 0; i < pools.length; i++) {
    const pool = pools[i];
    if (!isNaN(pool.poolStats?.connectedMiners)) {
      miners += pool.poolStats?.connectedMiners;
    }
  }
  $("#connectedMiners").html(miners);
};

setTotalPaid = async () => {
  var poolsResponse = await getPools();
  const pools = poolsResponse.pools;
  const coins = new Set();
  coins.add("bitcoin");
  const coingeckoIdMap = {
    hoosat: "hoosat-network",
  };
  for (var i = 0; i < pools.length; i++) {
    let coin = pools[i].coin.canonicalName.toLowerCase();
    if (coingeckoIdMap[coin] !== undefined) {
      coin = coingeckoIdMap[coin];
    }
    coins.add(coin);
  }
  const uniqueCoins = Array.from(coins);
  const coinPrices = await getCryptoPrices(uniqueCoins, "usd");
  var totalPaid = 0;
  for (var i = 0; i < pools.length; i++) {
    let coin = pools[i].coin.canonicalName.toLowerCase();
    if (coingeckoIdMap[coin] !== undefined) {
      coin = coingeckoIdMap[coin];
    }
    if (coinPrices[coin] !== undefined) {
      totalPaid += pools[i].totalPaid * coinPrices[coin]["usd"];
    }
  }
  $("#totalPaid").html(`${totalPaid.toFixed(2)} USD`);
};

const buildPoolCards = async (type) => {
  var poolsResponse = await getPools();
  const pools = poolsResponse.pools;
  pools.sort((a, b) => (b.poolStats?.connectedMiners || 0) - (a.poolStats?.connectedMiners || 0));

  $("#pool-cards").empty();

  for (var i = 0; i < pools.length; i++) {
    if (pools[i].paymentProcessing.payoutScheme === type) {
      const pool = pools[i];
      const acronym = pool.coin.type.toLowerCase();
      var timeSinceLastBlock = getTimeSinceLastBlock(pool.lastPoolBlockTime);
      if (timeSinceLastBlock == "NaN second ago") {
        timeSinceLastBlock = "Never";
      }
      const poolCard = `
        <div class="card pool-coin">
          <div class="pool-coin-header">
            <img 
              height="100px"
              width="100px"
              src="./img/webp/${acronym}.webp" 
              alt="${pool.coin?.name} Logo" class="img">
            <h1>${pool.coin?.name}</h1>
          </div>
          <div class="pool-coin-item">
            <div class="label">Algorithm</div>
            <div>${pool.coin?.algorithm || ""}</div>
          </div>
          <div class="pool-coin-item">
            <div class="label">Payment Scheme</div>
            <div>${pool.paymentProcessing?.payoutScheme || ""}</div>
          </div>
          <div class="pool-coin-item">
            <div class="label">Pool Fee</div>
            <div>${pool.poolFeePercent || ""}%</div>
          </div>
          <div class="pool-coin-item">
            <div class="label">Miners</div>
            <div>${pool.poolStats?.connectedMiners || "0"}</div>
          </div>
          <div class="pool-coin-item">
            <div class="label">Network Hashrate</div>
            <div>${formatHashrate(pool.networkStats?.networkHashrate || 0) || ""}</div>
          </div>
          <div class="pool-coin-item">
            <div class="label">Pool Hashrate</div>
            <div>${formatHashrate(pool.poolStats?.poolHashrate || 0) || ""}</div>
          </div>
          <div class="pool-coin-item">
            <div class="label">Last Block Found</div>
            <div>${timeSinceLastBlock || ""}</div>
          </div>
          <div class="pool-coin-start-button">
            <button onclick="navigate(
              \`/pool?pool=${pool.id}&coin=${acronym}\`
            )">Start Mining</button>
          </div>
        </div>
      `;
      $("#pool-cards").append(poolCard);
    }
  }
};
