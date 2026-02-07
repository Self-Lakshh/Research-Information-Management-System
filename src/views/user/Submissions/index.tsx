import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card'
import { Badge } from '@/components/shadcn/ui/badge'
import { Button } from '@/components/shadcn/ui/button'
import { Input } from '@/components/shadcn/ui/input'
import {
    FileText,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'

const Submissions = () => {
    const submissions = [
        { id: '1', title: 'Improving AI Efficiency in Healthcare', category: 'Journal', date: 'Oct 12, 2023', status: 'Approved' },
        { id: '2', title: 'Blockchain for Academic Veracity', category: 'Conference', date: 'Oct 10, 2023', status: 'Pending' },
        { id: '3', title: 'AI-based Healthcare Diagnostic System', category: 'IPR', date: 'Sep 25, 2023', status: 'Approved' },
        { id: '4', title: 'Deep Learning for Everyone', category: 'Book', date: 'Sep 15, 2023', status: 'Rejected' },
        { id: '5', title: 'Federated Learning in IOT', category: 'Journal', date: 'Aug 30, 2023', status: 'Pending' },
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            case 'Pending': return <Clock className="h-4 w-4 text-amber-500" />
            case 'Rejected': return <XCircle className="h-4 w-4 text-rose-500" />
            default: return null
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Approved': return 'default'
            case 'Pending': return 'secondary'
            case 'Rejected': return 'outline'
            default: return 'outline'
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
                    <p className="text-muted-foreground">Manage and track all your research submissions in one place.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="rounded-xl gap-2">
                        <ArrowUpDown className="h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-premium overflow-hidden">
                <CardHeader className="p-4 bg-muted/30 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search submissions..." className="pl-10 rounded-xl bg-background border-none shadow-inner" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Research Title</th>
                                    <th className="px-6 py-4 font-medium text-center">Category</th>
                                    <th className="px-6 py-4 font-medium text-center">Submission Date</th>
                                    <th className="px-6 py-4 font-medium text-center">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {submissions.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="secondary" className="rounded-lg">{item.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center text-muted-foreground">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {getStatusIcon(item.status)}
                                                <Badge variant={getStatusVariant(item.status) as any} className="capitalize">
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">Edit Submission</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-rose-500">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Submissions
