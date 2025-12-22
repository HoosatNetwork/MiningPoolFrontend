let minerHashrateChart = null;
let openedPage = null;

const initMiner = async () => {
  addRoute("/miner", ["miner-submenu", "miner-statistics", "miner-chart-container"], async (params) => {
    if (params.coin === undefined) {
      var coinSettings = null;
      for (var i = 0; i < listedCoins.length; i++) {
        for (var x = 0; x < listedCoins[i].prefix?.length; x++) {
          if (params.miner.startsWith(listedCoins[i].prefix[x])) {
            coinSettings = listedCoins[i];
          }
        }
      }
      console.log(coinSettings);
      params.coin = coinSettings.coin.toLowerCase();
    }
    var poolsResponse = await getPools();
    const filteredPools = poolsResponse.pools.filter((pool) => pool.coin?.symbol.toLowerCase() === params.coin);
    var minerPools = `<select name="miner-pools" id="miner-pools" onchange="changePool('${params.miner}', '${params.coin}')">`;
    for (var i = 0; i < filteredPools.length; i++) {
      if (params.pool !== undefined && filteredPools[i].id === params.pool) {
        minerPools += `<option value="${filteredPools[i].id}" selected>${filteredPools[i].paymentProcessing.payoutScheme}</option>`;
      } else {
        minerPools += `<option value="${filteredPools[i].id}">${filteredPools[i].paymentProcessing.payoutScheme}</option>`;
      }
    }
    minerPools += `</select>`;
    console.log(filteredPools);
    $("#miner-statistics-pool").html(minerPools);
    if (params.pool == undefined) {
      params.pool = filteredPools[0].id;
    }
    showMinerStatistics(params.pool, params.miner, params.coin);
    if (openedPage !== null && openedPage === "showMinerWorkers") {
      showMinerWorkers(params.pool, params.miner);
    } else if (openedPage !== null && openedPage === "showMinerBlocks") {
      showMinerBlocks(params.pool, params.miner, params.coin);
    } else if (openedPage !== null && openedPage === "showMinerPayments") {
      showMinerPayments(params.pool, params.miner);
    } else if (openedPage !== null && openedPage === "showMinerSettings") {
      showMinerSettings(params.pool, params.miner);
    } else if (openedPage !== null && openedPage === "showStatistics") {
      showMinerHashrateChart(params.pool, params.miner);
    } else {
      showMinerHashrateChart(params.pool, params.miner);
    }
    $("#open-miner-workers-button").on("click", () => {
      $("#miner-blocks").hide();
      $("#miner-payments").hide();
      $("#miner-settings").hide();
      $("#miner-chart-container").hide();
      openedPage = "showMinerWorkers";
      var selectedPool = $("#miner-pools").val();
      showMinerWorkers(selectedPool, params.miner);
      $("#workers").show();
    });
    $("#open-miner-statistics-button").on("click", () => {
      $("#workers").hide();
      $("#miner-blocks").hide();
      $("#miner-settings").hide();
      $("#miner-payments").hide();
      console.log("Statistics button clicked");
      openedPage = "showStatistics";
      var selectedPool = $("#miner-pools").val();
      showMinerHashrateChart(selectedPool, params.miner);
      $("#miner-chart-container").show();
    });

    $("#open-miner-blocks-button").on("click", () => {
      $("#workers").hide();
      $("#miner-payments").hide();
      $("#miner-settings").hide();
      $("#miner-chart-container").hide();
      openedPage = "showMinerBlocks";
      var selectedPool = $("#miner-pools").val();
      showMinerBlocks(selectedPool, params.miner, params.coin);
      $("#miner-blocks").show();
    });

    $("#open-miner-payments-button").on("click", () => {
      $("#miner-blocks").hide();
      $("#workers").hide();
      $("#miner-settings").hide();
      $("#miner-chart-container").hide();
      openedPage = "showMinerPayments";
      var selectedPool = $("#miner-pools").val();
      showMinerPayments(selectedPool, params.miner);
      $("#miner-payments").show();
    });

    $("#open-miner-settings-button").on("click", () => {
      $("#miner-blocks").hide();
      $("#workers").hide();
      $("#miner-payments").hide();
      $("#miner-chart-container").hide();
      openedPage = "showMinerPayments";
      var selectedPool = $("#miner-pools").val();
      showMinerSettings(selectedPool, params.miner);
      $("#miner-settings").show();
    });
  });
};

const changePool = (miner, coin) => {
  var selectedPool = $("#miner-pools").val();
  showMinerStatistics(selectedPool, miner, coin);
  if (openedPage !== null && openedPage === "showMinerWorkers") {
    showMinerWorkers(selectedPool, miner);
  } else if (openedPage !== null && openedPage === "showMinerBlocks") {
    showMinerBlocks(selectedPool, miner, coin);
  } else if (openedPage !== null && openedPage === "showMinerPayments") {
    showMinerPayments(selectedPool, miner);
  } else if (openedPage !== null && openedPage === "showMinerSettings") {
    showMinerSettings(selectedPool, miner);
  } else if (openedPage !== null && openedPage === "showStatistics") {
    showMinerHashrateChart(selectedPool, miner);
  } else {
    showMinerHashrateChart(selectedPool, miner);
  }
};

const showMinerStatistics = async (pool, miner, coin) => {
  var minerResponse = await getMiner(pool, miner);
  if (minerResponse == null) {
    console.log(`minerResponse was ${minerResponse}`);
    return;
  }
  $("#miner-statistics-header").html(`Your ${coin.toUpperCase()} statistics`);
  $("#miner-statistics-address").html(miner);
  $("#miner-statistics-pending-shares").html(minerResponse.pendingShares.toFixed(0));
  $("#miner-statistics-pending-balance").html(`${minerResponse.pendingBalance.toFixed(6)} ${coin.toUpperCase()}`);
  $("#miner-statistics-pending-blocks").html(minerResponse.totalPendingBlocks.toFixed(0));
  $("#miner-statistics-confirmed-blocks").html(minerResponse.totalConfirmedBlocks.toFixed(0));
  $("#miner-statistics-total-paid").html(`${minerResponse.totalPaid.toFixed(6)} ${coin.toUpperCase()}`);
  $("#miner-statistics-today-paid").html(`${minerResponse.todayPaid.toFixed(6)} ${coin.toUpperCase()}`);
  var formattedLastPaymentDate = new Date(minerResponse.lastPayment).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (formattedLastPaymentDate === "Invalid Date") {
    formattedLastPaymentDate = "No payment";
  }
  $("#miner-statistics-last-payment").html(formattedLastPaymentDate);
  var minerLuck = effortToLuck(minerResponse.minerEffort);
  if (minerLuck === "Invalid effort value") {
    minerLuck = "Unlucky!";
  }
  $("#miner-statistics-miner-luck").html(minerLuck);
};

const showMinerHashrateChart = async (pool, miner) => {
  if (minerHashrateChart) {
    minerHashrateChart.destroy();
  }
  var minerPerformance = await getMinerPerformance(pool, miner);
  if (minerPerformance == null || minerPerformance[0] == undefined) {
    console.log(`minerPerformance was ${minerPerformance}`);
    return;
  }
  var labels = minerPerformance.map((entry) => entry.created);

  var lastDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(minerPerformance[0].created));

  const minerHashrateData = [];
  const workers = minerPerformance[0].workers;

  // Calculate total hashrate
  const totalHashrateData = minerPerformance.map((entry) => {
    return Object.values(entry.workers).reduce((sum, worker) => {
      return sum + (worker.hashrate ? worker.hashrate / 1e6 : 0); // Convert H/s to Mh/s
    }, 0);
  });

  minerHashrateData.push({
    label: "Total Hashrate",
    data: totalHashrateData,
    borderColor: "#8BD1F7",
    backgroundColor: "#8BD1F7",
    fill: false,
    lineTension: 0.2,
    pointRadius: 3,
    borderWidth: 2,
  });

  // Process individual worker hashrates
  Object.keys(workers).forEach((worker) => {
    const hashrateData = minerPerformance.map((entry) => {
      const hashrateInH = entry.workers[worker]?.hashrate;
      return hashrateInH ? hashrateInH / 1e6 : 0; // Convert H/s to Mh/s
    });
    let color = getRandomColor();
    minerHashrateData.push({
      label: worker,
      data: hashrateData,
      borderColor: color,
      backgroundColor: color,
      fill: false,
      lineTension: 0.2,
      pointRadius: 3,
      borderWidth: 2,
    });
  });

  const ctx = document.getElementById("minerHashrateChart").getContext("2d");
  minerHashrateChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: minerHashrateData,
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
            text: [`Last Hashrate date: ${lastDate}`, `Date and Time`],
          },
        },
        y: {
          title: {
            display: true,
            text: "Hashrate (in Mh/s)",
          },
        },
      },
    },
  });
};

const showMinerWorkers = async (pool, miner) => {
  var minerResponse = await getMiner(pool, miner);
  $("#workers-table").empty();
  if (minerResponse == null) {
    console.log(`minerResponse was ${minerResponse}`);
    return;
  }
  if (minerResponse.performance.workers === undefined) {
    return;
  }
  var workers = Object.entries(minerResponse.performance.workers).map(([name, details]) => ({
    name,
    hashrate: details.hashrate,
    sharesPerSecond: details.sharesPerSecond,
  }));
  workers = workers.sort((a, b) => b.hashrate - a.hashrate);
  for (var i = 0; i < workers.length; i++) {
    const workerCard = `
      <div class="worker-card">
        <div class="worker-name">
        ${workers[i].name}
        </div>
        <div class="worker-hashrate">${formatHashrate(workers[i].hashrate)}</div>
        <div class="worker-sharerate">${workers[i].sharesPerSecond.toFixed(3)} s/s</div>
      </div>
    `;
    $("#workers-table").append(workerCard);
  }
};

const showMinerBlocks = async (pool, miner, coin) => {
  var blocksResponse = await getMinerBlocks(pool, miner, 0, 25, "confirmed");
  blocksResponse = blocksResponse.result;
  $("#miner-blocks-table").empty();
  if (blocksResponse == null && blocksResponse == undefined) {
    console.log(`blocksResponse was ${blocksResponse}`);
    return;
  }
  var coinSettings = null;
  for (var i = 0; i < listedCoins.length; i++) {
    if (listedCoins[i].coin.toLowerCase() == coin) {
      coinSettings = listedCoins[i];
    }
  }
  for (var i = 0; i < blocksResponse.length; i++) {
    const formattedCreated = new Date(blocksResponse[i].created).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const minerCard = ` 
      <div class="miner-block-card">
        <div class="block-height">
          ${blocksResponse[i].blockHeight}
        </div>
        <div class="block-hash">
          <a href="${blocksResponse[i].infoLink}">
            ${blocksResponse[i].hash.slice(0, 32)}...${blocksResponse[i].miner.slice(-4)}
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
    $("#miner-blocks-table").append(minerCard);
  }
};

const showMinerPayments = async (pool, miner) => {
  var paymentsResponse = await getMinerPayments(pool, miner);
  $("#miner-payments-table").empty();
  if (paymentsResponse == null && paymentsResponse == undefined) {
    console.log(`paymentsResponse was ${paymentsResponse}`);
    return;
  }
  for (var i = 0; i < paymentsResponse.length; i++) {
    const formattedCreated = new Date(paymentsResponse[i].created).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const paymentsCard = `
      <div class="miner-payments-card">
        <div class="miner-payments-created">${formattedCreated}</div>
        <div class="miner-payments-transaction">
          <a href="${paymentsResponse[i].transactionInfoLink}">
            ${paymentsResponse[i].transactionConfirmationData}
          </a>
        </div>
        <div class="miner-payments-amount">${paymentsResponse[i].amount.toFixed(6)} ${paymentsResponse[i].coin}</div>
      </div>
    `;
    $("#miner-payments-table").append(paymentsCard);
  }
};

// Helper function to generate random colors
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const showMinerSettings = async (pool, miner) => {
  var settingsResponse = await getMinerSettings(pool, miner);
  $("#miner-payments-table").empty();
  $("#miner-setings-wallet-input").val(miner);
  if (settingsResponse !== null && settingsResponse !== undefined) {
    $("#miner-settings-threshold-input").val(settingsResponse.paymentThreshold);
  }
  $("#miner-settings-ip-input").val();
  $("#miner-settings-threshold-submit-button").on("click", () => {
    var wallet = $("#miner-setings-wallet-input").val();
    var threshold = $("#miner-settings-threshold-input").val();
    var ip = $("#miner-settings-ip-input").val();
    var success = setMinerPaymentThreshold(pool, wallet, threshold, ip);
    if (success === true) {
      $("#failure-threshold").hide();
      $("#success-threshold").show();
    } else {
      $("#success-threshold").hide();
      $("#failure-threshold").show();
    }
  });
};
