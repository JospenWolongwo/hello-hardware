import { Component, Inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-pop-up-message',
  imports: [MatDialogModule, MatButtonModule, FlexLayoutModule],
  templateUrl: './pop-up-message.component.html',
  styleUrls: ['./pop-up-message.component.scss'],
})
export class PopUpMessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; class: string }) {}
}
