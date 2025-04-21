"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ExportData from "@/components/admin/export-data"
import Link from "next/link"

export default function ExportPage() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <Link href="/admin">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#29ED00]">Export Data</h1>
          <p className="text-gray-400 mt-1">Export registration data for analysis</p>
        </div>
      </div>

      <ExportData />
    </div>
  )
}
