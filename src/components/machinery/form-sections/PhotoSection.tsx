import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

interface PhotoSectionProps {
  photoFile: File | null;
  currentPhotoUrl: string | null;
  onPhotoChange: (file: File | null) => void;
}

export function PhotoSection({ photoFile, currentPhotoUrl, onPhotoChange }: PhotoSectionProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handlePhotoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      setTimeout(() => {
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], "machinery-photo.jpg", { type: "image/jpeg" });
              onPhotoChange(file);
            }
            stream.getTracks().forEach(track => track.stop());
          }, 'image/jpeg');
        }
      }, 300);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>Foto do Maquinário</FormLabel>
      
      {(currentPhotoUrl || photoFile) && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
          {currentPhotoUrl && !photoFile && (
            <img
              src={currentPhotoUrl}
              alt="Foto atual do maquinário"
              className="w-full h-full object-cover"
            />
          )}
          {photoFile && (
            <img
              src={URL.createObjectURL(photoFile)}
              alt="Nova foto do maquinário"
              className="w-full h-full object-cover"
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onPhotoChange(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        {isMobile && (
          <Button type="button" variant="outline" onClick={handlePhotoCapture}>
            <Camera className="w-4 h-4 mr-2" />
            Fotografar
          </Button>
        )}
      </div>
    </div>
  );
}