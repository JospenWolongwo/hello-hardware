import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { DeliveryState, deliveryStates } from '../types/delivery.state';

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    enum: deliveryStates,
    description: 'The delivery status.',
    example: 'active',
  })
  @IsNotEmpty()
  @IsIn(deliveryStates, { message: 'status must be a valid value.' })
  status: DeliveryState;
}
