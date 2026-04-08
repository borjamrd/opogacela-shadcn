'use client';

import { useState, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { temasData } from '@/lib/temas';

export interface Question {
    id: string;
    b: number;
    t: number;
    e: string;
    txt: string;
    ans: string[];
    ok: number;
    fb: string | null;
}

const ANSWER_LETTERS = ['A', 'B', 'C', 'D', 'E'];

function getBloqueLabel(b: number): string {
    return temasData[b]?.title ?? `Bloque ${b + 1}`;
}

function getTopicLabel(b: number, t: number): string {
    return temasData[b]?.topics[t] ?? `Tema ${t + 1}`;
}

export default function PreguntasClient({ questions }: { questions: Question[] }) {
    const [search, setSearch] = useState('');
    const [bloqueFilter, setBloqueFilter] = useState('');
    const [temaFilter, setTemaFilter] = useState('');
    const [examenFilter, setExamenFilter] = useState('');
    const [selected, setSelected] = useState<Question | null>(null);

    const parentRef = useRef<HTMLDivElement>(null);

    const hasFilters =
        search !== '' || bloqueFilter !== '' || temaFilter !== '' || examenFilter !== '';

    const resetFilters = () => {
        setSearch('');
        setBloqueFilter('');
        setTemaFilter('');
        setExamenFilter('');
    };

    const handleBloqueChange = (value: string) => {
        setBloqueFilter(value);
        setTemaFilter(''); // reset tema al cambiar bloque
    };

    const bloques = useMemo(
        () => Array.from(new Set(questions.map((q) => q.b))).sort((a, b) => a - b),
        [questions]
    );

    // Temas disponibles según el bloque seleccionado (y examen si aplica)
    const temasDisponibles = useMemo(() => {
        if (bloqueFilter === '') return [];
        const blockIndex = Number(bloqueFilter);
        const uniqueTs = Array.from(
            new Set(
                questions
                    .filter(
                        (q) => q.b === blockIndex && (examenFilter === '' || q.e === examenFilter)
                    )
                    .map((q) => q.t)
            )
        ).sort((a, b) => a - b);
        return uniqueTs.map((t) => ({
            value: t,
            label: getTopicLabel(blockIndex, t),
        }));
    }, [questions, bloqueFilter, examenFilter]);

    const examenes = useMemo(
        () => Array.from(new Set(questions.map((q) => q.e))).sort(),
        [questions]
    );

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        return questions.filter((q) => {
            if (bloqueFilter !== '' && q.b !== Number(bloqueFilter)) return false;
            if (temaFilter !== '' && q.t !== Number(temaFilter)) return false;
            if (examenFilter !== '' && q.e !== examenFilter) return false;
            if (term && !q.txt.toLowerCase().includes(term)) return false;
            return true;
        });
    }, [questions, search, bloqueFilter, temaFilter, examenFilter]);

    const virtualizer = useVirtualizer({
        count: filtered.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 145,
        overscan: 5,
    });

    return (
        <div
            className="max-w-screen-xl mx-auto px-4 flex flex-col"
            style={{ height: 'calc(100vh - 56px)' }}
        >
            {/* Filtros */}
            <div className="flex-shrink-0 border-b py-4 space-y-3 pb-10">
                <div className="flex gap-6 items-center">
                    <img
                        src="/giphy.gif"
                        alt="mascota estudiando"
                        className="h-24 w-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-2xl font-bold">Preguntas oficiales</h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                            Todas las preguntas de todos los exámenes de GACE completamente gratis en un solo lugar. Si te gusta el contenido sígueme en{' '}
                            <a
                                href="https://www.instagram.com/opogace_la/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline underline-offset-2 hover:opacity-80"
                            >
                                Instagram
                            </a>
                            .
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Búsqueda */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Input
                            type="text"
                            placeholder="Buscar en el enunciado..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pr-8"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Bloque */}
                    <select
                        value={bloqueFilter}
                        onChange={(e) => handleBloqueChange(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="">Todos los bloques</option>
                        {bloques.map((b) => (
                            <option key={b} value={b}>
                                {getBloqueLabel(b)}
                            </option>
                        ))}
                    </select>

                    {/* Tema (solo visible si hay bloque seleccionado) */}
                    {bloqueFilter !== '' && (
                        <select
                            value={temaFilter}
                            onChange={(e) => setTemaFilter(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring max-w-[300px]"
                        >
                            <option value="">Todos los temas</option>
                            {temasDisponibles.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {value + 1}. {label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Examen */}
                    <select
                        value={examenFilter}
                        onChange={(e) => setExamenFilter(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring min-w-[190px]"
                    >
                        <option value="">Todos los exámenes</option>
                        {examenes.map((e) => (
                            <option key={e} value={e}>
                                {e}
                            </option>
                        ))}
                    </select>

                    {/* Limpiar */}
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            className="h-9 inline-flex items-center gap-1.5 px-3 rounded-md text-sm text-muted-foreground border border-input hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0"
                        >
                            <XCircle className="h-4 w-4" />
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Lista + Sidebar */}
            <div className="flex flex-1 min-h-0">
                {/* Lista con scroll virtual */}
                <div ref={parentRef} className="flex-1 overflow-auto min-h-0 py-2 pr-2">
                    {filtered.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No se encontraron preguntas con los filtros aplicados.
                        </div>
                    ) : (
                        <div
                            style={{
                                height: `${virtualizer.getTotalSize()}px`,
                                position: 'relative',
                            }}
                        >
                            {virtualizer.getVirtualItems().map((item) => {
                                const q = filtered[item.index];
                                const isSelected = selected?.id === q.id;
                                const topicLabel = getTopicLabel(q.b, q.t);
                                return (
                                    <div
                                        key={item.key}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${item.start}px)`,
                                            paddingBottom: '8px',
                                        }}
                                    >
                                        <button
                                            onClick={() => setSelected(isSelected ? null : q)}
                                            className={`w-full text-left rounded-lg border transition-colors p-4 ${
                                                isSelected
                                                    ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-700'
                                                    : 'bg-card hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        >
                                            <p className="text-sm line-clamp-2">{q.txt}</p>
                                            <div className="mt-1 flex gap-1 mt-4">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    {q.e}
                                                </Badge>

                                                <Badge variant="secondary" className="text-xs">
                                                    {getBloqueLabel(q.b)}
                                                </Badge>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            key="sidebar"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 760, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="flex-shrink-0 border-l flex flex-col min-h-0 overflow-hidden"
                        >
                            <div className="flex items-start justify-between p-4 border-b flex-shrink-0">
                                <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
                                    <Badge variant="secondary">{getBloqueLabel(selected.b)}</Badge>
                                    <Badge variant="outline">{selected.e}</Badge>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Tema completo */}
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">Tema {selected.t + 1}:</span>{' '}
                                    {getTopicLabel(selected.b, selected.t)}
                                </p>

                                <p className="text-sm font-medium leading-relaxed">
                                    {selected.txt}
                                </p>

                                <div className="space-y-2">
                                    {selected.ans.map((ans, i) => (
                                        <div
                                            key={i}
                                            className={`flex gap-3 rounded-md p-3 text-sm ${
                                                i === selected.ok
                                                    ? 'bg-green-50 border border-green-200 dark:bg-green-950/40 dark:border-green-800'
                                                    : 'bg-muted/50 border border-transparent'
                                            }`}
                                        >
                                            <span
                                                className={`font-bold flex-shrink-0 w-5 ${
                                                    i === selected.ok
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {ANSWER_LETTERS[i]}.
                                            </span>
                                            <span
                                                className={`flex-1 ${i === selected.ok ? 'text-green-800 dark:text-green-200' : ''}`}
                                            >
                                                {ans}
                                            </span>
                                            {i === selected.ok && (
                                                <CheckCircle2 className="flex-shrink-0 h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {selected.fb && (
                                    <div className="pt-4 border-t">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                                            Explicación
                                        </p>
                                        <div className="text-sm text-muted-foreground">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => (
                                                        <p className="mb-2 leading-relaxed">
                                                            {children}
                                                        </p>
                                                    ),
                                                    strong: ({ children }) => (
                                                        <strong className="font-semibold text-foreground">
                                                            {children}
                                                        </strong>
                                                    ),
                                                    em: ({ children }) => (
                                                        <em className="italic">{children}</em>
                                                    ),
                                                    a: ({ href, children }) => (
                                                        <a
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary underline underline-offset-2 hover:opacity-80"
                                                        >
                                                            {children}
                                                        </a>
                                                    ),
                                                    ul: ({ children }) => (
                                                        <ul className="list-disc list-inside space-y-1 mb-2">
                                                            {children}
                                                        </ul>
                                                    ),
                                                    li: ({ children }) => <li>{children}</li>,
                                                    hr: () => <hr className="my-3 border-border" />,
                                                }}
                                            >
                                                {selected.fb}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
