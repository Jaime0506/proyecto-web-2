'use client'

import { IUser } from "@/types/auth"
import CustomModal from "./modal/CustomModal"
import TableUsers from "./table/TableUsers"
import { useDisclosure } from "@heroui/react"
import { useState } from "react"
import { KeyOpenModal } from "@/utils/tables/keyOpenModal"

interface UsersPageWrapperProps {
    data: IUser[]
}

export default function UsersPageWrapper({ data }: UsersPageWrapperProps) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [modalContent, setModalContent] = useState<{ key: KeyOpenModal, user: IUser } | null>(null);

    const openModal = (key: KeyOpenModal, user: IUser) => {
        setModalContent({
            key,
            user
        })
        onOpen()
    }

    const handleCreateUser = () => {
        openModal("create", {} as IUser)
    }

    return (
        <>
            {modalContent && <CustomModal isOpen={isOpen} onOpenChange={onOpenChange} modalContent={modalContent} />}
            <TableUsers rows={data} openModal={openModal} handleOnCreateUser={handleCreateUser} />
        </>
    )
}