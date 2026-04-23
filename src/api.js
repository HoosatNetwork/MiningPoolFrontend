const api_domain = "http://zenithpool.net";

const localStorageSetItem = (key, value) => {
  const timestamp = new Date().toISOString();
  const item = {
    value: value,
    timestamp: timestamp,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const localStorageGetItem = (key, allowedAgeInSeconds) => {
  const item = localStorage.getItem(key);
  if (item) {
    const parsedItem = JSON.parse(item);
    const timestamp = new Date(parsedItem.timestamp);
    const currentTime = new Date().getTime();
    const allowedTimeLimit = currentTime - allowedAgeInSeconds * 1000;
    if (timestamp.getTime() < allowedTimeLimit) {
      localStorage.removeItem(key);
      return null;
    }
    return parsedItem.value;
  }
  return null;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getCryptoPrices = async (coins = ["bitcoin", "ethereum", "litecoin"], currency = "usd") => {
  let prices = localStorageGetItem(`geckoprice?ids=${coins.join(",")}&vs_currencies=${currency}`, 360);
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(",")}&vs_currencies=${currency}`,
      {
        // mode: "no-cors",
      },
    );
    if (response.ok) {
      prices = await response.json();
      localStorageSetItem(`geckoprice?ids=${coins.join(",")}&vs_currencies=${currency}`, prices);
    }
  } catch (error) {
    console.error("Error fetching cryptocurrency price:", error);
  }
  return prices;
};

const getPools = async () => {
  let pools = localStorageGetItem("/api/pools", 60);
  if (pools === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools`, {
        // mode: "no-cors",
      });
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      pools = await response.json();
      localStorageSetItem("/api/pools", pools);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pools:", error);
      return null;
    }
  }
  return pools;
};

const getPool = async (poolid) => {
  let pool = localStorageGetItem(`/api/pools/${poolid}`, 60);
  if (pool === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}`, {
        // mode: "no-cors",
      });
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      pool = await response.json();
      localStorageSetItem(`/api/pools/${poolid}`, pool);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return pool;
};

const getPoolPerformance = async (poolid) => {
  let performance = localStorageGetItem(`/api/pools/${poolid}/performance`, 1);
  if (performance === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/performance`, {
        // mode: "no-cors",
      });
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      performance = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/performance`, performance);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return performance;
};

const getMiners = async (poolid) => {
  let miners = localStorageGetItem(`/api/pools/${poolid}/miners`, 1);
  if (miners === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners`, {
        // mode: "no-cors",
      });
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      miners = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/miners`, miners);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return miners;
};

const getBlocksV1 = async (poolid) => {
  let blocks = localStorageGetItem(`/api/pools/${poolid}/blocks`, 1);
  if (blocks === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/blocks`, {
        // mode: "no-cors",
      });
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      blocks = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/blocks`, blocks);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return blocks;
};

const getBlocks = async (poolid, page = 0, pageSize = 15, state = "NULL") => {
  let blocks = localStorageGetItem(
    `/api/v2/pools/${poolid}/blocks?page=${page}&pageSize=${pageSize}&state=${state}`,
    1,
  );
  if (blocks === null) {
    try {
      const response = await fetch(
        `${api_domain}/api/v2/pools/${poolid}/blocks?page=${page}&pageSize=${pageSize}&state=${state}`,
      );
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      blocks = await response.json();
      localStorageSetItem(`/api/v2/pools/${poolid}/blocks?page=${page}&pageSize=${pageSize}&state=${state}`, blocks);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return blocks;
};

const getPayments = async (poolid) => {
  let payments = localStorageGetItem(`/api/pools/${poolid}/payments`, 1);
  if (payments === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/payments`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      payments = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/payments`, payments);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return payments;
};

const getMiner = async (poolid, wallet) => {
  let miner = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}`, 1);
  if (miner === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      miner = await response.json();
      localStorageSetItem(`/api/pools/${poolid}`, miner);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return miner;
};

const getMinerBlocksV1 = async (poolid, wallet) => {
  let blocks = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}/blocks`, 1);
  if (blocks === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/blocks`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      blocks = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/blocks`, blocks);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return blocks;
};

const getMinerBlocks = async (poolid, wallet, page = 0, pageSize = 15, state = "NULL") => {
  let blocks = localStorageGetItem(
    `/api/v2/pools/${poolid}/miners/${wallet}/blocks?page=${page}&pageSize=${pageSize}&state=${state}`,
    1,
  );
  if (blocks === null) {
    try {
      const response = await fetch(
        `${api_domain}/api/v2/pools/${poolid}/miners/${wallet}/blocks?page=${page}&pageSize=${pageSize}&state=${state}`,
      );
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      blocks = await response.json();
      localStorageSetItem(`/api/v2/pools/${poolid}/blocks?page=${page}&pageSize=${pageSize}&state=${state}`, blocks);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return blocks;
};

const getMinerPayments = async (poolid, wallet) => {
  let payments = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}/payments`, 1);
  if (payments === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/payments`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      payments = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/payments`, payments);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return payments;
};

const getMinerPerformance = async (poolid, wallet) => {
  let performance = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}/performance`, 1);
  if (performance === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/performance`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      performance = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/performance`, performance);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return performance;
};

const getMinerDailyEarnings = async (poolid, wallet) => {
  let dailyEarnings = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}/earnings/daily`, 1);
  if (dailyEarnings === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/earnings/daily`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      dailyEarnings = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/earnings/daily`, dailyEarnings);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return dailyEarnings;
};

const getMinerBalanceChanges = async (poolid, wallet) => {
  let balanceChanges = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}/balancechanges`, 1);
  if (balanceChanges === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/balancechanges`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      balanceChanges = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/balancechanges`, balanceChanges);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return balanceChanges;
};

const getMinerSettings = async (poolid, wallet) => {
  let settings = localStorageGetItem(`/api/pools/${poolid}/miners/${wallet}/settings`, 1);
  if (settings === null) {
    try {
      const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/settings`);
      if (!response.ok) {
        // Handle non-OK responses (e.g., 404, 500) by returning null
        return null;
      }
      settings = await response.json();
      localStorageSetItem(`/api/pools/${poolid}/settings`, settings);
    } catch (error) {
      // Catch any errors (network issues, invalid JSON, etc.)
      console.error("Error fetching pool:", error);
      return null;
    }
  }
  return settings;
};

const setMinerPaymentThreshold = async (poolid, wallet, threshold, ip) => {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(`${api_domain}/api/pools/${poolid}/miners/${wallet}/settings`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        Settings: {
          PaymentThreshold: Number(threshold),
        },
        IpAddress: ip,
      }),
      redirect: "follow",
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error setting payment threshold:", error);
    return false;
  }
};
