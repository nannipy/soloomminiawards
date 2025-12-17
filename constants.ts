import { AwardCategory, Member } from './types';

// Valid codes for authentication
export const VALID_CODES = [
  '1111', '1112', '1113', 
  '2222', '2223', '2224', 
  '3333', '3334', '3335', '3336'
];

export const ADMIN_CODE = '5555';

// Members list sorted alphabetically by surname
export const MEMBERS: Member[] = [
  { id: '1', name: 'Francesco Campi' },
  { id: '2', name: 'Simone Campo' },
  { id: '3', name: 'Lorenzo Cavallo' },
  { id: '4', name: 'Giacomo Fabretti' },
  { id: '5', name: 'Alex Frigerio' },
  { id: '6', name: 'Giulio Massara' },
  { id: '7', name: 'Alessandro Niutta' },
  { id: '8', name: 'Giovanni Pernazza' },
  { id: '9', name: 'Edoardo Sensi' },
  { id: '10', name: 'Tommaso Terzaghi' },
];

export const AWARDS: AwardCategory[] = [
  {
    id: 'cagnolino',
    title: 'Cagnolino dell’anno',
    icon: '🐶',
    description: 'Il più devoto, fedele e sottomesso.',
    longDescription: 'Per il più devoto, fedele e sottomesso tra gli ommini. Il vero esempio di amore… e dipendenza.',
  },
  {
    id: 'bollito',
    title: 'Bollito dell’anno',
    icon: '🍲',
    description: 'Tenero, molle e privo di vapore.',
    longDescription: 'Per colui che ha passato troppo tempo in pentola, ormai tenero, molle, e totalmente privo di vapore.',
  },
  {
    id: 'bruciato',
    title: 'Bruciato dell’anno',
    icon: '🔥',
    description: 'La mina vagante ingestibile.',
    longDescription: 'La mina vagante del gruppo: imprevedibile, ingestibile, e probabilmente pericoloso per sé e per gli altri.',
  },
  {
    id: 'scomparso',
    title: 'Scomparso dell’anno',
    icon: '🕵️',
    description: 'Il fantasma che visualizza alle 23:47.',
    longDescription: 'Il fantasma del gruppo. Nessuno lo vede mai, ma ogni tanto lascia un “visualizzato alle 23:47”.',
  },
  {
    id: 'ommino',
    title: 'Solo Ommino dell’anno',
    icon: '🏆',
    description: 'L’onore supremo. Gloria eterna.',
    longDescription: 'L’onore supremo. Il titolo riservato a chi ha portato alto il nome del gruppo, con performance leggendarie, dedizione assoluta e contributi indelebili alla storia Solo Ommini.',
  },
];