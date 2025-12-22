# Hoosat Miningcore Frontend

A source-available frontend for the Hoosat Miningcore implementation, designed as a Single Page Application (SPA) for mining pool management.

## Features

- Real-time mining pool statistics
- Coin listings with wallet and transaction links
- Stratum server information
- Responsive web interface

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hoosat-Oy/MiningPoolFrontend.git
   cd MiningPoolFrontend
   ```

2. Customize the configuration:
   - Edit `src/listed-coins.js` to add your coins.
   - Replace placeholder strings in the code (see below).

3. Serve the files using a web server (e.g., NGINX, Apache).

## NGINX Configuration

Here is an example NGINX configuration for serving the SPA. Since it's a Single Page Application, all routes should be redirected to `index.html`.

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP address

    root /path/to/your/spa/build;  # Replace with the path to your built Miningcore Frontend
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # If the requested file doesn't exist, serve index.html
    }
}
```

## Adding Coin Data

The `src/listed-coins.js` file contains the data for coins listed in the pool. Each coin entry includes wallet addresses, transaction links, and stratum information.

Example entry:

```javascript
{
  coin: "BTC",
  prefix: ["1", "3", "bc1"],
  wallet: "https://www.blockchain.com/btc/address/",
  transaction: "https://www.blockchain.com/btc/tx/",
  blocks: "https://www.blockchain.com/btc/block/",
  stratum: [{ location: "Global", domain: "stratum+tcp://btc.pool.com" }],
}
```

To add a new coin, include it in `listed-coins.js` with the appropriate details. Only coins available via the API will be displayed.

## Adding Coin Icons

Add `.png` icons to `img/icon/` and convert them using `convert.bash` to `img/webp/`, or add `.webp` files directly to `img/webp/`.

## Configuration

Replace the following placeholder strings in the source code:

- `DOMAIN_ADDRESS_HERE`
- `EMAIL_ADDRESS_HERE`
- `DISCORD_LINK_HERE`
- `TELEGRAM_LINK_HERE`
- `COMPANY_NAME_HERE`

If you have permission from Hoosat Oy, you can replace the copyright notice.

## Usage

Open the `index.html` file in a web browser or serve it via a web server. The frontend will connect to your Miningcore API to display pool statistics.

## Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.

## Bug Reports

Bug reports can be emailed to toni.lukkaroinen@hoosat.fi or submitted through [GitHub Issues](https://github.com/Hoosat-Oy/MiningPoolFrontend/issues).

## License

See the [LICENSE](LICENSE) file for details.
