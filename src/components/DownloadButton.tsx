"use client"

import { Download } from "lucide-react"
import { Button } from "./ui/button"


export default function DownloadButton({ file }: { file: string }) {

    const handleDownload = (file: string) => {
        const pdfUrl = process.env.NEXT_PUBLIC_BASE_URL + '/ejemplos/' + file;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return <Button onClick={() => handleDownload(file)} className="mt-2" variant={'secondary'} >
        <Download className="h-4 w-4 mr-2" />
        Descargar</Button>
}