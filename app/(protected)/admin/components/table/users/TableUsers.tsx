'use client'
import { useMemo, useState } from "react";

import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { renderCell } from "./renderCell";


import TopContent from "./TopContent";
import BotContent from "./BotContent";

import { columnsUser } from "@/utils/tables/users/columnsUser";
import type { IUser } from "@/types/auth";
import { KeyOpenModal } from "@/utils/tables/keyOpenModal";

interface TableUsersProps {
    rows: IUser[];
    openModal: (key: KeyOpenModal, user: IUser) => void;
    handleOnCreateUser: () => void;
}

export default function TableUsers({ rows, openModal, handleOnCreateUser }: TableUsersProps) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>(["Activo", "Inactivo"]);

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const matchesSearch =
                row.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter.length === 0 || statusFilter.includes(row.status ? "Activo" : "Inactivo");

            return matchesSearch && matchesStatus;
        });
    }, [rows, searchTerm, statusFilter]);

    const pages = useMemo(() => {
        return Math.ceil(filteredRows.length / rowsPerPage);
    }, [filteredRows.length, rowsPerPage]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = page * rowsPerPage;

        return filteredRows.slice(start, end);
    }, [page, filteredRows, rowsPerPage]);

    return (
        <Table
            isHeaderSticky
            aria-labelledby="table-users"
            topContent={
                <TopContent
                    handleOnCreateUser={handleOnCreateUser}
                    lenght={filteredRows.length}
                    setRowsPerPage={setRowsPerPage}
                    setSearchTerm={setSearchTerm}
                    setStatusFilter={setStatusFilter}
                    statusFilter={statusFilter}
                />
            }
            topContentPlacement="outside"
            bottomContent={<BotContent setPage={setPage} pages={pages} page={page} />}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
        >
            <TableHeader columns={columnsUser}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={"No hay usuarios"} items={items}>
                {(item) => (
                    <TableRow key={item.national_id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey as string, openModal)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}