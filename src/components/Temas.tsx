import { temasData } from '@/lib/temas';

export const Temas = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-10">
            Temario de la oposición Gestión de la Administración Civil del Estado
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {temasData.map((bloque, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{bloque.title}</h3>
                        <div className="flex gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {bloque.pages} páginas
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {bloque.topics.length} temas
                            </span>
                        </div>
                    </div>
                    <div className="p-5">
                        <ul className="space-y-4">
                            {bloque.topics.map((topic, topicIndex) => (
                                <li
                                    key={topicIndex}
                                    className="flex items-start gap-3 text-sm text-gray-600"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                                        {topicIndex + 1}
                                    </span>
                                    <span className="leading-relaxed">{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
