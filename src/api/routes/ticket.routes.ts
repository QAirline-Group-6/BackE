import { Router } from 'express';
import { searchTicketByBookingAndEmail, cancelTicket } from '../../controllers/ticket.controller';

const router = Router();

// Search ticket by booking code and email
router.get('/search', searchTicketByBookingAndEmail);

// Cancel ticket by ticket ID
router.put('/:ticket_id/cancel', cancelTicket);

export default router;