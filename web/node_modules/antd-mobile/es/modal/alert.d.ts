import React from 'react';
export default function alert(title: React.ReactNode, message: React.ReactNode, actions?: {
    text: string;
}[], platform?: string): {
    close: () => void;
};
