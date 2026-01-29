import { IntegrationProvider, ProviderType } from '../providers/base';

export class ProviderRegistry {
    private static instance: ProviderRegistry;
    private providers: Map<string, IntegrationProvider> = new Map();

    private constructor() { }

    public static getInstance(): ProviderRegistry {
        if (!ProviderRegistry.instance) {
            ProviderRegistry.instance = new ProviderRegistry();
        }
        return ProviderRegistry.instance;
    }

    register(provider: IntegrationProvider): void {
        if (this.providers.has(provider.id)) {
            console.warn(`⚠️ Provider with id ${provider.id} is already registered. Overwriting.`);
        }
        this.providers.set(provider.id, provider);
        console.log(`✅ Registered provider: ${provider.name} (${provider.id})`);
    }

    getProvider(id: string): IntegrationProvider | undefined {
        return this.providers.get(id);
    }

    getProvidersByType(type: ProviderType): IntegrationProvider[] {
        return Array.from(this.providers.values()).filter(p => p.type === type);
    }

    listProviders(): string[] {
        return Array.from(this.providers.keys());
    }
}

export const registry = ProviderRegistry.getInstance();
