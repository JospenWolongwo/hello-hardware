import { Component, Inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-pop-up-confirmation',
  imports: [MatDialogModule, MatButtonModule, FlexLayoutModule],
  templateUrl: './pop-up-confirmation.component.html',
  styleUrls: ['../pop-up-message/pop-up-message.component.scss'],
})
export class PopUpConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
