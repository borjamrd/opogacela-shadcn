'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FileText, Printer } from 'lucide-react';
import type { Question } from './PreguntasClient';

function buildHtml(qs: Question[]): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Plantilla de examen</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; margin: 24px; color: #111; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    .meta { font-size: 10px; color: #666; margin-bottom: 24px; }
    .question { margin-bottom: 20px; page-break-inside: avoid; }
    .question-header { display: flex; gap: 6px; align-items: baseline; margin-bottom: 4px; }
    .num { font-weight: bold; min-width: 20px; }
    .badge { font-size: 9px; background: #eee; border-radius: 4px; padding: 1px 5px; }
    .txt { margin-bottom: 6px; }
    .answers { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
    .answers li { display: flex; gap: 6px; align-items: flex-start; }
    .letter { font-weight: bold; min-width: 16px; }
    .bubble { width: 10px; height: 10px; border: 1px solid #333; border-radius: 50%; display: inline-block; margin-top: 2px; flex-shrink: 0; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <h1>Plantilla de examen</h1>
  <p class="meta">${qs.length} pregunta${qs.length !== 1 ? 's' : ''} · Opogacela</p>
  ${qs
      .map(
          (q, i) => `
  <div class="question">
    <div class="question-header">
      <span class="num">${i + 1}.</span>
      <span class="badge">Bloque ${q.b} · Tema ${q.t}</span>
      <span class="badge">${q.e}</span>
    </div>
    <p class="txt">${q.txt}</p>
    <ul class="answers">
      ${q.ans
          .map(
              (a, ai) =>
                  `<li><span class="bubble"></span><span class="letter">${'ABCDE'[ai]})</span><span>${a}</span></li>`
          )
          .join('')}
    </ul>
  </div>`
      )
      .join('')}
</body>
</html>`;
}

interface Props {
    selectedIds: Set<string>;
    questions: Question[];
}

type Phase = 'idle' | 'loading' | 'preview';

export default function GenerarPlantilla({ selectedIds, questions }: Props) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [html, setHtml] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const open = phase !== 'idle';

    const handleGenerate = () => {
        setPhase('loading');
        const qs = questions.filter((q) => selectedIds.has(q.id));
        setTimeout(() => {
            setHtml(buildHtml(qs));
            setPhase('preview');
        }, 1200);
    };

    // Write html into iframe once preview is ready
    useEffect(() => {
        if (phase !== 'preview' || !iframeRef.current) return;
        const doc = iframeRef.current.contentDocument;
        if (!doc) return;
        doc.open();
        doc.write(html);
        doc.close();
    }, [phase, html]);

    const handlePrint = () => {
        iframeRef.current?.contentWindow?.print();
    };

    const handleClose = () => {
        setPhase('idle');
        setHtml('');
    };

    return (
        <>
            <Button
                size="sm"
                className="rounded-full text-xs h-7 px-3 gap-1.5"
                onClick={handleGenerate}
                disabled={selectedIds.size === 0}
            >
                <FileText className="h-3 w-3" />
                Generar plantilla ({selectedIds.size})
            </Button>

            <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
                <DialogContent
                    className="max-w-3xl w-full h-[85vh] flex flex-col p-0 gap-0"
                    onInteractOutside={(e) => phase === 'loading' && e.preventDefault()}
                >
                    <DialogHeader className="px-5 py-4 border-b flex-shrink-0">
                        <DialogTitle>
                            {phase === 'loading' ? 'Preparando plantilla…' : 'Vista previa'}
                        </DialogTitle>
                    </DialogHeader>

                    {phase === 'loading' && (
                        <div className="flex items-center gap-5 p-6 flex-1">
                            <img
                                src="/wait.gif"
                                alt="Espera"
                                className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                            />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Generando tu plantilla de examen, paciencia po favo 🐢
                            </p>
                        </div>
                    )}

                    {phase === 'preview' && (
                        <>
                            <div className="flex-1 min-h-0">
                                <iframe
                                    ref={iframeRef}
                                    className="w-full h-full border-0"
                                    title="Vista previa plantilla"
                                />
                            </div>
                            <div className="flex justify-end gap-2 px-5 py-3 border-t flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button size="sm" onClick={handlePrint} className="gap-1.5">
                                    <Printer className="h-3.5 w-3.5" />
                                    Imprimir / Guardar PDF
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
