import {Publisher, orderCancelledEvent, Subjects} from '@nasdtickets/common'

export class OrderCancelledPublisher extends Publisher<orderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

