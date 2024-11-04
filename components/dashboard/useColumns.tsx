"use client";
import {
  Pencil,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { Button } from "../common/button";
import { Task } from "./schema";
import { ColumnDef } from "@tanstack/react-table";

interface ActionButtonProps {
  row: any;
}

export const useColumns = (onEdit: (id: string) => void, onDelete: (id: string) => void): ColumnDef<Task>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "_id",
      header: () => (
        <div className="flex space-x-2 px-2 w-12">
          <p className="text-[17px] text-gray-500">Index</p>
        </div>
      ),
      cell: ({ row }) => (
        <div className="items-center flex justify-center text-gray-500">
          # {row.id}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: () => (
        <div className="flex space-x-2 px-2">
          <p className="text-[17px] text-primary">Nume</p>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "lastname",
      header: () => (
        <div className="flex space-x-2 px-2">
          <p className="text-[17px] text-primary">Prenume</p>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.lastname}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: () => (
        <div className="flex justify-center space-x-2 px-2">
          <p className="text-[17px] text-primary">Tip Ecografie</p>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          {row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: () => (
        <div className="flex justify-center space-x-2 px-2">
          <p className="text-[17px] text-primary">Telefon</p>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          {row.original.phone}
        </div>
      ),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex space-x-2 justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-lg hover:bg-[#8C0DF0] hover:text-white text-red-500"
              onClick={() => onEdit(row.original._id)}
            >
              <Pencil />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-lg hover:bg-red-500 hover:text-white text-red-500"
              onClick={() => onDelete(row.original._id)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      },
  ];
