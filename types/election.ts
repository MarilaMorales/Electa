export interface PoliticalParty {
  id: string
  name: string
  abbreviation: string
  votes: number
  percentage: number
  color: string
  logo?: string
}

export interface BoliviaRegion {
  id: string
  name: string
  votes: number
  leadingParty: string
  coordinates: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
  location: string
}

export interface ElectionData {
  totalVotes: number
  parties: PoliticalParty[]
  regions: BoliviaRegion[]
  incidents: Incident[]
}
