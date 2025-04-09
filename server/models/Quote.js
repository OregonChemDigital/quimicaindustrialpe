const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    presentation: { type: String, required: true },
    volume: { type: String, required: true }
});

const clientInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String },
    dni: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    socialReason: { type: String },
    ruc: { type: String }
});

const siteSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true }
});

const metadataSchema = new mongoose.Schema({
    ipAddress: { type: String },
    userAgent: { type: String },
    language: { type: String }
});

const quoteSchema = new mongoose.Schema({
    selectedProducts: [productSchema],
    clientType: { type: String, required: true },
    clientInfo: clientInfoSchema,
    contactMethod: { type: String },
    observations: { type: String },
    termsAccepted: { type: Boolean, required: true },
    privacyAccepted: { type: Boolean, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    site: siteSchema,
    metadata: metadataSchema
}, {
    timestamps: true
});

// Indexes for efficient querying
quoteSchema.index({ 'site.id': 1, createdAt: -1 }); // For site-specific quote listing
quoteSchema.index({ status: 1, 'site.id': 1 }); // For filtering by status and site
quoteSchema.index({ 'clientInfo.email': 1 }); // For client lookup
quoteSchema.index({ createdAt: -1 }); // For general sorting

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote; 