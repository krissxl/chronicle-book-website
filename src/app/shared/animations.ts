import { animation, query, style, stagger, animate } from '@angular/animations';

export const inListAnimation = animation([
  query(
    '.entry',
    [
      style({ opacity: 0, transform: 'translateX(-85%)' }),
      stagger('25ms', [
        animate(
          '{{ time }} ease',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ],
    { optional: true }
  ),
]);
