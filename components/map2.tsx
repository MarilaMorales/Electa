import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import io from 'socket.io-client';
import type { Socket as SocketType } from 'socket.io-client';

interface PartyBreakdown {
  name: string;
  count: number;
  percent: string;
}

interface LocationData {
  locationId: number;
  totalVotes: number;
  partyBreakdown: PartyBreakdown[];
  coords: [number, number];
  locationName: string;
}

const locationMap: Record<number, { locationName: string; coords: [number, number] }> = {
  1: { locationName: 'La Paz', coords: [-68.15, -16.5] },
  2: { locationName: 'Santa Cruz', coords: [-63.18, -17.78] },
  3: { locationName: 'Cochabamba', coords: [-66.16, -17.39] },
};

const Map2: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);

  const socket = useRef(io('http://localhost:4000')).current;

  useEffect(() => {
    const fetchAndRenderMap = async () => {
      try {
        const response = await fetch('/data/bol.json');
        if (!response.ok) throw new Error('Failed to load GeoJSON');
        const geoJson = await response.json();
        echarts.registerMap('bolivia', geoJson);

        if (chartRef.current) {
          chartInstance.current = echarts.init(chartRef.current);

          chartInstance.current.on('click', (params) => {
            console.log('Nombre:', params.name);
            console.log('source',params.source)

            if (typeof params.data === 'object' && params.data !== null) {
              const data = params.data as { id?: string; source?: string };
              console.log('data',data)
              console.log('ID:', data.id);
              console.log('Source:', data.source);

              if (data.id) {
                socket.emit('departmentClick', data.id);
              }
            } else {
              console.log('params.data no es un objeto, es:', params.data);
            }
          });

          const dataForMap = geoJson.features.map((feature: any) => ({
            name: feature.properties.name,
            value: 0,
            id: feature.properties.id,
            source: feature.properties.source,
          }));

          chartInstance.current.setOption({
            title: { text: 'Bolivia Votes Map', left: 'center' },
            tooltip: {
              trigger: 'item',
              position: 'right',
              backgroundColor: '#fff',
              borderColor: '#0d0d0d',
              formatter: (params: any) => {
                if (Array.isArray(params)) params = params[0];
                if (!params || typeof params.name !== 'string') return '';
                const loc = locations.find(l => l.locationName === params.name);
                if (!loc) return `${params.name}: ${(params as any).value ?? ''}`;
                let tooltip = `<b>${loc.locationName}</b><br/>Total Votes: ${loc.totalVotes}<br/><br/>Partidos:<br/>`;
                loc.partyBreakdown.forEach(p => {
                  tooltip += `${p.name}: ${p.count} votos (${p.percent}%)<br/>`;
                });
                return tooltip;
              },
              textStyle: { fontSize: 10 }
            },
            geo: {
              map: 'bolivia',
              data: dataForMap,
              roam: false,
              label: { show: false },
              itemStyle: {
                areaColor: '#e7e8ea',
                borderColor: '#111',
              },
            },
            series: [
              {
                name: 'Departments',
                type: 'map',
                map: 'bolivia',
                geoIndex: 0,
                emphasis: { label: { show: true } },
                data: [],
              },
              {
                name: 'Parties',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: [],
              },
            ]
          });

          const handleResize = () => {
            chartInstance.current?.resize();
          };

          window.addEventListener('resize', handleResize);

          return () => {
            window.removeEventListener('resize', handleResize);
            chartInstance.current?.dispose();
          };
        }
      } catch (error) {
        console.error('Error loading or rendering the map:', error);
      }
    };

    fetchAndRenderMap();
  }, []);

  useEffect(() => {
    socket.on('location', (data: Omit<LocationData, 'coords' | 'locationName'>) => {
      console.log('Datos recibidos del socket:', data);
      const mapping = locationMap[data.locationId];
      if (!mapping) return;

      const newLocation: LocationData = {
        ...data,
        coords: mapping.coords,
        locationName: mapping.locationName
      };

      setLocations(prev => {
        const filtered = prev.filter(l => l.locationId !== data.locationId);
        return [...filtered, newLocation];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption({
        series: [
          {
            name: 'Departments',
            type: 'map',
            map: 'bolivia',
            data: locations.map(loc => ({
              name: loc.locationName,
              value: loc.totalVotes,
            }))
          },
          {
            name: 'Parties',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: locations.flatMap(loc =>
              loc.partyBreakdown.map(p => ({
                name: p.name,
                value: [...loc.coords, p.count],
                symbolSize: 8
              }))
            )
          }
        ]
      });
    }
  }, [locations]);

  return (
    <div
      ref={chartRef}
      style={{
        height: '300px',
        width: '500px',
        border: '1px solid green',
        borderRadius: '8px',
        marginTop: '70px'
      }}
    />
  );
};

export default Map2;


