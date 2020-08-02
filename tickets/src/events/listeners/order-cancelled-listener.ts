import {Listener, Subjects, orderCancelledEvent} from '@nasdtickets/common';
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queue-group-name'
import {Ticket} from '../../models/tickets';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<orderCancelledEvent> {
 subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
 queueGroupName = queueGroupName;

 async onMessage(data: orderCancelledEvent['data'], msg: Message) {
  const ticket = await Ticket.findById(data.ticket.id);

  if (!ticket) {
    throw new Error('Ticket not found');
  }
  ticket.set({ orderId: undefined });
  await ticket.save();
  await new TicketUpdatedPublisher(this.client).publish({
    id: ticket.id,
    orderId: ticket.orderId,
    userId: ticket.userId,
    price: ticket.price,
    title: ticket.title,
    version: ticket.version,

  });
  msg.ack();
 }



}