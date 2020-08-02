import {Message} from 'node-nats-streaming';
import {Listener,  OrderCreatedEvent, Subjects, orderCancelledEvent} from '@nasdtickets/common';
import {queueGroupName} from './queue-group-name';
import {Ticket} from '../../models/tickets';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

 async onMessage(data: orderCancelledEvent['data'], msg: Message){
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket, throw erro
    if (!ticket) {
      throw new Error ('Ticket not found');
    }

    // Mark the ticket as being reserved bt setting its orderId property

    ticket.set({orderId: data.id});

    // save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    orderId: ticket.orderId 
    });

    // ack the message 
    msg.ack();
  }

}