const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const TOPICS = [
    "Artificial Intelligence", "Machine Learning", "Blockchain Technology", 
    "Quantum Computing", "Sustainable Agriculture", "Internet of Things", 
    "Edge Computing", "Cloud Infrastructure", "Cybersecurity", 
    "Bio-Medical Engineering", "Renewable Energy", "Smart Grid Design",
    "Digital Marketing", "Natural Language Processing", "Robotics", 
    "Autonomous Vehicles", "Nanotechnology", "Big Data Analytics"
];

const ORGS = [
    "IEEE", "ACM", "Springer", "Nature", "Elsevier", "Wiley", "Pearson", 
    "Oxford University Press", "Cambridge Press", "MIT Research Labs", 
    "Stanford Innovation", "Google Research", "Microsoft Research", "IBM Research"
];

const NAMES = [
    "Dr. Arjav Sharma", "Prof. Sunita Rao", "Dr. Kevin Miller", "Prof. Elena Rossi",
    "Dr. Michael Chen", "Prof. Rajesh Kumar", "Dr. Sarah Johnson", "Prof. Yuki Tanaka"
];

const generateRecord = (type, year) => {
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const org = ORGS[Math.floor(Math.random() * ORGS.length)];
    const author = NAMES[Math.floor(Math.random() * NAMES.length)];

    switch (type) {
        case 'journal':
            return {
                title_of_paper: `Analysis of ${topic} in Modern Era`,
                journal_name: `${org} Journal of ${topic}`,
                journal_type: Math.random() > 0.5 ? 'SCI' : 'Scopus',
                isbn_issn_number: `${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
                date_of_publication: dateStr,
                web_link: `https://${org.toLowerCase().replace(/ /g, '')}.com/papers/${Math.random().toString(36).substring(7)}`
            };
        case 'conference':
            return {
                title_of_paper: `Emerging Trends in ${topic}`,
                title_of_proceedings: `Proceedings of ${org} ${year}`,
                name_of_conference: `${org} Global Summit on ${topic}`,
                origin: Math.random() > 0.5 ? 'International' : 'National',
                year_of_publication: year.toString(),
                isbn_issn_number: `ISSN-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 1000)}`,
                name_of_publisher: org
            };
        case 'book':
            return {
                title_of_book: `Principles of ${topic}`,
                publisher_name: org,
                isbn_number: `ISBN-${Math.floor(Math.random() * 1000000)}`,
                date_of_publication: dateStr
            };
        case 'ipr':
            return {
                title: `Novel ${topic} Architecture`,
                application_no: `PAT/${year}/${Math.floor(Math.random() * 10000)}`,
                filing_date: dateStr,
                applicants: author,
                country: Math.random() > 0.5 ? 'India' : 'USA',
                patent_type: 'Patent',
                status: 'Granted',
                published_date: dateStr
            };
        case 'award':
            return {
                award_name: `Excellence in ${topic}`,
                title: `Innovation in ${org}`,
                institution_body: org,
                country: 'India',
                month_year: `${new Date(year, month-1).toLocaleString('default', { month: 'long' })} ${year}`
            };
        case 'consultancy':
            return {
                project_title: `${org} ${topic} Integration`,
                organization: org,
                organization_url: `https://${org.toLowerCase().replace(/ /g, '')}.com`,
                amount: Math.floor(Math.random() * 20) * 50000 + 100000,
                institution: "SPSU",
                duration: "12 months",
                grant_date: dateStr,
                status: 'Completed'
            };
        default:
            return {};
    }
};

const runGenerator = () => {
    console.log("Starting DB Excel Generation...");
    
    const domains = ['journal', 'conference', 'book', 'ipr', 'award', 'consultancy'];
    const years = [2023, 2024, 2025, 2026];
    
    const outputDir = path.join(__dirname, 'dummy_templates');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    let totalAdded = 0;

    domains.forEach(domain => {
        console.log(`Generating Excel for ${domain}...`);
        const records = [];
        
        years.forEach(year => {
            const count = Math.floor(Math.random() * 13) + 30; // 30-42 records per year
            for (let i = 0; i < count; i++) {
                records.push(generateRecord(domain, year));
                totalAdded++;
            }
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(records);
        XLSX.utils.book_append_sheet(wb, ws, 'SampleData');
        
        const filePath = path.join(outputDir, `${domain}_massive_data.xlsx`);
        XLSX.writeFile(wb, filePath);
        console.log(` -> Saved ${records.length} records to ${domain}_massive_data.xlsx`);
    });

    console.log(`\nSUCCESS: Generated ${totalAdded} records total in 'dummy_templates' folder!`);
};

runGenerator();
