import { Button } from "@heroui/react";

interface ViewPDFProps {
    currentLinkDocument: string | null;
    setCurrentLinkDocument: (link: string | null) => void;
}

export default function ViewPDF({ currentLinkDocument, setCurrentLinkDocument }: ViewPDFProps) {
    if (!currentLinkDocument) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-5xl h-[80vh] rounded shadow-lg overflow-hidden">

                {/* Botón de cierre */}
                <Button
                    onPress={() => setCurrentLinkDocument(null)}
                    className="absolute top-2 right-15 z-10 text-sm font-medium"
                    color="primary"
                >
                    Cerrar ✕
                </Button>

                {/* Visor del PDF */}
                <iframe
                    src={currentLinkDocument}
                    className="w-full h-full"
                    title="Documento de reglamento"
                />
            </div>
        </div>
    )
}
