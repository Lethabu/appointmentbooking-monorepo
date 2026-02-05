import { Metadata } from 'next';

import EcommerceStore from '@/components/ecommerce/ProductStore';

export const metadata: Metadata = {
    title: 'Shop | InStyle Hair Boutique',
    description: 'Shop premium hair care products, extensions, and styling tools from InStyle Hair Boutique.',
};

export default function ShopPage() {
    return <EcommerceStore />;
}

export const runtime = 'edge';
