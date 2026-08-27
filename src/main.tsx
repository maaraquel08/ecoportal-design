import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ToastProvider } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/toaster'
import App from '@/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <ToastProvider>
          {/* isolation: isolate keeps Base UI portalled popups stacked above app content */}
          <div className="isolate min-h-dvh">
            <App />
          </div>
          <Toaster />
        </ToastProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
