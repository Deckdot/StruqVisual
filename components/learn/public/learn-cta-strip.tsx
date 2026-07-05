import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

interface LearnCtaStripProps {
  headline?: string;
  body?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export function LearnCtaStrip({
  headline = 'Stop met herhalen. Begin met schalen.',
  body = 'Struq is je operationeel geheugen voor AI-native builders. Bewaar prompts, skills en context als herbruikbare bouwblokken.',
  buttonText = 'Probeer Struq gratis',
  buttonHref = '/auth',
  className,
}: LearnCtaStripProps) {
  return (
    <section className={`bg-panel border border-border rounded-2xl p-8 text-center space-y-4 ${className ?? ''}`}>
      <div className="inline-flex items-center gap-2 text-accent">
        <BookOpen className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Struq Learn</span>
      </div>
      <h2 className="text-2xl font-semibold text-primary-text">{headline}</h2>
      <p className="text-secondary-text max-w-xl mx-auto">{body}</p>
      <Link
        href={buttonHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
