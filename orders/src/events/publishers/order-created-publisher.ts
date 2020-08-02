import {Publisher, OrderCreatedEvent, Subjects} from '@nasdtickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

