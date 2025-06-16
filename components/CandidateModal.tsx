import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  name: string;
  party: string;
  votes: number;
  percentage: number;
  imageUrl?: string;
  bio?: string;
  age?: number;
  experience?: string;
}

interface CandidateModalProps {
  candidate: Candidate;
  children: React.ReactNode;
}

export function CandidateModal({ candidate, children }: CandidateModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {candidate.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg text-white">Información del Candidato</CardTitle>
              <CardDescription className="text-slate-300">
                {candidate.party}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {candidate.imageUrl && (
                  <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-300">Votos:</div>
                  <div className="text-white font-semibold">{candidate.votes.toLocaleString()}</div>
                  
                  <div className="text-slate-300">Porcentaje:</div>
                  <div className="text-white font-semibold">{candidate.percentage.toFixed(2)}%</div>
                  
                  {candidate.age && (
                    <>
                      <div className="text-slate-300">Edad:</div>
                      <div className="text-white font-semibold">{candidate.age} años</div>
                    </>
                  )}
                </div>
                {candidate.bio && (
                  <div className="mt-4">
                    <div className="text-slate-300 mb-2">Biografía:</div>
                    <p className="text-white text-sm">{candidate.bio}</p>
                  </div>
                )}
                {candidate.experience && (
                  <div className="mt-4">
                    <div className="text-slate-300 mb-2">Experiencia:</div>
                    <p className="text-white text-sm">{candidate.experience}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                Candidato Activo
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 