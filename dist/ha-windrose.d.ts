import { LitElement, PropertyValues } from 'lit';
import { WindRoseConfig } from './types';
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
export declare class HaWindrose extends LitElement {
    hass: any;
    config: WindRoseConfig;
    private chart;
    private _canvas;
    static getStubConfig(): {
        type: string;
        title: string;
        speed_entity: string;
        gust_entity: string;
        direction_entity: string;
        hours_to_show: number;
    };
    setConfig(config: WindRoseConfig): void;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    updated(changedProps: PropertyValues): void;
    private initChart;
    private updateChart;
}
//# sourceMappingURL=ha-windrose.d.ts.map