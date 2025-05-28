'use client'

import { Pagination } from "@heroui/react"
import type { Dispatch, SetStateAction } from "react"

interface BotContentProps {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    pages: number
}

export default function BotContent({ page, setPage, pages }: BotContentProps) {
    return (
        <div className="flex justify-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
        </div>
    )
}
