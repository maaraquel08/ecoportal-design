import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  useToastManager,
} from "@/components/ui/toast";

/** Renders the toast stack. Fire toasts with `useToast()` anywhere below the provider. */
export function Toaster() {
  const { toasts } = useToastManager();

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast}>
          <ToastTitle />
          <ToastDescription />
          <ToastClose aria-label="Close">
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </ToastClose>
        </Toast>
      ))}
    </ToastViewport>
  );
}
