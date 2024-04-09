export default function TypeBadge({ type }: { type: any }) {
    
    return <span className={`absolute top-2 left-1 px-2 py-0.5 rounded-lg ms-2 ${type === 'gace' ? 'bg-primary/30 text-primary' : 'bg-[#b985ab]/30 text-[#b985ab]'} font-semibold text-sm`}>{type === 'gace' ? 'GACE' : 'Administrativo'}</span>

}