import { readFileSync } from 'fs';
import path from 'path';
import PreguntasClient from '@/components/PreguntasClient';
import type { Question } from '@/components/PreguntasClient';

interface RawData {
    json_build_object: {
        preguntas: Question[];
    };
}

export default function PreguntasPage() {
    const filePath = path.join(process.cwd(), 'allquestions.json');
    const raw: RawData[] = JSON.parse(readFileSync(filePath, 'utf-8'));
    const questions = raw[0].json_build_object.preguntas;

    return <PreguntasClient questions={questions} />;
}
