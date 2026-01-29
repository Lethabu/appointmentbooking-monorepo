export type ProviderType = 'video' | 'payment' | 'messaging' | 'storage';

export interface IntegrationProvider {
    id: string;
    name: string;
    type: ProviderType;
    description?: string;

    initialize(config: any): Promise<void>;
    execute(action: string, params: any): Promise<any>;
}

export abstract class BaseProvider implements IntegrationProvider {
    abstract id: string;
    abstract name: string;
    abstract type: ProviderType;

    protected config: any = {};

    async initialize(config: any): Promise<void> {
        this.config = config;
        console.log(`📡 [${this.name}] Initialized with config keys: ${Object.keys(config).join(', ')}`);
    }

    abstract execute(action: string, params: any): Promise<any>;
}
