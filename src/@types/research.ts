export type ApprovalStatus = 'approved' | 'rejected' | 'pending' | 'accepted'

export interface BaseResearchData {
    id: string
    approval_status: ApprovalStatus
    approval_action_by?: string
    action_at?: string
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
    sources?: string[]
}

export interface IPR extends BaseResearchData {
    faculty_ref: string
    application_no: string
    title: string
    inventors: string[]
    applicants: string[]
    country: string
    published_date: string
    patent_type: string 
    status: string
}

export interface PHD_Student_Data extends BaseResearchData {
    name: string
    faculty_ref: string
    supervisor_type: string
    name_of_student: string
    enrollment_number: string
    phd_stream: string
}

export interface Journal extends BaseResearchData {
    title_of_paper: string
    authors: string[]
    journal_name: string
    journal_type: string
    date_of_publication: string
    ISSN_number: string
    web_link: string
}

export interface Conference extends BaseResearchData {
    authors: string[]
    title_of_paper: string
    title_of_proceedings_of_conference: string
    name_of_conference: string
    origin: string // nationality
    year_of_publication: string
    isbn_issn_number: string
    name_of_publisher: string
}

export interface Book extends BaseResearchData {
    author: string
    title_of_book: string
    date_of_publication: string
    ISBN_number: string
    publisher_name: string
}

export interface Consultancy_Project_Grants extends BaseResearchData {
    project_title: string
    amount: string
    organization: string
    organization_url: string
    principal_investigator_ref: string
    co_investigators_refs: string[]
    institution: string
    duration: string
    grant_date: string
    status: string // ongoing/completed
}

export interface Award extends BaseResearchData {
    award_name: string
    title: string
    recipient_ref: string
    institution_body: string
    country: string
    month_year: string
}

export interface Other extends BaseResearchData {
    type: string // FDP/Seminar/Workshop/Keynote Speaker
    topic_title: string
    organization: string
    date: string
    role: string
    involved_faculty_refs: string[]
}

export type ResearchCategory =
    | 'IPR'
    | 'PHD_Student_Data'
    | 'Journal'
    | 'Conference'
    | 'Book'
    | 'Consultancy_Project_Grants'
    | 'Awards'
    | 'Others'

export type ResearchRequest =
    | ({ category: 'IPR' } & IPR)
    | ({ category: 'PHD_Student_Data' } & PHD_Student_Data)
    | ({ category: 'Journal' } & Journal)
    | ({ category: 'Conference' } & Conference)
    | ({ category: 'Book' } & Book)
    | ({ category: 'Consultancy_Project_Grants' } & Consultancy_Project_Grants)
    | ({ category: 'Awards' } & Award)
    | ({ category: 'Others' } & Other)
