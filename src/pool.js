let hashrateChart = null;
let statisticsInterval = null;
let chartInterval = null;
let minersInterval = null;
let blocksInterval = null;
let paymentsInterval = null;

const showFlag = (countryName) => {
  const countryFlagMap = {
    Finland: "fi",
    Türkiye: "tr",
    France: "fr",
    Italy: "it",
    Europe: "eu",
    US: "us",
    Asia: "sg",
    Singapore: "sg",
  };
  const flagClass = countryFlagMap[countryName] || countryName;
  if (flagClass) {
    return '<span class="fi fi-' + flagClass + '"></span>';
  } else {
    console.log("Flag not found!");
  }
};

const clearIntervals = () => {
  if (statisticsInterval) clearInterval(statisticsInterval);
  if (chartInterval) clearInterval(chartInterval);
  if (minersInterval) clearInterval(minersInterval);
  if (blocksInterval) clearInterval(blocksInterval);
  if (paymentsInterval) clearInterval(paymentsInterval);
};

const initPool = async () => {
  addRoute(
    "/pool",
    [
      "pool-submenu",
      "connect",
      "wallet-address-search-section",
      "statistics",
      "chart-container",
      "miners",
      "blocks",
      "payments",
    ],
    // "statistics",
    async (params) => {
      clearIntervals();
      console.log(`Pool ${params.pool} opened.`);
      await showStatistics(params.pool);
      await showHashrateChart(params.pool);
      chartInterval = setInterval(() => {
        showHashrateChart(params.pool);
      }, 30000);
      await showMiners(params.pool, params.coin);
      minersInterval = setInterval(() => {
        showMiners(params.pool, params.coin);
      }, 30000);
      await showBlocks(params.pool, params.coin);
      blocksInterval = setInterval(() => {
        showBlocks(params.pool, params.coin);
      }, 10000);
      await showPayments(params.pool);
      paymentsInterval = setInterval(() => {
        showPayments(params.pool);
      }, 10000);
      await showConnect(params.pool, params.coin);
    },
    async () => {
      clearIntervals;
    }
  );
  $("#open-connect-button").on("click", () => {
    $("#statistics").hide();
    $("#chart-container").hide();
    $("#miners").hide();
    $("#blocks").hide();
    $("#payments").hide();
    $("#connect").show();
  });
  $("#open-statistics-button").on("click", () => {
    $("#statistics").show();
    $("#chart-container").show();
    $("#miners").hide();
    $("#blocks").hide();
    $("#payments").hide();
    $("#connect").hide();
  });

  $("#open-miners-button").on("click", () => {
    $("#statistics").hide();
    $("#chart-container").hide();
    $("#miners").show();
    $("#blocks").hide();
    $("#payments").hide();
    $("#connect").hide();
  });

  $("#open-blocks-button").on("click", () => {
    $("#statistics").hide();
    $("#chart-container").hide();
    $("#miners").hide();
    $("#blocks").show();
    $("#payments").hide();
    $("#connect").hide();
  });

  $("#open-payments-button").on("click", () => {
    $("#statistics").hide();
    $("#chart-container").hide();
    $("#miners").hide();
    $("#blocks").hide();
    $("#payments").show();
    $("#connect").hide();
  });
};

const formatDifficulty = (value) => {
  if (value < 1000) return value.toFixed(2);

  const suffixes = ["", "K", "M", "B", "T", "P", "E"];
  const tier = Math.floor(Math.log10(value) / 3);

  if (tier === 0) return value.toFixed(2);

  const scaled = value / Math.pow(10, tier * 3);
  return `${scaled.toFixed(2)} ${suffixes[tier]}`;
};

function effortToLuck(rawEffort) {
  if (rawEffort <= 0) return "Invalid effort value";

  let luckFactor = 0;

  if (rawEffort < 1e-9) {
    luckFactor = 1e12; // Kaspa-like scaling (close to 1e-11)
  }

  // Calculate luck and return it
  return `${parseFloat(rawEffort * luckFactor).toFixed(2)}%`;
}
const showStatistics = async (pool) => {
  var poolResponse = await getPool(pool);
  let acronym = poolResponse.pool?.coin?.type;
  $("#statistics-header").html(`${poolResponse.pool?.coin?.canonicalName} Statistics`);
  $("#statistics-token").html(acronym);
  $("#statistics-chain-height").html(poolResponse.pool?.networkStats?.blockHeight);
  $("#statistics-miners").html(poolResponse.pool?.poolStats?.connectedMiners);
  const lastBlock = new Date(poolResponse.pool?.lastPoolBlockTime);
  const formattedDate = lastBlock.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  $("#statistics-last-blocks").html(formattedDate);
  $("#statistics-pool-luck").html(effortToLuck(poolResponse.pool?.poolEffort));
  $("#statistics-network-difficulty").html(formatDifficulty(poolResponse.pool?.networkStats?.networkDifficulty));
  $("#statistics-pool-hashrate").html(formatHashrate(poolResponse.pool?.poolStats?.poolHashrate));
  $("#statistics-network-hashrate").html(formatHashrate(poolResponse.pool?.networkStats?.networkHashrate));
  $("#statistics-pool-fee").html(`${poolResponse.pool?.poolFeePercent} %`);

  $("#statistics-total-paid").html(`${poolResponse.pool?.totalPaid.toFixed(2)} ${acronym}`);

  $("#statistics-total-pool-blocks").html(`${poolResponse.pool?.totalBlocks}`);
  $("#statistics-total-confirmed-blocks").html(`${poolResponse.pool?.totalConfirmedBlocks}`);
  const confirmationsPercentage = (poolResponse.pool?.totalConfirmedBlocks / poolResponse.pool?.totalBlocks) * 100;
  $("#statistics-block-confirmations-percentage").html(`${confirmationsPercentage.toFixed(2)} %`);
  $("#statistics-pending-blocks").html(`${poolResponse.pool?.totalPendingBlocks}`);
};

const formatHashrateChart = (hashrate, unit) => {
  const units = {
    "H/s": 1, // hashes per second (H/s)
    "KH/s": 1e3, // kilohashes per second (kH/s)
    "MH/s": 1e6, // megahashes per second (MH/s)
    "GH/s": 1e9, // gigahashes per second (GH/s)
    "TH/s": 1e12, // terahashes per second (TH/s)
    "PH/s": 1e15, // petahashes per second (PH/s)
  };
  return hashrate / units[unit];
};

const getHashrateUnit = (hashrate) => {
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

  return units[index];
};

const getSmallestHashrate = (data) => {
  if (data.stats && data.stats.length > 0) {
    const hashrates = data.stats.map((stat) => stat.poolHashrate);
    const smallestHashrate = Math.min(...hashrates);
    return smallestHashrate;
  } else {
    return null;
  }
};

const showHashrateChart = async (pool) => {
  var data = await getPoolPerformance(pool);
  console.log(data);
  const labels = data.stats.map((entry) => entry.created);
  const smallestHashrate = getSmallestHashrate(data);
  const unit = getHashrateUnit(smallestHashrate);
  const poolHashrateData = data.stats.map((entry) => formatHashrateChart(entry.poolHashrate, unit));
  if (hashrateChart) {
    hashrateChart.destroy();
  }
  const ctx = document.getElementById("hashrateChart").getContext("2d");
  hashrateChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pool Hashrate",
          data: poolHashrateData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          lineTension: 0.2,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "hour",
            tooltipFormat: "ll HH:mm",
          },
          title: {
            display: true,
            text: "Date and Time",
          },
        },
        y: {
          title: {
            display: true,
            text: `Hashrate (${unit})`,
          },
        },
      },
    },
  });
};

const showMiners = async (pool, coin) => {
  var minersResponse = await getMiners(pool);
  if (minersResponse == null) {
    console.log(`minersResponse was ${minersResponse}`);
    return;
  }
  var coinSettings = null;
  for (var i = 0; i < listedCoins.length; i++) {
    if (listedCoins[i].coin.toLowerCase() == coin) {
      coinSettings = listedCoins[i];
    }
  }
  minersResponse.sort((a, b) => b.hashrate - a.hashrate);
  $("#miners-table").empty();
  for (var i = 0; i < minersResponse?.length; i++) {
    const minerCard = `
      <div class="miner-card">
        <div class="miner-address">
          <a href="javascript:void(0);" onclick="navigate('/miner?pool=${pool}&miner=${
      minersResponse[i].miner
    }&coin=${coin}')">
            ${minersResponse[i].miner.slice(0, 32)}...${minersResponse[i].miner.slice(-8)}
          </a>
        </div>
        <div class="miner-hashrate">${formatHashrate(minersResponse[i].hashrate)}</div>
        <div class="miner-sharerate">${minersResponse[i].sharesPerSecond.toFixed(3)} s/s</div>
      </div>
    `;
    $("#miners-table").append(minerCard);
  }
};

const showBlocks = async (pool, coin) => {
  var blocksResponse = await getBlocks(pool, 0, 25, "confirmed");
  if (blocksResponse == null) {
    console.log(`blocksResponse was ${blocksResponse}`);
    return;
  }
  blocksResponse = blocksResponse.result;
  var coinSettings = null;
  for (var i = 0; i < listedCoins.length; i++) {
    if (listedCoins[i].coin.toLowerCase() == coin) {
      coinSettings = listedCoins[i];
    }
  }
  $("#blocks-table").empty();
  for (var i = 0; i < blocksResponse?.length; i++) {
    const formattedCreated = new Date(blocksResponse[i].created).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const minerCard = ` 
      <div class="block-card">
        <div class="block-source">
          ${showFlag(blocksResponse[i].source)}
        </div>
        <div class="block-height">
          ${blocksResponse[i].blockHeight}
        </div>
        <div class="block-hash">
          <a href="${blocksResponse[i].infoLink}">
            ${blocksResponse[i].hash.slice(0, 32)}...${blocksResponse[i].hash.slice(-4)}
          </a>
        </div>
        <div class="block-miner">
          <a href="${coinSettings?.wallet}${blocksResponse[i].miner}">
            ${blocksResponse[i].miner.slice(0, 32)}...${blocksResponse[i].miner.slice(-8)}
          </a>
        </div>
        <div class="block-status">${blocksResponse[i].status}</div>
        <div class="block-reward">${blocksResponse[i].reward.toFixed(0)} ${coin.toUpperCase()}</div>
        <div class="block-time">
          ${formattedCreated}
        </div>
      </div>
    `;
    $("#blocks-table").append(minerCard);
  }
};

const showPayments = async (pool) => {
  var paymentsResponse = await getPayments(pool);
  if (paymentsResponse == null) {
    console.log(`paymentsResponse was ${paymentsResponse}`);
    return;
  }
  $("#payments-table").empty();
  for (var i = 0; i < paymentsResponse?.length; i++) {
    const formattedCreated = new Date(paymentsResponse[i].created).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const minerCard = ` 
      <div class="payments-card"> 
        <div class="payments-transaction">
          <a href="${paymentsResponse[i].transactionInfoLink}">
            ${paymentsResponse[i].transactionConfirmationData.slice(0, 32)}
            ...${paymentsResponse[i].transactionConfirmationData.slice(-4)}
          </a>
        </div>
        <div class="payments-address">
          <a href="${paymentsResponse[i].addressInfoLink}">
          ${paymentsResponse[i].address.slice(0, 32)}...${paymentsResponse[i].address.slice(-8)}
          </a>
        </div>
        <div class="payments-amount">
          ${paymentsResponse[i].amount.toFixed(6)}
        </div>
        <div class="payments-time">
          ${formattedCreated}
        </div>
      </div>
    `;
    $("#payments-table").append(minerCard);
  }
};
const showConnect = async (pool, coin) => {
  var poolResponse = await getPool(pool);
  if (poolResponse == null) {
    console.log(`poolResponse was ${poolResponse}`);
    return;
  }
  var servers = null;
  var coinSettings = null;
  for (var i = 0; i < listedCoins.length; i++) {
    if (listedCoins[i].coin.toLowerCase() == coin) {
      coinSettings = listedCoins[i];
      servers = listedCoins[i].stratum;
    }
  }
  $("#connect-servers-table").empty();
  for (var i = 0; i < servers.length; i++) {
    const serverCard = `
      <div class="card">
        <div class="label">
            ${showFlag(servers[i].location)} ${servers[i].location}
        </div>
        <div>
            ${servers[i].domain}
        </div>
      </div>
    `;
    $("#connect-servers-table").append(serverCard);
  }
  $("#connect-ports-table").empty();

  $("#pool-address").html(
    `<a href="${coinSettings?.wallet}${poolResponse.pool.address}">${poolResponse.pool.address}</a>`
  );
  console.log(poolResponse);
  for (const port in poolResponse.pool.ports) {
    if (poolResponse.pool.ports.hasOwnProperty(port)) {
      const portData = poolResponse.pool.ports[port];
      const serverCard = `
        <div class="subcard">
          ${
            portData.name !== undefined
              ? `<div class="label">
                    Name:
                  </div>
                  <div>
                      ${portData.name}
                  </div>`
              : ``
          }
          <div class="label">
              Port:
          </div>
          <div>
              ${port}
          </div>
          <div class="label">
              Difficulty:
          </div>
          <div>
              ${
                portData.varDiff === undefined
                  ? portData.difficulty
                  : `Variable / ${portData.varDiff.minDiff} <-> ${
                      portData.varDiff.maxDiff === undefined ? "~" : portData.varDiff.maxDiff
                    }`
              }
          </div>
          <div class="label">
              SSL/TLS:
          </div>
          <div>
              ${portData.tls}
          </div>
        </div>
      `;
      $("#connect-ports-table").append(serverCard);
    }
  }
};
