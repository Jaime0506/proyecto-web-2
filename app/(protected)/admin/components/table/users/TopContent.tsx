'use client'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, SharedSelection } from "@heroui/react";
import { Search } from "lucide-react";

import type { Dispatch, SetStateAction } from "react";

interface TopContentProps {
    lenght?: number;
    setRowsPerPage: Dispatch<SetStateAction<number>>;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    setStatusFilter: Dispatch<SetStateAction<string[]>>;
    statusFilter: string[]; // Agregar el estado actual del filtro de estado
    handleOnCreateUser: () => void;
}

export default function TopContent({
    lenght,
    setRowsPerPage,
    setSearchTerm,
    setStatusFilter,
    statusFilter, // Recibir el estado actual del filtro de estado
    handleOnCreateUser
}: TopContentProps) {
    const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setRowsPerPage(Number(value));
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const onStatusFilterChange = (keys: SharedSelection) => {
        setStatusFilter(Array.from(keys) as string[]);
    };

    return (
        <main className="flex flex-col gap-2">
            <section className="flex flex-row items-center gap-4">
                <Input
                    placeholder="Buscar por el nombre o apellido"
                    radius="sm"
                    startContent={<Search size={16} />}
                    onChange={onSearchChange}
                />

                <Dropdown>
                    <DropdownTrigger>
                        <Button>Estado</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        selectionMode="multiple" // Permitir selección múltiple
                        selectedKeys={new Set(statusFilter)} // Mostrar los elementos seleccionados
                        onSelectionChange={onStatusFilterChange}
                    >
                        <DropdownItem key="Activo">Activo</DropdownItem>
                        <DropdownItem key="Inactivo">Inactivo</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Button color="primary" radius="sm" onPress={handleOnCreateUser}>
                    Crear usuario
                </Button>
            </section>

            <section className="flex justify-between flex-row text-sm text-default-500">
                <span>Total {lenght} usuarios</span>

                <label>
                    Usuarios por página:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </section>
        </main>
    );
}