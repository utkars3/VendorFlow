import { Router } from 'express';
import { generateRFP, createRFP, getRFPs, getRFPById, sendRFP, checkEmails, compareProposals } from '../controllers/rfp.controller';

const router = Router();

router.post('/:id/compare', compareProposals);
router.post('/check-emails', checkEmails);
router.post('/:id/send', sendRFP);
router.post('/generate', generateRFP);
router.post('/', createRFP);
router.get('/', getRFPs);
router.get('/:id', getRFPById);

export default router;
