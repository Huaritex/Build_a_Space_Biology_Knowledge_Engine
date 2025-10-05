import React from 'react';

const VisualizationPanel = ({ synthesisResult = '', isLoading = false }) => {
  return (
    <div className="h-full flex flex-col bg-transparent p-4 text-foreground">
      <div className="pb-3 mb-4">
        <h2 className="text-2xl font-bold text-center">Resumen Ejecutivo</h2>
      </div>
      <div className="flex-1 overflow-auto bg-secondary border border-input rounded p-6 shadow">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Preparando síntesis con TESS…</span>
            </div>
            <div className="w-2/3 max-w-xl mt-2 space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded animate-pulse" style={{width:'85%'}}></div>
              <div className="h-3 bg-muted rounded animate-pulse" style={{width:'70%'}}></div>
            </div>
          </div>
        ) : synthesisResult ? (
          <div className="prose prose-invert max-w-none text-base leading-7 whitespace-pre-wrap">{synthesisResult}</div>
        ) : (
          <div className="relative h-full select-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center" style={{opacity: 0.15}}>
                <div className="text-3xl font-extrabold tracking-wide">Esperando tus ganas de aprender</div>
                <div className="mt-2 text-sm">Selecciona uno o más papers y genera un resumen ejecutivo con TESS.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;
