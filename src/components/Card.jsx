import React from "react";

/**
 * Simple card component with optional purple button.
 * @param {Object} props
 * @param {React.ReactNode} [props.title] - Optional card title
 * @param {React.ReactNode} [props.children] - Card content
 * @param {string} [props.buttonLabel] - Button text (if omitted, no button)
 * @param {() => void} [props.onButtonClick] - Button click handler
 */
export default function Card({
    title,
    children,
    buttonLabel = "Action",
    onButtonClick,
}) {
    return (
        <div
            style={{
                background: "var(--bg-card)",
                borderRadius: "var(--r-lg)",
                padding: 24,
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--border)",
            }}
        >
            {title && (
                <h3
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 12,
                        marginTop: 0,
                    }}
                >
                    {title}
                </h3>
            )}
            {children && (
                <div
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        marginBottom: onButtonClick ? 20 : 0,
                    }}
                >
                    {children}
                </div>
            )}
            {onButtonClick && (
                <button
                    type="button"
                    onClick={onButtonClick}
                    style={{
                        background: "var(--accent)",
                        color: "white",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        padding: "10px 20px",
                        borderRadius: "var(--r-full)",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                        transition: "box-shadow 0.15s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(124, 58, 237, 0.4)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(124, 58, 237, 0.3)";
                        e.currentTarget.style.transform = "none";
                    }}
                >
                    {buttonLabel}
                </button>
            )}
        </div>
    );
}
