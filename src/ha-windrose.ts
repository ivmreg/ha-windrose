import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { Chart, registerables } from 'chart.js';
import { WindRoseConfig, WindData } from './types';
import { calculateBeaufort, mpsToKmh, mphToMps, mphToKmh } from './utils/wind-helpers';

Chart.register(...registerables);

// Register card with Home Assistant card picker
declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'ha-windrose',
  name: 'Wind Rose Card',
  description: 'A card that displays wind direction and speed as a wind rose diagram',
  preview: true,
});

@customElement('ha-windrose')
export class HaWindrose extends LitElement {
    @property({ type: Object }) hass: any;
    @property({ type: Object }) config!: WindRoseConfig;

    @state() private chart: Chart | null = null;
    @query('#windrose') private _canvas!: HTMLCanvasElement;

    static getStubConfig() {
        return {
            type: 'custom:ha-windrose',
            title: 'Wind Conditions',
            speed_entity: 'sensor.wind_speed',
            gust_entity: 'sensor.wind_gust',
            direction_entity: 'sensor.wind_direction',
            hours_to_show: 4
        };
    }

    setConfig(config: WindRoseConfig) {
        if (!config.speed_entity || !config.direction_entity) {
            throw new Error('Please define speed_entity and direction_entity');
        }
        this.config = {
            hours_to_show: 4,
            ...config
        };
    }

    static styles = css`
        ha-card {
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .card-header {
            width: 100%;
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .content {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }
        .canvas-container {
            position: relative;
            width: 100%;
            max-width: 300px;
            aspect-ratio: 1;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            width: 100%;
            text-align: center;
        }
        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .stat-label {
            font-size: 0.8em;
            color: var(--secondary-text-color);
        }
        .stat-value {
            font-size: 1.1em;
            font-weight: bold;
        }
        .beaufort-scale {
            width: 100%;
            height: 8px;
            background: linear-gradient(to right,
                #ffffff 0%, #ccffff 8%, #99ff99 16%, #99ff99 24%,
                #99ff99 32%, #ccff66 40%, #ffff00 48%, #ffcc00 56%,
                #ff9900 64%, #ff6600 72%, #ff3300 80%, #ff0000 100%);
            border-radius: 4px;
            margin-top: 8px;
            position: relative;
        }
        .beaufort-marker {
            position: absolute;
            top: -4px;
            width: 2px;
            height: 16px;
            background-color: var(--primary-text-color);
            transform: translateX(-50%);
        }
    `;

    render() {
        if (!this.hass || !this.config) return html``;

        const speedState = this.hass.states[this.config.speed_entity];
        const gustState = this.config.gust_entity ? this.hass.states[this.config.gust_entity] : null;
        const dirState = this.hass.states[this.config.direction_entity];

        if (!speedState || !dirState) {
            return html`<ha-card>Entity not found</ha-card>`;
        }

        const speed = parseFloat(speedState.state);
        const gust = gustState ? parseFloat(gustState.state) : 0;
        const direction = parseFloat(dirState.state);

        const beaufort = calculateBeaufort(speed);

        return html`
            <ha-card>
                <div class="card-header">
                    ${this.config.title}
                    <div class="beaufort-badge">Bft ${beaufort.force}</div>
                </div>
                <div class="content">
                    <div class="canvas-container">
                        <canvas id="windrose"></canvas>
                    </div>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Speed</span>
                            <span class="stat-value">${speed} mph</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Direction</span>
                            <span class="stat-value">${direction}°</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Gust</span>
                            <span class="stat-value">${gust} mph</span>
                        </div>
                    </div>
                    <div class="beaufort-scale">
                        <div class="beaufort-marker" style="left: ${(beaufort.force / 12) * 100}%"></div>
                    </div>
                </div>
            </ha-card>
        `;
    }


   updated(changedProps: PropertyValues) {
        if (changedProps.has('hass') && this.chart) {
            this.updateChart();
        } else if (!this.chart) {
            this.initChart();
        }
    }

    private initChart() {
        if (!this._canvas) return;

        const ctx = this._canvas.getContext('2d');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
                datasets: [{
                    label: 'Wind Speed',
                    data: [0, 0, 0, 0, 0, 0, 0, 0], // Placeholder
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        pointLabels: {
                            display: true,
                            centerPointLabels: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        this.updateChart();
    }

   private updateChart() {
        if (!this.chart || !this.hass || !this.config) return;

        const dirState = this.hass.states[this.config.direction_entity];
        const speedState = this.hass.states[this.config.speed_entity];

        if (!dirState || !speedState) return;

        const direction = parseFloat(dirState.state);
        const speed = parseFloat(speedState.state);

        // Map direction to 8 cardinal points
        // 0/360=N, 45=NE, 90=E, etc.
        const sector = Math.round(direction / 45) % 8;

        const data = [0, 0, 0, 0, 0, 0, 0, 0];
        data[sector] = speed;

        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}
