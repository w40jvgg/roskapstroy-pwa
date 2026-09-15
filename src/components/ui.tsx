import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, useEffect, useId, useRef } from 'react';
import { LoaderCircle, X } from 'lucide-react';

export function Button({ children, className = '', loading, variant = 'secondary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button className={`button button--${variant} ${className}`} disabled={loading || props.disabled} {...props}>{loading && <LoaderCircle className="spin" aria-hidden="true" />}{children}</button>;
}

export function IconButton({ label, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button type="button" className="icon-button" aria-label={label} title={label} {...props}>{children}</button>;
}

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span className="field__label">{label}</span>{children}{hint && <span className="field__hint">{hint}</span>}{error && <span className="field__error">{error}</span>}</label>;
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`input ${className}`} {...props} />; }
export function Textarea({ value, onChange, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const node = ref.current; if (!node) return; node.style.height = 'auto'; node.style.height = `${Math.min(240, Math.max(92, node.scrollHeight))}px`; }, [value]);
  return <textarea ref={ref} className="textarea" value={value} onChange={onChange} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select className="input select" {...props} />; }

export function Modal({ open, title, children, onClose, wide = false }: { open: boolean; title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const titleId = useId(); const panel = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    trigger.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => (panel.current?.querySelector('button, input, textarea, select') as HTMLElement | null)?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panel.current) {
        const list = [...panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]')];
        if (!list.length) return; const first = list[0], last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = previousOverflow; trigger.current?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="modal-layer" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panel} className={`modal ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="modal__header"><h2 id={titleId}>{title}</h2><IconButton label="Закрыть" onClick={onClose}><X /></IconButton></header>
      <div className="modal__body">{children}</div>
    </div>
  </div>;
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="form-section"><div className="form-section__heading"><h3>{title}</h3>{description && <p>{description}</p>}</div>{children}</section>;
}

export function Toast({ message, action, onAction }: { message: string; action?: string; onAction?: () => void }) {
  return <div className="toast" role="status"><span>{message}</span>{action && <button onClick={onAction}>{action}</button>}</div>;
}
