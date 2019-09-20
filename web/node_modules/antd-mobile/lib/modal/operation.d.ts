export default function operation(actions?: {
    text: string;
}[], platform?: string): {
    close: () => void;
};
