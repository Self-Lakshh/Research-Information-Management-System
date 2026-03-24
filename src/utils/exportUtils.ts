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

export const exportToExcel = async (records: any[], domain: string) => {
    // Dynamic import to avoid top-level evaluation of large libs
    const XLSX = await import('xlsx')
    
    const config = RECORD_TYPE_CONFIG[domain.toLowerCase() as RecordType]
    if (!config) return;

    const exportFields = config.fields.filter(f => f.key !== 'file')
    
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
        return row
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, config.shortLabel || 'Records')
    XLSX.writeFile(workbook, `${config.label}_Export_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportToPDF = async (records: any[], domain: string) => {
    // Dynamic import
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const config = RECORD_TYPE_CONFIG[domain.toLowerCase() as RecordType]
    if (!config) return;

    const exportFields = config.fields.filter(f => f.key !== 'file')
    const headers = exportFields.map(f => f.label)
    
    const rows = await Promise.all(records.map(async (r) => {
        return await Promise.all(exportFields.map(async (field) => {
            let val = r[field.key] || r.data?.[field.key]
            if (field.type === 'user_select' || val instanceof DocumentReference || (Array.isArray(val) && val.length > 0 && (val[0] instanceof DocumentReference || val[0]?.path))) {
                return await resolveUserNames(val)
            }
            return formatValue(val)
        }))
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
        styles: { fontSize: 8, cellPadding: 5 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        theme: 'striped'
    })

    docPDF.save(`${config.label}_Export_${new Date().toISOString().split('T')[0]}.pdf`)
}
