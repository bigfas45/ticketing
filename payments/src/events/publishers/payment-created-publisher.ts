import {Subjects, Publisher, PaymentCreatedEvent} from '@nasdtickets/common';


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}