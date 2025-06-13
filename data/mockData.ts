import type { ElectionData } from "../types/election"

export const mockElectionData: ElectionData = {
  totalVotes: 2847593,
  parties: [
    {
      id: "1",
      name: "Movimiento al Socialismo",
      abbreviation: "MAS-IPSP",
      votes: 1423796,
      percentage: 50.02,
      color: "#1E40AF",
      candidate: {
        name: "Eduardo del Castillo",
        photo: "/img/EduardoCastillo.MAS-IPSP.png",
        bio: "Abogado de 46 años, actualmente ministro de Gobierno de Bolivia. Ha ocupado varios cargos en el gobierno del MAS y es considerado cercano tanto a Evo Morales como a Luis Arce. Fue designado como candidato presidencial del MAS tras la inhabilitación de Morales y la decisión de Arce de no buscar la reelección.",
        partyWebsite: "https://mas-ipsp.org.bo"
      }
    },
    {
      id: "2",
      name: "Alianza LIBRE-Libertad y Democracia",
      abbreviation: "LIBRE",
      votes: 854277,
      percentage: 30.01,
      color: "#DC2626",
      candidate: {
        name: "Jorge 'Tuto' Quiroga",
        photo: "/img/JorgeTutoQuiroga.AlianzaLIBRE.png",
        bio: "Ingeniero industrial y político veterano de 64 años que ya fue presidente de Bolivia entre 2001-2002, completando el mandato de Hugo Banzer tras su renuncia por enfermedad. Es considerado un político de centro-derecha con experiencia internacional y ha sido una figura constante en la política boliviana durante las últimas décadas.",
        partyWebsite: "https://libre.org.bo"
      }
    },
    {
      id: "3",
      name: "Bloque de Unidad",
      abbreviation: "UNIDAD",
      votes: 426414,
      percentage: 14.98,
      color: "#059669",
      candidate: {
        name: "Samuel Doria Medina",
        photo: "/img/SamuelDoriaMedina.BloqueDeUnidad.png",
        bio: "Empresario y político de 65 años, fundador del partido Unidad Nacional. Lidera las encuestas con 19.1% de intención de voto. Ha sido candidato presidencial en varias ocasiones anteriores y es conocido por su perfil empresarial y sus propuestas de modernización económica del país.",
        partyWebsite: "https://unidad.org.bo"
      }
    },
    {
      id: "4",
      name: "Alianza APB Súmate",
      abbreviation: "APB",
      votes: 85552,
      percentage: 3.01,
      color: "#7C3AED",
      candidate: {
        name: "Manfred Reyes Villa",
        photo: "/img/ManfredReyesVilla.AlianzaABPSumate.png",
        bio: "Exmilitar y político de 72 años, exalcalde de Cochabamba. Ha tenido una carrera política controversial, incluyendo períodos en el exilio. Es conocido por su estilo populista y su base de apoyo en la región de Cochabamba.",
        partyWebsite: "https://apb.org.bo"
      }
    },
    {
      id: "5",
      name: "Movimiento Sin Miedo",
      abbreviation: "MSM",
      votes: 42380,
      percentage: 1.49,
      color: "#EA580C",
      candidate: {
        name: "Eva Copa",
        photo: "/img/EvaCopa.Morena.png",
        bio: "Política de 39 años, expresidenta del Senado boliviano y exdirigente sindical. Proviene del movimiento sindical y fue una figura importante durante los conflictos políticos de 2019. Representa una opción política que busca diferenciarse tanto del MAS como de la oposición tradicional.",
        partyWebsite: "https://msm.org.bo"
      }
    },
    {
      id: "6",
      name: "Alianza Popular",
      abbreviation: "AP",
      votes: 14238,
      percentage: 0.5,
      color: "#0891B2",
      candidate: {
        name: "Andrónico Rodríguez",
        photo: "/img/AndrónicoRodríguez.AlianzaPopular.png",
        bio: "Dirigente sindical cocalero de 34 años, actualmente presidente del Senado. Es considerado muy cercano a Evo Morales y representa el ala más radical del movimiento cocalero. Su candidatura refleja las divisiones internas dentro del movimiento masista.",
        partyWebsite: "https://alianzapopular.org.bo"
      }
    },
    {
      id: "7",
      name: "Partido Demócrata Cristiano",
      abbreviation: "PDC",
      votes: 0,
      percentage: 0,
      color: "#065F46",
      candidate: {
        name: "Rodrigo Paz Pereira",
        photo: "/img/RodrigoPazPereira.PDC.png",
        bio: "Senador tarijeño de 55 años y exalcalde, líder del Partido Demócrata Cristiano. Aboga por una izquierda moderada y un enfoque en política social y regional.",
        partyWebsite: "https://pdc.org.bo"
      }
    },
    {
      id: "8",
      name: "Nueva Generación Patriótica",
      abbreviation: "NGP",
      votes: 0,
      percentage: 0,
      color: "#F43F5E",
      candidate: {
        name: "Jaime Dunn De Ávila",
        photo: "/img/JaimeDunn.NGP.png",
        bio: "Analista financiero de 57 años, con formación MBA y experiencia internacional. Candidato presidencial del partido emergente NGP.",
        partyWebsite: "https://ngp.org.bo"
      }
    },
    {
      id: "9",
      name: "Alianza Fuerza del Pueblo",
      abbreviation: "FP",
      votes: 0,
      percentage: 0,
      color: "#B91C1C",
      candidate: {
        name: "Jhonny Fernández",
        photo: "/img/JhonnyFernandez.FP.png",
        bio: "Actual alcalde de Santa Cruz de la Sierra, 61 años, candidato por la Alianza Fuerza del Pueblo. Presenta un perfil conservador con fuerte apoyo regional.",
        partyWebsite: "https://fuersadelpueblo.bo"
      }
    },
    {
      id: "10",
      name: "Alianza Libertad y Progreso ADN",
      abbreviation: "LYP-ADN",
      votes: 0,
      percentage: 0,
      color: "#DC2626",
      candidate: {
        name: "Pavel Aracena",
        photo: "/img/PavelAracena.LYP-ADN.png",
        bio: "Ingeniero militar de 48 años, candidato por la alianza LYP‑ADN (Libertad y Progreso). Representa una opción de derecha nacionalista.",
        partyWebsite: "https://adn.org.bo"
      }
    }
  ],
  regions: [
    {
      id: "la-paz",
      name: "La Paz",
      votes: 456789,
      leadingParty: "MAS",
      coordinates: "M150,120 L180,140 L170,180 L140,170 Z",
    },
    {
      id: "cochabamba",
      name: "Cochabamba",
      votes: 298456,
      leadingParty: "MAS",
      coordinates: "M180,180 L220,190 L210,220 L180,210 Z",
    },
    {
      id: "santa-cruz",
      name: "Santa Cruz",
      votes: 567234,
      leadingParty: "MTS",
      coordinates: "M220,190 L280,200 L270,250 L220,240 Z",
    },
    {
      id: "oruro",
      name: "Oruro",
      votes: 187654,
      leadingParty: "MAS",
      coordinates: "M140,170 L170,180 L160,210 L130,200 Z",
    },
    {
      id: "potosi",
      name: "Potosí",
      votes: 234567,
      leadingParty: "Unity Block",
      coordinates: "M160,210 L190,220 L180,260 L150,250 Z",
    },
    {
      id: "tarija",
      name: "Tarija",
      votes: 145678,
      leadingParty: "MTS",
      coordinates: "M180,260 L210,270 L200,300 L170,290 Z",
    },
    {
      id: "chuquisaca",
      name: "Chuquisaca",
      votes: 198765,
      leadingParty: "MAS",
      coordinates: "M190,220 L230,230 L220,270 L190,260 Z",
    },
    {
      id: "beni",
      name: "Beni",
      votes: 123456,
      leadingParty: "MTS",
      coordinates: "M220,140 L270,150 L260,190 L220,180 Z",
    },
    {
      id: "pando",
      name: "Pando",
      votes: 87654,
      leadingParty: "MAS",
      coordinates: "M220,100 L260,110 L250,140 L220,130 Z",
    },
  ],
  incidents: [
    {
      id: "1",
      title: "Polling Station Delay",
      description: "Delayed opening at Station 247 in La Paz due to technical issues",
      severity: "medium",
      timestamp: "2024-01-15T08:30:00Z",
      location: "La Paz",
    },
    {
      id: "2",
      title: "Minor Disturbance",
      description: "Small crowd gathering reported near voting center in Santa Cruz",
      severity: "low",
      timestamp: "2024-01-15T10:15:00Z",
      location: "Santa Cruz",
    },
    {
      id: "3",
      title: "Equipment Malfunction",
      description: "Voting machine malfunction reported in Cochabamba district",
      severity: "high",
      timestamp: "2024-01-15T11:45:00Z",
      location: "Cochabamba",
    },
  ],
}
