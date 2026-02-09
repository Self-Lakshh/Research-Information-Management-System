import { cloneElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import authImg from '@/assets/mockup/hero-illustration.png'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="grid lg:grid-cols-2 h-screen overflow-hidden bg-white dark:bg-gray-900">
            <div className="hidden lg:block relative w-full h-full bg-teal-50 dark:bg-gray-800 overflow-hidden z-10 shadow-[10px_0_30px_-10px_rgba(0,0,0,0.1)]">
                <img
                    src={authImg}
                    alt="SPSU RIMS"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col h-full overflow-y-auto relative">
                <div className="min-h-full flex flex-col justify-center items-center p-8 lg:p-24">
                    <div className="w-full max-w-[600px]">
                        <div className="mb-8 lg:hidden flex justify-center">
                            {/* Logo can go here for mobile */}
                        </div>
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                ...rest,
                            })
                            : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Simple
