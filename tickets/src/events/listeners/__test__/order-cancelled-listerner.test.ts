import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import {Message} from 'node-nats-streaming'
import {orderCancelledEvent, OrderStatus} from '@nasdtickets/common'
import {Ticket} from '../../../models/tickets';
import mongoose from 'mongoose';


const setup = async () => {
const listerner = new OrderCancelledListener(natsWrapper.client);

const orderId = mongoose.Types.ObjectId().toHexString()

const ticket = Ticket.build({
  title: 'concert',
  price: 20,
  userId: 'asdfg',
});

ticket.set({orderId});
await ticket.save();


const data: orderCancelledEvent['data'] = {
  id: orderId,
  version: 0,
  ticket: {
    id: ticket.id
  }
};
// @ts-ignore
const msg: Message= {
  ack: jest.fn()
}


return{msg, data, ticket, orderId,  listerner}



};

it('updates the tickets, publish an event, and acks the message',  async() => {
  const {msg, data, ticket, orderId,  listerner} = await setup();

  await listerner.onMessage(data, msg);


  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled()



});
