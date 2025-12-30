export const SAMPLE_DOCUMENT_DETAIL = {
  id: "doc-12345",
  fileName: "invoice_Q4_2024.pdf",
  pdfUrl: "https://storage.example.com/original-invoice.pdf",
  uploadedAt: "2024-12-15T10:30:00Z",
  pages: 8,
  status: "processed",
  translatedPdfUrl: "https://storage.example.com/translated-invoice-en.pdf",
  extractionSource: "translated", // or "original"
  extractedJson: {
    transactions: [
      { 
        key: "Invoice Number", 
        value: "INV-2024-7890", 
        type: "text" 
      },
      { 
        key: "Invoice Date", 
        value: "December 15, 2024", 
        type: "date" 
      },
      { 
        key: "Due Date", 
        value: "January 14, 2025", 
        type: "date" 
      },
      { 
        key: "Customer Name", 
        value: "TechCorp Solutions Inc.", 
        type: "text" 
      },
      { 
        key: "Customer ID", 
        value: "TCS-9823", 
        type: "text" 
      },
      { 
        key: "Customer Email", 
        value: "accounts@techcorp.com", 
        type: "text" 
      },
      { 
        key: "Vendor Name", 
        value: "Innovate Consulting Group", 
        type: "text" 
      },
      { 
        key: "Vendor Address", 
        value: "123 Business Ave, San Francisco, CA 94107", 
        type: "text" 
      },
      { 
        key: "Total Amount", 
        value: "$18,750.50", 
        type: "amount", 
        positive: true 
      },
      { 
        key: "Subtotal", 
        value: "$17,000.00", 
        type: "amount" 
      },
      { 
        key: "Tax (10%)", 
        value: "$1,700.00", 
        type: "amount" 
      },
      { 
        key: "Shipping", 
        value: "$50.50", 
        type: "amount" 
      },
      { 
        key: "Currency", 
        value: "USD", 
        type: "text" 
      },
      { 
        key: "Payment Status", 
        value: "Pending", 
        type: "status" 
      },
      { 
        key: "Payment Method", 
        value: "Bank Transfer", 
        type: "text" 
      },
      { 
        key: "Purchase Order", 
        value: "PO-2024-456", 
        type: "text" 
      },
      { 
        key: "Terms", 
        value: "Net 30", 
        type: "text" 
      },
      { 
        key: "Discount Applied", 
        value: "$250.00", 
        type: "amount", 
        positive: false 
      },
      { 
        key: "Late Fee", 
        value: "$0.00", 
        type: "amount" 
      }
    ],
    lineItems: [
      { 
        description: "Enterprise Software License - Annual", 
        quantity: 5, 
        rate: 2000.00, 
        amount: 10000.00 
      },
      { 
        description: "Technical Consultation Hours", 
        quantity: 40, 
        rate: 125.00, 
        amount: 5000.00 
      },
      { 
        description: "System Integration Services", 
        quantity: 1, 
        rate: 1500.00, 
        amount: 1500.00 
      },
      { 
        description: "Data Migration Support", 
        quantity: 20, 
        rate: 100.00, 
        amount: 2000.00 
      },
      { 
        description: "Training Sessions", 
        quantity: 4, 
        rate: 375.00, 
        amount: 1500.00 
      },
      { 
        description: "Premium Support Package", 
        quantity: 1, 
        rate: 1000.00, 
        amount: 1000.00 
      }
    ]
  },
  summary: "This invoice document from Innovate Consulting Group to TechCorp Solutions Inc. contains billing details for Q4 2024 services totaling $18,750.50. The invoice includes enterprise software licenses, technical consultation hours, system integration services, data migration support, training sessions, and premium support. Payment terms are Net 30 with the invoice due on January 14, 2025. The current payment status is pending and the preferred payment method is bank transfer.",
  summarySource: "translated"
};