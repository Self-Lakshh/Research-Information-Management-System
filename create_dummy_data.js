const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dummyData = {
    ipr: [
        {
            title: 'Neural Network Optimizer',
            application_no: 'PAT/2024/001',
            filing_date: '2024-01-15',
            applicants: 'John Doe, Jane Smith',
            country: 'India',
            patent_type: 'Patent',
            status: 'Published',
            published_date: '2024-03-20'
        },
        {
            title: 'Smart Grid Design',
            application_no: 'DES/2024/042',
            filing_date: '2024-02-10',
            applicants: 'Alice Johnson',
            country: 'USA',
            patent_type: 'Design',
            status: 'Registered',
            published_date: '2024-04-05'
        },
        {
            title: 'Encryption Algorithm',
            application_no: 'PAT/2023/999',
            filing_date: '2023-11-20',
            applicants: 'Tech Corp',
            country: 'UK',
            patent_type: 'Utility',
            status: 'Granted',
            published_date: '2024-01-10'
        }
    ],
    journal: [
        {
            title_of_paper: 'Impact of AI on Healthcare',
            journal_name: 'Nature Medicine',
            journal_type: 'SCI',
            isbn_issn_number: '1234-5678',
            date_of_publication: '2024-02-15',
            web_link: 'https://nature.com/example1'
        },
        {
            title_of_paper: 'Climate Change Modeling',
            journal_name: 'Science Today',
            journal_type: 'Scopus',
            isbn_issn_number: '8765-4321',
            date_of_publication: '2023-12-10',
            web_link: 'https://science.com/example2'
        },
        {
            title_of_paper: 'Quantum Computing Basics',
            journal_name: 'IEEE Transactions',
            journal_type: 'Web of Science',
            isbn_issn_number: '1122-3344',
            date_of_publication: '2024-04-01',
            web_link: 'https://ieee.org/example3'
        }
    ],
    conference: [
        {
            title_of_paper: 'Ethical AI Frameworks',
            title_of_proceedings: 'Proc. of ICML 2024',
            name_of_conference: 'ICML',
            origin: 'International',
            year_of_publication: '2024',
            isbn_issn_number: '978-3-16-148410-0',
            name_of_publisher: 'Springer'
        },
        {
            title_of_paper: 'Local SEO Strategies',
            title_of_proceedings: 'National Marketing Summit',
            name_of_conference: 'NMS 2023',
            origin: 'National',
            year_of_publication: '2023',
            isbn_issn_number: 'ISBN-101-202',
            name_of_publisher: 'Self'
        },
        {
            title_of_paper: 'Blockchain for Supply Chain',
            title_of_proceedings: 'IEEE EuroS&P',
            name_of_conference: 'EuroS&P 2024',
            origin: 'International',
            year_of_publication: '2024',
            isbn_issn_number: 'ISSN-444-555',
            name_of_publisher: 'IEEE'
        }
    ],
    book: [
        {
            title_of_book: 'Advanced Calculus',
            publisher_name: 'Pearson',
            isbn_number: '123-456-789',
            date_of_publication: '2023-05-10'
        },
        {
            title_of_book: 'Python for Data Science',
            publisher_name: 'O\'Reilly',
            isbn_number: '987-654-321',
            date_of_publication: '2024-01-20'
        },
        {
            title_of_book: 'Modern Architecture',
            publisher_name: 'Wiley',
            isbn_number: '111-222-333',
            date_of_publication: '2022-11-15'
        }
    ],
    consultancy: [
        {
            project_title: 'Smart City Planning',
            organization: 'City Council',
            amount: 500000,
            institution: 'University Z',
            duration: '12 months',
            grant_date: '2024-01-01',
            status: 'Ongoing'
        },
        {
            project_title: 'Bridge Structural Audit',
            organization: 'Govt. Dept',
            amount: 250000,
            institution: 'Engineering College X',
            duration: '6 months',
            grant_date: '2023-06-15',
            status: 'Completed'
        },
        {
            project_title: 'AI Ethics Consulting',
            organization: 'Global Tech',
            amount: 1000000,
            institution: 'Research Lab Y',
            duration: '24 months',
            grant_date: '2023-11-20',
            status: 'Ongoing'
        }
    ],
    award: [
        {
            award_name: 'Best Researcher 2023',
            title: 'Contribution to STEM',
            institution_body: 'Scientific Society',
            country: 'USA',
            month_year: 'December 2023'
        },
        {
            award_name: 'Young Scientist Award',
            title: 'Innovative Polymers',
            institution_body: 'National Science Acad',
            country: 'India',
            month_year: 'January 2024'
        },
        {
            award_name: 'Excellence in Teaching',
            title: 'Pedagogy Innovation',
            institution_body: 'Education Board',
            country: 'UK',
            month_year: 'March 2024'
        }
    ]
};

const outputDir = path.join(__dirname, 'dummy_templates');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

Object.keys(dummyData).forEach(type => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dummyData[type]);
    XLSX.utils.book_append_sheet(wb, ws, 'SampleData');
    const filePath = path.join(outputDir, `${type}_sample_data.xlsx`);
    XLSX.writeFile(wb, filePath);
    console.log(`Generated: ${filePath}`);
});

console.log(`\nAll 6 sample files generated in: ${outputDir}`);
