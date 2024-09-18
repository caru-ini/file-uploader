import { HeroSection } from '@/components/sections/hero';
import { IntroductionSection } from '@/components/sections/introduction';

export default function Home() {
  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <HeroSection />
      <IntroductionSection />
    </main>
  );
}
