import Link from "next/link"
import { Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardStats from "@/components/admin/dashboard-stats"

export default function AdminDashboard() {
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#29ED00]">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage Securinets ENIT registrations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/registrations">
            <Button className="bg-[#C400ED] hover:bg-[#C400ED]/80">
              <Users className="mr-2 h-4 w-4" />
              View All Registrations
            </Button>
          </Link>
        </div>
      </div>

      <DashboardStats />


      <div className="mt-8 flex justify-end">
        <Link href="/admin/export">
          <Button variant="outline" className="border-[#29ED00] text-[#29ED00] hover:bg-[#29ED00]/10">
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
        </Link>
      </div>
    </div>
  )
}
