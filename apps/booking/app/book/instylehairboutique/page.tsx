import { Metadata } from 'next';
import InStyleLandingPage from '@/components/landing/InStyleLandingPage';

export const metadata: Metadata = {
  title: 'InStyle Hair Boutique | Premium Hair Services',
  description: 'Book your appointment at InStyle Hair Boutique. Premium hair installations, styling, and products in Cape Town.',
};

export default function BookInStylePage() {
  return <InStyleLandingPage />;
}