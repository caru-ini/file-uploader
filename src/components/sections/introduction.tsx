import { Lock } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { TbCurrencyDollarOff } from 'react-icons/tb';

export const IntroductionSection: React.FC = ({}) => {
  const features = [
    {
      icon: TbCurrencyDollarOff,
      title: 'Free',
      description:
        'Upload files up to 10MB in size at no cost. Our service is completely free to use.',
    },
    {
      icon: Lock,
      title: 'Secure',
      description:
        'We prioritize your privacy. All uploaded files are processed securely and not stored on our servers.',
    },
    {
      icon: SiGithub,
      title: 'Open-source',
      description:
        'Transparency is key. Our project is open-source, allowing you to review and contribute to the code on GitHub.',
    },
  ];
  return (
    <section className='py-12 md:py-24 lg:py-32'>
      <div className='container mx-auto px-4'>
        <h2 className='mb-8 text-3xl font-bold'>Introduction</h2>
        <div className='grid gap-8 md:grid-cols-3'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='flex flex-col items-center space-y-4 rounded-lg border border-border p-4 transition-transform hover:scale-105 hover:shadow-md'
            >
              <feature.icon size={48} className='text-primary' />
              <h3 className='text-lg font-semibold'>{feature.title}</h3>
              <p className='text-muted-foreground'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
