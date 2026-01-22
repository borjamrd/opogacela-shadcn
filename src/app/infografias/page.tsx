import InfografiasContent from '@/components/InfografiasContent';

export default function Infografias() {
    return (
        <div className="container py-24 sm:py-32">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Infografías</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6">
                Estas infografías te ayudarán a comprender mejor los conceptos clave y a prepararte
                de manera más efectiva.
            </p>

            <InfografiasContent />
        </div>
    );
}
