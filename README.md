# Wind Rose Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/ivmreg/ha-windrose.svg)](https://github.com/ivmreg/ha-windrose/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Lovelace card for Home Assistant that displays wind direction and speed as a beautiful wind rose diagram.

## Features

- 🧭 Visual wind direction indicator with compass rose
- 💨 Dynamic arrow length based on wind speed
- 🎨 Customizable appearance using Home Assistant themes
- ⚡ Real-time updates
- 📱 Responsive design

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
| `entity` | string | **Yes** | - | Wind direction sensor entity (in degrees or compass direction) |
| `speed_entity` | string | No | - | Wind speed sensor entity |
| `title` | string | No | `Wind Rose` | Card title |
| `max_speed` | number | No | `50` | Maximum wind speed for scaling the arrow |
| `hours_to_show` | number | No | `24` | Hours of history to display (future feature) |

### Example Configuration

```yaml
type: custom:ha-windrose
entity: sensor.wind_direction
speed_entity: sensor.wind_speed
title: Wind Rose
max_speed: 100
hours_to_show: 24
```

### Minimal Configuration

```yaml
type: custom:ha-windrose
entity: sensor.wind_direction
```

## Entity Requirements

### Wind Direction Entity

The wind direction entity can provide values in:
- **Degrees** (0-360): Numeric value representing wind direction in degrees
- **Compass directions**: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW

### Wind Speed Entity (Optional)

The wind speed entity should provide a numeric value. The unit of measurement will be displayed automatically.

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
