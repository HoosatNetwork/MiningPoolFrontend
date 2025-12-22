$(document).ready(async () => {
  addRoute("/terms-of-service", ["terms-of-service"], async () => {});
  addRoute("/cookie-policy", ["cookie-policy"], async () => {});
  addRoute("/privacy-policy", ["privacy-policy"], async () => {});
  await initLanding();
  await initPool();
  await initMiner();
  await initRouter();
});
