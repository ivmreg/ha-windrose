# Wind Rose Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/ivmreg/ha-windrose.svg)](https://github.com/ivmreg/ha-windrose/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Lovelace card for Home Assistant that displays wind direction and speed as a beautiful wind rose diagram.

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the "+" button
4. Search for "Wind Rose Card"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download `ha-windrose.js` from the [latest release](https://github.com/ivmreg/ha-windrose/releases)
2. Copy it to your `config/www` folder
3. Add the following to your Lovelace resources:
   ```yaml
   resources:
     - url: /local/ha-windrose.js
       type: module
   ```

## Configuration

### Options

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | string | **Yes** | - | Must be `custom:ha-windrose` |
| `speed_entity` | string | **Yes** | - | Wind speed sensor entity (e.g., `sensor.wind_speed`) |
| `direction_entity` | string | **Yes** | - | Wind direction sensor entity (degrees, e.g., `sensor.wind_direction`) |
| `gust_entity` | string | No | - | Wind gust sensor entity (e.g., `sensor.wind_gust`) |
| `title` | string | No | `Wind Conditions` | Card title |
| `hours_to_show` | number | No | `4` | Hours of history to display (currently unused) |

### Example Configuration

```yaml
type: custom:ha-windrose
title: My Weather Station
speed_entity: sensor.wind_speed
direction_entity: sensor.wind_direction
gust_entity: sensor.wind_gust
```

## Features

- 🧭 **Wind Rose Chart**: Visualizes wind speed and direction using Chart.js.
- 🌬️ **Beaufort Scale**: Automatically calculates and displays the Beaufort scale force and description based on wind speed.
- 📊 **Statistics**: Displays current speed, direction, and gust values.
- 🎨 **Visual Indicators**: Includes a color-coded Beaufort scale bar.

## Entity Requirements

### Wind Direction Entity
The wind direction entity should provide a numeric value in degrees (0-360).

### Wind Speed Entity
The wind speed entity should provide a numeric value. The card currently assumes `mph` for Beaufort calculations but displays the unit from the sensor.

### Wind Gust Entity (Optional)
The wind gust entity should provide a numeric value.

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/ivmreg/ha-windrose.git
cd ha-windrose

# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run watch
```

### Build Output

The built file will be located at `dist/ha-windrose.js`.

### Testing Locally

1. Build the project: `npm run build`
2. Copy `dist/ha-windrose.js` to your Home Assistant `config/www/` folder
3. Add as a resource in Lovelace
4. Clear browser cache and refresh

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Home Assistant](https://www.home-assistant.io/) - The amazing home automation platform
- [HACS](https://hacs.xyz/) - Home Assistant Community Store
- [LitElement](https://lit.dev/) - For the web component framework
