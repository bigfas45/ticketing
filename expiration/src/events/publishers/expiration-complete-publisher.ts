import {  Publisher, ExpirationCompleteEvent, Subjects} from '@nasdtickets/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}