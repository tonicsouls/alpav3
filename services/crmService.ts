
import { CustomerData, WorkflowConfig } from '../types';

// Mock CRM Database
const mockCrmDatabase: CustomerData[] = [
    { id: 'usr_1', name: 'John Doe', address: '123 Main St, Anytown, USA', email: 'john.doe@email.com', shortId: 'JD12345' },
    { id: 'usr_2', name: 'Jane Smith', address: '456 Oak Ave, Somecity, USA', email: 'jane.s@web.com', shortId: 'JS67890' },
    { id: 'usr_3', name: 'Innovate Corp', address: '789 Tech Park, Silicon Valley', email: 'contact@innovate.com', shortId: 'ICORP01' },
    { id: 'usr_4', name: 'Samantha Bee', address: 'Invoice #INV-2024-9981', email: 's.bee@mail.net', shortId: 'SBEE442' },
    { id: 'usr_5', name: 'Michael Scott', address: '1725 Slough Avenue, Scranton, PA', email: 'm.scott@dundermifflin.com', shortId: 'MSCOTT' },
    { id: 'usr_6', name: 'Olivia Chen', address: '221B Baker Street, London', email: 'olivia.chen@consulting.co.uk', shortId: 'OCHEN88' },
    { id: 'usr_7', name: 'Quantum Solutions', address: '1 Quantum Way, Boston, MA', email: 'billing@quantumsol.com', shortId: 'QSOLBOS' },
    { id: 'usr_8', name: 'Benjamin Carter', address: '42 Wallaby Way, Sydney', email: 'bencarter@auspost.au', shortId: 'BCART42' },
    { id: 'usr_9', name: 'Acme Corporation', address: '123 Looney Lane, Toontown', email: 'support@acme.com', shortId: 'ACME001' },
    { id: 'usr_10', name: 'Dr. Evelyn Reed', address: '300 Research Blvd, Cambridge', email: 'e.reed@university.edu', shortId: 'EREEDPHD' },
    { id: 'usr_11', name: 'Carlos Gomez', address: 'Paseo de la Reforma 222, Mexico City', email: 'c.gomez@despacho.mx', shortId: 'CGMZ222' },
    { id: 'usr_12', name: 'Pioneer Logistics', address: 'PO Box 5000, Salt Lake City, UT', email: 'dispatch@pioneer.logistics', shortId: 'PIONUT' },
    { id: 'usr_13', name: 'Aisha Khan', address: '15 Mohammed Ali Road, Mumbai', email: 'a.khan@fabrics.in', shortId: 'AKHAN15' },
    { id: 'usr_14', name: 'Kenji Tanaka', address: 'Shibuya Crossing Tower, Tokyo', email: 'tanaka.k@tech.jp', shortId: 'KTANAKA' },
    { id: 'usr_15', name: 'Starlight Diner', address: '555 Starry Night Rd, Galaxy, NV', email: 'orders@starlightdiner.net', shortId: 'STAR555' },
    { id: 'usr_16', name: 'Liam Murphy', address: '77 Grafton Street, Dublin', email: 'liam.m@eire.ie', shortId: 'LMURPHY' },
    { id: 'usr_17', name: 'Isabella Rossi', address: 'Via Veneto 10, Rome', email: 'isabella.rossi@fashion.it', shortId: 'IROSSI10' },
    { id: 'usr_18', name: 'Global Petrochem', address: 'Al-Khobar 31952, Saudi Arabia', email: 'accounts@globalpetro.sa', shortId: 'GPETROKSA' },
    { id: 'usr_19', name: 'Fatima Al-Fassi', address: 'Rue 24, Casablanca, Morocco', email: 'fatima.alfassi@artisan.ma', shortId: 'FALFASSI' },
    { id: 'usr_20', name: 'David Chen', address: 'Social Security Number: XXX-XX-5678', email: 'd.chen88@me.com', shortId: 'DCHEN5678' },
    { id: 'usr_21', name: 'Maple Leaf Bakery', address: '100 Queen Street West, Toronto', email: 'info@mapleleafbakery.ca', shortId: 'MAPLE100' },
    { id: 'usr_22', name: 'Lucas Dubois', address: '25 Rue de Rivoli, Paris', email: 'l.dubois@gallery.fr', shortId: 'LDUBOIS' },
    { id: 'usr_23', name: 'Oceanic Shipping Co.', address: 'One Harbourfront, Singapore', email: 'freight@oceanic.sg', shortId: 'OCEANSG' },
    { id: 'usr_24', name: 'Chloe Kim', address: 'Gangnam-daero 162, Seoul', email: 'chloe.kim@kpop.kr', shortId: 'CKIM162' },
    { id: 'usr_25', name: 'Nile Treasures', address: 'Account #NT-8876-2024', email: 'sales@niletreasures.com', shortId: 'NILE8876' }
];

// Simulate network delay
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));


/**
 * Simulates finding a customer in the CRM by a piece of identifying information.
 * @param identifier - The customer info extracted by the AI (name, email, address, etc.).
 * @returns A promise that resolves to the customer data or null if not found.
 */
export const findCustomerByDetails = async (identifier: string): Promise<CustomerData | null> => {
    await simulateDelay(1000); // Simulate API call latency

    if (!identifier) return null;
    
    const searchTerm = identifier.toLowerCase().trim();

    const customer = mockCrmDatabase.find(c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.address.toLowerCase().includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm) ||
        c.shortId.toLowerCase().includes(searchTerm)
    );
    
    return customer || null;
};

/**
 * Simulates renaming a file and moving it to a new folder based on configuration.
 * @param originalFileName - The original name of the file.
 * @param customerShortId - The customer's short ID from the CRM.
 * @param fileType - The type of file determined by the AI.
 * @param config - The workflow configuration object.
 * @returns A promise that resolves to the new file name and destination path.
 */
export const renameAndMoveFile = async (
    originalFileName: string,
    customerShortId: string,
    fileType: string,
    config: WorkflowConfig
): Promise<{ newFileName: string; destination: string }> => {
    await simulateDelay(800);

    // Sanitize fileType for folder name
    const sanitizedFileType = fileType.replace(/[^a-zA-Z0-9]/g, '_');
    const parts = originalFileName.split('.');
    const extension = parts.length > 1 ? `.${parts.pop()}` : '';
    const baseName = parts.join('.');

    let newFileName: string;

    // New file name format based on configuration
    if (config.namingConvention === 'TYPE_ID_NAME') {
        newFileName = `${sanitizedFileType}_${customerShortId}_${baseName}${extension}`;
    } else { // Default to 'ID_TYPE_NAME'
        newFileName = `${customerShortId}_${sanitizedFileType}_${baseName}${extension}`;
    }


    // Destination path based on customer, file type, and configured base path
    const destination = `${config.secureBasePath}${customerShortId}/${sanitizedFileType}/`;

    console.log(`SIMULATED: Renamed "${originalFileName}" to "${newFileName}"`);
    console.log(`SIMULATED: Moved to "${destination}"`);

    return { newFileName, destination };
};