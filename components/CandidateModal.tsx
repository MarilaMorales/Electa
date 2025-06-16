import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { PoliticalParty } from "../types/election";

interface CandidateModalProps {
  candidate: PoliticalParty;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateModal({ candidate, isOpen, onClose }: CandidateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[500px] bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center">
            {candidate.candidate.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 py-4">
          {/* Columna izquierda - Foto y datos principales */}
          <div className="flex flex-col items-center md:w-1/3 space-y-4">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-lg">
              <img
                src={candidate.candidate.photo}
                alt={candidate.candidate.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-blue-300">{candidate.name}</h3>
              <p className="text-sm text-slate-400">{candidate.abbreviation}</p>
              
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{candidate.votes.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Votos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{candidate.percentage.toFixed(2)}%</div>
                  <div className="text-xs text-slate-400">Porcentaje</div>
                </div>
              </div>
              
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                Candidato Activo
              </Badge>
            </div>
          </div>
          
          {/* Columna derecha - Biografía y botón */}
          <div className="md:w-2/3 space-y-4">
            {/* Biografía */}
            {candidate.candidate.bio && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-white">Biografía</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="max-h-40 overflow-y-auto pr-2">
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {candidate.candidate.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Botón del sitio web */}
            {candidate.candidate.partyWebsite && (
              <div className="flex justify-center md:justify-start">
                <Button
                  onClick={() => window.open(candidate.candidate.partyWebsite, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
                >
                  <ExternalLink size={14} />
                  <span>Visitar Sitio Web</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 