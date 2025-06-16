import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getSocket } from '../lib/socket';
import DownloadExcel from '@/components/dwdata'

interface PartyData {
  name: string;
  count: number;
  percent: number;
}

interface VoteSummary {
  totalVotes: number;
  partyBreakdown: PartyData[];
}

interface BarChartProps {
  active: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ active }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [voteSummary, setVoteSummary] = useState<VoteSummary | null>(null);

  useEffect(() => {
    if (active && chartInstance.current) {
      chartInstance.current.resize();
    }
  }, [active]);

  useEffect(() => {
    console.log('🔄 [BarChart] Iniciando conexión socket...');
    const socket = getSocket();
    
    socket.on('connect', () => {
      console.log('🟢 [BarChart] Socket conectado, ID:', socket.id);
      console.log('📤 [BarChart] Solicitando resumen global...');
      socket.emit('get-global-summary');
    });

    socket.on('global vote summary', (data: VoteSummary) => {
      console.log('📥 [BarChart] Datos recibidos del servidor:', {
        totalVotes: data.totalVotes,
        partyBreakdown: data.partyBreakdown,
        timestamp: new Date().toISOString()
      });
      if (data && data.partyBreakdown) {
        console.log('✅ [BarChart] Actualizando voteSummary con datos válidos');
        setVoteSummary(data);
      } else {
        console.warn('⚠️ [BarChart] Datos recibidos inválidos:', data);
      }
    });

    socket.on('connect_error', (error: Error) => {
      console.error('❌ [BarChart] Error de conexión:', error.message);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('🔴 [BarChart] Socket desconectado. Razón:', reason);
    });

    // Solicitar datos iniciales si ya estamos conectados
    if (socket.connected) {
      console.log('📤 [BarChart] Socket ya conectado, solicitando datos iniciales...');
      socket.emit('get-global-summary');
    }

    // Solicitar datos cada 5 segundos si estamos conectados
    const interval = setInterval(() => {
      if (socket.connected) {
        console.log('🔄 [BarChart] Solicitando actualización periódica...');
        socket.emit('get-global-summary');
      }
    }, 5000);

    return () => {
      console.log('🧹 [BarChart] Limpiando conexión socket...');
      clearInterval(interval);
      socket.off('global vote summary');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  useEffect(() => {
    console.log('🔄 [BarChart] Estado de votos actualizado:', voteSummary ? {
      totalVotes: voteSummary.totalVotes,
      numberOfParties: voteSummary.partyBreakdown.length,
      timestamp: new Date().toISOString()
    } : 'null');
    
    if (voteSummary) {
      console.log('📊 [BarChart] Datos disponibles para el botón de descarga:', voteSummary.partyBreakdown);
    }
  }, [voteSummary]);

  useEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current!);
      } else {
        chartInstance.current.resize();
      }
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!voteSummary) return;
    if (!chartInstance.current) return;
    const data = voteSummary.partyBreakdown.map(p => p.count);
    const names = voteSummary.partyBreakdown.map(p => p.name);

    const option: echarts.EChartsOption = {
      xAxis: { max: voteSummary.totalVotes },
      yAxis: {
        type: 'category',
        data: names,
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: names.length
      },
      grid: {
        containLabel: true,
        bottom: 20,
      },
      series: [
        {
          realtimeSort: true,
          name: 'Votes',
          type: 'bar',
          data: data,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }
      ],
      legend: { show: true },
      animationDuration: 0,
      animationDurationUpdate: 3000,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear'
    };

    chartInstance.current.setOption(option);
  }, [voteSummary]);

  console.log('Renderizando BarChart, voteSummary:', voteSummary);

  return (
    <div style={{
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '5px',
      border: '1px solid purple',
      borderRadius: '8px',
      backgroundColor: '#fff',
      verticalAlign: 'center',
      marginLeft: '0px'
    }}>
      {voteSummary && (
        <div>
          <DownloadExcel data={voteSummary.partyBreakdown} />
        </div>
      )}
      <div
        ref={chartRef}
        style={{
          width: '400px',
          height: '300px',
          border: '1px solid pink',
          borderRadius: '10px',
          backgroundColor: '#fff',
          padding: '2px',
          marginTop: '1rem',
          marginBottom: '1rem',
          contain: 'layout',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default BarChart; 