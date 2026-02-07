import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/shadcn/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import { ResearchCategory } from '@/@types/research'
import { Loader2, Plus, Trash2, FileUp } from 'lucide-react'

// Define schemas for each category
const commonSchema = z.object({
    sources: z.array(z.string()).optional(),
})

const iprSchema = z.object({
    faculty_ref: z.string().min(1, 'Faculty reference is required'),
    application_no: z.string().min(1, 'Application number is required'),
    title: z.string().min(1, 'Title is required'),
    inventors: z.array(z.string()).min(1, 'At least one inventor is required'),
    applicants: z.array(z.string()).min(1, 'At least one applicant is required'),
    country: z.string().min(1, 'Country is required'),
    published_date: z.string().min(1, 'Date is required'),
    patent_type: z.enum(['design', 'patent', 'copyright', 'trademark']),
    status: z.string().min(1, 'Status is required'),
    ...commonSchema.shape,
})

const phdSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    faculty_ref: z.string().min(1, 'Faculty reference is required'),
    supervisor_type: z.string().min(1, 'Supervisor type is required'),
    name_of_student: z.string().min(1, 'Student name is required'),
    enrollment_number: z.string().min(1, 'Enrollment number is required'),
    phd_stream: z.string().min(1, 'PhD stream is required'),
    ...commonSchema.shape,
})

const journalSchema = z.object({
    title_of_paper: z.string().min(1, 'Title is required'),
    authors: z.array(z.string()).min(1, 'At least one author is required'),
    journal_name: z.string().min(1, 'Journal name is required'),
    journal_type: z.string().min(1, 'Journal type is required'),
    date_of_publication: z.string().min(1, 'Publication date is required'),
    ISSN_number: z.string().min(1, 'ISSN number is required'),
    web_link: z.string().url('Invalid URL').min(1, 'Web link is required'),
    ...commonSchema.shape,
})

const conferenceSchema = z.object({
    authors: z.array(z.string()).min(1, 'At least one author is required'),
    title_of_paper: z.string().min(1, 'Title is required'),
    title_of_proceedings_of_conference: z.string().min(1, 'Proceedings title is required'),
    name_of_conference: z.string().min(1, 'Conference name is required'),
    origin: z.string().min(1, 'Origin/Nationality is required'),
    year_of_publication: z.string().min(1, 'Year is required'),
    isbn_issn_number: z.string().min(1, 'ISBN/ISSN is required'),
    name_of_publisher: z.string().min(1, 'Publisher is required'),
    ...commonSchema.shape,
})

const bookSchema = z.object({
    author: z.string().min(1, 'Author is required'),
    title_of_book: z.string().min(1, 'Title is required'),
    date_of_publication: z.string().min(1, 'Publication date is required'),
    ISBN_number: z.string().min(1, 'ISBN number is required'),
    publisher_name: z.string().min(1, 'Publisher name is required'),
    ...commonSchema.shape,
})

const consultancySchema = z.object({
    project_title: z.string().min(1, 'Project title is required'),
    amount: z.string().min(1, 'Amount is required'),
    organization: z.string().min(1, 'Organization is required'),
    organization_url: z.string().url('Invalid URL').optional(),
    principal_investigator_ref: z.string().min(1, 'PI reference is required'),
    co_investigators_refs: z.array(z.string()),
    institution: z.string().min(1, 'Institution is required'),
    duration: z.string().min(1, 'Duration is required'),
    grant_date: z.string().min(1, 'Grant date is required'),
    status: z.enum(['ongoing', 'completed']),
    ...commonSchema.shape,
})

const awardSchema = z.object({
    award_name: z.string().min(1, 'Award name is required'),
    title: z.string().min(1, 'Title is required'),
    recipient_ref: z.string().min(1, 'Recipient reference is required'),
    institution_body: z.string().min(1, 'Institution / Body is required'),
    country: z.string().min(1, 'Country is required'),
    month_year: z.string().min(1, 'Month/Year is required'),
    ...commonSchema.shape,
})

const otherSchema = z.object({
    type: z.enum(['FDP', 'Seminar', 'Workshop', 'Keynote Speaker']),
    topic_title: z.string().min(1, 'Topic/Title is required'),
    organization: z.string().min(1, 'Organization is required'),
    date: z.string().min(1, 'Date is required'),
    role: z.string().min(1, 'Role is required'),
    involved_faculty_refs: z.array(z.string()),
    ...commonSchema.shape,
})

const schemaMap: Record<ResearchCategory, z.ZodObject<any>> = {
    IPR: iprSchema,
    PHD_Student_Data: phdSchema,
    Journal: journalSchema,
    Conference: conferenceSchema,
    Book: bookSchema,
    Consultancy_Project_Grants: consultancySchema,
    Awards: awardSchema,
    Others: otherSchema,
}

interface ResearchFormProps {
    category: ResearchCategory
    onSuccess: () => void
    onCancel: () => void
}

const ResearchForm = ({ category, onSuccess, onCancel }: ResearchFormProps) => {
    const [loading, setLoading] = React.useState(false)
    const schema = schemaMap[category]

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            inventors: [''],
            applicants: [''],
            authors: [''],
            co_investigators_refs: [''],
            involved_faculty_refs: [''],
            sources: [''],
            status: category === 'Consultancy_Project_Grants' ? 'ongoing' : '',
            patent_type: 'patent',
            type: 'Workshop'
        } as any
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        console.log('Submitting data for', category, ':', data)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setLoading(false)
        onSuccess()
    }

    const renderArrayField = (fieldName: string, label: string) => {
        const values = form.watch(fieldName) || []

        return (
            <div className="space-y-4 col-span-full">
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                {values.map((_: any, index: number) => (
                    <div key={index} className="flex gap-2">
                        <FormField
                            control={form.control}
                            name={`${fieldName}.${index}`}
                            render={({ field }: { field: any }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input {...field} placeholder={`Enter ${label.toLowerCase()} member`} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {values.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    const newValues = [...values]
                                    newValues.splice(index, 1)
                                    form.setValue(fieldName, newValues)
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-rose-500" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 gap-2"
                    onClick={() => form.setValue(fieldName, [...values, ''])}
                >
                    <Plus className="h-4 w-4" />
                    Add {label}
                </Button>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category === 'IPR' && (
                        <>
                            <FormField control={form.control} name="faculty_ref" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Faculty Ref</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="application_no" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Application No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="title" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            {renderArrayField('inventors', 'Inventors')}
                            {renderArrayField('applicants', 'Applicants')}
                            <FormField control={form.control} name="country" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="published_date" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Published Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="patent_type" render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Patent Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="patent">Patent</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                            <SelectItem value="copyright">Copyright</SelectItem>
                                            <SelectItem value="trademark">Trademark</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Status</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </>
                    )}

                    {category === 'PHD_Student_Data' && (
                        <>
                            <FormField control={form.control} name="name" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Supervisor Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="faculty_ref" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Faculty Ref</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="supervisor_type" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Supervisor Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="name_of_student" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="enrollment_number" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Enrollment Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phd_stream" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>PhD Stream</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </>
                    )}

                    {category === 'Journal' && (
                        <>
                            <FormField control={form.control} name="title_of_paper" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Title of Paper</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            {renderArrayField('authors', 'Authors')}
                            <FormField control={form.control} name="journal_name" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Journal Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="journal_type" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Journal Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="date_of_publication" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Date of Publication</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="ISSN_number" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>ISSN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="web_link" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Web Link / DOI</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </>
                    )}

                    {category === 'Conference' && (
                        <>
                            <FormField control={form.control} name="title_of_paper" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Title of Paper</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            {renderArrayField('authors', 'Authors')}
                            <FormField control={form.control} name="name_of_conference" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Name of Conference</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="title_of_proceedings_of_conference" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Title of Proceedings</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="origin" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Nationality / Origin</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="year_of_publication" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Year of Publication</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="isbn_issn_number" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>ISBN/ISSN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="name_of_publisher" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Publisher Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </>
                    )}

                    {category === 'Book' && (
                        <>
                            <FormField control={form.control} name="title_of_book" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Title of Book</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="author" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="date_of_publication" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Date of Publication</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="ISBN_number" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>ISBN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="publisher_name" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Publisher Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </>
                    )}

                    {category === 'Consultancy_Project_Grants' && (
                        <>
                            <FormField control={form.control} name="project_title" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="amount" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Amount</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="organization" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="organization_url" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Organization URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="principal_investigator_ref" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Principal Investigator Ref</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            {renderArrayField('co_investigators_refs', 'Co-Investigators')}
                            <FormField control={form.control} name="institution" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="duration" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="grant_date" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Grant Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Project Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </>
                    )}

                    {category === 'Awards' && (
                        <>
                            <FormField control={form.control} name="award_name" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Award Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="title" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="recipient_ref" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Recipient Ref</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="institution_body" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Institution / Body</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="country" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="month_year" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Month & Year</FormLabel><FormControl><Input {...field} placeholder="e.g. Oct 2023" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </>
                    )}

                    {category === 'Others' && (
                        <>
                            <FormField control={form.control} name="type" render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Activity Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="FDP">FDP</SelectItem>
                                            <SelectItem value="Seminar">Seminar</SelectItem>
                                            <SelectItem value="Workshop">Workshop</SelectItem>
                                            <SelectItem value="Keynote Speaker">Keynote Speaker</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="topic_title" render={({ field }: { field: any }) => (
                                <FormItem className="col-span-full"><FormLabel>Topic / Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="organization" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="date" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="role" render={({ field }: { field: any }) => (
                                <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            {renderArrayField('involved_faculty_refs', 'Involved Faculty')}
                        </>
                    )}

                    <div className="col-span-full pt-4 border-t mt-4">
                        <FormLabel className="text-sm font-medium mb-2 block">Supporting Documents (Proof)</FormLabel>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-400">PDF, PNG, JPG (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" multiple />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl gap-2 min-w-[120px]" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Request'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ResearchForm
