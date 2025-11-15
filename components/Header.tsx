import { Video } from 'lucide-react';
import { Badge } from './ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Free AI Video Studio</h1>
        </div>

        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
          Seedance Lite Environment
        </Badge>
      </div>
    </header>
  );
}
