const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const { sendQuoteEmail } = require('../services/emailService');
const { generatePDF } = require('../services/pdfService');

// Middleware to validate site
const validateSite = (req, res, next) => {
    const validSites = ['quimicaindustrialpe', 'site2', 'site3', 'site4', 'site5'];
    if (!req.body.site || !validSites.includes(req.body.site.id)) {
        return res.status(400).json({ error: 'Invalid site identifier' });
    }
    next();
};

// Create a new quote
router.post('/', validateSite, async (req, res) => {
    try {
        // Add metadata
        req.body.metadata = {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            language: req.get('accept-language')
        };

        const quote = new Quote(req.body);
        await quote.save();

        // Generate PDF
        const pdfBuffer = await generatePDF(quote);

        // Send emails
        await sendQuoteEmail(quote, pdfBuffer);

        res.status(201).json(quote);
    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ error: 'Error creating quote' });
    }
});

// Get quotes for a specific site
router.get('/', async (req, res) => {
    try {
        const { siteId, status, startDate, endDate, page = 1, limit = 10 } = req.query;
        
        const query = {};
        if (siteId) query['site.id'] = siteId;
        if (status) query.status = status;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const quotes = await Quote.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Quote.countDocuments(query);

        res.json({
            quotes,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Error fetching quotes' });
    }
});

// Get a specific quote
router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        res.json(quote);
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).json({ error: 'Error fetching quote' });
    }
});

// Update quote status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.json(quote);
    } catch (error) {
        console.error('Error updating quote status:', error);
        res.status(500).json({ error: 'Error updating quote status' });
    }
});

module.exports = router; 