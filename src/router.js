const routerData = {};

const addRoute = (path, elements, onOpen, onClose) => {
  if (routerData[path]) {
    console.log(`Route ${path} already exists.`);
    return;
  }
  routerData[path] = { elements, onOpen, onClose };
  console.log(`Route ${path} has been added.`);
};

const unwantedStrings = ["MiningPoolFrontend/", "downloads/"];

const closeAllRoutes = () => {
  for (let route in routerData) {
    const elements = routerData[route].elements;
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        $("#" + elements[i]).hide();
      }
    }
    if (routerData[route].onClose !== undefined) {
      routerData[route].onClose();
    }
  }
};

const openRoute = (path) => {
  // Remove unwanted strings from the path
  unwantedStrings.forEach((str) => {
    path = path.replace(str, "");
  });

  // Split the path and query string
  var [routePath, queryString] = path.split("?");
  var route = routerData[routePath];

  if (!route) {
    route = routerData["/"];
    queryString = null;
  }

  const params = {};
  if (queryString) {
    // Parse the query string and create the params object
    queryString.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });
  }

  // Show elements related to the current route
  if (route.elements.length > 0) {
    route.elements.forEach((elementId) => {
      $("#" + elementId).show();
    });
  }

  // Call the onOpen callback for the current route with the params
  route.onOpen(params);
  window.scrollTo(0, 0);

  // Log the path for debugging
  console.log(path);
  console.log(window.location.hostname);

  // Only modify the history state if not running from a file:// URL or a local server
  if (window.location.protocol !== "file:" && window.location.hostname !== "network.hoosat.fi") {
    history.pushState({ path, params }, "", path); // Store both path and params
  } else {
    console.log("Running from a file:// URL, skipping history.pushState.");
  }
};

const navigate = (route) => {
  closeAllRoutes();
  openRoute(route);
};

const initRouter = async () => {
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.path) {
      const path = event.state.path;
      openRoute(path);
    }
  });
  closeAllRoutes();
  openRoute(window.location.pathname + window.location.search);
};
