/**
 * Type definitions for Home Assistant and Lovelace cards
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  callService: (
    domain: string,
    service: string,
    serviceData?: { [key: string]: unknown },
    target?: { entity_id?: string | string[] }
  ) => Promise<void>;
  language: string;
  themes: {
    default_theme: string;
    themes: { [key: string]: { [key: string]: string } };
  };
  user?: {
    id: string;
    is_admin: boolean;
    name: string;
  };
  config: {
    unit_system: {
      length: string;
      mass: string;
      pressure: string;
      temperature: string;
      volume: string;
    };
  };
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface WindRoseConfig extends LovelaceCardConfig {
  title?: string;
  speed_entity: string;
  gust_entity?: string;
  direction_entity: string;
  hours_to_show?: number;
}

export interface WindData {
  speed: number;
  direction: number;
  gust?: number;
  timestamp: number;
}

