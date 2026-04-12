import React from "react";

type OnboardingDialogProps = {
  open: boolean;
  onClose: () => void;
};

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          width: "min(520px, 90vw)",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="onboarding-title" style={{ marginTop: 0 }}>
          Hoş geldiniz
        </h2>
        <p style={{ marginBottom: 24 }}>
          Uygulamayı keşfetmeye başlayabilirsiniz. İsterseniz daha sonra da
          devam edebilirsiniz.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Kapat
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Başla
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDialog;
