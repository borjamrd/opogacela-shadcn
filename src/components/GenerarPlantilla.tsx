'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FileText, Printer } from 'lucide-react';
import type { Question } from './PreguntasClient';

// ─── Answer sheet ─────────────────────────────────────────────────────────────

function buildAnswerSheetPage(count: number): string {
    const NUM_COLS = 5;
    const perCol = Math.ceil(count / NUM_COLS);

    const bubble = `<span style="display:inline-block;width:10px;height:10px;border:1.5px solid #444;border-radius:50%;"></span>`;

    const colsHtml = Array.from({ length: NUM_COLS }, (_, colIdx) => {
        const start = colIdx * perCol;
        const end = Math.min(start + perCol, count);
        if (start >= count) return `<div style="flex:1;"></div>`;

        const rows = Array.from({ length: end - start }, (_, i) => {
            const num = start + i + 1;
            return `<tr>
        <td style="text-align:right;padding:1.5px 5px 1.5px 0;font-size:8px;color:#333;font-weight:500;">${num}</td>
        <td style="padding:1.5px 2px;text-align:center;">${bubble}</td>
        <td style="padding:1.5px 2px;text-align:center;">${bubble}</td>
        <td style="padding:1.5px 2px;text-align:center;">${bubble}</td>
        <td style="padding:1.5px 2px;text-align:center;">${bubble}</td>
      </tr>`;
        }).join('');

        return `<table style="border-collapse:collapse;font-size:8px;">
      <thead>
        <tr>
          <th style="width:18px;"></th>
          <th style="text-align:center;padding:0 4px 3px;font-size:8px;font-weight:bold;border-bottom:1px solid #bbb;">A</th>
          <th style="text-align:center;padding:0 4px 3px;font-size:8px;font-weight:bold;border-bottom:1px solid #bbb;">B</th>
          <th style="text-align:center;padding:0 4px 3px;font-size:8px;font-weight:bold;border-bottom:1px solid #bbb;">C</th>
          <th style="text-align:center;padding:0 4px 3px;font-size:8px;font-weight:bold;border-bottom:1px solid #bbb;">D</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
    }).join('');

    return `
<div style="page-break-before:always;font-family:Arial,sans-serif;padding:24px 28px;color:#111;">
  <div style="border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:14px;text-align:center;">
    <div style="font-size:11px;margin-top:3px;letter-spacing:3px;color:#333;">HOJA DE RESPUESTAS OPOGACELA</div>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:8px;">
    <div style="flex:4;">
      <div style="font-size:7.5px;color:#666;margin-bottom:2px;">Nombre y apellidos</div>
      <div style="border-bottom:1px solid #333;height:16px;"></div>
    </div>
    <div style="flex:1.5;">
      <div style="font-size:7.5px;color:#666;margin-bottom:2px;">DNI / NIE</div>
      <div style="border-bottom:1px solid #333;height:16px;"></div>
    </div>
    <div style="flex:1;">
      <div style="font-size:7.5px;color:#666;margin-bottom:2px;">Nº orden</div>
      <div style="border-bottom:1px solid #333;height:16px;"></div>
    </div>
    <div style="flex:1;">
      <div style="font-size:7.5px;color:#666;margin-bottom:2px;">Turno</div>
      <div style="border-bottom:1px solid #333;height:16px;"></div>
    </div>
    <div style="flex:1;">
      <div style="font-size:7.5px;color:#666;margin-bottom:2px;">Fecha</div>
      <div style="border-bottom:1px solid #333;height:16px;"></div>
    </div>
  </div>
  <p style="font-size:7.5px;color:#777;margin:10px 0 12px;">
    Utilice bolígrafo de tinta azul o negra. Rellene completamente el círculo que corresponda. Una única respuesta válida por pregunta.
  </p>
  <div style="display:flex;gap:16px;justify-content:space-between;">
    ${colsHtml}
  </div>
</div>`;
}

// ─── Questions HTML ────────────────────────────────────────────────────────────

interface BuildOpts {
    showAnswerSheet: boolean;
    showBloque: boolean;
    showExamen: boolean;
    showTema: boolean;
    showRespuestas: boolean;
    showExplicacion: boolean;
}

function buildFullHtml(qs: Question[], opts: BuildOpts): string {
    const { showAnswerSheet, showBloque, showExamen, showTema, showRespuestas, showExplicacion } = opts;

    const badgesHtml = (q: Question) => {
        const badges = [
            showBloque ? `<span class="badge">Bloque ${q.b + 1}</span>` : '',
            showTema ? `<span class="badge">Tema ${q.t + 1}</span>` : '',
            showExamen ? `<span class="badge">${q.e}</span>` : '',
        ]
            .filter(Boolean)
            .join('');
        return badges ? `<div class="badges">${badges}</div>` : '';
    };

    const answerItemHtml = (a: string, ai: number, correctIdx: number) => {
        const isCorrect = showRespuestas && ai === correctIdx;
        return `<li style="${isCorrect ? 'font-weight:600;color:#166534;' : ''}">
      <span class="bubble" style="${isCorrect ? 'background:#bbf7d0;border-color:#16a34a;' : ''}"></span>
      <span class="letter">${'ABCDE'[ai]})</span>
      <span>${a}</span>
    </li>`;
    };

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Plantilla de examen · Opogacela</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; margin: 24px; color: #111; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    .meta { font-size: 10px; color: #666; margin-bottom: 24px; }
    .question { margin-bottom: 20px; page-break-inside: avoid; }
    .question-header { display: flex; gap: 6px; align-items: baseline; margin-bottom: 4px; }
    .num { font-weight: bold; min-width: 20px; }
    .badges { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 4px; }
    .badge { font-size: 9px; background: #eee; border-radius: 4px; padding: 1px 5px; }
    .txt { margin-bottom: 6px; }
    .answers { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
    .answers li { display: flex; gap: 6px; align-items: flex-start; }
    .letter { font-weight: bold; min-width: 16px; }
    .bubble { width: 10px; height: 10px; border: 1px solid #333; border-radius: 50%; display: inline-block; margin-top: 2px; flex-shrink: 0; }
    .explicacion { margin-top: 6px; font-size: 10px; color: #555; background: #f5f5f4; border-left: 3px solid #a8a29e; padding: 4px 8px; border-radius: 2px; }
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
    </div>
    ${badgesHtml(q)}
    <p class="txt">${q.txt}</p>
    <ul class="answers">
      ${q.ans.map((a, ai) => answerItemHtml(a, ai, q.ok)).join('')}
    </ul>
    ${showExplicacion && q.fb ? `<div class="explicacion">${q.fb}</div>` : ''}
  </div>`
      )
      .join('')}
  ${showAnswerSheet ? buildAnswerSheetPage(qs.length) : ''}
</body>
</html>`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
    selectedIds: Set<string>;
    questions: Question[];
    randomCount?: number;
    label?: string;
}

type Phase = 'idle' | 'loading' | 'preview';

function CheckboxOption({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label htmlFor={id} className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
            />
            <span className="text-xs text-muted-foreground">{label}</span>
        </label>
    );
}

export default function GenerarPlantilla({ selectedIds, questions, randomCount, label }: Props) {
    const [phase, setPhase] = useState<Phase>('idle');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [showAnswerSheet, setShowAnswerSheet] = useState(false);
    const [showBloque, setShowBloque] = useState(true);
    const [showExamen, setShowExamen] = useState(true);
    const [showTema, setShowTema] = useState(false);
    const [showRespuestas, setShowRespuestas] = useState(false);
    const [showExplicacion, setShowExplicacion] = useState(false);

    const open = phase !== 'idle';

    const getQs = () => {
        if (randomCount) {
            const shuffled = [...questions].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, randomCount);
        }
        return questions.filter((q) => selectedIds.has(q.id));
    };

    const writeToIframe = (html: string) => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;
        doc.open();
        doc.write(html);
        doc.close();
    };

    const currentHtml = () =>
        buildFullHtml(getQs(), { showAnswerSheet, showBloque, showExamen, showTema, showRespuestas, showExplicacion });

    const handleGenerate = () => {
        setPhase('loading');
        setTimeout(() => setPhase('preview'), 1200);
    };

    // Write to iframe whenever preview is active and any option changes
    useEffect(() => {
        if (phase !== 'preview') return;
        writeToIframe(currentHtml());
    }, [phase, showAnswerSheet, showBloque, showExamen, showTema, showRespuestas, showExplicacion]);

    const handlePrint = () => {
        iframeRef.current?.contentWindow?.print();
    };

    const handleClose = () => {
        setPhase('idle');
    };

    return (
        <>
            <Button
                size="sm"
                className="rounded-full text-xs h-7 px-3 gap-1.5"
                onClick={handleGenerate}
                disabled={!randomCount && selectedIds.size === 0}
            >
                <FileText className="h-3 w-3" />
                {label ?? `Generar examen personalizado (${selectedIds.size})`}
            </Button>

            <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
                <DialogContent
                    className={
                        phase === 'preview'
                            ? 'max-w-3xl w-full h-[85vh] flex flex-col p-0 gap-0'
                            : 'max-w-3xl w-full h-[35vh] flex flex-col p-0 gap-0'
                    }
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
                                className="h-40 w-40 rounded-xl object-cover flex-shrink-0"
                            />
                            <p className="text- text-muted-foreground leading-relaxed">
                                Generando tu plantilla de examen, paciencia po favo 🐢
                            </p>
                        </div>
                    )}

                    {phase === 'preview' && (
                        <>
                            {/* Options bar */}
                            <div className="flex items-center gap-4 px-5 py-2.5 border-b bg-muted/40 flex-shrink-0 flex-wrap">
                                <CheckboxOption
                                    id="opt-answer-sheet"
                                    label="Plantilla para responder"
                                    checked={showAnswerSheet}
                                    onChange={setShowAnswerSheet}
                                />
                                <CheckboxOption
                                    id="opt-bloque"
                                    label="Mostrar bloque"
                                    checked={showBloque}
                                    onChange={setShowBloque}
                                />
                                <CheckboxOption
                                    id="opt-examen"
                                    label="Mostrar examen"
                                    checked={showExamen}
                                    onChange={setShowExamen}
                                />
                                <CheckboxOption
                                    id="opt-tema"
                                    label="Mostrar tema"
                                    checked={showTema}
                                    onChange={setShowTema}
                                />
                                <CheckboxOption
                                    id="opt-respuestas"
                                    label="Mostrar respuestas"
                                    checked={showRespuestas}
                                    onChange={setShowRespuestas}
                                />
                                <CheckboxOption
                                    id="opt-explicacion"
                                    label="Mostrar explicación"
                                    checked={showExplicacion}
                                    onChange={setShowExplicacion}
                                />
                            </div>

                            {/* Preview iframe */}
                            <div className="flex-1 min-h-0">
                                <iframe
                                    ref={iframeRef}
                                    className="w-full h-full border-0"
                                    title="Vista previa plantilla"
                                />
                            </div>

                            {/* Footer */}
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
