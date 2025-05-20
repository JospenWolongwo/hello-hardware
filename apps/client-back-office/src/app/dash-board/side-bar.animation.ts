import { animate, state, style, transition } from '@angular/animations';

export const expandSideBar = [
  state(
    'open',
    style({
      width: '250px',
    })
  ),
  transition('open <=> *', [animate('0.4s cubic-bezier(.55,-0.01,.52,1)')]),
];
