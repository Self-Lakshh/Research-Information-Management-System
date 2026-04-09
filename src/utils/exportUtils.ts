import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { RecordType } from '@/@types/rims.types'
import { doc, getDoc, DocumentReference } from 'firebase/firestore'
import { db } from '@/configs/firebase.config'

async function resolveUserNames(value: any): Promise<string> {
    if (!value) return 'N/A';
    
    const resolveRef = async (ref: any) => {
        if (ref instanceof DocumentReference || (ref && ref.path)) {
            const r = ref instanceof DocumentReference ? ref : doc(db, ref.path);
            const snap = await getDoc(r);
            return snap.exists() ? (snap.data()?.name || snap.data()?.email || 'Unknown') : 'Unknown';
        }
        return String(ref);
    };

    if (Array.isArray(value)) {
        if (value.length === 0) return 'None';
        const names = await Promise.all(value.map(resolveRef));
        return names.join(', ');
    }

    return await resolveRef(value);
}

export async function resolveMediaLinks(record: any): Promise<{ name: string, url: string }[]> {
    const sources = record.sources || record.documents || [];
    if (!sources || sources.length === 0) return [];

    try {
        const files = await Promise.all(sources.map(async (ref: any) => {
            try {
                let resolvedRef = ref;
                if (typeof ref === 'string') {
                    resolvedRef = ref.includes('/') ? doc(db, ref) : doc(db, 'documents', ref);
                }
                
                const snap = await getDoc(resolvedRef);
                if (snap.exists()) {
                    const dData = snap.data() as any;
                    const url = dData.file_url || dData.url || dData.media_url;
                    // Extract name from URL or metadata
                    let name = dData.name || dData.fileName || 'Document';
                    if (url && name === 'Document') {
                        const decodeUrl = decodeURIComponent(url);
                        const match = decodeUrl.match(/\/([^/?#]+)[^/]*$/);
                        if (match && match[1]) {
                            // Firebase storage paths often have [hash]_name
                            name = match[1].split('/').pop()?.split('_').slice(1).join('_') || match[1];
                        }
                    }
                    return { name, url };
                }
            } catch (e) { console.error("Error resolving export media:", e) }
            return null;
        }));
        
        return files.filter((f): f is { name: string, url: string } => f !== null);
    } catch (err) {
        console.error("Critical error resolving media links for export:", err);
        return [];
    }
}

const formatValue = (val: any) => {
    if (val === null || val === undefined || val === '') return 'N/A';
    if (typeof val === 'object' && val.seconds !== undefined) {
        return new Date(val.seconds * 1000).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
    return String(val);
}

export const exportToExcel = async (records: any[], domain: string, selectedFields?: string[]) => {
    // Dynamic import to avoid top-level evaluation of large libs
    const XLSX = await import('xlsx')
    
    const config = RECORD_TYPE_CONFIG[domain.toLowerCase() as RecordType]
    if (!config) return;

    let exportFields = config.fields.filter(f => f.key !== 'file')
    if (selectedFields) {
        exportFields = exportFields.filter(f => selectedFields.includes(f.key))
    }
    
    const dataToExport = await Promise.all(records.map(async (r) => {
        const row: any = {}
        for (const field of exportFields) {
            let val = r[field.key] || r.data?.[field.key]
            
            if (field.type === 'user_select' || val instanceof DocumentReference || (Array.isArray(val) && val.length > 0 && (val[0] instanceof DocumentReference || val[0]?.path))) {
                val = await resolveUserNames(val)
            } else {
                val = formatValue(val)
            }
            
            row[field.label] = val
        }
        
        // Add Documents Link if selected
        if (!selectedFields || selectedFields.includes('documents_link')) {
            const media = await resolveMediaLinks(r)
            if (media.length > 0) {
                // Use the name as the display value (this fixes the empty cell issue)
                row['Supporting Documents'] = media.map(m => m.name).join(', ')
                // Attach the first URL for post-processing
                if (media.length === 1) {
                    row._docUrl = media[0].url
                }
            } else {
                row['Supporting Documents'] = 'No Documents'
            }
        }
        
        return row
    }))

    // Filter out internal helper properties like _docUrl before generating sheet
    const cleanData = dataToExport.map(({ _docUrl, ...rest }) => rest)
    const worksheet = XLSX.utils.json_to_sheet(cleanData)

    // Post-process to add formulas for single links
    dataToExport.forEach((r, idx) => {
        if (r._docUrl) {
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
            const col = range.e.c // Supporting Documents is the last column
            const cellRef = XLSX.utils.encode_cell({ r: idx + 1, c: col })
            if (worksheet[cellRef]) {
                worksheet[cellRef].f = `HYPERLINK("${r._docUrl}", "${r['Supporting Documents']}")`
            }
        }
    })

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, config.shortLabel || 'Records')
    XLSX.writeFile(workbook, `${config.label}_Export_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportToPDF = async (records: any[], domain: string, selectedFields?: string[]) => {
    // Dynamic import
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const config = RECORD_TYPE_CONFIG[domain.toLowerCase() as RecordType]
    if (!config) return;

    let exportFields = config.fields.filter(f => f.key !== 'file')
    if (selectedFields) {
        exportFields = exportFields.filter(f => selectedFields.includes(f.key))
    }
    
    const headers = exportFields.map(f => f.label)
    if (!selectedFields || selectedFields.includes('documents_link')) {
        headers.push('Supporting Documents')
    }
    
    const mediaMap = new Map<number, { name: string, url: string }[]>()
    const rows = await Promise.all(records.map(async (r, rowIndex) => {
        const rowData = await Promise.all(exportFields.map(async (field) => {
            let val = r[field.key] || r.data?.[field.key]
            if (field.type === 'user_select' || val instanceof DocumentReference || (Array.isArray(val) && val.length > 0 && (val[0] instanceof DocumentReference || val[0]?.path))) {
                return await resolveUserNames(val)
            }
            return formatValue(val)
        }))
        
        if (!selectedFields || selectedFields.includes('documents_link')) {
            const media = await resolveMediaLinks(r)
            mediaMap.set(rowIndex, media)
            rowData.push(media.map(m => m.name).join(', ') || 'No Documents')
        }
        
        return rowData
    }))

    const docPDF = new jsPDF('l', 'pt')
    docPDF.setFontSize(18)
    docPDF.text(`${config.label} Export`, 40, 40)
    docPDF.setFontSize(10)
    docPDF.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60)
    
    autoTable(docPDF, {
        head: [headers],
        body: rows,
        startY: 80,
        styles: { fontSize: 8, cellPadding: 5, overflow: 'linebreak' }, 
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        theme: 'striped',
        didDrawCell: (data: any) => {
            const docColIndex = headers.length - 1;
            if (data.section === 'body' && data.column.index === docColIndex) {
                const media = mediaMap.get(data.row.index);
                if (media && media.length > 0) {
                    docPDF.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: media[0].url });
                }
            }
        }
    })

    docPDF.save(`${config.label}_Export_${new Date().toISOString().split('T')[0]}.pdf`)
}
