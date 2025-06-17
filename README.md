# 🇧🇴 Bolivia Election Dashboard

Un dashboard en tiempo real para monitorear las elecciones presidenciales de Bolivia, construido con Next.js, TypeScript y Socket.IO.

## 🚀 Características

### 📊 **Visualización en Tiempo Real**
- **Contador central** de votos totales con actualizaciones en vivo
- **Gráfico de barras** interactivo mostrando distribución de votos por partido
- **Mapa de Bolivia** con datos por departamento
- **Lista de partidos políticos** con estadísticas detalladas

### 🎯 **Funcionalidades Principales**
- **Actualizaciones automáticas** cada 5 segundos via WebSocket
- **Modal de candidatos** con información biográfica completa
- **Descarga de datos** en formato Excel
- **Diseño responsive** para desktop y móvil
- **Tema oscuro** profesional y elegante

### 🔧 **Tecnologías Utilizadas**
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Gráficos**: ECharts para visualizaciones interactivas
- **Comunicación**: Socket.IO para actualizaciones en tiempo real
- **UI Components**: Shadcn/ui para componentes elegantes
- **Backend**: Node.js con Socket.IO (separado)

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm
- Backend Socket.IO corriendo en puerto 4000

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd bolivia-election-dashboard
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Crear .env.local (opcional)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
pnpm dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
bolivia-election-dashboard/
├── app/                    # App Router de Next.js
├── components/             # Componentes React
│   ├── ui/                # Componentes de UI (Shadcn)
│   ├── BarChart.tsx       # Gráfico de barras con ECharts
│   ├── CandidateModal.tsx # Modal de información de candidatos
│   ├── CentralNumberDisplay.tsx # Contador central de votos
│   ├── map2.tsx           # Mapa interactivo de Bolivia
│   └── PoliticalParties.tsx # Lista de partidos políticos
├── lib/                   # Utilidades y configuración
│   └── socket.ts          # Configuración de Socket.IO
├── public/                # Archivos estáticos
│   ├── data/              # Datos mock y GeoJSON
│   └── img/               # Imágenes de candidatos
├── types/                 # Definiciones de TypeScript
└── styles/                # Estilos globales
```

## 🔌 Configuración del Backend

El dashboard requiere un servidor Socket.IO corriendo en `http://localhost:4000` que emita los siguientes eventos:

### Eventos Emitidos por el Backend
- `global vote summary` - Resumen global de votos
- `new votes inserted` - Nuevos votos insertados
- `location update` - Actualización de ubicación
- `location vote summary` - Resumen de votos por ubicación
- `all locations summary` - Resumen de todas las ubicaciones

### Estructura de Datos Esperada
```typescript
interface VoteSummary {
  totalVotes: number;
  partyBreakdown: Array<{
    name: string;
    count: number;
    percent: number;
  }>;
}
```

## 🎨 Componentes Principales

### CentralNumberDisplay
Contador central que muestra el total de votos con actualizaciones en tiempo real.

### BarChart
Gráfico de barras horizontal que visualiza la distribución de votos por partido político.

### CandidateModal
Modal elegante que muestra información detallada de cada candidato:
- Foto del candidato
- Información del partido
- Estadísticas de votos
- Biografía completa
- Enlace al sitio web del partido

### PoliticalParties
Lista de partidos políticos con:
- Imagen del candidato
- Nombre y abreviatura del partido
- Porcentaje de votos
- Barra de progreso visual

## 🚀 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en modo producción
npm run lint         # Ejecutar linter
```

## 📱 Responsive Design

El dashboard está completamente optimizado para:
- **Desktop**: Layout completo con todas las funcionalidades
- **Tablet**: Adaptación automática del grid
- **Mobile**: Stack vertical de componentes

## 🔧 Personalización

### Modificar Datos de Candidatos
Los datos de los candidatos se encuentran en `public/data/mockData.ts`:
```typescript
export const mockElectionData: ElectionData = {
  parties: [
    {
      name: "Nombre del Partido",
      candidate: {
        name: "Nombre del Candidato",
        bio: "Biografía del candidato...",
        photo: "/img/foto-candidato.png",
        partyWebsite: "https://sitio-web-partido.com"
      }
    }
  ]
}
```

### Cambiar Colores de Partidos
Los colores de los partidos se definen en la propiedad `color` de cada partido en `mockData.ts`.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [ECharts](https://echarts.apache.org/) por las visualizaciones
- [Socket.IO](https://socket.io/) por la comunicación en tiempo real
- [Shadcn/ui](https://ui.shadcn.com/) por los componentes de UI

---

**🇧🇴 Desarrollado con ❤️ para las elecciones de Bolivia** 