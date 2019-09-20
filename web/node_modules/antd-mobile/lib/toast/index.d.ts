declare const _default: {
    SHORT: number;
    LONG: number;
    show(content: string, duration?: number | undefined, mask?: boolean | undefined): void;
    info(content: string, duration?: number | undefined, onClose?: (() => void) | undefined, mask?: boolean | undefined): void;
    success(content: string, duration?: number | undefined, onClose?: (() => void) | undefined, mask?: boolean | undefined): void;
    fail(content: string, duration?: number | undefined, onClose?: (() => void) | undefined, mask?: boolean | undefined): void;
    offline(content: string, duration?: number | undefined, onClose?: (() => void) | undefined, mask?: boolean | undefined): void;
    loading(content: string, duration?: number | undefined, onClose?: (() => void) | undefined, mask?: boolean | undefined): void;
    hide(): void;
};
export default _default;
