
export interface MockDocument {
    name: string;
    content: string;
}

export const mockDocuments: MockDocument[] = [
    {
        name: "invoice_quantum_solutions.txt",
        content: `
INVOICE #QS-2024-03-881
Date: March 15, 2024
To: Quantum Solutions
Billing Dept: billing@quantumsol.com
Address: 1 Quantum Way, Boston, MA

----------------------------------------------------
DESCRIPTION            | AMOUNT
----------------------------------------------------
Qubit Maintenance      | $15,000.00
Cryo-cooling fluid     | $3,500.00
----------------------------------------------------
TOTAL                  | $18,500.00
        `
    },
    {
        name: "w2_michael_scott.txt",
        content: `
a) Employee's social security number: ***-**-XXXX
b) Employer identification number (EIN)
c) Employer's name, address, and ZIP code
Dunder Mifflin, Inc.
1725 Slough Avenue
Scranton, PA 18505

d) Control number
e) Employee's first name and initial | Last name
   Michael G.                      | Scott

f) Employee's address and ZIP code
   42 Kellum Court, Apt 2
   Scranton, PA 18503
        `
    },
    {
        name: "contract_acme_corp.md",
        content: `
# Service Level Agreement

This agreement is made between AlpaV3 Industries ("Provider") and ACME Corporation ("Client").

**1. Services**
Provider will supply 10,000 units of anvils and one (1) giant magnet.

**2. Point of Contact**
All communication regarding this contract should be directed to support@acme.com.

**3. Payment**
Payment is due upon receipt of goods.

Signed,
W. E. Coyote,
Super Genius
        `
    },
    {
        name: "tax_form_david_chen.txt",
        content: `
FORM 1099-INT
Interest Income

RECIPIENT'S name: David Chen
Street address: 1234 Market St, Apt 5B, Philadelphia, PA 19107

RECIPIENT'S TIN: XXX-XX-5678

PAYER'S name: First National Bank of Alpa
        `
    },
    {
        name: "shipment_nile_treasures.csv",
        content: `
OrderId,CustomerId,ShipTo,Contents
ORD-24-99A,NT-8876-2024,"Attn: Sales, 1st Pyramid, Giza, Egypt","Sarcophagus (gold-plated)"
ORD-24-99B,NT-8876-2024,"Attn: Sales, 1st Pyramid, Giza, Egypt","Canopic Jars (set of 4)"
        `
    },
    {
        name: "letter_olivia_chen.txt",
        content: `
Dear Ms. Chen,

We are writing to you regarding your account.
Please review the enclosed documents at your earliest convenience.

Our records show your primary address as:
Olivia Chen
221B Baker Street
London

Sincerely,
AlpaV3 Bank
        `
    }
];
