"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

const NotificationContext = createContext(null);

const toastStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-primary/15 bg-white text-primary",
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "info") => {
      const id = idRef.current + 1;
      idRef.current = id;

      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => removeToast(id), 3600);
    },
    [removeToast]
  );

  const success = useCallback((message) => toast(message, "success"), [toast]);
  const error = useCallback((message) => toast(message, "error"), [toast]);
  const info = useCallback((message) => toast(message, "info"), [toast]);

  const confirmDialog = useCallback((options) => {
    const dialogOptions =
      typeof options === "string" ? { message: options } : options;

    return new Promise((resolve) => {
      setDialog({
        type: "confirm",
        title: dialogOptions.title || "confirmar acción",
        message: dialogOptions.message,
        confirmLabel: dialogOptions.confirmLabel || "confirmar",
        cancelLabel: dialogOptions.cancelLabel || "cancelar",
        resolve,
      });
    });
  }, []);

  const promptDialog = useCallback((options) => {
    const dialogOptions =
      typeof options === "string" ? { message: options } : options;

    return new Promise((resolve) => {
      setDialog({
        type: "prompt",
        title: dialogOptions.title || "completar información",
        message: dialogOptions.message,
        label: dialogOptions.label || "detalle",
        placeholder: dialogOptions.placeholder || "",
        confirmLabel: dialogOptions.confirmLabel || "guardar",
        cancelLabel: dialogOptions.cancelLabel || "cancelar",
        resolve,
      });
    });
  }, []);

  const closeDialog = useCallback(
    (value) => {
      dialog?.resolve(value);
      setDialog(null);
    },
    [dialog]
  );

  return (
    <NotificationContext.Provider
      value={{ toast, success, error, info, confirmDialog, promptDialog }}
    >
      {children}

      <div className="fixed right-4 top-24 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-[0_18px_50px_rgba(44,32,24,0.12)] backdrop-blur ${toastStyles[item.type]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-relaxed">{item.message}</p>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="text-base leading-none opacity-60 transition hover:opacity-100"
                aria-label="cerrar notificación"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {dialog ? <Dialog dialog={dialog} onClose={closeDialog} /> : null}
    </NotificationContext.Provider>
  );
}

function Dialog({ dialog, onClose }) {
  const [value, setValue] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (dialog.type === "prompt") {
      onClose(value.trim());
      return;
    }

    onClose(true);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/25 px-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-black/5 bg-[#fffaf4] p-6 shadow-[0_28px_80px_rgba(44,32,24,0.22)]"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-primary/50">
          rüf admin
        </p>
        <h2 className="mt-3 text-2xl font-light text-primary">
          {dialog.title}
        </h2>
        {dialog.message ? (
          <p className="mt-3 text-sm leading-relaxed text-text/70">
            {dialog.message}
          </p>
        ) : null}

        {dialog.type === "prompt" ? (
          <label className="mt-5 block space-y-2 text-sm text-text/75">
            <span>{dialog.label}</span>
            <input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={dialog.placeholder}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onClose(dialog.type === "prompt" ? "" : false)}
            className="rounded-xl border border-primary/20 px-5 py-3 text-sm text-primary transition hover:bg-white"
          >
            {dialog.cancelLabel}
          </button>
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white transition hover:opacity-85"
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }

  return context;
}
