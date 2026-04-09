import xlsx from 'xlsx';
import fs from 'fs';

const configs = {
    ipr: ['title', 'application_no', 'filing_date', 'applicants', 'country', 'patent_type', 'status', 'published_date'],
    journal: ['title_of_paper', 'journal_name', 'journal_type', 'isbn_issn_number', 'date_of_publication', 'web_link'],
    conference: ['title_of_paper', 'title_of_proceedings', 'name_of_conference', 'origin', 'year_of_publication', 'isbn_issn_number', 'name_of_publisher'],
    book: ['title_of_book', 'publisher_name', 'isbn_number', 'date_of_publication'],
    consultancy: ['project_title', 'organization', 'organization_url', 'amount', 'institution', 'duration', 'grant_date', 'status'],
    award: ['award_name', 'title', 'institution_body', 'country', 'month_year']
};

Object.entries(configs).forEach(([type, fields]) => {
    const wb = xlsx.utils.book_new();
    // Headers only
    const wsData = [fields];
    // Add one empty row with examples or just empty
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'Template');
    xlsx.writeFile(wb, `${type}_template.xlsx`);
    console.log(`Generated ${type}_template.xlsx`);
});
