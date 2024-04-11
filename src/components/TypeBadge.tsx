export default function TypeBadge({ type }: { type: any }) {

    const typeText = (): string => {
        switch (type) {
            case 'admin':
                return 'Administrativo'
            case 'law':
                return 'Ley suelta'
            case 'gace':
                return 'GACE'
            default:
                return ''
        }
    }
    const typeClass = (): string => {
        switch (type) {
            case 'admin':
                return 'bg-[#b985ab]/30 text-[#b985ab]'
            case 'law':
                return 'bg-blue-100 text-blue-800'
            case 'gace':
                return 'bg-primary/30 text-primary'
            default:
                return ''
        }
    }

    return <span className={`absolute top-4 lg:left-4 left-1 px-2 py-0.5 rounded-lg ms-2 ${typeClass()} font-semibold text-sm`}>{typeText()}</span>

}