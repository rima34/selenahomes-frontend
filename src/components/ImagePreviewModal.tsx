import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

const ImagePreviewModal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImagePreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] p-2 bg-slate-900/95 border-amber-200/30">
        <div className="relative w-full h-full flex items-center justify-center mt-4">
          <img
            src={imageUrl}
            alt={title || "Property image"}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
