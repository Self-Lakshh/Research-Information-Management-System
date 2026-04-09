import { db, storage } from '@/configs/firebase.config';
import { collection, doc, getDocs, setDoc, query, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as XLSX from 'xlsx';
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config';

export const TEMPLATE_COLLECTION = 'excel_templates';

export interface TemplateMetadata {
    id: string;
    name: string;
    type: string;
    file_url: string;
    updated_at: Timestamp;
}

/**
 * Generates an Excel workbook based on RECORD_TYPE_CONFIG
 */
export const generateExcelWorkbook = (type: string) => {
    const config = RECORD_TYPE_CONFIG[type as keyof typeof RECORD_TYPE_CONFIG];
    if (!config) throw new Error(`Invalid record type: ${type}`);

    // Exclude file fields and user_id fields
    const fields = config.fields
        .filter(f => f.type !== 'file' && f.type !== 'user_select')
        .map(f => f.key);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([fields]);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    return wb;
};

/**
 * Returns a Blob version of the template
 */
export const generateExcelTemplateBlob = (type: string) => {
    const wb = generateExcelWorkbook(type);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

/**
 * Uploads all templates to Storage and saves metadata to Firestore
 */
export const setupTemplates = async () => {
    const types = ['ipr', 'journal', 'conference', 'book', 'consultancy', 'award'];
    
    for (const type of types) {
        const blob = generateExcelTemplateBlob(type);
        const storageRef = ref(storage, `templates/${type}_template.xlsx`);
        
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        
        await setDoc(doc(collection(db, TEMPLATE_COLLECTION), type), {
            id: type,
            name: `${type.toUpperCase()} Template`,
            type: type,
            file_url: url,
            updated_at: Timestamp.now()
        });
        
        console.log(`Setup template for ${type}`);
    }
};

/**
 * Fetches template metadata for a specific type
 */
export const getTemplateByType = async (type: string): Promise<TemplateMetadata | null> => {
    const q = query(collection(db, TEMPLATE_COLLECTION), where('type', '==', type));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as TemplateMetadata;
};
