// Trainingsschema's. Per week: een korte omschrijving van de trainingen (3x per week).
export interface Plan {
  id: string
  title: string
  goal: string
  weeks: string[]
  level: string
  perWeek: string
}

export const PLANS: Plan[] = [
  {
    id: '5k',
    title: 'Van 0 naar 5 km',
    goal: 'Voor wie (opnieuw) begint met hardlopen.',
    level: 'Beginner',
    perWeek: '3 trainingen per week, ± 30 minuten',
    weeks: [
      '8× 1 min hardlopen, 1,5 min wandelen',
      '6× 2 min hardlopen, 1 min wandelen',
      '5× 3 min hardlopen, 1 min wandelen',
      '4× 4 min hardlopen, 1 min wandelen',
      '3× 6 min hardlopen, 1 min wandelen',
      '2× 10 min hardlopen, 2 min wandelen',
      '20 min rustig hardlopen, 2× per week; 1× 25 min',
      '30 min rustig hardlopen — en dan je eerste 5 km!',
    ],
  },
  {
    id: '10k',
    title: 'Van 5 naar 10 km',
    goal: 'Je loopt 5 km en wilt door naar 10 km.',
    level: 'Gevorderde beginner',
    perWeek: '3 trainingen per week, 30–60 minuten',
    weeks: [
      '2× 30 min rustig, 1× 35 min rustig',
      '2× 30 min rustig, 1× 40 min rustig',
      '1× 30 min met 4× 2 min iets sneller, 1× 30 min rustig, 1× 45 min rustig',
      '2× 35 min rustig, 1× 50 min rustig',
      'Herstelweek: 3× 30 min rustig',
      '1× 35 min met 5× 3 min iets sneller, 1× 35 min rustig, 1× 55 min rustig',
      '2× 40 min rustig, 1× 60 min rustig',
      '1× 40 min met 3× 5 min tempo, 1× 35 min rustig, 1× 65 min rustig',
      'Rustiger aan: 2× 30 min, 1× 40 min',
      '2× 25 min rustig — en dan je 10 km-wedstrijd',
    ],
  },
  {
    id: 'half',
    title: 'Halve marathon',
    goal: 'Je loopt 10 km en wilt naar 21,1 km.',
    level: 'Gevorderd',
    perWeek: '3–4 trainingen per week',
    weeks: [
      '3× 40 min rustig, lange duurloop 10 km',
      '3× 40 min rustig, lange duurloop 11 km',
      '1× tempo 4× 5 min, 2× 40 min rustig, lange duurloop 12 km',
      'Herstelweek: 3× 35 min, lange duurloop 9 km',
      '1× tempo 3× 8 min, 2× 45 min rustig, lange duurloop 14 km',
      '1× heuveltraining, 2× 45 min rustig, lange duurloop 15 km',
      '1× tempo 2× 12 min, 2× 45 min rustig, lange duurloop 16 km',
      'Herstelweek: 3× 40 min, lange duurloop 12 km',
      '1× tempo 3× 10 min, 2× 50 min rustig, lange duurloop 18 km',
      '1× tempo 20 min, 2× 45 min rustig, lange duurloop 19 km',
      'Afbouwen: 3× 40 min, lange duurloop 12 km',
      '2× 30 min rustig — en dan je halve marathon!',
    ],
  },
]
