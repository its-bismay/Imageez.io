"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

const Dashboard = () => {

    const data = useQuery(api.projects.getUserProjects);

    console.log(data)
  return (
    <div>Dashboard</div>
  )
}
export default Dashboard