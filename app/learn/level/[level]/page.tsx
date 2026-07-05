import { redirect } from 'next/navigation';

/**
 * The old 3-level structure is gone: the Atelier index presents the three
 * lesson archetypes directly. Old level URLs land on the index.
 */
export default function LearnLevelRedirect() {
  redirect('/learn');
}
