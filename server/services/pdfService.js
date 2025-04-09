const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

// Site-specific configurations
const siteConfigs = {
    quimicaindustrialpe: {
        name: 'Química Industrial Perú',
        address: 'Dirección de la empresa',
        phone: 'Teléfono de contacto',
        email: 'correo@quimicaindustrialpe.com',
        logo: 'path/to/quimicaindustrialpe-logo.png'
    },
    // Add configurations for other sites
};

const generatePDF = async (quote) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const siteConfig = siteConfigs[quote.site.id];

        // Header
        doc.image(siteConfig.logo, 50, 50, { width: 100 });
        doc.fontSize(20).text(siteConfig.name, 170, 50);
        doc.fontSize(10).text(siteConfig.address, 170, 80);
        doc.text(`Tel: ${siteConfig.phone}`, 170, 95);
        doc.text(`Email: ${siteConfig.email}`, 170, 110);

        // Quote Information
        doc.moveDown(2);
        doc.fontSize(16).text('COTIZACIÓN', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Número: ${quote._id}`);
        doc.text(`Fecha: ${new Date(quote.createdAt).toLocaleDateString('es-PE')}`);

        // Client Information
        doc.moveDown();
        doc.fontSize(14).text('INFORMACIÓN DEL CLIENTE');
        doc.fontSize(12);
        doc.text(`Nombre: ${quote.clientInfo.name} ${quote.clientInfo.lastName || ''}`);
        doc.text(`Email: ${quote.clientInfo.email}`);
        doc.text(`Teléfono: ${quote.clientInfo.phone}`);
        if (quote.clientInfo.company) {
            doc.text(`Empresa: ${quote.clientInfo.company}`);
        }
        if (quote.clientInfo.ruc) {
            doc.text(`RUC: ${quote.clientInfo.ruc}`);
        }

        // Products
        doc.moveDown();
        doc.fontSize(14).text('PRODUCTOS SOLICITADOS');
        
        // Table header
        const startY = doc.y;
        doc.fontSize(12);
        doc.text('Producto', 50, startY);
        doc.text('Presentación', 200, startY);
        doc.text('Volumen', 350, startY);
        
        // Table rows
        let y = startY + 20;
        quote.selectedProducts.forEach(product => {
            doc.text(product.name, 50, y);
            doc.text(product.presentation, 200, y);
            doc.text(product.volume, 350, y);
            y += 20;
        });

        // Observations
        if (quote.observations) {
            doc.moveDown();
            doc.fontSize(14).text('OBSERVACIONES');
            doc.fontSize(12).text(quote.observations);
        }

        // Footer
        const pageHeight = doc.page.height;
        doc.fontSize(10)
           .text('Gracias por su preferencia', 50, pageHeight - 100, { align: 'center' })
           .text(siteConfig.name, 50, pageHeight - 80, { align: 'center' });

        doc.end();
    });
};

module.exports = {
    generatePDF
}; 