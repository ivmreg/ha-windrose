import { LitElement, html, css, CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, WindRoseCardConfig } from './types';

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

// Direction labels for the wind rose
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const DIRECTION_DEGREES: Record<string, number> = {
  'N': 0,
  'NNE': 22.5,
  'NE': 45,
  'ENE': 67.5,
  'E': 90,
  'ESE': 112.5,
  'SE': 135,
  'SSE': 157.5,
  'S': 180,
  'SSW': 202.5,
  'SW': 225,
  'WSW': 247.5,
  'W': 270,
  'WNW': 292.5,
  'NW': 315,
  'NNW': 337.5,
};

@customElement('ha-windrose')
export class HaWindrose extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: WindRoseCardConfig;

  static getConfigElement(): HTMLElement | null {
    return null; // No config editor for now
  }

  static getStubConfig(): Partial<WindRoseCardConfig> {
    return {
      entity: '',
      title: 'Wind Rose',
      max_speed: 50,
      hours_to_show: 24,
    };
  }

  public setConfig(config: WindRoseCardConfig): void {
    if (!config.entity) {
      throw new Error('Please define a wind direction entity');
    }
    this._config = {
      title: 'Wind Rose',
      max_speed: 50,
      hours_to_show: 24,
      ...config,
    };
  }

  public getCardSize(): number {
    return 4;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    if (!this.hass || !changedProps.has('hass')) {
      return false;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass) {
      return true;
    }

    const entityId = this._config.entity;
    const speedEntityId = this._config.speed_entity;

    if (oldHass.states[entityId] !== this.hass.states[entityId]) {
      return true;
    }

    if (speedEntityId && oldHass.states[speedEntityId] !== this.hass.states[speedEntityId]) {
      return true;
    }

    return false;
  }

  private _getWindDirection(): number {
    const entity = this.hass.states[this._config.entity];
    if (!entity) {
      return 0;
    }

    const state = entity.state;
    
    // Check if state is a number (degrees)
    const degrees = parseFloat(state);
    if (!isNaN(degrees)) {
      return degrees;
    }

    // Check if state is a direction string
    if (state in DIRECTION_DEGREES) {
      return DIRECTION_DEGREES[state];
    }

    return 0;
  }

  private _getWindSpeed(): number {
    if (!this._config.speed_entity) {
      return 0;
    }

    const entity = this.hass.states[this._config.speed_entity];
    if (!entity) {
      return 0;
    }

    const speed = parseFloat(entity.state);
    return isNaN(speed) ? 0 : speed;
  }

  private _renderCompassRose(): TemplateResult {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    const innerRadius = 20;

    return html`
      <svg viewBox="0 0 200 200" class="wind-rose">
        <!-- Background circles -->
        <circle cx="${centerX}" cy="${centerY}" r="${radius}" class="outer-circle" />
        <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.66}" class="middle-circle" />
        <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.33}" class="inner-circle" />
        <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" class="center-circle" />
        
        <!-- Direction lines -->
        ${DIRECTIONS.map((_, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const x1 = centerX + innerRadius * Math.cos(angle);
          const y1 = centerY + innerRadius * Math.sin(angle);
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);
          return html`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="direction-line" />`;
        })}
        
        <!-- Direction labels -->
        ${DIRECTIONS.map((dir, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const labelRadius = radius + 12;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          return html`<text x="${x}" y="${y}" class="direction-label">${dir}</text>`;
        })}
        
        <!-- Wind direction arrow -->
        ${this._renderWindArrow(centerX, centerY, radius)}
      </svg>
    `;
  }

  private _renderWindArrow(centerX: number, centerY: number, radius: number): TemplateResult {
    const direction = this._getWindDirection();
    const speed = this._getWindSpeed();
    const maxSpeed = this._config.max_speed || 50;
    
    // Calculate arrow length based on speed (minimum 30% of radius)
    const arrowLength = Math.min(radius * 0.9, radius * (0.3 + (speed / maxSpeed) * 0.6));
    
    // Arrow points from center in the direction the wind is coming FROM
    // (wind direction is typically reported as the direction wind is coming from)
    const angleRad = (direction - 90) * (Math.PI / 180);
    
    const tipX = centerX + arrowLength * Math.cos(angleRad);
    const tipY = centerY + arrowLength * Math.sin(angleRad);
    
    // Arrow head
    const headLength = 12;
    const headAngle = 25 * (Math.PI / 180);
    const head1X = tipX - headLength * Math.cos(angleRad - headAngle);
    const head1Y = tipY - headLength * Math.sin(angleRad - headAngle);
    const head2X = tipX - headLength * Math.cos(angleRad + headAngle);
    const head2Y = tipY - headLength * Math.sin(angleRad + headAngle);

    return html`
      <g class="wind-arrow">
        <line 
          x1="${centerX}" 
          y1="${centerY}" 
          x2="${tipX}" 
          y2="${tipY}" 
          class="arrow-line"
        />
        <polygon 
          points="${tipX},${tipY} ${head1X},${head1Y} ${head2X},${head2Y}"
          class="arrow-head"
        />
      </g>
    `;
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const directionEntity = this.hass.states[this._config.entity];
    const speedEntity = this._config.speed_entity 
      ? this.hass.states[this._config.speed_entity] 
      : null;

    if (!directionEntity) {
      return html`
        <ha-card>
          <div class="card-content">
            <div class="error">Entity not found: ${this._config.entity}</div>
          </div>
        </ha-card>
      `;
    }

    const direction = this._getWindDirection();
    const speed = this._getWindSpeed();
    const speedUnit = speedEntity?.attributes.unit_of_measurement || '';

    return html`
      <ha-card>
        ${this._config.title ? html`<h1 class="card-header">${this._config.title}</h1>` : ''}
        <div class="card-content">
          ${this._renderCompassRose()}
          <div class="wind-info">
            <div class="wind-direction">
              <span class="label">Direction:</span>
              <span class="value">${direction.toFixed(0)}°</span>
            </div>
            ${speedEntity ? html`
              <div class="wind-speed">
                <span class="label">Speed:</span>
                <span class="value">${speed.toFixed(1)} ${speedUnit}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card-header {
        padding: 16px 16px 0 16px;
        font-size: 1.5em;
        font-weight: 500;
        margin: 0;
      }

      .card-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }

      .wind-rose {
        width: 100%;
        max-width: 250px;
        height: auto;
      }

      .outer-circle,
      .middle-circle,
      .inner-circle {
        fill: none;
        stroke: var(--primary-text-color, #333);
        stroke-width: 0.5;
        opacity: 0.3;
      }

      .center-circle {
        fill: var(--primary-color, #03a9f4);
        opacity: 0.3;
      }

      .direction-line {
        stroke: var(--primary-text-color, #333);
        stroke-width: 0.5;
        opacity: 0.3;
      }

      .direction-label {
        font-size: 10px;
        fill: var(--primary-text-color, #333);
        text-anchor: middle;
        dominant-baseline: middle;
        font-weight: 500;
      }

      .arrow-line {
        stroke: var(--primary-color, #03a9f4);
        stroke-width: 3;
        stroke-linecap: round;
      }

      .arrow-head {
        fill: var(--primary-color, #03a9f4);
      }

      .wind-info {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .wind-direction,
      .wind-speed {
        display: flex;
        gap: 8px;
        font-size: 1.1em;
      }

      .label {
        color: var(--secondary-text-color, #666);
      }

      .value {
        font-weight: 500;
        color: var(--primary-text-color, #333);
      }

      .error {
        color: var(--error-color, #db4437);
        padding: 16px;
        text-align: center;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ha-windrose': HaWindrose;
  }
}
